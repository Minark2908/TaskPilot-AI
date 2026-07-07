from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.models.task import TaskPriority, TaskStatus
from app.schemas.task import Task, TaskCreate, TaskPage, TaskUpdate
from app.services import task_service

router = APIRouter()

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db=db, task_in=payload)

@router.get("/owners", response_model=List[str])
def read_task_owners(db: Session = Depends(get_db)):
    return task_service.get_distinct_owners(db=db)

@router.get("/", response_model=TaskPage, response_model_exclude_none=True)
def read_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(
        settings.DEFAULT_PAGE_SIZE,
        ge=1,
        le=settings.MAX_PAGE_SIZE,
    ),
    search: Optional[str] = Query(None, max_length=255),
    owner: Optional[str] = Query(None, max_length=100),
    priority: Optional[TaskPriority] = None,
    status: Optional[TaskStatus] = None,
    db: Session = Depends(get_db),
):
    items, total = task_service.get_tasks(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        owner=owner,
        priority=priority,
        status=status,
    )
    return TaskPage(items=items, total=total, skip=skip, limit=limit)

@router.get("/{task_id}", response_model=Task, response_model_exclude_none=True)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_service.get_task(db=db, task_id=task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    return db_task

@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    db_task = task_service.get_task(db=db, task_id=task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    return task_service.update_task(db=db, db_task=db_task, task_in=payload)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_service.get_task(db=db, task_id=task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    task_service.delete_task(db=db, db_task=db_task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
