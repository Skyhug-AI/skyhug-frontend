# tts_stream_api.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import os, requests, re
from supabase import create_client

load_dotenv()

SUPABASE_URL              = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
ELEVENLABS_VOICE_ID       = os.getenv("ELEVENLABS_VOICE_ID")
ELEVENLABS_API_KEY        = os.getenv("ELEVENLABS_API_KEY")

# reuse a single Session for all ElevenLabs calls
eleven_sess = requests.Session()
eleven_sess.headers.update({
    "xi-api-key": ELEVENLABS_API_KEY,
    "Content-Type": "application/json",
})

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ─── WARM-UP POOL ────────────────────────────────────────────────────────────
@app.on_event("startup")
def warmup_elevenlabs_pool():
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
    # 1) HEAD a few times to establish TCP/TLS
    for _ in range(3):
        try:
            eleven_sess.head(url, timeout=1)
        except:
            pass

    # 2) One super-short streaming POST to spin up the model server
    try:
        dummy = eleven_sess.post(
            url,
            json={
                "text": ".",                  # 1-character payload
                "voice_settings": {
                    "stability": 0.2,
                    "similarity_boost": 0.2,
                    "latency_boost": True,
                },
                "stream": True
            },
            stream=True,
            timeout=(1, 1)                  # don’t wait for the whole stream
        )
        dummy.close()
    except Exception:
        pass


@app.get("/tts-stream/{message_id}")
async def tts_stream(message_id: str, snippet: int = 0):
    # 1) fetch & sanitize
    msg = (
        supabase
        .table("messages")
        .select("assistant_text,conversation_id")
        .eq("id", message_id)
        .single()
        .execute()
        .data
    ) or {}
    text = msg.get("assistant_text", "")
    if not text:
        raise HTTPException(404, "No assistant_text for that message")

    sanitized = re.sub(r"[*/{}\[\]<>&#@_\\|+=%]", "", text)

    # split into sentences (keep the delimiter on the end)
    sentences = re.split(r'(?<=[.!?])\s+', sanitized)
    if snippet < 0 or snippet >= len(sentences):
        raise HTTPException(400, f"snippet index {snippet} out of range")
    piece = sentences[snippet].strip()

    # 2) confirm voice mode
    # pull voice_enabled + therapist_id
    convo = (
        supabase
        .table("conversations")
        .select("voice_enabled, therapist_id")
        .eq("id", msg["conversation_id"])
        .single()
        .execute()
        .data
    ) or {}

    if not convo.get("voice_enabled"):
        raise HTTPException(403, "TTS only in Voice Mode")

    # 2) confirm voice mode & pull therapist_id
    convo_resp = (
        supabase
        .table("conversations")
        .select("voice_enabled, therapist_id")
        .eq("id", msg["conversation_id"])
        .single()
        .execute()
    )
    convo = convo_resp.data or {}
    if not convo.get("voice_enabled"):
        raise HTTPException(403, "TTS only in Voice Mode")
    
    # 3) look up the therapist’s voice_id (or fallback to ENV)
    therapist_id = convo.get("therapist_id")
    if therapist_id:
        therapist_resp = (
            supabase
            .table("therapists")
            .select("elevenlabs_voice_id")
            .eq("id", therapist_id)
            .single()
            .execute()
        )
        therapist_row = therapist_resp.data or {}
        voice_id = therapist_row.get("elevenlabs_voice_id") or ELEVENLABS_VOICE_ID
    else:
        voice_id = ELEVENLABS_VOICE_ID


    # 3) proxy the streaming POST
    upstream = eleven_sess.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        json={
            "text": piece,
            "voice_settings": {
                "stability": 0.45,
                "similarity_boost": 0.45,
                "latency_boost": True,
            },
            "stream": True,
        },
        stream=True,
        timeout=(5, None),
    )
    upstream.raise_for_status()

    return StreamingResponse(
        upstream.iter_content(chunk_size=4_096),
        media_type="audio/mpeg",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Transfer-Encoding": "chunked",
        }
    )
