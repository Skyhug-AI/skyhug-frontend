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
import re 

# ─── CONFIG & CLIENTS ────────────────────────────────────────────────────────
load_dotenv()

SUPABASE_URL        = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY    = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")
ELEVENLABS_API_KEY       = os.getenv("ELEVENLABS_API_KEY")


# sync clients for your existing handlers
supabase       = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)
supabase_admin = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

# async client only for realtime
# will be created inside `start_realtime()`

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def warmup_openai_models():
    for model in ("gpt-3.5-turbo", "gpt-4-turbo"):
        try:
            openai_client.chat.completions.create(
                model=model,
                messages=[
                    {"role":"system", "content":" "},
                    {"role":"user",   "content":" "}
                ],
                max_tokens=1
            )
        except Exception:
            pass




START_TS    = datetime.now(timezone.utc).isoformat()
MAX_HISTORY = 10

# Regex compilation 
_SENT_SPLIT = re.compile(r"([.!?]\s+)")
_SANITIZE  = re.compile(r"[*/{}\[\]<>&#@_\\|+=%]")
_SENT_COUNT= re.compile(r"[.!?]\s*")

# Initialize sessions 
storage_sess = requests.Session()
eleven_sess = requests.Session()
eleven_sess.headers.update({
    "xi-api-key": ELEVENLABS_API_KEY,
    "Content-Type": "application/json",
})

# ─── Your Custom Prompt & Examples ────────────────────────────────────────────
SKY_SYSTEM_PROMPT = """
You are a compassionate, emotionally attuned AI therapist assistant. You respond with warmth, sensitivity, and care. 
Your goal is to make the user feel heard, safe, and supported — not judged or fixed. You use simple, human language. 
You reflect feelings, normalize experiences, and offer practical next steps with kindness.

Always speak in a conversational tone — avoid sounding clinical, robotic, or overly formal. Do not use diagnostic terms. 
If a user expresses distress, validate it and gently suggest grounding or coping strategies. Do not suggest that they seek professional therapy or remind them that you’re an AI — focus entirely on helping them explore and work through their experience. 

For any mention of self-harm or suicide, invoke the `handle_suicidal_mention` function to provide a hotline and immediate in-person recommendation.

Your structure for each response should be:
1. Empathic reflection  
2. Gentle validation and normalization  
3. Supportive guidance (e.g., explore, soothe, or understand — not just fix)  
4. Invite the user to keep sharing or go deeper

Stay gentle, grounded, and curious. When in doubt, ask open-ended questions to help the user explore their inner world.
""".strip()

SKY_EXAMPLE_DIALOG = [
    {"role":"user", "content":"I feel like I’m falling apart and no one understands me."},
    {"role":"assistant", "content":"I’m really sorry you’re feeling this way. It makes so much sense that you’d feel overwhelmed when it seems like no one truly sees what you’re going through. You’re not alone — many people carry this kind of invisible weight. Sometimes writing down your feelings or talking out loud can help bring a bit of clarity or relief. Would you like to explore that together?"},
    {"role": "user", "content": "My chest gets tight and I can’t focus when I’m around people."},
    {"role": "assistant", "content": "That sounds so uncomfortable. Feeling that kind of pressure in social situations can be really overwhelming. You're not alone in this — many people find those moments incredibly hard to manage. What do you think makes those moments feel especially intense for you?"}
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

# ─── SYNC HELPERS & HANDLERS ────────────────────────────────────────────────
def update_status(table, record_id, fields):
    supabase.table(table).update(fields).eq("id", record_id).execute()

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

    conv = supabase.table("conversations") \
    .select("needs_resummarization") \
    .eq("id", conv_id).single().execute().data
    if conv and conv["needs_resummarization"]:
        supabase.table("conversations") \
        .update({"memory_summary": "", "needs_resummarization": False}) \
        .eq("id", conv_id).execute()

    # Fetch the message history
    history = supabase.table("messages") \
        .select("sender_role,transcription,assistant_text,created_at") \
        .eq("conversation_id", conv_id) \
        .eq("invalidated", False)  \
        .order("created_at").execute().data or []

    # Start with system prompt(s)
    messages = [{"role": "system", "content": SKY_SYSTEM_PROMPT}] + SKY_EXAMPLE_DIALOG

    # If this is a brand-new session with a memory summary, inject it
    if memory and not history:
        messages.append({
            "role": "assistant",
            "content": f"Last time we spoke, we discussed {memory}. Would you like to continue?"
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
            model = "gpt-4-turbo" if voice_mode else "gpt-4-turbo",
            messages=messages + [
                {"role": "assistant", "content": "Please summarize the earlier conversation briefly."}
            ] + turns[:-MAX_HISTORY],
            temperature=0.3,
            max_tokens=600
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
    """
    Fetch a transcription-complete user message, generate an AI reply,
    and write either a streaming chat-mode record or a voice-mode
    record with a streaming snippet URL baked in.
    """
    # skip anything we’ve already started
    if msg.get("ai_started"):
        return
    # mark it so no one else will re-run it
    supabase_admin.table("messages").update({"ai_started": True}).eq("id", msg["id"]).execute()
    print(f"💬 ⏳ Generating AI reply for message {msg['id']}…")

    try:
        # 1) Figure out if Voice Mode is on
        conv = (
            supabase_admin
            .table("conversations")
            .select("voice_enabled")
            .eq("id", msg["conversation_id"])
            .single()
            .execute()
        )
        voice_mode = bool(conv.data.get("voice_enabled", False))

        # 2) Build the chat payload
        payload = build_chat_payload(msg["conversation_id"], voice_mode=voice_mode)

        # ── MODEL SELECTION ──────────────────────────────────────────────
        user_text = (msg.get("transcription") or "").strip()
        lc = user_text.lower()

        if lc.startswith(("what is ", "define ")):
            model_name, max_tokens = "gpt-3.5-turbo", 150
        elif lc.startswith(("i feel", "i’m feeling", "i am feeling", "i am", "i'm")):
            model_name, max_tokens = "gpt-4-turbo", 600
        elif lc.startswith(("why ", "how ", "explain ", "describe ", "compare ", "recommend ", "suggest ")):
            model_name, max_tokens = "gpt-4-turbo", 600
        else:
            words = [w for w in user_text.split() if w.strip()]
            if len(words) > 6:                  # threshold = 6 words
                model_name, max_tokens = "gpt-4-turbo", 600
            else:
                model_name, max_tokens = "gpt-3.5-turbo", 150

        print("Selected model:", model_name)

        # ── Generate and store assistant reply ────────────────────────────────────────
        if not voice_mode:
            # —— CHAT MODE: stream deltas into the DB ——
            insert_resp = (
                supabase
                .table("messages")
                .insert({
                    "conversation_id": msg["conversation_id"],
                    "sender_role":     "assistant",
                    "assistant_text":  "",
                    "ai_status":       "pending",
                    "ai_started":      False,
                    "tts_status":      "done"
                })
                .execute()
            )
            mid = insert_resp.data[0]["id"]

            # stream GPT
            stream = openai_client.chat.completions.create(
                model=model_name,
                messages=payload,
                temperature=0.7,
                stream=True,
                max_tokens=max_tokens
            )

            accumulated = ""
            finish_reason = None
            for chunk in stream:
                delta = chunk.choices[0].delta.content or ""
                accumulated += delta
                if chunk.choices[0].finish_reason:
                    finish_reason = chunk.choices[0].finish_reason
                supabase.table("messages") \
                    .update({"assistant_text": accumulated}) \
                    .eq("id", mid) \
                    .execute()

            # if truncated or cut off mid-sentence, fetch a continuation
            if finish_reason == "length" or not accumulated.strip().endswith((".", "!", "?")):
                cont = openai_client.chat.completions.create(
                    model=model_name,
                    messages=payload + [{"role": "assistant", "content": accumulated}],
                    temperature=0.7,
                    max_tokens=200
                )
                extra = cont.choices[0].message.content or ""
                accumulated = accumulated.rstrip() + " " + extra.strip()
                supabase.table("messages") \
                    .update({"assistant_text": accumulated}) \
                    .eq("id", mid) \
                    .execute()

            # mark AI done
            supabase.table("messages") \
                .update({"ai_status": "done"}) \
                .eq("id", mid) \
                .execute()

        else:
            # —— VOICE MODE: full GPT → streaming snippet URL ——
            resp = openai_client.chat.completions.create(
                model=model_name,
                messages=payload,
                temperature=0.7,
                max_tokens=max_tokens,
                functions=FUNCTION_DEFS,
                function_call="auto"
            )
            choice = resp.choices[0].message

            # handle function calls (e.g. suicidal mentions)
            if getattr(choice, "function_call", None):
                args = json.loads(choice.function_call.arguments)
                content = (
                    "I'm so sorry you’re feeling this way. "
                    f"If you ever think about harming yourself, call {args['hotline_number']}."
                )
            else:
                # base content
                content = choice.content or ""

                # if truncated or cut off mid-sentence, fetch continuation
                finish_reason = resp.choices[0].finish_reason
                if finish_reason == "length" or not content.strip().endswith((".", "!", "?")):
                    cont = openai_client.chat.completions.create(
                        model=model_name,
                        messages=payload + [{"role": "assistant", "content": content}],
                        temperature=0.7,
                        max_tokens=200,
                        functions=FUNCTION_DEFS,
                        function_call="auto"
                    )
                    cont_choice = cont.choices[0].message
                    extra = cont_choice.content or ""
                    content = content.rstrip() + " " + extra.lstrip()

            # insert the full assistant_text, leave snippet_url blank
            insert_resp = (
                supabase
                .table("messages")
                .insert({
                    "conversation_id": msg["conversation_id"],
                    "sender_role":     "assistant",
                    "assistant_text":  content,
                    "ai_status":       "done",
                    "tts_status":      "pending",
                    "snippet_url":     ""
                })
                .execute()
            )
            mid = insert_resp.data[0]["id"]

            # seed the first snippet
            snippet_url = f"/tts-stream/{mid}?snippet=0"
            try:
                supabase.table("messages") \
                    .update({"snippet_url": snippet_url}) \
                    .eq("id", mid) \
                    .execute()
            except Exception as e:
                print("❌ Failed to write snippet_url:", e)
                supabase.table("messages") \
                    .update({"tts_status": "error"}) \
                    .eq("id", mid) \
                    .execute()

        # ─── Clear original message status ───────────────────────────────────────────
        supabase.table("messages") \
            .update({"ai_status": "done"}) \
            .eq("id", msg["id"]) \
            .execute()

        print(f"✅ Assistant response created for message {msg['id']}")


    except Exception as e:
        print(f"❌ AI error for {msg['id']}: {e}")
        supabase.table("messages") \
            .update({"ai_status": "error"}) \
            .eq("id", msg["id"]) \
            .execute()



# ─── ASYNC REALTIME SUBSCRIPTION ─────────────────────────────────────────────
async def start_realtime():
    supabase_async = await create_client_async(SUPABASE_URL, SERVICE_ROLE_KEY)

    def on_insert(payload):
        msg = payload["data"]["record"]
        # only text messages (or audio after transcription) should trigger
        if (
        msg["sender_role"] == "user"
        and msg.get("ai_status") == "pending"
        and msg.get("transcription_status") == "done"
        and not msg.get("ai_started")
        ):
            loop = asyncio.get_event_loop()
            loop.run_in_executor(None, handle_ai_record, msg)

    def on_update(payload):
        msg = payload["data"]["record"]
        # only fire on a true client edit
        if (
        msg["sender_role"] == "user"
        and msg.get("ai_status") == "pending"
        and msg.get("edited_at")   # only set by your editMessage call
        and not msg.get("ai_started")
        ):
            loop = asyncio.get_event_loop()
            loop.run_in_executor(None, handle_ai_record, msg)

    def on_subscribe(status, err):
        if status == RealtimeSubscribeStates.SUBSCRIBED:
            print("🔌 SUBSCRIBED to messages_changes")
        else:
            print("❗ Realtime status:", status, err)
    
    def on_change(payload):
        msg = payload["data"]["record"]
        # only new user turns, never ones we’ve already kicked off
        if (
        msg["sender_role"] == "user"
        and msg.get("ai_status") == "pending"
        and not msg.get("ai_started")
        ):
            loop = asyncio.get_event_loop()
            loop.run_in_executor(None, handle_ai_record, msg)

    channel = supabase_async.channel("messages_changes")
    channel.on_postgres_changes(event="INSERT", schema="public", table="messages", callback=on_insert)
    channel.on_postgres_changes(event="UPDATE", schema="public", table="messages", callback=on_update)
    await channel.subscribe(on_subscribe)

    # Never close 
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


def download_audio(path, bucket="raw-audio"):
    url = supabase.storage.from_(bucket).create_signed_url(path, 60)["signedURL"]
    return storage_sess.get(url).content

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
    You are a concise summarizer. Return a single plain noun phrase (≤8 words)that captures the conversation topic. Do NOT return a full sentence, no punctuation, no articles like “the” or “a”.
    """
    resp = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role":"system", "content": prompt.strip()}] + msgs,
        temperature=0.5,
        max_tokens=30,
    )
    raw = resp.choices[0].message.content.strip()
    # strip trailing period if any
    summary = raw.rstrip(".!?,;").strip()

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

# ─── ENTRYPOINT ─────────────────────────────────────────────────────────────


if __name__ == "__main__":
    print("➤ Loaded ENV:")
    print("  SUPABASE_URL =", SUPABASE_URL)
    print("  OPENAI_API_KEY set?", bool(os.getenv("OPENAI_API_KEY")))
    print("  ELEVENLABS_API_KEY set?", bool(os.getenv("ELEVENLABS_API_KEY")))

    warmup_openai_models()

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
