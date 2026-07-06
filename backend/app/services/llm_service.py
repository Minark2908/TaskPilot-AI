import json
from datetime import date
from typing import List, Optional

from google import genai
from google.genai import types
from google.genai.errors import APIError
from pydantic import BaseModel, Field, ValidationError

from app.core.config import settings

class ExtractedTask(BaseModel):
    description: str = Field(..., description="Actionable description of what needs to be done.")
    owner: str = Field(default="Unassigned", description="Person responsible. Default 'Unassigned' if not specified.")
    due_date: Optional[date] = Field(default=None, description="Due date in YYYY-MM-DD format. Null if not specified.")
    priority: str = Field(default="Medium", description="Must be exactly one of: High, Medium, Low.")

    def model_post_init(self, __context) -> None:
        if self.priority not in ("High", "Medium", "Low"):
            self.priority = "Medium"

class ExtractedTaskList(BaseModel):
    tasks: List[ExtractedTask]

_SYSTEM_PROMPT = """\
You are a professional project manager assistant.
Extract every actionable task from the provided text.

Today's date context: use it to resolve relative dates like "by Friday" or "next week".

Rules:
- Extract every distinct action item, even if implicit.
- Do not invent tasks that are not present in the text.
- owner must be a real name from the text, never a role like 'team' or 'everyone'.
- due_date must be an ISO date string or null. Never a relative phrase.
- priority must be exactly one of: High, Medium, Low.
"""

def extract_tasks_from_text(text: str) -> List[ExtractedTask]:
    current_key = settings.GEMINI_API_KEY
    if not current_key or current_key in ("your_api_key_here", "your_gemini_api_key_here"):
        raise ValueError(
            "GEMINI_API_KEY is not configured. Please set it in your .env file."
        )

    client = genai.Client(
        api_key=current_key
    )

    try:
        response = client.models.generate_content(
            model=settings.LLM_MODEL,
            contents=f"Text:\n{text}",
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=ExtractedTaskList,
                temperature=0.0,
            ),
        )
    except APIError as exc:
        status_code = getattr(exc, "code", None)
        message = getattr(exc, "message", str(exc))
        if status_code in (400, 403):
            raise ValueError(f"Invalid Gemini API key: {message}")
        elif status_code == 429:
            raise RuntimeError(f"Gemini API rate limit reached: {message}")
        elif status_code in (408, 504):
            raise TimeoutError(f"Gemini API request timed out: {message}")
        else:
            raise RuntimeError(f"Gemini API error ({status_code}): {message}")
    except Exception as exc:
        raise ConnectionError(f"Failed to communicate with Gemini API: {str(exc)}")

    raw_content = response.text
    if not raw_content:
        return []

    try:
        data = json.loads(raw_content)
    except json.JSONDecodeError:
        raise RuntimeError("Gemini returned a response that is not valid JSON.")

    try:
        result = ExtractedTaskList.model_validate(data)
    except ValidationError as exc:
        raise RuntimeError(f"Gemini response did not match expected schema: {exc.error_count()} error(s).")

    return result.tasks


