# TaskPilot AI

An AI-powered project management assistant that converts unstructured meeting notes and text into structured, actionable tasks. TaskPilot AI uses the Google Gemini API to extract tasks from free-form input, then allows users to review, edit, filter, manage, and export those tasks through a modern web interface.

---

## Features

- **AI Task Extraction** — Paste raw meeting notes or transcripts and have Gemini 2.5 Flash extract discrete, structured action items automatically.
- **Review and Edit Before Saving** — Extracted tasks are surfaced in an editable review interface before being committed to the database. Each field (description, owner, due date, priority) can be adjusted inline.
- **Task CRUD** — Create, read, update, and delete tasks through the UI. Individual task detail pages support in-place editing via a managed form.
- **Filtering** — The task management view supports simultaneous filtering by free-text search, owner, priority, and status, with a one-click reset.
- **CSV Export** — Export the current task list (or filtered subset) to a CSV file directly from the browser.
- **Live Backend Status** — The navigation bar polls the backend health endpoint every 30 seconds and displays a live connection indicator.
- **Dashboard Overview** — Tasks are grouped visually into status columns (Pending, In Progress, Completed) and priority lanes (High, Medium, Low) for quick situational awareness.

---

## System Architecture Overview

TaskPilot AI follows a standard client-server architecture with a clear separation between the presentation layer, the application logic layer, and the persistence layer. The AI model is accessed as a remote service via the Google Gemini API.

```
Browser (React + Vite)
        |
        | HTTP / JSON (Axios)
        v
FastAPI Application Server (Uvicorn)
        |
        |-- Task CRUD --> SQLite (SQLAlchemy ORM)
        |
        |-- AI Extraction --> Google Gemini API (google-genai SDK)
                                      |
                              Structured JSON response
                                      |
                              Persisted to SQLite
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component framework |
| TypeScript | 6 | Static typing |
| Vite | 8 | Build tool and dev server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 3 | Utility-first styling |
| Axios | 1 | HTTP client |
| React Hook Form | 7 | Form state and validation |
| Lucide React | 1 | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Runtime |
| FastAPI | 0.110+ | Web framework |
| Uvicorn | 0.28+ | ASGI server |
| SQLAlchemy | 2 | ORM and database abstraction |
| Pydantic | 2 | Data validation and serialization |
| pydantic-settings | 2 | Environment-based configuration |

### Database

| Technology | Purpose |
|---|---|
| SQLite | Local file-based relational database (`project_manager.db`) |

### AI

| Technology | Purpose |
|---|---|
| Google Gemini 2.5 Flash | LLM used for structured task extraction |
| google-genai SDK | Official Python client for the Gemini API |

---

## Folder Structure

```
TaskPilot AI/
├── .env                        # Root-level environment variables (Gemini API key, CORS)
├── .env.example                # Example environment variable template
├── requirements.txt            # Python dependencies
├── project_manager.db          # SQLite database file (auto-created on first run)
│
├── backend/
│   ├── .env                    # Backend-specific environment variables
│   ├── .env.example            # Backend environment variable template
│   ├── __init__.py
│   └── app/
│       ├── main.py             # FastAPI application entry point
│       ├── api/
│       │   ├── deps.py         # FastAPI dependency: database session injection
│       │   ├── router.py       # Central API router
│       │   └── endpoints/
│       │       ├── health.py   # GET /api/v1/health
│       │       ├── extractor.py # POST /api/v1/extract
│       │       └── tasks.py    # CRUD endpoints under /api/v1/tasks
│       ├── core/
│       │   └── config.py       # Application settings via pydantic-settings
│       ├── database/
│       │   ├── base.py         # Imports all models for Alembic/metadata
│       │   ├── base_class.py   # SQLAlchemy DeclarativeBase with auto __tablename__
│       │   └── session.py      # SQLAlchemy engine and SessionLocal factory
│       ├── models/
│       │   └── task.py         # Task ORM model with enums for status and priority
│       ├── schemas/
│       │   ├── task.py         # Pydantic schemas: TaskCreate, TaskUpdate, Task
│       │   └── extractor.py    # Pydantic schema: ExtractionRequest
│       └── services/
│           ├── llm_service.py  # Gemini API integration and task extraction logic
│           └── task_service.py # Database CRUD operations for tasks
│
└── frontend/
    ├── index.html              # HTML entry point
    ├── package.json            # Node dependencies and scripts
    ├── vite.config.ts          # Vite configuration
    ├── tailwind.config.js      # Tailwind CSS theme and token configuration
    ├── tsconfig.json           # TypeScript compiler options
    └── src/
        ├── main.tsx            # React application bootstrap
        ├── App.tsx             # Root component with router and layout
        ├── index.css           # Global styles
        ├── types/
        │   └── index.ts        # Shared TypeScript type definitions
        ├── layouts/
        │   └── AppLayout.tsx   # Page shell: Navbar, main content area, footer, Toast
        ├── pages/
        │   ├── Dashboard.tsx       # Task overview grouped by status and priority
        │   ├── AIExtract.tsx       # Meeting notes input and extraction review flow
        │   ├── TaskManagement.tsx  # Full task list with filter, edit, delete
        │   └── TaskDetails.tsx     # Individual task detail and edit page
        ├── components/
        │   ├── Navbar.tsx              # Top navigation with live backend status
        │   ├── FilterBar.tsx           # Combined search and dropdown filter controls
        │   ├── TaskTable.tsx           # Tabular task list with action buttons
        │   ├── TaskReviewCard.tsx      # Inline-editable card for post-extraction review
        │   ├── EditTaskModal.tsx       # Modal dialog for editing an existing task
        │   ├── DeleteConfirmationModal.tsx # Confirmation dialog before task deletion
        │   ├── AISummaryCard.tsx       # Extraction metrics summary (count, priority breakdown)
        │   ├── MeetingNotesCard.tsx    # Textarea input card for notes submission
        │   ├── PriorityBadge.tsx       # Color-coded priority label
        │   ├── StatusBadge.tsx         # Color-coded status label
        │   ├── LoadingSpinner.tsx      # Reusable spinner component
        │   ├── EmptyState.tsx          # Placeholder shown when no tasks exist
        │   └── Toast.tsx               # Toast notification display and container
        ├── hooks/
        │   ├── useTasks.ts     # State and actions for task CRUD operations
        │   ├── useExtract.ts   # State and actions for AI extraction flow
        │   └── useToast.tsx    # Toast context provider and hook
        ├── services/
        │   ├── api.ts          # Axios instance with base URL and error interceptor
        │   └── taskService.ts  # API call functions for all task and extraction endpoints
        └── utils/
            ├── exportCsv.ts    # Builds and triggers CSV file download
            └── formatDate.ts   # Formats ISO date strings for display
```

---

## Architecture Flow

```
User submits meeting notes (AIExtract page)
        |
        v
POST /api/v1/extract  (ExtractionRequest payload)
        |
        v
llm_service.extract_tasks_from_text()
        |
        v
Google Gemini 2.5 Flash API
  - System prompt instructs structured JSON output
  - Response schema enforced via response_mime_type + response_schema
        |
        v
Pydantic validation of LLM response (ExtractedTaskList)
        |
        v
task_service.create_task() for each extracted item
  - Tasks written to SQLite
        |
        v
List[Task] returned to frontend (HTTP 201)
        |
        v
Review interface rendered (TaskReviewCard)
  - User edits fields inline
  - User confirms with "Save All Tasks"
        |
        v
PUT /api/v1/tasks/{id} for each reviewed task
        |
        v
Persisted to SQLite, user redirected to /tasks
```

---

## Setup Instructions

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher and npm
- A Google Gemini API key (obtain from [Google AI Studio](https://aistudio.google.com/))

### Clone Repository

```bash
git clone <repository-url>
cd "TaskPilot AI"
```

### Environment Variables

**Backend** — copy and fill in `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PROJECT_NAME="Mini AI Project Manager Assistant"
API_V1_STR="/api/v1"
DATABASE_URL="sqlite:///./project_manager.db"
BACKEND_CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
GEMINI_API_KEY="your_gemini_api_key_here"
LLM_MODEL="gemini-2.5-flash"
LLM_TIMEOUT=60.0
```

**Frontend** — copy and fill in `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

The default value `http://127.0.0.1:8000/api/v1` is correct for local development.

### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Run Backend

From the repository root:

```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/api/v1/openapi.json`, and Swagger UI is at `http://127.0.0.1:8000/docs`.

### Run Frontend

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Screens Overview

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/` | Visual overview of all tasks grouped into three status columns (Pending, In Progress, Completed) and three priority lanes (High, Medium, Low). Includes a CSV export button. |
| AI Extract | `/extract` | Two-phase interface. Phase one accepts free-form meeting notes. Phase two renders extracted tasks as editable review cards with an extraction metrics summary before the user commits them to the database. |
| Task Management | `/tasks` | Full paginated task list in table format. Supports simultaneous filtering by text search, owner, priority, and status. Provides per-row edit and delete actions. Filtered results can be exported to CSV. |
| Task Details | `/tasks/:taskId` | Single-task view showing all fields and audit timestamps. An in-page edit mode activates a managed form (react-hook-form) for updating the task directly. |

---

## API Overview

All endpoints are prefixed with `/api/v1`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns backend and database health status |
| `POST` | `/extract` | Accepts free-form text, calls Gemini, persists extracted tasks, returns the saved task list |
| `GET` | `/tasks/` | Returns all tasks (supports `skip` and `limit` query parameters) |
| `POST` | `/tasks/` | Creates a single task manually |
| `GET` | `/tasks/{task_id}` | Returns a single task by ID |
| `PUT` | `/tasks/{task_id}` | Partially or fully updates a task by ID |
| `DELETE` | `/tasks/{task_id}` | Deletes a task by ID |

---

## Future Improvements

- User authentication and multi-user support with per-user task isolation
- Pagination on the task list endpoint and frontend table
- Support for multiple LLM backends (configurable provider selection)
- Task comments and activity history
- Due date reminders and notification system
- Bulk task operations (multi-select delete, status update)
- Dark mode toggle in the UI

---

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Follow the existing code structure: keep backend logic in services, keep frontend data-fetching logic in custom hooks, and keep API calls in `taskService.ts`.
3. Do not commit `.env` files or the `project_manager.db` file.
4. Open a pull request with a clear description of what the change does and why.

---

## License

This project is released under the MIT License.

---

## Documentation Links

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
- [API Reference](backend/API.md)
