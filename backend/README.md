# TaskPilot AI — Backend

FastAPI backend for TaskPilot AI. Handles task persistence via SQLite and AI-powered task extraction via the Google Gemini API.

For full API reference, see [API.md](API.md).

---

## Architecture

```
FastAPI (main.py)
    |
    |-- /api/v1/health       --> health.py
    |-- /api/v1/extract      --> extractor.py --> llm_service.py --> Gemini API
    |-- /api/v1/tasks/*      --> tasks.py     --> task_service.py --> SQLite
```

Dependency injection via `api/deps.py` provides a scoped SQLAlchemy session to every request handler, closed automatically in a `finally` block.

---

## Folder Structure

```
backend/
├── .env
├── .env.example
└── app/
    ├── main.py             # App factory, lifespan, CORS middleware
    ├── api/
    │   ├── deps.py         # get_db session dependency
    │   ├── router.py       # Registers all sub-routers
    │   └── endpoints/
    │       ├── health.py
    │       ├── extractor.py
    │       └── tasks.py
    ├── core/
    │   └── config.py       # pydantic-settings Settings class
    ├── database/
    │   ├── base.py         # Imports all models for metadata
    │   ├── base_class.py   # DeclarativeBase with auto __tablename__
    │   └── session.py      # SQLAlchemy engine and SessionLocal
    ├── models/
    │   └── task.py         # Task ORM model, TaskStatus, TaskPriority enums
    ├── schemas/
    │   ├── task.py         # TaskCreate, TaskUpdate, Task schemas
    │   └── extractor.py    # ExtractionRequest schema
    └── services/
        ├── llm_service.py  # Gemini API client and extraction logic
        └── task_service.py # SQLAlchemy CRUD helpers
```

---

## Technology Stack

| Package | Version | Role |
|---|---|---|
| FastAPI | >=0.110.0 | Web framework |
| Uvicorn | >=0.28.0 | ASGI server |
| SQLAlchemy | >=2.0.28 | ORM |
| Pydantic | >=2.6.4 | Validation and serialisation |
| pydantic-settings | >=2.2.1 | `.env` configuration loading |
| google-genai | >=0.1.1 | Google Gemini SDK |

---

## Database Schema

Table name: `task`

| Column | Type | Constraints | Default |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | auto |
| `description` | VARCHAR(255) | NOT NULL, indexed | — |
| `owner` | VARCHAR(100) | NOT NULL, indexed | — |
| `due_date` | DATE | nullable | NULL |
| `priority` | ENUM | NOT NULL | `Medium` |
| `status` | ENUM | NOT NULL | `Pending` |
| `created_at` | DATETIME | NOT NULL | `func.now()` |
| `updated_at` | DATETIME | NOT NULL | `func.now()`, auto-updates |

**TaskPriority** values: `Low`, `Medium`, `High`

**TaskStatus** values: `Pending`, `In Progress`, `Completed`

---

## AI Service

`services/llm_service.py` exposes `extract_tasks_from_text(text) -> List[ExtractedTask]`.

- Uses `google-genai` SDK with `response_mime_type="application/json"` and `response_schema=ExtractedTaskList` to enforce structured output.
- Temperature is `0.0` for deterministic results.
- The system prompt instructs the model to extract only tasks present in the text, resolve relative dates to ISO 8601, assign real names as owners (never roles), and use exactly one of `High`, `Medium`, `Low` for priority.
- Exception types are mapped to specific HTTP status codes in the extractor endpoint (400, 502, 503, 504).

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env`.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PROJECT_NAME` | No | `"Mini AI Project Manager Assistant"` | Shown in OpenAPI metadata |
| `API_V1_STR` | No | `"/api/v1"` | URL prefix for all routes |
| `DATABASE_URL` | No | `"sqlite:///./project_manager.db"` | SQLAlchemy connection string |
| `BACKEND_CORS_ORIGINS` | No | `""` | Comma-separated allowed CORS origins |
| `GEMINI_API_KEY` | **Yes** | `""` | Google Gemini API key |
| `LLM_MODEL` | No | `"gemini-2.5-flash"` | Gemini model identifier |
| `LLM_TIMEOUT` | No | `60.0` | Request timeout in seconds |

---

## Installation and Running

```bash
# Install dependencies (from repo root)
pip install -r requirements.txt

# Run the server (from backend/ directory)
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The SQLite database is created automatically on first startup. Interactive docs are available at `http://127.0.0.1:8000/docs`.

---

## Troubleshooting

**`GEMINI_API_KEY is not configured`** — The key is missing or still set to the placeholder value. Set it in `backend/.env`.

**400 on `/extract` with an API key message** — The key is present but rejected by Google. Verify it in Google AI Studio.

**`database is locked`** — Occurs when running multiple workers against the same SQLite file. Use a single worker locally, or switch to PostgreSQL for multi-worker deployments.

---
