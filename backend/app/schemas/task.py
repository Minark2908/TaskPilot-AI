from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.task import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    description: str = Field(..., max_length=255)
    owner: str = Field(..., max_length=100)
    due_date: Optional[date] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    description: Optional[str] = Field(None, max_length=255)
    owner: Optional[str] = Field(None, max_length=100)
    due_date: Optional[date] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None

class TaskInDBBase(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Task(TaskInDBBase):
    pass

class TaskPage(BaseModel):
    items: list[Task]
    total: int
    skip: int
    limit: int
