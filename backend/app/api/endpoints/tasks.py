from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.task import Task, TaskCreate, TaskUpdate
from app.services import task_service

router = APIRouter()

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db=db, task_in=payload)

@router.get("/", response_model=List[Task], response_model_exclude_none=True)
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return task_service.get_tasks(db=db, skip=skip, limit=limit)

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

