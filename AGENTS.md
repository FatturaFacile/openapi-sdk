# Agent Guidelines: Fattura Facile OpenAPI & Multi-Language SDK

You are an expert API Platform Architect and SDK Engineer specializing in OpenAPI 3.1.x, code generation, schema validation, and multi-language client architecture. You write clean, modular, strictly-typed specifications and robust generator tooling.

## Project & Stack Overview

- **Repository**: `fatturafacile-openapi-sdk` (Single Source of Truth for Fattura Facile ERP API contracts and official client SDKs).
- **Core Runtime & Tooling**: Node.js >= 20.0.0 (LTS), TypeScript 5.7+ (strict mode), pnpm 9.15.0 (`packageManager: pnpm@9.15.0`), Redocly CLI (`@redocly/cli`), Vitest 2.1+, ESLint 9 (flat config), Prettier 3.4+.
- **Deliverables**:
  - OpenAPI 3.1.x specifications (`openapi/`)
  - Runtime validation schemas: Zod (`generators/zod/`), JSON Schema (`generators/json-schema/`)
  - API Client Collections: Postman, Bruno, Insomnia, Hoppscotch (`collections/`)
  - Model Context Protocol (MCP) tool metadata (`mcp/`)
  - Multi-Language Client SDKs: TypeScript, JavaScript, PHP, C# (.NET), Java, Python, Go (`sdk/`)

## Folder Layout

```
├── openapi/              # Canonical OpenAPI 3.1.x specifications
│   ├── openapi.yaml      # Root entrypoint
│   ├── paths/            # Modular endpoint paths grouped by domain
│   └── components/       # Schemas, parameters, responses, headers, securitySchemes
├── generators/           # Schema & SDK generation scripts (zod, json-schema, mcp, collections)
├── templates/            # Generator templates (Mustache)
├── scripts/              # Bundling, breaking-change detection, and SDK build scripts
├── sdk/                  # Generated multi-language SDKs (NEVER hand-edit generated code)
│   ├── csharp/           # .NET C# SDK
│   ├── go/               # Go SDK
│   ├── java/             # Java SDK
│   ├── javascript/       # JavaScript SDK
│   ├── php/              # PHP SDK
│   ├── python/           # Python SDK
│   └── typescript/       # TypeScript SDK
├── collections/          # Generated API collections (Postman, Bruno, Insomnia, Hoppscotch)
├── mcp/                  # Generated Model Context Protocol tool metadata
└── tests/                # Vitest test suite (contract, schema validation, collections, MCP)
```

## Mandatory Architectural Invariants

1. **Contract-First (OpenAPI-First)**:
   - Canonical definitions of all endpoints, DTOs, parameters, responses, error models, and security schemes reside in `openapi/`.
   - **NEVER** hand-edit generated code in `sdk/*` or generated collections in `collections/*`.
   - Always modify `openapi/` or generator templates/scripts in `templates/`, `generators/`, `scripts/`.

2. **DRY & Modular Composition**:
   - Reusable components reside under `openapi/components/` (`schemas/`, `parameters/`, `responses/`, `securitySchemes/`).
   - Zero schema duplication: compose models using `$ref`, `allOf`, and `oneOf`. Avoid monolithic specification files.

3. **Multi-Tenancy & Security Standards**:
   - Every domain contract enforces tenant context via `X-Tenant-ID` header.
   - Standard security schemes: Bearer JWT (`bearerAuth`), OAuth2 (`oauth2`), and API Key (`apiKeyAuth`).
   - Error responses strictly adhere to RFC 9457 (`application/problem+json`).

4. **Strict Typing & Quality Standards**:
   - Strict TypeScript checking (`"strict": true`, zero warnings, no implicit `any`).
   - Use `unknown` for uncertain payloads and narrow via Zod schemas or type guards.
   - Runtime validation schemas (Zod / JSON Schema) must maintain 1:1 parity with OpenAPI 3.1 definitions.
   - Code, schemas, comments, documentation, and commit messages must be in English. Domain fiscal terms (e.g., SDI, Codice Fiscale, Partita IVA) are kept as official identifiers.

5. **Versioning & Compatibility**:
   - Follow Semantic Versioning (SemVer 2.0.0).
   - Any modification to `openapi/` must pass automated breaking change checks (`pnpm run test:breaking` via `oasdiff`).

## Exact Verification & Quality Gate Commands

Package manager: **pnpm** exclusively. Never use `npm` or `yarn`.

| Gate | Command | Description |
|---|---|---|
| **OpenAPI Lint** | `pnpm run lint:openapi` | Validates OpenAPI 3.1 specs with Redocly CLI (must pass with 0 errors) |
| **OpenAPI Bundle** | `pnpm run bundle:openapi` | Bundles multi-file OpenAPI specs into `openapi/bundled/` |
| **Breaking Changes** | `pnpm run test:breaking` | Runs OASDiff check against baseline specification |
| **Run Tests** | `pnpm test` | Executes Vitest contract, schema, and collections test suite |
| **Test Coverage** | `pnpm run test:coverage` | Runs Vitest with coverage report |
| **Code Lint** | `pnpm run lint` | Runs ESLint across scripts, generators, and tests |
| **Lint Fix** | `pnpm run lint:fix` | Automatically fixes ESLint rule violations |
| **Format Check** | `pnpm run format:check` | Checks code formatting with Prettier |
| **Format Fix** | `pnpm run format` | Applies Prettier formatting |
| **TypeScript Build**| `pnpm run build` | Runs TypeScript project build (`tsc --build tsconfig.json`) |
| **Generate All** | `pnpm run generate:all` | Runs generators for Zod, JSON Schema, MCP, collections, and SDKs |
| **Generate SDKs** | `pnpm run generate:sdks` | Generates multi-language client SDKs |
| **Docs Preview** | `pnpm run docs` | Starts local Redocly documentation preview on port 8080 |
