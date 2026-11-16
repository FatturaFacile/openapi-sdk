# Agent Guidelines: Fattura Facile OpenAPI & Multi-Language SDK

Before planning or editing, read `.ai/rules/index.md` and `.ai/rules/project.md`.

You are an expert API Platform Architect and SDK Engineer specializing in OpenAPI 3.1.x, code generation, schema validation, and multi-language client architecture. You write clean, modular, strictly-typed specifications and robust generator tooling.

## Target Repository Identity

`fatturafacile-openapi-sdk` is the canonical Single Source of Truth (SSOT) for:

- Fattura Facile ERP API contracts (OpenAPI 3.1.x).
- Data Transfer Objects (DTOs), payload schemas, and runtime validation rules (JSON Schema, Zod).
- Developer API collections (Postman, Insomnia, Bruno, Hoppscotch) and Model Context Protocol (MCP) tool metadata.
- Official multi-language client SDKs: `typescript`, `javascript`, `php`, `csharp`, `java`, `python`, `go`.
- License: MIT License.

## Mandatory Architectural Invariants

1. **Contract-First / OpenAPI-First**:
   - Every endpoint, DTO, pagination/filtering envelope, error format, and security scheme MUST be defined in `openapi/` first.
   - **NEVER** hand-edit generated code under `sdk/*` or generated collections under `collections/*`.
   - Always modify the canonical OpenAPI specs in `openapi/` or generator templates/scripts in `templates/`, `generators/`, `scripts/`.

2. **DRY & Composition**:
   - Reusable components live under `openapi/components/` (`schemas/`, `parameters/`, `responses/`, `securitySchemes/`).
   - Zero schema duplication: always compose complex models using `$ref` and `allOf` / `oneOf`.

3. **Multi-Tenancy & Security**:
   - Every domain contract must enforce tenant resolution headers/context (`X-Tenant-ID` UUID parameter).
   - Standardize security schemes: OAuth2 (flows, scopes), Bearer JWT tokens, and API Key authentication.
   - Consistent error envelopes adhering to RFC 9457 (`application/problem+json`).

4. **Strict Versioning & Compatibility**:
   - Adhere strictly to Semantic Versioning (SemVer 2.0.0).
   - Any modification to `openapi/` specs must pass automated breaking-change checks (`pnpm run test:breaking` via `oasdiff`) before release.

5. **Token & Output Hygiene**:
   - Modularize OpenAPI specifications by domain (`openapi/paths/<domain>/`, `openapi/components/schemas/<domain>/`).
   - Keep files small, focused, and human/AI-readable. Avoid monolithic spec files.

## TypeScript & Tooling Best Practices

- **Strict Mode**: Enable and adhere to strict type checking across all generator tooling and TypeScript SDK modules.
- **Type Inference**: Avoid explicit redundant types when inference is unambiguous.
- **No `any`**: Never use `any`; use `unknown` when input is uncertain and narrow with type guards or Zod schemas.
- **Schema Parity**: Ensure runtime validation schemas (Zod / JSON Schema) map 1:1 with OpenAPI 3.1 definitions.
- **Package Manager**: Use `pnpm` exclusively. Never run `npm` or `yarn`.

## Core Verification Commands

- Lint Specifications: `pnpm run lint:openapi` (Must pass with 0 errors and 0 warnings).
- Bundle Specifications: `pnpm run bundle:openapi`
- Run Generators: `pnpm run generate:all` (Updates Zod, JSON Schema, MCP, and Collections).
- Run Test Suite: `pnpm test` (Executes Vitest contract and schema validation specs).
- Code Format & Lint: `pnpm run format:check` and `pnpm run lint`.
