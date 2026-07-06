from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> List[Task]:
    return db.query(Task).offset(skip).limit(limit).all()

def get_task(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()

def create_task(db: Session, task_in: TaskCreate) -> Task:
    db_task = Task(
        description=task_in.description,
        owner=task_in.owner,
        due_date=task_in.due_date,
        priority=task_in.priority,
        status=task_in.status
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, db_task: Task, task_in: TaskUpdate) -> Task:
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, db_task: Task) -> Task:
    db.delete(db_task)
    db.commit()
    return db_task
