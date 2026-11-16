# Agent Optimization & Execution Guidelines: fatturafacile-openapi-sdk

## Context & Token Saving Rules

1. **Inspect signatures and schemas first**: Read relevant OpenAPI path/component files or generator interfaces rather than whole directories or generated codebases.
2. **Concise diffs only**: Output focused modifications; avoid reproducing unchanged specifications or scripts.
3. **No conversational padding**: Return direct code, commands, or answers without conversational fluff.
4. **No unsolicited syntax explanations**: Assume senior platform engineering context.

## Repository Workflow & Package Manager

- Package manager: **pnpm** exclusively. Never execute `npm` or `yarn`.
- Install dependencies: `pnpm install --frozen-lockfile`.
- Orchestration runtime: Node.js (latest LTS), TypeScript (strict mode).

## Agent Sandboxing & Execution Boundaries

- **Secret Protection**: Never read, modify, or leak `.env*`, `.git/`, `auth.json`, or keys in `certs/`.
- **Ephemeral Scratch**: Working files and temporary scripts belong in `.sandbox/scratch/` or `.sandbox/output/`.
- **Sandboxed Execution**: Run containerized commands with Docker/Docker Compose when validating multi-language SDK runtimes.

## Build, Test, Lint, and Validation Commands

- **OpenAPI Linting**: `pnpm run lint:openapi` (Redocly CLI linting of `openapi/` root and modules).
- **OpenAPI Bundling**: `pnpm run bundle:openapi` (Redocly CLI bundles specs into `openapi/bundled/`).
- **OpenAPI Documentation Preview**: `pnpm run docs` (Redocly CLI live documentation server on port 8080).
- **Breaking Change Detection**: `pnpm run test:breaking` (OASDiff against baseline spec).
- **Code Lint & Format**:
  - `pnpm run lint`: ESLint across scripts, generators, and TypeScript modules.
  - `pnpm run format:check`: Prettier formatting check (`pnpm run format` to write).
- **Test Suite**: `pnpm test` (Vitest unit and schema validation tests).
- **SDK Generation**:
  - `pnpm run generate:all`: Generates all validation schemas, MCP tools, and collections.
  - `pnpm run generate:sdks`: Generates multi-language SDKs (`typescript`, `javascript`, `php`, `csharp`, `java`, `python`, `go`).
  - `pnpm run generate:collections`: Generates Postman, Insomnia, Bruno, and Hoppscotch collections.

## Architecture & Directory Layout

- `openapi/`: Canonical OpenAPI 3.1.x specifications.
  - `openapi.yaml`: Root OpenAPI entrypoint.
  - `paths/<domain>/`: Domain-modularized route operations.
  - `components/`: Reusable schemas, parameters, responses, headers, securitySchemes.
- `generators/` & `templates/`: Custom generator configurations, Mustache templates, and code-generation pipelines.
- `scripts/`: TypeScript orchestration scripts for bundling, validation, and multi-language artifact publishing.
- `sdk/`: Official client SDKs by language (`typescript/`, `php/`, `python/`, `go/`, etc.). **Do not manually edit generated code.**
- `collections/`: Generated API client collections (Postman, Bruno, Insomnia, Hoppscotch).
- `mcp/`: Model Context Protocol server definitions and tool metadata derived from OpenAPI specs.

## Architectural Invariants

- **Contract-First**: Every change begins in `openapi/`.
- **Zero Duplication**: Shared DTOs and query envelopes are referenced via `$ref`.
- **Multi-Tenancy**: Tenant context (`X-Tenant-ID`) is required on all authenticated operations.
- **SemVer & Backward Compatibility**: Any breaking change requires SemVer major version bump and OASDiff clearance.
