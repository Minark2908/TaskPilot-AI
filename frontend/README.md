# TaskPilot AI — Frontend

This document covers the frontend application of TaskPilot AI. The frontend is a React single-page application built with Vite and TypeScript. It communicates with the FastAPI backend over a versioned REST API and provides all user-facing functionality: AI task extraction, task management, filtering, detail editing, and CSV export.

---

## Project Overview

The frontend is a client-side rendered SPA. All routing is handled in the browser using React Router. There is no server-side rendering. State is managed locally within custom React hooks — there is no global state library. API communication is handled through a centralised Axios instance and a typed service module.

---

## Architecture

```
src/
  App.tsx                 Root router and provider composition
      |
      +-- AppLayout       Shell: Navbar + main content area + footer + Toast
              |
              +-- Dashboard         /
              +-- AIExtract         /extract
              +-- TaskManagement    /tasks
              +-- TaskDetails       /tasks/:taskId

Custom Hooks (state + side effects)
  useTasks        -- task list state, CRUD operations
  useExtract      -- extraction flow state
  useToast        -- notification queue

Services (API communication)
  api.ts          -- Axios instance, base URL, response error interceptor
  taskService.ts  -- typed wrappers for each backend endpoint

Utils (pure functions)
  exportCsv.ts    -- builds CSV content and triggers browser download
  formatDate.ts   -- converts ISO date strings to localised display strings
```

---

## Technology Stack

| Package | Version | Role |
|---|---|---|
| React | 19 | Component framework |
| TypeScript | 6 | Static typing across the entire codebase |
| Vite | 8 | Build tool and development server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 3 | Utility-first CSS framework |
| Axios | 1 | HTTP client with interceptors |
| React Hook Form | 7 | Form state management and validation |
| Lucide React | 1 | SVG icon library |

---

## Folder Structure

```
frontend/
├── index.html                  # HTML document shell, mounts #root
├── package.json
├── vite.config.ts              # Vite plugin configuration (React plugin only)
├── tailwind.config.js          # Custom theme tokens and font families
├── tsconfig.json               # TypeScript project references
├── tsconfig.app.json           # App-specific TypeScript settings
├── tsconfig.node.json          # Node tooling TypeScript settings
├── .env                        # VITE_API_BASE_URL (not committed)
└── src/
    ├── main.tsx                # Renders <App /> into #root
    ├── App.tsx                 # BrowserRouter, Routes, ToastProvider
    ├── index.css               # Minimal global styles
    ├── types/
    │   └── index.ts            # Task, TaskCreate, TaskUpdate, ExtractedTask types
    ├── layouts/
    │   └── AppLayout.tsx       # Full-page shell with Navbar, footer, ToastContainer
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── AIExtract.tsx
    │   ├── TaskManagement.tsx
    │   └── TaskDetails.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── FilterBar.tsx
    │   ├── TaskTable.tsx
    │   ├── TaskReviewCard.tsx
    │   ├── EditTaskModal.tsx
    │   ├── DeleteConfirmationModal.tsx
    │   ├── AISummaryCard.tsx
    │   ├── MeetingNotesCard.tsx
    │   ├── PriorityBadge.tsx
    │   ├── StatusBadge.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── EmptyState.tsx
    │   └── Toast.tsx
    ├── hooks/
    │   ├── useTasks.ts
    │   ├── useExtract.ts
    │   └── useToast.tsx
    ├── services/
    │   ├── api.ts
    │   └── taskService.ts
    └── utils/
        ├── exportCsv.ts
        └── formatDate.ts
```

---

## Routing

Routes are declared in `App.tsx` using React Router DOM v7. The application uses `BrowserRouter` (HTML5 history API). All unmatched paths redirect to `/`.

| Route | Component | Description |
|---|---|---|
| `/` | `Dashboard` | Task overview grouped by status and priority |
| `/extract` | `AIExtract` | AI extraction input and review flow |
| `/tasks` | `TaskManagement` | Full task list with filters and actions |
| `/tasks/:taskId` | `TaskDetails` | Individual task detail and edit page |
| `*` | Redirect to `/` | Catch-all for unknown paths |

---

## Component Structure

### Pages

#### Dashboard (`/`)

Fetches all tasks on mount via `useTasks`. Splits tasks into two visual groupings using `useMemo`:

- **Workflow Status Columns** — three columns for Pending, In Progress, and Completed. Each column shows up to four tasks rendered as `TaskMiniCard` (a component local to `Dashboard.tsx`), displaying description, owner, due date, and a priority badge.
- **Priority Urgency Lists** — three columns for High, Medium, and Low priority. Each shows up to four tasks with a status badge.

Clicking any task card navigates to `/tasks/:taskId`. A CSV export button at the top triggers `exportToCsv` with the full task list.

---

#### AIExtract (`/extract`)

Two-phase flow controlled by a local `isReviewMode` boolean:

**Phase 1 — Input**

Renders `MeetingNotesCard`, which provides a textarea for raw text input and a submit button. On submit, `useExtract.extractTasks(text)` is called, which sends a `POST /extract` request. If tasks are returned, the component switches to review mode.

**Phase 2 — Review**

Renders `AISummaryCard` (extraction metrics) and `TaskReviewList` (editable cards for each extracted task). The user can modify any field on any card or delete individual tasks from the list before committing. Clicking "Save All Tasks" calls `useTasks.saveMultipleTasks`, which sends a `PUT` request for each task and then redirects to `/tasks`. Clicking "Cancel" deletes all extracted tasks from the database via individual `DELETE` requests and returns to the input phase.

While any async operation is in progress (`isExtracting`, `isDiscarding`, `isSaving`), the entire page content is replaced with a `LoadingSpinner` and a contextual status message.

---

#### TaskManagement (`/tasks`)

Fetches all tasks on mount. Derives a unique `ownersList` for the owner filter dropdown using `useMemo`. Applies four simultaneous filter conditions using a single `useMemo` over the task list:

- Text search on `description` (case-insensitive substring match)
- Exact match on `owner` (case-insensitive)
- Exact match on `priority`
- Exact match on `status`

Renders `FilterBar` for the filter controls and `TaskTable` for the result set. The CSV export button exports only the currently filtered subset.

Per-row actions:
- **View** — navigates to `/tasks/:taskId`
- **Edit** — opens `EditTaskModal` with the selected task pre-populated
- **Delete** — opens `DeleteConfirmationModal`, then calls `useTasks.deleteTask`

---

#### TaskDetails (`/tasks/:taskId`)

Fetches a single task by ID on mount. Uses `react-hook-form` for the edit form, pre-populated via `reset()` when the task loads.

Two display modes controlled by `isEditMode`:

- **View mode** — displays all task fields and audit timestamps (`created_at`, `updated_at`) in a read-only layout. An "Edit Task" button switches to edit mode.
- **Edit mode** — renders a managed form. The `description` and `owner` fields include client-side validation (required, max length). Priority and status are `<select>` elements. On successful submission, the local `task` state is updated with the API response and the component returns to view mode.

Breadcrumb navigation links back to the Task Management list.

---

### Reusable Components

| Component | Props | Description |
|---|---|---|
| `Navbar` | none | Sticky top navigation. Polls `GET /health` every 30 seconds and renders a pulsing green or solid red dot next to the brand name to indicate backend connectivity. Contains navigation links to Dashboard, AI Extract, and Task Management. |
| `AppLayout` | `children` | Page shell. Wraps content with the Navbar at the top, a centred `<main>` element (max-width 7xl), a footer, and the `ToastContainer`. |
| `FilterBar` | `searchQuery`, `onSearchChange`, `selectedOwner`, `onOwnerChange`, `selectedPriority`, `onPriorityChange`, `selectedStatus`, `onStatusChange`, `onClearFilters`, `ownersList` | Combined filter control bar. Renders a text search input and three dropdown selectors (owner, priority, status). A "Reset" button appears conditionally when any filter is active. |
| `TaskTable` | `tasks`, `onView`, `onEdit`, `onDelete` | Renders tasks in an HTML table. Each row shows description, owner, due date, priority badge, status badge, and three action buttons. |
| `TaskReviewCard` | `task`, `onChange`, `onDelete` | Inline-editable card used during the extraction review phase. All fields are live-controlled inputs bound to the parent state via `onChange`. |
| `TaskReviewList` | `tasks`, `onTasksChange`, `onSaveAll`, `onCancel`, `isSaving` | Container for the extraction review phase. Renders a grid of `TaskReviewCard` components and "Save All" / "Cancel" action buttons. |
| `EditTaskModal` | `task`, `isOpen`, `onClose`, `onSave` | Modal dialog for editing an existing task from the Task Management page. |
| `DeleteConfirmationModal` | `task`, `isOpen`, `onClose`, `onConfirm` | Modal dialog that displays the task description and asks the user to confirm deletion. |
| `AISummaryCard` | `tasks` | Displays extraction metrics: total tasks extracted, and counts per priority level. |
| `MeetingNotesCard` | `onExtract`, `isLoading` | Textarea card for submitting meeting notes to the extraction endpoint. |
| `PriorityBadge` | `priority` | Small colour-coded label. High = rose, Medium = amber, Low = emerald. |
| `StatusBadge` | `status` | Small colour-coded label. Pending = slate, In Progress = blue, Completed = emerald. |
| `LoadingSpinner` | `size` (`"sm"` or `"lg"`) | Animated SVG spinner. |
| `EmptyState` | none | Placeholder shown in Task Management when no tasks exist. |
| `Toast` / `ToastContainer` | — | Renders the current toast queue from `useToast`. Each toast auto-dismisses after 4 seconds. |

---

## State Management

There is no external state library. State is managed through three custom hooks:

### useTasks

Manages the task list state for pages that need full CRUD access.

| Returned value | Type | Description |
|---|---|---|
| `tasks` | `Task[]` | Current task list |
| `isLoading` | `boolean` | True while a fetch or batch save is in progress |
| `error` | `string \| null` | Error message from the last failed fetch |
| `fetchTasks` | `() => Promise<void>` | Loads all tasks from the API |
| `addTask` | `(task: TaskCreate) => Promise<Task>` | Creates a task and prepends it to local state |
| `updateTask` | `(id, update) => Promise<void>` | Updates a task and reflects the change in local state |
| `deleteTask` | `(id) => Promise<void>` | Deletes a task and removes it from local state |
| `saveMultipleTasks` | `(tasks: Task[]) => Promise<void>` | Sends a `PUT` for each task in the list, then refreshes the full list |
| `setTasks` | React state setter | Direct state setter, used by the extraction review flow |

### useExtract

Manages the AI extraction flow state.

| Returned value | Type | Description |
|---|---|---|
| `extractedTasks` | `Task[]` | Tasks returned by the last extraction |
| `isExtracting` | `boolean` | True while the extraction request is in flight |
| `extractError` | `string \| null` | Error message if extraction failed |
| `extractTasks` | `(text: string) => Promise<Task[] \| null>` | Sends the extraction request |
| `clearExtractedTasks` | `() => void` | Resets extracted tasks and error state |
| `setExtractedTasks` | React state setter | Used to reflect inline edits made in the review cards |

### useToast

A React Context-based notification system. The `ToastProvider` is mounted at the root of the application in `App.tsx`. Any component can call `useToast().addToast(message, type)` to display a notification.

| Method | Parameters | Description |
|---|---|---|
| `addToast` | `message: string`, `type: 'success' \| 'error' \| 'info'` | Adds a toast to the queue; auto-removes after 4 seconds |
| `removeToast` | `id: string` | Manually removes a toast by ID |

---

## API Integration

### Axios Instance (`services/api.ts`)

A single Axios instance is created with:

- `baseURL` set to `VITE_API_BASE_URL` (falls back to `http://127.0.0.1:8000/api/v1` if the environment variable is absent)
- `timeout` of 35,000 ms (35 seconds) to accommodate LLM response latency
- `Content-Type: application/json` header

A response interceptor normalises all error responses into a plain `Error` object with a human-readable `message` string. If the backend returned an error response, the `detail` or `message` field from the response body is used. If no response was received (network error or timeout), a generic connectivity message is used. This means all hooks receive `Error` objects and can access `err.message` uniformly.

### Task Service (`services/taskService.ts`)

Provides typed async functions for every API endpoint:

| Function | Method | Endpoint | Returns |
|---|---|---|---|
| `extractTasks(text)` | POST | `/extract` | `Task[]` |
| `getTasks(skip, limit)` | GET | `/tasks/` | `Task[]` |
| `getTask(taskId)` | GET | `/tasks/{taskId}` | `Task` |
| `createTask(task)` | POST | `/tasks/` | `Task` |
| `updateTask(taskId, task)` | PUT | `/tasks/{taskId}` | `Task` |
| `deleteTask(taskId)` | DELETE | `/tasks/{taskId}` | `void` |

---

## TypeScript Types (`types/index.ts`)

```typescript
type TaskPriority = 'Low' | 'Medium' | 'High';
type TaskStatus  = 'Pending' | 'In Progress' | 'Completed';

interface Task {
  id:          number;
  description: string;
  owner:       string;
  due_date:    string | null;
  priority:    TaskPriority;
  status:      TaskStatus;
  created_at:  string;
  updated_at:  string;
}

interface TaskCreate {
  description: string;
  owner:       string;
  due_date:    string | null;
  priority:    TaskPriority;
  status?:     TaskStatus;
}

interface TaskUpdate {
  description?: string;
  owner?:       string;
  due_date?:    string | null;
  priority?:    TaskPriority;
  status?:      TaskStatus;
}
```

These types mirror the backend Pydantic schemas exactly.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api/v1` | Base URL for all backend API requests |

Vite exposes only variables prefixed with `VITE_` to the browser bundle. The value is read at build time via `import.meta.env.VITE_API_BASE_URL`.

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## Installation

```bash
cd frontend
npm install
```

Node.js 18 or higher is required.

---

## Running the Frontend

```bash
npm run dev
```

The development server starts at `http://localhost:5173` with HMR (Hot Module Replacement) enabled. The backend must also be running for any data to load.

---

## Build

```bash
npm run build
```

Runs `tsc -b` for type checking followed by `vite build`. The production bundle is output to `frontend/dist/`. To preview the production build locally:

```bash
npm run preview
```

---

## Linting

```bash
npm run lint
```

The project uses [oxlint](https://oxc.rs/docs/guide/usage/linter) configured via `.oxlintrc.json`.

---

## Responsive Design

The layout is fully responsive. Tailwind CSS responsive prefixes (`sm:`, `md:`) are used throughout:

- The Navbar adapts its spacing at the `sm` breakpoint.
- The Dashboard status and priority grids switch from a single column to three columns at the `md` breakpoint.
- The FilterBar stacks vertically on mobile and shifts to a horizontal row at the `md` breakpoint.
- The TaskTable scrolls horizontally on small viewports.
- The `TaskReviewList` grid is one column on mobile, two on `md`, and three on `lg`.
- The `TaskDetails` meta fields grid is one column on mobile and two on `md`.

---

## Design System

The design system is defined in `tailwind.config.js`. All custom tokens are in the `theme.extend` section.

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#14B8A6` | Primary actions, active nav links, focus rings |
| `primary-dark` | `#006b5f` | Hover state for primary buttons |
| `slate-850` | `#1e293b` | Navbar background |
| `brand-background` | `#F8FAFC` | Page background |
| `brand-text` | `#334155` | Body text |
| `brand-heading` | `#0d1c2f` | Headings and high-emphasis text |
| `brand-accent` | `#F59E0B` | Amber accent |

### Typography

| Font family token | Stack |
|---|---|
| `sans` / `inter` | Inter, system-ui sans-serif fallbacks |
| `serif` | EB Garamond, Garamond, Georgia, serif |

Inter is used for all UI labels, buttons, and body text. EB Garamond is used selectively for headings on Dashboard and Task Management pages.

### Animation

A `fadeIn` keyframe animation is defined and applied to the task groups on the Dashboard when they appear after loading:

```css
0%:   opacity 0, translateY(4px)
100%: opacity 1, translateY(0)
```

---

## Backend Communication

The frontend communicates with the backend entirely through the `taskService` module, which uses the shared Axios instance from `api.ts`. No component makes direct `fetch` or `axios` calls. All network-related state (loading, error) is managed inside the custom hooks, keeping components focused on rendering.

The Navbar makes one additional direct call to `api.get('/health')` on an independent polling interval for the connection indicator, separate from the task data flow.

---

## Development Notes

- Environment variables must be prefixed with `VITE_` to be available in the browser. Changes to `.env` require a Vite server restart.
- The `TaskDetails` page uses `react-hook-form` for its edit form. The `reset()` function is called with fresh data each time a task is loaded, ensuring the form reflects the current server state.
- The `useExtract` hook holds `Task[]` (not `ExtractedTask[]`) because the backend's `/extract` endpoint saves tasks immediately and returns full `Task` objects including database-generated fields (`id`, `created_at`, `updated_at`). This is why the cancel flow needs to delete those records explicitly.
- The `saveMultipleTasks` function in `useTasks` uses sequential `PUT` requests (not parallel) to avoid overwhelming the backend for large extraction results.

---

## Troubleshooting

**Blank page or nothing loads after `npm run dev`**

Check the browser console for errors. The most common cause is a missing or misconfigured `VITE_API_BASE_URL`. Confirm the `.env` file exists in `frontend/` and contains the correct value.

**`Unable to connect to the backend server` toast on page load**

The backend is not running, or is running on a different port. Start the backend with `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` from the `backend/` directory.

**Extraction returns no tasks**

The Gemini API processed the text but found no actionable items, or the input was too short (minimum 10 non-whitespace characters). Try a longer, more detailed input with clear action items and named assignees.

**`Extraction Error` shown after submitting notes**

Check the toast message detail. Common causes are an invalid or missing `GEMINI_API_KEY` on the backend, a Gemini API rate limit, or a network timeout (35 seconds client-side, 60 seconds server-side). Check the backend terminal output for the underlying error.

**TypeScript errors after pulling updates**

Run `npm install` to ensure dependencies are up to date, then run `tsc --noEmit` to identify type errors without producing output files.

---

## Future Improvements

- Pagination on the Task Management table for large task sets
- Debounced search input to reduce unnecessary re-renders on the filter bar
- Dark mode support using Tailwind's `dark:` variant
- Optimistic UI updates to reduce perceived latency on task edits and deletes
- Keyboard shortcut support for common actions (the `⌘K` hint is already present in the FilterBar UI)
- Unit tests for utility functions and custom hooks using Vitest
- E2E test coverage using Playwright
