# RFC 9457 Problem Details Error Guide

All error responses returned by Fattura Facile ERP adhere strictly to the **IETF RFC 9457** standard using the `application/problem+json` media type.

---

## 1. Problem Details Envelope Structure

```json
{
  "type": "https://api.fatturafacile.com/v1/errors/unprocessable-entity",
  "title": "Validation Error",
  "status": 422,
  "detail": "The provided fiscalCode is invalid for Italian SDI transmission.",
  "instance": "https://api.fatturafacile.com/v1/invoices/f1000000-0000-0000-0000-000000000001",
  "invalidParams": [
    {
      "name": "fiscalCode",
      "reason": "Must be a 16-character alphanumeric code adhering to Italian fiscal calculation rules.",
      "code": "INVALID_FISCAL_CODE"
    }
  ]
}
```

---

## 2. Standard HTTP Status Code Map

| Status Code         | Title                 | Meaning & Recommended Handling                                                             |
| :------------------ | :-------------------- | :----------------------------------------------------------------------------------------- |
| `400 Bad Request`   | Bad Request           | Syntax error in URL query parameters or JSON body. Do not retry without modifying request. |
| `401 Unauthorized`  | Unauthorized          | Bearer token expired or API key missing/invalid. Rotate token via `/v1/auth/refresh`.      |
| `403 Forbidden`     | Forbidden             | Subject lacks permissions for tenant or operation. Check RBAC roles.                       |
| `404 Not Found`     | Not Found             | Target resource does not exist in the tenant context.                                      |
| `422 Unprocessable` | Validation Error      | Business rule validation failure. Inspect `invalidParams` array.                           |
| `429 Too Many Req`  | Rate Limit Exceeded   | Client exceeded API rate limit. Back off exponentially according to `Retry-After` header.  |
| `500 Server Error`  | Internal Server Error | Unexpected system failure. Retry with exponential backoff.                                 |
