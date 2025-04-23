import os, time, io, json, requests
from supabase import create_client
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
import tempfile

load_dotenv()

print("➤ Loaded ENV:")
print("  SUPABASE_URL =", os.getenv("SUPABASE_URL"))
print("  OPENAI_API_KEY =", bool(os.getenv("OPENAI_API_KEY")))
print("  ELEVENLABS_API_KEY =", bool(os.getenv("ELEVENLABS_API_KEY")))


# ─── Supabase & OpenAI setup ────────────────────────────────────────────────
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

supabase_admin = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # ⚠️ must be the SERVICE ROLE KEY
)
print("🔑 Supabase token prefix:", os.getenv("SUPABASE_SERVICE_ROLE_KEY")[:10])


info = supabase.rpc("auth_role").execute()
print("🔐 Auth role seen by Supabase:", info)





client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ─── Your Custom Prompt & Examples ────────────────────────────────────────────
SYSTEM_PROMPT = """
You are a compassionate, emotionally attuned AI therapist assistant. You respond with warmth, sensitivity, and care. 
Your goal is to make the user feel heard, safe, and supported — not judged or fixed. You use simple, human language. 
You reflect feelings, normalize experiences, and offer practical next steps with kindness.

Always speak in a conversational tone — avoid sounding clinical, robotic, or overly formal. Do not use diagnostic terms. 
If a user expresses distress, validate it and gently suggest grounding or coping strategies. If appropriate, gently remind 
them that you're an AI and not a substitute for professional care.

Your structure for each response should be:
1. Empathic reflection
2. Gentle validation and normalization
3. Simple, supportive guidance
4. Invite to continue sharing

Stay gentle, grounded, and curious.
""".strip()

EXAMPLE_DIALOG = [
    {"role":"user", "content":"I feel like I’m falling apart and no one understands me."},
    {"role":"assistant", "content":"I’m really sorry you’re feeling this way. It makes so much sense that you’d feel overwhelmed when it seems like no one truly sees what you’re going through. You’re not alone — many people carry this kind of invisible weight. Sometimes writing down your feelings or talking out loud can help bring a bit of clarity or relief. Would you like to explore that together?"},
    {"role":"user", "content":"My anxiety has been through the roof lately."},
    {"role":"assistant", "content":"That sounds incredibly intense. Anxiety can take over in ways that feel exhausting and scary. You’re doing something really brave by talking about it. Would it help to try a calming technique together, or talk through what’s been triggering it lately?"}
]

# ─── Function Definition for Suicidal Mentions ───────────────────────────────
FUNCTION_DEFS = [
    {
        "name": "handle_suicidal_mention",
        "description": "Responds to mentions of suicide or self harm in a conversation by providing a suicide hotline and recommending immediate in-person therapy.",
        "parameters": {
            "type": "object",
            "required": ["message", "hotline_number", "recommendation"],
            "properties": {
                "message": {
                    "type": "string",
                    "description": "The user's message that may contain mentions of suicide or self harm."
                },
                "hotline_number": {
                    "type": "string",
                    "description": "The phone number for the suicide hotline."
                },
                "recommendation": {
                    "type": "string",
                    "description": "Message recommending the user to seek an in-person therapist."
                }
            },
            "additionalProperties": False
        }
    }
]

# ─── Helpers ────────────────────────────────────────────────────────────────
# Record the time when the worker started, as an ISO timestamp string
START_TS = datetime.now(timezone.utc).isoformat()

#Cutoff for "Only keep the last X messages in full detail — and summarize the rest.
MAX_HISTORY = 10

def fetch_pending(table, **conds):
    """
    Fetch rows matching conds from the given table.
    For the messages table, only return those created after START_TS
    so any old backlog is ignored.
    """
    q = supabase.table(table).select("*").match(conds)
    if table == "messages":
        q = q.gt("created_at", START_TS)
    return q.execute().data or []

def update_status(table, record_id, fields):
    supabase.table(table).update(fields).eq("id", record_id).execute()

def download_audio(path, bucket="raw-audio"):
    url = supabase.storage.from_(bucket).create_signed_url(path, 60)["signedURL"]
    return requests.get(url).content

def upload_audio(path, data, bucket="tts-audio"):
    supabase.storage.from_(bucket).upload(path, io.BytesIO(data), {"content-type":"audio/mpeg"})

def summarize_and_store(conv_id):
    """
    Summarize a conversation only if there are at least 4 assistant replies,
    then store a very brief, noun‑phrase style summary (≤12 words).
    """
    # 1) fetch full history
    history = (
        supabase
        .table("messages")
        .select("sender_role,transcription,assistant_text")
        .eq("conversation_id", conv_id)
        .order("created_at")
        .execute()
        .data
        or []
    )

    # 2) require at least 4 assistant replies
    assistant_count = sum(1 for m in history if m["sender_role"] == "assistant")
    if assistant_count < 4:
        print(f"🛑 Skipping summary for conv {conv_id} — only {assistant_count} assistant replies")
        return

    # 3) build messages for GPT
    msgs = []
    for m in history:
        role = "user" if m["sender_role"] == "user" else "assistant"
        content = m["transcription"] if role == "user" else m["assistant_text"]
        msgs.append({"role": role, "content": content})

    # 4) ask GPT for a very brief topic phrase
    prompt = """
You are a concise summarizer. Extract the single main theme of the conversation
as a noun or gerund phrase (no more than 12 words). Do NOT include any suggestions
or extra punctuation. Examples:
  • political issues and feeling like nobody cares
  • basketball strategies and team dynamics
  • anxiety about work deadlines
"""
    resp = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[{"role":"system", "content": prompt.strip()}] + msgs,
        temperature=0.5,
        max_tokens=30,
    )
    raw = resp.choices[0].message.content.strip()
    # strip trailing period if any
    summary = raw.rstrip(".").strip()

    # 5) store it
    supabase.table("conversations") \
        .update({"memory_summary": summary}) \
        .eq("id", conv_id) \
        .execute()
    print(f"🧠 Stored memory for conv {conv_id}: {summary}")

def close_inactive_conversations():
    """
    Auto‑end any conversation idle >1h, summarizing it just before marking it ended.
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=1)
    print("⏰ Checking for inactive conversations...")

    # 1) find only active convs that have gone quiet for >1h
    stale = (
        supabase
        .table("conversations")
        .select("id")
        .eq("ended", False)
        .lt("updated_at", cutoff.isoformat())
        .execute()
        .data
        or []
    )

    for record in stale:
        conv_id = record["id"]

        # 2) generate & store summary (only if ≥4 assistant replies)
        summarize_and_store(conv_id)

        # 3) now mark it ended
        supabase.table("conversations") \
            .update({"ended": True}) \
            .eq("id", conv_id) \
            .execute()
        print(f"✅ Auto-ended and summarized conversation {conv_id}")

# ─── Summarization to Keep Context Small ─────────────────────────────────────
def build_chat_payload(conv_id):
    # — fetch any prior memory —
    conv_meta = supabase.table("conversations") \
        .select("memory_summary") \
        .eq("id", conv_id) \
        .single() \
        .execute().data or {}
    memory = conv_meta.get("memory_summary")

    # — now fetch in‑progress history —
    history = supabase.table("messages") \
        .select("sender_role,transcription,assistant_text,created_at") \
        .eq("conversation_id", conv_id) \
        .order("created_at") \
        .execute().data or []

    # — build the standard messages list —
    # Start with system + examples
    messages = [{"role":"system","content":SYSTEM_PROMPT}] + EXAMPLE_DIALOG

    # — if brand‑new session and we have a memory, inject it —
    if memory and len(history) == 0:
        messages.append({
            "role": "assistant",
            "content": f"Last time we spoke, we talked about: {memory} Would you like to pick up where we left off?"
        })

    # — map actual turns —
    user_msgs = []
    for m in history:
        if m["sender_role"] == "user":
            user_msgs.append({"role":"user","content": m["transcription"]})
        else:
            user_msgs.append({"role":"assistant","content": m["assistant_text"]})

    # — summarization of old turns if needed —
    if len(user_msgs) > MAX_HISTORY:
        to_summarize = user_msgs[:-MAX_HISTORY]
        summary_resp = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=messages + [
                {"role":"assistant","content":"Please summarize the earlier conversation in a brief sentence."}
            ] + to_summarize,
            temperature=0.3,
            max_tokens=200
        )
        summary = summary_resp.choices[0].message.content
        messages += [
            {"role":"assistant","content": f"Summary of earlier conversation: {summary}"}
        ] + user_msgs[-MAX_HISTORY:]
    else:
        messages += user_msgs

    return messages


# ─── 1) Transcription Pass ──────────────────────────────────────────────────
def process_transcriptions():
    pending = fetch_pending("messages", sender_role="user", transcription_status="pending")
    print(f"📝 Transcription stage: {len(pending)} messages pending")
    for msg in pending:
        try:
            audio = download_audio(msg["audio_path"])
            resp  = client.audio.transcriptions.create(
                model="whisper-1",
                file=io.BytesIO(audio)
            )
            update_status("messages", msg["id"], {
                "transcription": resp.text,
                "transcription_status": "done"
            })
            print(f"✅ Marked message {msg['id']} as ai_status=done")
        except Exception as e:
            update_status("messages", msg["id"], {"transcription_status": "error"})
            print("Transcribe error:", e)


# ─── 2) AI Response Pass ────────────────────────────────────────────────────
def process_ai():
    pending = fetch_pending(
        "messages",
        sender_role="user",
        transcription_status="done",
        ai_status="pending",
    )
    print(f"💬 AI stage: {len(pending)} messages pending")
    for msg in pending:
        try:
            # Build the chat payload
            payload = build_chat_payload(msg["conversation_id"])
            # Call GPT-4 Turbo
            resp = client.chat.completions.create(
                model="gpt-4-turbo",
                messages=payload,
                temperature=0.7,
                functions=FUNCTION_DEFS,
                function_call="auto",
            )
            choice = resp.choices[0].message  # ChatCompletionMessage

            # Check if GPT wants to call our suicide handler
            if hasattr(choice, "function_call") and choice.function_call:
                func = choice.function_call
                args = json.loads(func.arguments)
                # Craft the response
                content = (
                    "I'm so sorry to hear how distressed you're feeling. "
                    f"If you ever think about harming yourself or feel unsafe, please call "
                    f"{args['hotline_number']} immediately. {args['recommendation']}"
                )
            else:
                # Normal assistant response
                content = choice.content

            # Insert assistant reply
            supabase.table("messages").insert({
                "conversation_id": msg["conversation_id"],
                "sender_role":     "assistant",
                "assistant_text":  content,
                "ai_status":       "done",
                "tts_status":      "pending"
            }).execute()

            # Mark the user message as done
            update_status("messages", msg["id"], {"ai_status": "done"})
            print(f"✅ Assistant response created for message {msg['id']}")

        except Exception as e:
            # On error, mark ai_status as error so we don’t loop forever
            update_status("messages", msg["id"], {"ai_status": "error"})
            print("❌ AI error:", e)


# ─── 3) TTS Generation Pass ─────────────────────────────────────────────────
def process_tts():
    pending = fetch_pending("messages", sender_role="assistant", tts_status="pending")
    print(f"🔊 TTS stage: {len(pending)} messages pending")
    for msg in pending:
        print(f"📄 Processing message: {msg['id']}")
        try:
            print("📥 Fetching conversation info...")
            conv = supabase_admin.table("conversations") \
                .select("voice_enabled") \
                .eq("id", msg["conversation_id"]) \
                .single() \
                .execute()
            voice_on = conv.data.get("voice_enabled", False) if conv.data else False
            print(f"🎚 Voice enabled? {voice_on}")
            if voice_on is None: 
                voise_on = True 
            if not voice_on:
                print("⏭ Voice off. Updating tts_status to done...")
                supabase_admin.table("messages").update({
                    "tts_status": "done"
                }).eq("id", msg["id"]).execute()
                continue

            # Generate ElevenLabs TTS
            print("🎤 Sending TTS request to ElevenLabs...")
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{os.getenv('ELEVENLABS_VOICE_ID')}"
            headers = {"xi-api-key": os.getenv("ELEVENLABS_API_KEY"), "Content-Type": "application/json"}
            body = {
                "text": msg["assistant_text"],
                "voice_settings": {"stability": 0.75, "similarity_boost": 0.75}
            }

            with requests.post(url, json=body, headers=headers, stream=True) as r:
                r.raise_for_status()
                with tempfile.NamedTemporaryFile(suffix=".mp3") as tmp:
                    for chunk in r.iter_content(chunk_size=8192):
                        if chunk:
                            tmp.write(chunk)
                    tmp.flush()

                    path = f"{msg['conversation_id']}/{msg['id']}.mp3"

                    # Upload to Supabase
                    # Step 1: Generate path to use for storage (must match exactly)
                    path = f"{msg['conversation_id']}/{msg['id']}.mp3"

                    # Step 2: Create signed upload URL
                    print("📤 Getting signed upload URL...")
                    signed_upload = supabase_admin.storage.from_("tts-audio").create_signed_upload_url(path)
                    upload_url = signed_upload.get("signed_url") or signed_upload.get("signedUrl")
                    print(f"🔍 Upload URL: {upload_url}")

                    if not upload_url:
                        raise Exception("❌ Failed to get signed upload URL")

                    # Step 3: Upload file using PUT
                    print("📤 Uploading MP3 to Supabase...")
                    with open(tmp.name, "rb") as audio_file:
                        put_response = requests.put(
                            upload_url,
                            data=audio_file,
                            headers={"Content-Type": "audio/mpeg"}
                        )
                        put_response.raise_for_status()
                    print("✅ Upload succeeded")

                    # Step 4 (optional): Debug playback URL
                    signed_playback = supabase_admin.storage.from_("tts-audio").create_signed_url(path, 60)
                    print("🔊 Signed playback URL:", signed_playback.get("signed_url") or signed_playback.get("signedUrl"))


            # ✅ Create a signed playback URL (optional but useful for debugging)
            signed_playback = supabase_admin.storage.from_("tts-audio").create_signed_url(path, 60)
            print("🔊 Signed playback URL (for debug):", signed_playback.get("signed_url") or signed_playback.get("signedUrl"))

            # ✅ Update the DB record
            print("✅ Updating tts_path and tts_status...")
            supabase_admin.table("messages").update({
                "tts_path": path,
                "tts_status": "done"
            }).eq("id", msg["id"]).execute()

            print(f"✅ TTS succeeded for {msg['id']}")


        except Exception as e:
            print("❌ TTS error:", e)
            supabase_admin.table("messages").update({
                "tts_status": "done"
            }).eq("id", msg["id"]).execute()

            
# ─── Main Loop ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    test = supabase.table("messages").select("id").limit(1).execute()
    print("✔️ Supabase connectivity test:", test.data)

    no_work_count = 0
    MAX_IDLE_CYCLES = 2000
    close_inactive_conversations()

    while True:
        trans_count = len(fetch_pending("messages", sender_role="user", transcription_status="pending"))
        ai_count     = len(fetch_pending("messages", sender_role="user", transcription_status="done", ai_status="pending"))
        tts_count    = len(fetch_pending("messages", sender_role="assistant", tts_status="pending"))

        if trans_count == 0 and ai_count == 0 and tts_count == 0:
            no_work_count += 1
        else:
            no_work_count = 0

        if no_work_count < MAX_IDLE_CYCLES:
            process_transcriptions()
            process_ai()
            process_tts()
        else:
            close_inactive_conversations()

        time.sleep(1)

