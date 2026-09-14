import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from app.config import RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_SECONDS


_request_history = defaultdict(deque)


def rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"

    now = time.time()

    history = _request_history[client_ip]

    while history and now - history[0] > RATE_LIMIT_WINDOW_SECONDS:
        history.popleft()

    if len(history) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again in a few minutes.",
        )

    history.append(now)