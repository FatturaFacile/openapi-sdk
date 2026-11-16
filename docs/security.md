# Security Architecture & API Standards

Fattura Facile ERP enforces defense-in-depth platform security across transport, authentication, tenant isolation, and sensitive accounting data protection.

---

## 1. Transport Security & Encryption

- **TLS 1.3**: All public traffic requires TLS 1.3 (with fallback to TLS 1.2 minimum). Cleartext HTTP is rejected with HSTS.
- **Perfect Forward Secrecy (PFS)**: Strong ephemeral cipher suites only.

---

## 2. Token & Secret Protection

- **Short-Lived Access Tokens**: JWT access tokens expire in 1 hour (3600s).
- **Refresh Token Rotation**: Refresh tokens are single-use. Using an expired or used refresh token invalidates the entire token family.
- **API Key Hashing**: API Keys are SHA-256 hashed at rest; raw keys are presented only once at creation time.
- **Repository Zero-Leak Policy**: Secrets, `.env*` files, and private keys (`certs/`) are never committed and denied by AI tooling permissions.

---

## 3. Rate Limiting & Denial of Service Protection

- **IP & Tenant Rate Limiting**: Token bucket algorithm enforcing 1000 requests per minute per IP / API Key.
- **Rate-Limit Headers**: Responses return `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`.
- **429 Handling**: Exceeding the quota returns `429 Too Many Requests` with a mandatory `Retry-After` header.

---

## 4. Fiscal Data Privacy & GDPR

- All personal identifying information (PII) and tax identifiers (Codice Fiscale, Partita IVA) are encrypted at rest with AES-256-GCM.
- Audit logs track all read and write accesses to electronic invoices and employee profiles.
