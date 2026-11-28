# Authentication & Authorization Guide

The Fattura Facile API supports three primary authentication mechanisms tailored to specific integration scenarios:

---

## 1. User Authentication (JWT Bearer Token)

Best for: Interactive web applications, SPAs, and mobile applications.

### Login Flow

Send credentials to `/v1/auth/login`:

```http
POST /v1/auth/login HTTP/1.1
Host: api.fatturafacile.eu
Content-Type: application/json

{
  "email": "mario.rossi@fatturafacile.com",
  "password": "SecurePassword123!"
}
```

**Response (`200 OK`):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "d9e8f7a6b5c43210...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": { ... }
}
```

Include the token in all subsequent requests:

```http
Authorization: Bearer <accessToken>
```

---

## 2. Server-to-Server Integrations (Scoped API Keys)

Best for: Background cron jobs, e-commerce sync plugins (WooCommerce, Shopify, Magento), and webhooks.

Include your API key in the `X-API-Key` HTTP header:

```http
X-API-Key: ff_live_998877665544332211
```

API Keys are bound to specific scopes (e.g., `invoices:read`, `invoices:write`, `customers:read`) and can be created via `/v1/auth/api-keys`.

---

## 3. Partner & Third-Party Apps (OAuth 2.0)

Best for: Certified third-party SaaS integrations.

- **Token Endpoint**: `/v1/auth/oauth/token`
- **Supported Grants**: `authorization_code` (with PKCE) and `client_credentials`.
- **Standard Scopes**: `read`, `write`, `admin`.
