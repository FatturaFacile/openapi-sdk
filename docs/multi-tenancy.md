# Multi-Tenancy Architecture & Tenant Isolation

Fattura Facile ERP operates on a strict multi-tenant model. Every organization, legal entity, or accounting unit is isolated within a dedicated tenant workspace.

---

## 1. Tenant Identification Header (`X-Tenant-ID`)

All authenticated API requests targeting tenant resources (invoices, customers, quotes, products, settings) **MUST** include the `X-Tenant-ID` header containing the tenant's UUID:

```http
GET /v1/invoices HTTP/1.1
Host: api.fatturafacile.com
Authorization: Bearer <accessToken>
X-Tenant-ID: a0000000-0000-0000-0000-000000000001
```

---

## 2. Validation & Security Rules

1. **Permission Check**: The API verifies that the authenticated user or API Key possesses an active role/permission assignment inside the specified `X-Tenant-ID`.
2. **Cross-Tenant Guardrail**: If an authenticated subject attempts to query or modify a resource belonging to another tenant, the API returns `404 Not Found` (to prevent resource existence enumeration) or `403 Forbidden`.
3. **Database Isolation**: The backend enforces logical row-level security (RLS) and schema scoping automatically based on the resolved `X-Tenant-ID`.
