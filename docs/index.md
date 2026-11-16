# Fattura Facile ERP API Reference & Documentation

Welcome to the official developer documentation and API reference for the **Fattura Facile ERP** platform.

## Architecture & Integration Paradigm

`fatturafacile-openapi-sdk` is the canonical Single Source of Truth (SSOT) for all ERP contracts, electronic invoicing flows (Italian SDI / FatturaPA), schemas, and multi-language client libraries.

### Available Documentation Guides

1. [Authentication & Authorization](./auth.md): JWT tokens, refresh rotation, scoped API keys, and OAuth 2.0.
2. [Multi-Tenancy & Isolation](./multi-tenancy.md): `X-Tenant-ID` header rules and tenant context resolution.
3. [SDK Usage Guide](./sdk-usage.md): Official clients for TypeScript, JavaScript, PHP, C#, Java, Python, and Go.
4. [Error Handling (RFC 9457)](./errors.md): `application/problem+json` standard format and error recovery.
5. [Pagination, Filtering & Sorting](./pagination-filtering-search.md): Query parameters, cursor pagination, and search syntax.
6. [Versioning & Compatibility Policy](./versioning-compatibility.md): Semantic Versioning (SemVer) and OASDiff guardrails.
7. [Security Standards](./security.md): Transport encryption, token hygiene, and access control.

## Interactive API Console

- **Live Documentation Server**: Run `pnpm run docs` to launch the local interactive Redocly viewer on port 8080.
- **Production Spec Bundle**: Compiled standalone bundle available at `openapi/bundled/openapi.json`.
