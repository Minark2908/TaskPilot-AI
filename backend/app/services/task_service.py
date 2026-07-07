from typing import List, Optional, Tuple
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, Query
from app.models.task import Task, TaskStatus, TaskPriority
from app.schemas.task import TaskCreate, TaskUpdate

def _apply_task_filters(
    query: Query,
    search: Optional[str] = None,
    owner: Optional[str] = None,
    priority: Optional[TaskPriority] = None,
    status: Optional[TaskStatus] = None,
) -> Query:
    if search:
        query = query.filter(Task.description.ilike(f"%{search.strip()}%"))
    if owner:
        if owner.lower() == "unassigned":
            query = query.filter(or_(Task.owner == "", Task.owner.is_(None)))
        else:
            query = query.filter(func.lower(Task.owner) == owner.strip().lower())
    if priority:
        query = query.filter(Task.priority == priority)
    if status:
        query = query.filter(Task.status == status)
    return query

def get_tasks(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    owner: Optional[str] = None,
    priority: Optional[TaskPriority] = None,
    status: Optional[TaskStatus] = None,
) -> Tuple[List[Task], int]:
    query = _apply_task_filters(db.query(Task), search, owner, priority, status)
    total = query.count()
    items = (
        query.order_by(Task.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total

def get_distinct_owners(db: Session) -> List[str]:
    rows = (
        db.query(Task.owner)
        .distinct()
        .order_by(Task.owner.asc())
        .all()
    )
    owners = [row[0] for row in rows if row[0]]
    return owners

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
