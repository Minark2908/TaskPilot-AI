from fastapi import APIRouter
from app.api.endpoints import health, extractor, tasks

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(extractor.router, tags=["extractor"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
