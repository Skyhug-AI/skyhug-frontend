from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client
import uuid
import datetime
from .db import supabase_admin  # Admin client to bypass RLS

router = APIRouter()

# --- Pydantic Models ---

class Assessment(BaseModel):
    id: str
    name: str
    description: Optional[str]

class AnswerOption(BaseModel):
    label: str
    value: int

class AssessmentQuestion(BaseModel):
    id: str
    question_number: int
    question_text: str
    ui_prompt: Optional[str]
    answer_options: List[AnswerOption]

class AssessmentWithQuestions(BaseModel):
    id: str
    name: str
    questions: List[AssessmentQuestion]

class AnswerSubmission(BaseModel):
    user_id: str
    conversation_id: Optional[str]
    answers: List[dict]  # Each dict: {"question_id": str, "value": int, "label": str}

# --- Routes ---

@router.get("/api/assessments", response_model=List[Assessment])
def get_assessments():
    response = supabase_admin.table("assessments").select("*").execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="No assessments found")
    return response.data

@router.get("/api/assessments/{assessment_id}/questions", response_model=AssessmentWithQuestions)
def get_questions(assessment_id: str):
    assessment_res = supabase_admin.table("assessments").select("*").eq("id", assessment_id).single().execute()
    if not assessment_res.data:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions_res = supabase_admin.table("assessment_questions").select("*").eq("assessment_id", assessment_id).order("question_number").execute()
    return {
        "id": assessment_res.data["id"],
        "name": assessment_res.data["name"],
        "questions": questions_res.data or []
    }

@router.post("/api/assessments/{assessment_id}/submit")
def submit_assessment(assessment_id: str, submission: AnswerSubmission):
    score = sum(ans["value"] for ans in submission.answers)
    result_text = interpret_score(assessment_id, score)
    result_id = str(uuid.uuid4())

    supabase_admin.table("assessment_results").insert({
        "id": result_id,
        "assessment_id": assessment_id,
        "user_id": submission.user_id,
        "conversation_id": submission.conversation_id,
        "score": score,
        "result_text": result_text,
        "submitted_at": datetime.datetime.utcnow().isoformat()
    }).execute()

    for ans in submission.answers:
        supabase_admin.table("assessment_answers").insert({
            "id": str(uuid.uuid4()),
            "result_id": result_id,
            "question_id": ans["question_id"],
            "answer_value": ans["value"],
            "answer_label": ans["label"]
        }).execute()

    return {"result_id": result_id, "score": score, "result_text": result_text}

# --- Utility: Interpretation ---
def interpret_score(assessment_id: str, score: int) -> str:
    key = assessment_id.lower()
    if "phq" in key:
        if score >= 20: return "Severe Depression"
        elif score >= 15: return "Moderately Severe Depression"
        elif score >= 10: return "Moderate Depression"
        elif score >= 5: return "Mild Depression"
        else: return "Minimal Depression"
    elif "gad" in key:
        if score >= 15: return "Severe Anxiety"
        elif score >= 10: return "Moderate Anxiety"
        elif score >= 5: return "Mild Anxiety"
        else: return "Minimal Anxiety"
    elif "kessler" in key or "k6" in key:
        if score >= 13: return "Serious psychological distress"
        elif score >= 8: return "Moderate distress"
        else: return "Low distress"
    return "Score Interpretation Unavailable"

# You can include this router in your main app as:
# app.include_router(assessment.router)
