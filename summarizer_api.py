from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from worker import summarize_and_store, close_inactive_conversations

# bring in your worker’s summary logic
from worker import summarize_and_store

app = FastAPI()

# allow your React dev server (localhost:8080) to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    conversation_id: str

@app.post("/summarize_conversation")
async def summarize_conversation(req: SummarizeRequest):
    try:
        summarize_and_store(req.conversation_id)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cleanup_inactive")
async def cleanup_inactive():
    """
    Manually trigger auto-ending and summarizing any conversation
    that has been idle >1h.
    """
    try:
        close_inactive_conversations()
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("summarizer_api:app", host="0.0.0.0", port=8001, reload=True)