# TaskPilot AI — API Reference

Base URL: `http://127.0.0.1:8000/api/v1`

All request and response bodies use `application/json`. Interactive documentation is available at `http://127.0.0.1:8000/docs`.

---

## Endpoints

- [GET /health](#get-health)
- [POST /extract](#post-extract)
- [GET /tasks/](#get-tasks)
- [POST /tasks/](#post-tasks)
- [GET /tasks/{task_id}](#get-taskstask_id)
- [PUT /tasks/{task_id}](#put-taskstask_id)
- [DELETE /tasks/{task_id}](#delete-taskstask_id)

---

## GET /health

Returns the operational status of the application and its database connection.

**Response — 200 OK**

```json
{
  "status": "healthy",
  "database": "healthy"
}
```

If the database query fails:

```json
{
  "status": "degraded",
  "database": "unhealthy"
}
```

---

## POST /extract

Accepts unstructured text, sends it to the Gemini API, persists the extracted tasks, and returns the saved list. Tasks are written to the database immediately upon extraction — the frontend is responsible for deleting them if the user cancels the review.

**Request Body**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `text` | string | Yes | Minimum 10 non-whitespace characters |

```json
{
  "text": "Alice needs to finish the design mockups by Friday. Bob should schedule the client call for next Tuesday."
}
```

**Response — 201 Created**

Returns a list of the newly created `Task` objects.

```json
[
  {
    "id": 1,
    "description": "Finish the design mockups",
    "owner": "Alice",
    "due_date": "2026-07-11",
    "priority": "Medium",
    "status": "Pending",
    "created_at": "2026-07-06T12:00:00Z",
    "updated_at": "2026-07-06T12:00:00Z"
  },
  {
    "id": 2,
    "description": "Schedule the client call",
    "owner": "Bob",
    "due_date": "2026-07-14",
    "priority": "Medium",
    "status": "Pending",
    "created_at": "2026-07-06T12:00:00Z",
    "updated_at": "2026-07-06T12:00:00Z"
  }
]
```

**Error Responses**

| Status | Condition |
|---|---|
| 400 | `GEMINI_API_KEY` is missing, invalid, or text is too short |
| 502 | Gemini returned a malformed or non-JSON response |
| 503 | Network-level failure connecting to the Gemini API |
| 504 | Gemini API request timed out |
| 500 | Unexpected server-side error |

---

## GET /tasks/

Returns a list of tasks. Supports optional offset-based pagination.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `skip` | integer | `0` | Number of records to skip |
| `limit` | integer | `100` | Maximum records to return |

**Response — 200 OK**

```json
[
  {
    "id": 1,
    "description": "Finish the design mockups",
    "owner": "Alice",
    "due_date": "2026-07-11",
    "priority": "Medium",
    "status": "Pending",
    "created_at": "2026-07-06T12:00:00Z",
    "updated_at": "2026-07-06T12:00:00Z"
  }
]
```

---

## POST /tasks/

Creates a single task manually.

**Request Body**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `description` | string | Yes | max 255 characters |
| `owner` | string | Yes | max 100 characters |
| `due_date` | string (YYYY-MM-DD) or null | No | — |
| `priority` | `"Low"` \| `"Medium"` \| `"High"` | No | Defaults to `"Medium"` |
| `status` | `"Pending"` \| `"In Progress"` \| `"Completed"` | No | Defaults to `"Pending"` |

```json
{
  "description": "Review pull request #42",
  "owner": "Charlie",
  "due_date": "2026-07-10",
  "priority": "High"
}
```

**Response — 201 Created**

Returns the full created `Task` object.

```json
{
  "id": 3,
  "description": "Review pull request #42",
  "owner": "Charlie",
  "due_date": "2026-07-10",
  "priority": "High",
  "status": "Pending",
  "created_at": "2026-07-06T12:05:00Z",
  "updated_at": "2026-07-06T12:05:00Z"
}
```

**Error Responses**

| Status | Condition |
|---|---|
| 422 | Validation failure (missing required field, value out of constraints) |

---

## GET /tasks/{task_id}

Returns a single task by its integer ID.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `task_id` | integer | The task's primary key |

**Response — 200 OK**

```json
{
  "id": 3,
  "description": "Review pull request #42",
  "owner": "Charlie",
  "due_date": "2026-07-10",
  "priority": "High",
  "status": "Pending",
  "created_at": "2026-07-06T12:05:00Z",
  "updated_at": "2026-07-06T12:05:00Z"
}
```

**Error Responses**

| Status | Condition |
|---|---|
| 404 | No task found with the given ID |

```json
{
  "detail": "Task with ID 99 not found"
}
```

---

## PUT /tasks/{task_id}

Updates a task. All body fields are optional — only fields included in the request are changed. Uses `exclude_unset=True` internally, so omitting a field leaves its current value unchanged.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `task_id` | integer | The task's primary key |

**Request Body** (all fields optional)

| Field | Type | Constraints |
|---|---|---|
| `description` | string | max 255 characters |
| `owner` | string | max 100 characters |
| `due_date` | string (YYYY-MM-DD) or null | — |
| `priority` | `"Low"` \| `"Medium"` \| `"High"` | — |
| `status` | `"Pending"` \| `"In Progress"` \| `"Completed"` | — |

```json
{
  "status": "In Progress",
  "priority": "High"
}
```

**Response — 200 OK**

Returns the full updated `Task` object.

```json
{
  "id": 3,
  "description": "Review pull request #42",
  "owner": "Charlie",
  "due_date": "2026-07-10",
  "priority": "High",
  "status": "In Progress",
  "created_at": "2026-07-06T12:05:00Z",
  "updated_at": "2026-07-06T13:00:00Z"
}
```

**Error Responses**

| Status | Condition |
|---|---|
| 404 | No task found with the given ID |
| 422 | Validation failure on a provided field |

---

## DELETE /tasks/{task_id}

Permanently deletes a task.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `task_id` | integer | The task's primary key |

**Response — 204 No Content**

Empty body. The task has been deleted.

**Error Responses**

| Status | Condition |
|---|---|
| 404 | No task found with the given ID |

---

## Task Object Reference

All endpoints that return a task use the following structure.

| Field | Type | Description |
|---|---|---|
| `id` | integer | Auto-generated primary key |
| `description` | string | Actionable task description (max 255 chars) |
| `owner` | string | Person responsible for the task (max 100 chars) |
| `due_date` | string or null | Due date in `YYYY-MM-DD` format, or `null` |
| `priority` | string | One of `"Low"`, `"Medium"`, `"High"` |
| `status` | string | One of `"Pending"`, `"In Progress"`, `"Completed"` |
| `created_at` | string (ISO 8601) | Timestamp of creation, set by the database |
| `updated_at` | string (ISO 8601) | Timestamp of last update, auto-updated on every write |
