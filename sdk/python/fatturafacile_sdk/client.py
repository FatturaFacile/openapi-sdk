import httpx
from typing import Any, Dict, Optional


class FatturaFacileError(Exception):
    def __init__(self, status_code: int, problem: Dict[str, Any]):
        self.status_code = status_code
        self.problem = problem
        detail = problem.get("detail") or problem.get("title") or f"HTTP {status_code}"
        super().__init__(detail)


class FatturaFacileClient:
    def __init__(
        self,
        base_url: str = "https://api.fatturafacile.eu",
        access_token: Optional[str] = None,
        api_key: Optional[str] = None,
        tenant_id: Optional[str] = None,
        timeout: float = 30.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.access_token = access_token
        self.api_key = api_key
        self.tenant_id = tenant_id
        self.timeout = timeout

    def _headers(self, custom: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        elif self.api_key:
            headers["X-API-Key"] = self.api_key

        if self.tenant_id:
            headers["X-Tenant-ID"] = self.tenant_id

        if custom:
            headers.update(custom)
        return headers

    def request(
        self,
        method: str,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        with httpx.Client(timeout=self.timeout) as client:
            response = client.request(
                method=method,
                url=url,
                headers=self._headers(),
                json=data,
                params=params,
            )
            if response.status_code >= 400:
                try:
                    problem = response.json()
                except Exception:
                    problem = {"status": response.status_code, "detail": response.text}
                raise FatturaFacileError(response.status_code, problem)

            if response.status_code == 204:
                return None
            return response.json()


class AsyncFatturaFacileClient:
    def __init__(
        self,
        base_url: str = "https://api.fatturafacile.eu",
        access_token: Optional[str] = None,
        api_key: Optional[str] = None,
        tenant_id: Optional[str] = None,
        timeout: float = 30.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.access_token = access_token
        self.api_key = api_key
        self.tenant_id = tenant_id
        self.timeout = timeout

    def _headers(self, custom: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        elif self.api_key:
            headers["X-API-Key"] = self.api_key

        if self.tenant_id:
            headers["X-Tenant-ID"] = self.tenant_id

        if custom:
            headers.update(custom)
        return headers

    async def request(
        self,
        method: str,
        path: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=self._headers(),
                json=data,
                params=params,
            )
            if response.status_code >= 400:
                try:
                    problem = response.json()
                except Exception:
                    problem = {"status": response.status_code, "detail": response.text}
                raise FatturaFacileError(response.status_code, problem)

            if response.status_code == 204:
                return None
            return response.json()
