"""Manual verification script for pagination and rate limiting."""

from fastapi.testclient import TestClient

from app.core.config import settings
from app.core.rate_limiter import extractor_limiter
from app.main import app

client = TestClient(app)


def reset_rate_limiter() -> None:
    extractor_limiter.history.clear()


def test_pagination_returns_metadata() -> None:
    reset_rate_limiter()

    for i in range(15):
        response = client.post(
            "/api/v1/tasks/",
            json={
                "description": f"Pagination test task {i}",
                "owner": "Tester",
                "priority": "Medium",
            },
        )
        assert response.status_code == 201, response.text

    page_one = client.get("/api/v1/tasks/?skip=0&limit=10")
    assert page_one.status_code == 200, page_one.text
    data = page_one.json()
    assert data["total"] >= 15
    assert data["skip"] == 0
    assert data["limit"] == 10
    assert len(data["items"]) == 10

    page_two = client.get("/api/v1/tasks/?skip=10&limit=10")
    assert page_two.status_code == 200, page_two.text
    page_two_data = page_two.json()
    assert page_two_data["skip"] == 10
    assert len(page_two_data["items"]) >= 5

    page_one_ids = {item["id"] for item in data["items"]}
    page_two_ids = {item["id"] for item in page_two_data["items"]}
    assert page_one_ids.isdisjoint(page_two_ids)


def test_pagination_filters() -> None:
    reset_rate_limiter()

    client.post(
        "/api/v1/tasks/",
        json={
            "description": "Filter me alpha",
            "owner": "Alice",
            "priority": "High",
            "status": "Pending",
        },
    )

    response = client.get(
        "/api/v1/tasks/?search=alpha&owner=Alice&priority=High&status=Pending&limit=10"
    )
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["total"] >= 1
    assert all("alpha" in item["description"].lower() for item in payload["items"])


def test_owners_endpoint() -> None:
    response = client.get("/api/v1/tasks/owners")
    assert response.status_code == 200, response.text
    owners = response.json()
    assert isinstance(owners, list)
    assert "Tester" in owners or "Alice" in owners


def test_rate_limiting_on_extract() -> None:
    reset_rate_limiter()
    original_limit = settings.RATE_LIMIT_REQUESTS
    settings.RATE_LIMIT_REQUESTS = 2

    try:
        payload = {"text": "This is a long enough sample note for extraction testing."}

        first = client.post("/api/v1/extract", json=payload)
        second = client.post("/api/v1/extract", json=payload)
        third = client.post("/api/v1/extract", json=payload)

        statuses = [first.status_code, second.status_code, third.status_code]
        assert 429 in statuses, statuses
        blocked = next(
            response for response in (first, second, third) if response.status_code == 429
        )
        assert "Retry-After" in blocked.headers
    finally:
        settings.RATE_LIMIT_REQUESTS = original_limit
        reset_rate_limiter()


if __name__ == "__main__":
    test_pagination_returns_metadata()
    print("pagination metadata: OK")

    test_pagination_filters()
    print("pagination filters: OK")

    test_owners_endpoint()
    print("owners endpoint: OK")

    test_rate_limiting_on_extract()
    print("rate limiting: OK")

    print("All checks passed.")
