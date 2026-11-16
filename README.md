# Fattura Facile OpenAPI 3.1 & Multi-Language SDK

[![CI - Quality Assurance](https://github.com/fatturafacile/fatturafacile-openapi-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/fatturafacile/fatturafacile-openapi-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1.0-brightgreen.svg)](https://spec.openapis.org/oas/v3.1.0)
[![Redocly Validated](https://img.shields.io/badge/Redocly-Validated-success.svg)](https://redocly.com)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev)
[![MCP Ready](https://img.shields.io/badge/Model%20Context%20Protocol-MCP%20Ready-purple.svg)](https://modelcontextprotocol.io)

**Fattura Facile OpenAPI & Multi-Language SDK** is the official **Single Source of Truth (SSOT)** for all API contracts, Data Transfer Objects (DTOs), payload schemas, runtime validation rules (Zod & JSON Schema), Model Context Protocol (MCP) tool metadata, developer API collections (Postman, Insomnia, Bruno, Hoppscotch), and official client libraries for the Fattura Facile ERP ecosystem.

---

## 📑 Table of Contents

- [Architectural Principles & Invariants](#-architectural-principles--invariants)
- [Repository Organization](#-repository-organization)
- [Domain Coverage (14 ERP Domains)](#-domain-coverage-14-erp-domains)
- [Multi-Language Client SDKs (7 Languages)](#-multi-language-client-sdks-7-languages)
- [Model Context Protocol (MCP) Integration](#-model-context-protocol-mcp-integration)
- [Developer API Collections](#-developer-api-collections)
- [Validation & Schema Generators](#-validation--schema-generators)
- [Development & Automation Workflow](#-development--automation-workflow)
- [Docker & Containerized Execution](#-docker--containerized-execution)
- [CI/CD & Multi-Registry Publishing](#-cicd--multi-registry-publishing)
- [Documentation Index](#-documentation-index)
- [Contributing & Governance](#-contributing--governance)
- [License](#-license)

---

## 🏛 Architectural Principles & Invariants

This repository is governed by strict platform rules to guarantee reliability, security, and developer ergonomics:

1. **Contract-First / OpenAPI-First**: Every endpoint, schema, DTO, pagination envelope, error format, and security scheme is defined canonically in `openapi/` using **OpenAPI 3.1.0**.
2. **Zero Manual Code Editing in Generated Targets**: Generated code in `sdk/*` and collections in `collections/*` are never edited by hand. Modifications are executed exclusively in canonical specifications (`openapi/`) or generator scripts/templates (`generators/`, `templates/`, `scripts/`).
3. **Multi-Tenancy Isolation**: Every business endpoint enforces tenant resolution via the mandatory `X-Tenant-ID` header (UUID) or verified JWT tenant claims.
4. **Standardized RFC 9457 Errors**: All error payloads adhere strictly to IETF RFC 9457 (`application/problem+json`) with standard fields: `type`, `title`, `status`, `detail`, `instance`, and `invalidParams`.
5. **Strict Semantic Versioning (SemVer)**: Automated `oasdiff` breaking-change detection gates block any backward-incompatible API modification on pull requests.
6. **Token-Efficient Domain Modularization**: OpenAPI paths and components are partitioned into domain directories to ensure human/AI readability and optimal context window usage.

---

## 📁 Repository Organization

```text
fatturafacile-openapi-sdk/
├── .github/
│   └── workflows/              # CI/CD, validation, testing, and multi-registry publishing
├── collections/                # Generated API collections
│   ├── postman/                # Postman Collection v2.1
│   ├── insomnia/               # Insomnia v4 Export
│   ├── bruno/                  # Bruno Collection
│   └── hoppscotch/             # Hoppscotch Collection
├── dist/                       # Generated validation schemas
│   ├── json-schema/            # 46 JSON Schema Draft 2020-12 files
│   └── zod/                    # Runtime TypeScript Zod schemas
├── docs/                       # Technical guides (Auth, Tenant, SDK, Errors, Pagination, Security)
├── examples/                   # Ecosystem integration examples (Laravel, WP, Shopify, Node, Python, .NET, MCP)
├── generators/                 # Custom generators (Zod, JSON Schema, MCP, Collections)
├── mcp/                        # Model Context Protocol tools (65 tools), schemas, and TypeScript exports
├── openapi/                    # Canonical OpenAPI 3.1.0 specifications
│   ├── openapi.yaml            # Root OpenAPI document
│   ├── bundled/                # Standalone bundled artifacts (openapi.json, openapi.yaml)
│   ├── components/             # Reusable schemas, parameters, responses, securitySchemes
│   └── paths/                  # Modular domain route definitions
├── scripts/                    # Platform automation scripts (bundle, diff, generate-sdks)
├── sdk/                        # Official client SDKs across 7 languages
│   ├── typescript/             # @fatturafacile/sdk (Node.js & Browsers)
│   ├── javascript/             # fatturafacile-sdk (Vanilla JS / ESM)
│   ├── php/                    # fatturafacile/sdk-php (PHP 8.2+, Laravel, WordPress)
│   ├── csharp/                 # FatturaFacile.Sdk (.NET Standard 2.0 & .NET 8)
│   ├── java/                   # com.fatturafacile:sdk-java (Java 17+)
│   ├── python/                 # fatturafacile-sdk (Python 3.10+, FastAPI)
│   └── go/                     # github.com/fatturafacile/fatturafacile-sdk-go (Go 1.22+)
├── templates/                  # Custom Mustache templates for code generation
├── tests/                      # Vitest contract, schema, and metadata test suites
├── Dockerfile                  # Containerized build and validation environment
├── docker-compose.yml          # Compose orchestration for linting, docs, and generators
├── package.json                # Workspace dependencies and scripts
└── pnpm-workspace.yaml         # Monorepo workspace configuration
```

---

## 🏢 Domain Coverage (14 ERP Domains)

| Domain             | Description                                                | Key Modeled Endpoints                                                                          |
| :----------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **Authentication** | JWT tokens, refresh rotation, scoped API keys, OAuth2      | `/v1/auth/login`, `/v1/auth/refresh`, `/v1/auth/api-keys`, `/v1/auth/logout`                   |
| **Users & RBAC**   | Tenant user directory, profile, roles, and permissions     | `/v1/users`, `/v1/users/{id}`, `/v1/roles`, `/v1/profile`                                      |
| **Companies**      | Legal entities, VAT, Codice Fiscale, PEC, SDI, statistics  | `/v1/companies`, `/v1/companies/{id}`, `/v1/companies/{id}/settings`                           |
| **Customers**      | B2B/B2C client directory, electronic billing addresses     | `/v1/customers`, `/v1/customers/{id}`                                                          |
| **Products**       | Catalog, SKU tracking, pricing, stock movements            | `/v1/products`, `/v1/products/{id}`, `/v1/inventory/movements`                                 |
| **Services**       | Billable consulting, hourly rate definitions               | `/v1/services`, `/v1/services/{id}`                                                            |
| **Quotes**         | Estimates, quote lines, quote-to-invoice conversion        | `/v1/quotes`, `/v1/quotes/{id}`, `/v1/quotes/{id}/convert`                                     |
| **Invoices**       | Electronic billing (FatturaPA), SDI dispatch, PDF download | `/v1/invoices`, `/v1/invoices/{id}`, `/v1/invoices/{id}/sdi/transmit`, `/v1/invoices/{id}/pdf` |
| **Credit Notes**   | Legal credit notes (TD04) linked to invoices               | `/v1/credit-notes`, `/v1/credit-notes/{id}`                                                    |
| **Payments**       | Installment settlements, refunds, payment methods          | `/v1/payments`, `/v1/payments/{id}`, `/v1/payment-methods`                                     |
| **Projects**       | Project milestones, deadlines, budget allocations          | `/v1/projects`, `/v1/projects/{id}`                                                            |
| **Tasks**          | Task boards, assignments, billable time tracking           | `/v1/tasks`, `/v1/tasks/{id}`                                                                  |
| **Files**          | Multipart file uploads, antivirus scanning, secure storage | `/v1/files/upload`, `/v1/files/{id}`                                                           |
| **Notifications**  | Real-time user notification stream and unread states       | `/v1/notifications`, `/v1/notifications/{id}/read`                                             |

---

## 📦 Multi-Language Client SDKs (7 Languages)

Each official SDK includes built-in exponential backoff retries, rate-limit header parsing (`Retry-After`), automatic tenant context injection (`X-Tenant-ID`), and RFC 9457 error handling.

### 1. TypeScript (`@fatturafacile/sdk`)

```typescript
import { FatturaFacileClient } from '@fatturafacile/sdk';

const client = new FatturaFacileClient({
  apiKey: 'ff_live_your_key',
  tenantId: 'a0000000-0000-0000-0000-000000000001'
});

const invoices = await client.request('GET', '/v1/invoices?limit=25');
console.log(invoices);
```

### 2. PHP (`fatturafacile/sdk-php`)

```php
use FatturaFacile\Sdk\Client;

$client = new Client(
    apiKey: 'ff_live_your_key',
    tenantId: 'a0000000-0000-0000-0000-000000000001'
);

$invoices = $client->request('GET', '/v1/invoices');
```

### 3. Python (`fatturafacile-sdk`)

```python
from fatturafacile_sdk import FatturaFacileClient

client = FatturaFacileClient(
    api_key="ff_live_your_key",
    tenant_id="a0000000-0000-0000-0000-000000000001"
)

invoices = client.request("GET", "/v1/invoices")
```

### 4. Go (`github.com/fatturafacile/fatturafacile-sdk-go`)

```go
client := fatturafacile.NewClient(fatturafacile.ClientOptions{
    APIKey:   "ff_live_your_key",
    TenantID: "a0000000-0000-0000-0000-000000000001",
})

var result map[string]interface{}
err := client.Request(ctx, "GET", "/v1/invoices", nil, &result)
```

### 5. C# / .NET (`FatturaFacile.Sdk`)

```csharp
var client = new FatturaFacileClient(new FatturaFacileClientOptions
{
    ApiKey = "ff_live_your_key",
    TenantId = "a0000000-0000-0000-0000-000000000001"
});

var invoices = await client.SendAsync<object>(HttpMethod.Get, "/v1/invoices");
```

### 6. Java (`com.fatturafacile:sdk-java`)

```java
FatturaFacileClient client = new FatturaFacileClient(
    "https://api.fatturafacile.com",
    null,
    "ff_live_your_key",
    "a0000000-0000-0000-0000-000000000001"
);

Map response = client.send("GET", "/v1/invoices", null, Map.class);
```

### 7. Vanilla JavaScript (`fatturafacile-sdk`)

```javascript
import { FatturaFacileClient } from 'fatturafacile-sdk';

const client = new FatturaFacileClient({ apiKey: 'ff_live_your_key', tenantId: '...' });
const customers = await client.request('GET', '/v1/customers');
```

---

## 🤖 Model Context Protocol (MCP) Integration

The repository generates production-ready MCP tooling in `mcp/` containing **65 structured tools**:

- Tool metadata and JSON Schemas: [`mcp/tools.json`](./mcp/tools.json)
- Programmatic TypeScript export: [`mcp/index.ts`](./mcp/index.ts)
- Integration Guide: [`examples/mcp-server/index.ts`](./examples/mcp-server/index.ts)
- AI System Prompt Directive: [`examples/ai-agents/system-prompt-mcp.md`](./examples/ai-agents/system-prompt-mcp.md)

This allows AI assistants (Claude Desktop, Cursor, Copilot, Windsurf) to inspect and execute ERP operations (creating invoices, checking stock, transmitting to SDI) directly and safely.

---

## 🛠 Development & Automation Workflow

### Prerequisites

- Node.js >= 20.0.0 (LTS)
- `pnpm` >= 9.0.0

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Lint OpenAPI specifications (Redocly CLI)
pnpm run lint:openapi

# 3. Bundle OpenAPI specifications into standalone artifacts
pnpm run bundle:openapi

# 4. Preview interactive API documentation on http://localhost:8080
pnpm run docs

# 5. Detect breaking changes against base specifications (OASDiff)
pnpm run test:breaking

# 6. Run all generators (Zod, JSON Schema, MCP, Collections)
pnpm run generate:all

# 7. Generate client SDKs
pnpm run generate:sdks

# 8. Run Vitest contract and schema validation test suites
pnpm test

# 9. Verify code formatting and linting
pnpm run format:check
pnpm run lint
```

---

## 🐳 Docker & Containerized Execution

Build and run the entire validation and generation suite in a containerized environment:

```bash
# Build Docker image
docker-compose build

# Lint specifications
docker-compose run --rm openapi-tools

# Start live documentation server on port 8080
docker-compose up docs-server

# Run test suite in container
docker-compose run --rm test-runner
```

---

## 🚢 CI/CD & Multi-Registry Publishing

The repository includes enterprise-grade GitHub Actions workflows:

- **`.github/workflows/ci.yml`**: Triggers on pull requests and pushes to `main` and `dev`. Executes Redocly linting, bundling, OASDiff breaking-change checks, generator execution, code linting, formatting checks, and the Vitest test suite.
- **`.github/workflows/publish-sdks.yml`**: Triggers upon release tag creation (`v*`). Builds bundled specs, generates SDKs, and publishes artifacts across:
  - **npm**: `@fatturafacile/sdk`
  - **PyPI**: `fatturafacile-sdk`
  - **NuGet**: `FatturaFacile.Sdk`
  - **Packagist**: `fatturafacile/sdk-php`
  - **Maven Central**: `com.fatturafacile:sdk-java`
  - **Go Modules**: `github.com/fatturafacile/fatturafacile-sdk-go`

---

## 📚 Documentation Index

Detailed platform guides are available under [`docs/`](./docs/):

1. [API Reference & Overview](./docs/index.md)
2. [Authentication & Authorization Guide](./docs/auth.md)
3. [Multi-Tenancy & Isolation Guide](./docs/multi-tenancy.md)
4. [SDK Usage Guide Across 7 Languages](./docs/sdk-usage.md)
5. [RFC 9457 Problem Details Error Guide](./docs/errors.md)
6. [Pagination, Filtering, Sorting & Search Guide](./docs/pagination-filtering-search.md)
7. [Semantic Versioning & Compatibility Policy](./docs/versioning-compatibility.md)
8. [Security Standards & Data Protection](./docs/security.md)

---

## 🤝 Contributing & Governance

Contributions to API contracts must follow the Contract-First methodology:

1. Make all additions or modifications in `openapi/paths/` and `openapi/components/`.
2. Ensure no schema duplication; reuse shared models in `openapi/components/schemas/common/`.
3. Validate that `pnpm run lint:openapi` passes with **0 errors and 0 warnings**.
4. Run `pnpm run test:breaking` to verify backward compatibility.
5. Re-run `pnpm run generate:all` to keep Zod, JSON Schema, MCP, and Collections in sync.
6. Verify all tests pass with `pnpm test`.

---

## 📄 License

This repository and all generated artifacts are open-source software licensed under the [MIT License](./LICENSE).
