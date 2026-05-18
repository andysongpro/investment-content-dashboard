from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional


class IngestionError(RuntimeError):
    """Base ingestion error."""


class QuotaExceededError(IngestionError):
    """Raised when a provider reports quota or rate-limit exhaustion."""


QUOTA_MARKERS = (
    "quota",
    "rate limit",
    "rate_limit",
    "monthly limit",
    "usage exceeded",
    "limit exceeded",
    "too many requests",
)


def _load_env_file(path: Path) -> None:
    """Load KEY=VALUE lines without overriding already-exported environment variables."""
    if not path.exists() or not path.is_file():
        return
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError:
        return
    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


for env_path in (
    Path.cwd() / ".env.local",
    Path.cwd() / ".env",
    Path.home() / ".hermes" / ".env",
):
    _load_env_file(env_path)


def has_env(name: str) -> bool:
    return bool(os.getenv(name, "").strip())



def _json_request(
    url: str,
    *,
    method: str = "GET",
    headers: Optional[Dict[str, str]] = None,
    payload: Optional[Dict[str, Any]] = None,
    timeout: int = 60,
) -> Any:
    data = None
    req_headers = {"Accept": "application/json", **(headers or {})}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        req_headers.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        if exc.code == 429 or any(marker in body.lower() for marker in QUOTA_MARKERS):
            raise QuotaExceededError(f"HTTP {exc.code}: provider quota/rate limit") from exc
        raise IngestionError(f"HTTP {exc.code}: {body[:500]}") from exc
    except urllib.error.URLError as exc:
        raise IngestionError(str(exc)) from exc


@dataclass
class TavilyClient:
    api_key: Optional[str] = None

    def __post_init__(self) -> None:
        self.api_key = self.api_key or os.getenv("TAVILY_API_KEY")

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def search(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        if not self.api_key:
            raise IngestionError("TAVILY_API_KEY is not configured")
        payload = {
            "api_key": self.api_key,
            "query": query,
            "max_results": max_results,
            "search_depth": "basic",
            "include_answer": False,
            "include_raw_content": False,
        }
        data = _json_request("https://api.tavily.com/search", method="POST", payload=payload, timeout=45)
        if isinstance(data, dict) and any(marker in json.dumps(data).lower() for marker in QUOTA_MARKERS):
            raise QuotaExceededError("Tavily quota/rate limit")
        return list((data or {}).get("results") or [])


@dataclass
class ApifyClient:
    token: Optional[str] = None

    def __post_init__(self) -> None:
        self.token = self.token or os.getenv("APIFY_TOKEN") or os.getenv("APIFY_API_TOKEN")

    @property
    def available(self) -> bool:
        return bool(self.token)

    @staticmethod
    def actor_to_api_id(actor: str) -> str:
        return actor.replace("/", "~")

    def run_actor_sync(self, actor: str, actor_input: Dict[str, Any], *, timeout: int = 180) -> List[Dict[str, Any]]:
        if not self.token:
            raise IngestionError("APIFY_TOKEN is not configured")
        actor_id = self.actor_to_api_id(actor)
        qs = urllib.parse.urlencode({"token": self.token, "timeout": timeout})
        url = f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items?{qs}"
        data = _json_request(url, method="POST", payload=actor_input, timeout=timeout + 30)
        if isinstance(data, list):
            return data
        if isinstance(data, dict) and "items" in data:
            return list(data["items"] or [])
        return []


@dataclass
class FirecrawlClient:
    api_key: Optional[str] = None

    def __post_init__(self) -> None:
        self.api_key = self.api_key or os.getenv("FIRECRAWL_API_KEY")

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def scrape(self, url: str, *, timeout: int = 60) -> Dict[str, Any]:
        if not self.api_key:
            raise IngestionError("FIRECRAWL_API_KEY is not configured")
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {"url": url, "formats": ["markdown", "html"]}
        data = _json_request("https://api.firecrawl.dev/v1/scrape", method="POST", headers=headers, payload=payload, timeout=timeout)
        return dict(data or {})
