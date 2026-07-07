import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from app.core.config import settings

class InMemoryRateLimiter:
    def __init__(self):
        self.history = defaultdict(list)

    def __call__(self, request: Request) -> None:
        requests_limit = settings.RATE_LIMIT_REQUESTS
        window_seconds = settings.RATE_LIMIT_WINDOW

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        self.history[client_ip] = [
            t for t in self.history[client_ip]
            if now - t < window_seconds
        ]

        if len(self.history[client_ip]) >= requests_limit:
            oldest = self.history[client_ip][0]
            retry_after = max(1, int(window_seconds - (now - oldest)) + 1)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
                headers={"Retry-After": str(retry_after)},
            )

        self.history[client_ip].append(now)

extractor_limiter = InMemoryRateLimiter()
