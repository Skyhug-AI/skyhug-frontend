import os
import io
import json
import threading
import requests
import asyncio

from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from supabase import create_client      # sync client for handlers
from supabase._async.client import create_client as create_client_async  # async for realtime
from openai import OpenAI
from realtime import RealtimeSubscribeStates
from supabase._async.client import create_client_async
from concurrent.futures import ThreadPoolExecutor

# ─── CONFIG & CLIENTS ────────────────────────────────────────────────────────
load_dotenv()

SUPABASE_URL        = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY    = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")

# sync clients for your existing handlers
supabase       = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
supabase_admin = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

# async client only for realtime
# will be created inside `start_realtime()`

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

START_TS    = datetime.now(timezone.utc).isoformat()
MAX_HISTORY = 10
tts_executor = ThreadPoolExecutor(max_workers=10)

# ─── Your Custom Prompt & Examples ────────────────────────────────────────────
SKY_SYSTEM_PROMPT = """
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

SKY_EXAMPLE_DIALOG = [
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
    },
    {
        "name": "suggest_breathing_exercise",
        "description": "Suggests a breathing exercise when the user needs to calm down or ground themselves",
        "parameters": {
            "type": "object",
            "required": ["exercise_type", "duration"],
            "properties": {
                "exercise_type": {
                    "type": "string",
                    "enum": ["box-breathing", "4-7-8", "deep-breathing"],
                    "description": "The type of breathing exercise to suggest"
                },
                "duration": {
                    "type": "integer",
                    "description": "Duration of the exercise in minutes (1-10)"
                }
            }
        }
    },
    {
        "name": "start_empty_chair",
        "description": "Guides the user through an empty chair dialogue exercise for processing relationships or internal conflicts",
        "parameters": {
            "type": "object",
            "required": ["perspective", "prompt"],
            "properties": {
                "perspective": {
                    "type": "string",
                    "enum": ["other-person", "future-self", "past-self", "inner-critic", "compassionate-self"],
                    "description": "The perspective to take in the empty chair"
                },
                "prompt": {
                    "type": "string",
                    "description": "The specific prompt or question to explore in the dialogue"
                }
            }
        }
    },
    {
        "name": "facilitate_role_play",
        "description": "Guides the user through a role-play exercise for practicing difficult conversations or scenarios",
        "parameters": {
            "type": "object",
            "required": ["scenario", "role"],
            "properties": {
                "scenario": {
                    "type": "string",
                    "description": "Description of the scenario to role-play"
                },
                "role": {
                    "type": "string",
                    "description": "The role the AI should take in the role-play"
                }
            }
        }
    }
]

# Function implementations
def suggest_breathing_exercise(exercise_type: str, duration: int) -> str:
    exercises = {
        "box-breathing": f"Let's do box breathing for {duration} minutes. Follow these steps:\n1. Inhale for 4 counts\n2. Hold for 4 counts\n3. Exhale for 4 counts\n4. Hold for 4 counts\n5. Repeat",
        "4-7-8": f"Let's try the 4-7-8 technique for {duration} minutes:\n1. Inhale for 4 counts\n2. Hold for 7 counts\n3. Exhale for 8 counts\n4. Repeat",
        "deep-breathing": f"Let's practice deep breathing for {duration} minutes:\n1. Inhale slowly through your nose, filling your belly\n2. Hold briefly\n3. Exhale slowly through your mouth\n4. Repeat"
    }
    return exercises[exercise_type]

def start_empty_chair(perspective: str, prompt: str) -> str:
    return f"Let's begin the empty chair exercise. Imagine {perspective} sitting across from you. {prompt}\n\nTake your time to express what you're feeling. I'll guide you through this dialogue."

def facilitate_role_play(scenario: str, role: str) -> str:
    return f"I'll take on the role of {role} in this scenario: {scenario}\n\nLet's begin the role-play. Feel free to respond as yourself, and I'll stay in character to help you practice."

# ─── SYNC HELPERS & HANDLERS ────────────────────────────────────────────────

def update_status(table: str, record_id: str, fields: dict):
    supabase.table(table).update(fields).eq("id", record_id).execute()

def download_audio(path: str, bucket="raw-audio") -> bytes:
    url = supabase.storage.from_(bucket).create_signed_url(path, 60)["signedURL"]
    return requests.get(url).content

def summarize_and_store(conv_id: str):
    history = supabase.table("messages") \
        .select("sender_role,transcription,assistant_text") \
        .eq("conversation_id", conv_id) \
        .order("created_at").execute().data or []
    if sum(1 for m in history if m["sender_role"]=="assistant") < 4:
        return

    msgs = [
        {"role":"user" if m["sender_role"]=="user" else "assistant",
         "content": m["transcription"] if m["sender_role"]=="user" else m["assistant_text"]}
        for m in history
    ]
    prompt = (
        "You are a concise summarizer. Extract the single main theme "
        "of the conversation as a noun or gerund phrase (≤12 words)."
    )
    resp = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role":"system","content":prompt}] + msgs,
        temperature=0.5, max_tokens=30
    )
    summary = resp.choices[0].message.content.strip().rstrip(".")
    supabase.table("conversations") \
        .update({"memory_summary": summary}) \
        .eq("id", conv_id).execute()

def close_inactive_conversations():
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
    stale = supabase.table("conversations") \
        .select("id") \
        .eq("ended", False) \
        .lt("updated_at", cutoff) \
        .execute().data or []
    for rec in stale:
        summarize_and_store(rec["id"])
        supabase.table("conversations") \
            .update({"ended": True}) \
            .eq("id", rec["id"]).execute()

def schedule_cleanup(interval_hours=1):
    def job():
        close_inactive_conversations()
        threading.Timer(interval_hours * 3600, job).start()
    job()

def build_chat_payload(conv_id: str, voice_mode: bool = False) -> list:
    # Fetch any saved memory
    meta = supabase.table("conversations") \
        .select("memory_summary") \
        .eq("id", conv_id) \
        .single().execute().data or {}
    memory = meta.get("memory_summary")

    # Fetch the message history
    history = supabase.table("messages") \
        .select("sender_role,transcription,assistant_text,created_at") \
        .eq("conversation_id", conv_id) \
        .order("created_at").execute().data or []

    # Start with system prompt(s)
    if voice_mode:
        # Enforce concise replies up front
        messages = [
            {"role": "system", "content": SKY_SYSTEM_PROMPT}
        ] + SKY_EXAMPLE_DIALOG
    else:
        messages = [{"role": "system", "content": SKY_SYSTEM_PROMPT}] + SKY_EXAMPLE_DIALOG

    # If this is a brand-new session with a memory summary, inject it
    if memory and not history:
        messages.append({
            "role": "assistant",
            "content": f"Last time we spoke, we talked about: {memory}. Would you like to continue?"
        })

    # Turn the DB rows into chat turns
    turns = []
    for m in history:
        if m["sender_role"] == "user":
            turns.append({"role": "user", "content": m["transcription"]})
        else:
            turns.append({"role": "assistant", "content": m["assistant_text"]})

    # If history is long, summarize older turns
    if len(turns) > MAX_HISTORY:
        summary_resp = openai_client.chat.completions.create(
            model = "gpt-3.5-turbo" if voice_mode else "gpt-4-turbo",
            messages=messages + [
                {"role": "assistant", "content": "Please summarize the earlier conversation briefly."}
            ] + turns[:-MAX_HISTORY],
            temperature=0.3,
            max_tokens=200
        )
        summary = summary_resp.choices[0].message.content
        messages += [
            {"role": "assistant", "content": f"Summary of earlier conversation: {summary}"}
        ] + turns[-MAX_HISTORY:]
    else:
        messages += turns

    return messages


def handle_transcription_record(msg):
    print(f"📝 ⏳ Transcribing message {msg['id']}…")
    try:
        audio = download_audio(msg["audio_path"])
        resp  = openai_client.audio.transcriptions.create(
            model="whisper-1",
            file=io.BytesIO(audio)
        )
        update_status("messages", msg["id"], {
            "transcription": resp.text,
            "transcription_status": "done"
        })
        print(f"✅ Transcribed {msg['id']}: “{resp.text[:30]}…”")
    except Exception as e:
        update_status("messages", msg["id"], {"transcription_status": "error"})
        print(f"❌ Transcription error for {msg['id']}:", e)


def handle_ai_record(msg):
    print(f"💬 ⏳ Generating AI reply for message {msg['id']}…")
    try:
        # 1) See if this conversation has voice mode on
        record = supabase_admin.table("conversations") \
            .select("voice_enabled") \
            .eq("id", msg["conversation_id"]) \
            .single() \
            .execute().data or {}
        voice_mode = bool(record.get("voice_enabled"))

        # 2) Build the payload, which will inject a 60-word limit if voice_mode is True
        payload = build_chat_payload(msg["conversation_id"], voice_mode=voice_mode)

        # 3) Call OpenAI once
        resp = openai_client.chat.completions.create(
            model = "gpt-3.5-turbo" if voice_mode else "gpt-4-turbo",
            messages=payload,
            temperature=0.7,
            max_tokens=200, #CHANGE THIS IF YOU WANT LONGER REPLIES
            functions=FUNCTION_DEFS,
            function_call="auto"
        )
        choice = resp.choices[0].message

        # 4) Extract the assistant text
        if getattr(choice, "function_call", None):
            args    = json.loads(choice.function_call.arguments)
            content = (
                "I'm so sorry you’re feeling this way. "
                f"If you ever think about harming yourself, call {args['hotline_number']}."
            )
        else:
            content = choice.content

        # 5) Store the assistant reply
        tts_status = "pending" if voice_mode else "done"
        if not voice_mode:
            print("ℹ️  Chat mode: skipping TTS call")
        supabase.table("messages").insert({
            "conversation_id": msg["conversation_id"],
            "sender_role":     "assistant",
            "assistant_text":  content,
            "ai_status":       "done",
            "tts_status":      tts_status
        }).execute()

        update_status("messages", msg["id"], {"ai_status": "done"})
        print(f"✅ Assistant response created for message {msg['id']}")

    except Exception as e:
        update_status("messages", msg["id"], {"ai_status": "error"})
        print(f"❌ AI error for {msg['id']}:", e)


# ─── ASYNC REALTIME SUBSCRIPTION ─────────────────────────────────────────────
async def start_realtime():
    supabase_async = await create_client_async(SUPABASE_URL, SERVICE_ROLE_KEY)

    def on_insert(payload):
        # supabase-py async realtime wraps the change under payload["data"]
        change = payload.get("data", {})
        msg    = change.get("record")
        if not msg:
            return

        loop = asyncio.get_event_loop()

        # 1) If this is a new user message awaiting transcription:
        if msg["sender_role"] == "user" and msg["transcription_status"] == "pending":
            loop.run_in_executor(None, handle_transcription_record, msg)

        # 2) If this user message has been transcribed and now awaits an AI reply:
        elif msg["sender_role"] == "user" \
        and msg["transcription_status"] == "done" \
        and msg.get("ai_status") == "pending":
            loop.run_in_executor(None, handle_ai_record, msg)

        # 3) No longer store MP3

    def on_subscribe(status, err):
        if status == RealtimeSubscribeStates.SUBSCRIBED:
            print("🔌 SUBSCRIBED to messages_changes")
        else:
            print("❗ Realtime status:", status, err)

    channel = supabase_async.channel("messages_changes")
    channel.on_postgres_changes("INSERT", schema="public", table="messages", callback=on_insert)
    await channel.subscribe(on_subscribe)

    # never exit
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(start_realtime())

# ─── Helpers ────────────────────────────────────────────────────────────────
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
    resp = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
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
    messages = [{"role":"system","content":SKY_SYSTEM_PROMPT}] + SKY_EXAMPLE_DIALOG

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
        summary_resp = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
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

# ─── ENTRYPOINT ─────────────────────────────────────────────────────────────


if __name__ == "__main__":
    print("➤ Loaded ENV:")
    print("  SUPABASE_URL =", SUPABASE_URL)
    print("  OPENAI_API_KEY set?", bool(os.getenv("OPENAI_API_KEY")))
    print("  ELEVENLABS_API_KEY set?", bool(os.getenv("ELEVENLABS_API_KEY")))

    # 1) One-off cleanup + schedule hourly
    close_inactive_conversations()
    schedule_cleanup(interval_hours=1)

    # 2) Drain any pending rows left over from before restart
    #    (so transcription, AI, and TTS all pick up where they left off)
    for msg in fetch_pending("messages", sender_role="user", transcription_status="pending"):
        handle_transcription_record(msg)

    for msg in fetch_pending(
        "messages",
        sender_role="user",
        transcription_status="done",
        ai_status="pending"
    ):
        handle_ai_record(msg)

    # 3) Start your realtime listener
    try:
        asyncio.run(start_realtime())
    except KeyboardInterrupt:
        print("👋 Shutting down.")
