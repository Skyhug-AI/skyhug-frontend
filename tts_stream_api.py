# tts_stream_api.py
from fastapi import FastAPI, HTTPException, status 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import os, requests
import re
from supabase import create_client

load_dotenv()

# ─── CONFIG ───────────────────────────────────────────────────────────────
SUPABASE_URL             = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
ELEVENLABS_VOICE_ID      = os.getenv("ELEVENLABS_VOICE_ID")
ELEVENLABS_API_KEY       = os.getenv("ELEVENLABS_API_KEY")

# ─── HTTP SESSIONS & CLIENTS ───────────────────────────────────────────────
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

# ─── WARM-UP POOL ───────────────────────────────────────────────────────────
@app.on_event("startup")
def warmup_elevenlabs_pool():
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
    for _ in range(3):
        try:
            eleven_sess.head(url, timeout=1)
        except:
            pass
@app.get("/tts-stream/{message_id}")
async def tts_stream(message_id: str):
    # 1) Fetch assistant_text + conversation_id
    msg_resp = (
        supabase
        .table("messages")
        .select("assistant_text,conversation_id")
        .eq("id", message_id)
        .single()
        .execute()
    )
    if not msg_resp.data or not msg_resp.data.get("assistant_text"):
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            "No assistant_text for that message")

    text = msg_resp.data["assistant_text"]
    # remove all of: * / { } [ ] < > & # @ _ \ | + = % so TTS does not say them 
    sanitized_text = re.sub(r"[*/{}\[\]<>&#@_\\|+=%]", "", text)
    conversation_id = msg_resp.data["conversation_id"]

    # 2) Check that this conv is still in voice mode
    conv_resp = (
        supabase
        .table("conversations")
        .select("voice_enabled")
        .eq("id", conversation_id)
        .single()
        .execute()
    )
    # If the front end never flipped it, default is False
    if not conv_resp.data or not conv_resp.data.get("voice_enabled"):
        raise HTTPException(status.HTTP_403_FORBIDDEN,
                            "TTS is only available in Voice Mode")

    # 3) Proxy ElevenLabs exactly as before
    print(f"🔊 Proxying streamed TTS for {message_id}…")   
    upstream = eleven_sess.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}",
        json={
            "text": sanitized_text,
            "voice_settings": {
                "stability": 0.2,
                "similarity_boost": 0.2,
                "latency_boost": True,
            },
            "stream": True,
        },
        stream=True,
        timeout=(5, None),
    )
    upstream.raise_for_status()
    print(f"✅ ElevenLabs proxy succeeded for {message_id}") 

    return StreamingResponse(
        upstream.iter_content(chunk_size=8_192),
        media_type="audio/mpeg",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Transfer-Encoding": "chunked",
        }
    )

