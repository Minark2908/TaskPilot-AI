from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.rate_limiter import extractor_limiter
from app.schemas.extractor import ExtractionRequest
from app.schemas.task import Task, TaskCreate
from app.services.llm_service import extract_tasks_from_text
from app.services import task_service

router = APIRouter()

@router.post("/extract", response_model=List[Task], status_code=status.HTTP_201_CREATED)
def extract_and_save_tasks(
    payload: ExtractionRequest,
    db: Session = Depends(get_db),
    _: None = Depends(extractor_limiter),
):
    try:
        extracted = extract_tasks_from_text(payload.text)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except TimeoutError as exc:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc))
    except ConnectionError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during task extraction: {str(exc)}"
        )

    saved: List[Task] = []
    for item in extracted:
        task_in = TaskCreate(
            description=item.description,
            owner=item.owner,
            due_date=item.due_date,
            priority=item.priority,
        )
        saved.append(task_service.create_task(db=db, task_in=task_in))

    return saved

