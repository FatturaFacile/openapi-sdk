# AGENTS.md — Fattura Facile OpenAPI & Multi-Language SDK

## Stack & Repository Layout

- **Repo**: `@fatturafacile/openapi-sdk` — OpenAPI 3.1.0 Single Source of Truth (SSOT) for Fattura Facile ERP API contracts and multi-language SDKs.
- **Runtime & Tooling**: Node.js >= 20 LTS, TypeScript 5.7+ (`strict: true`), `pnpm@9.15.0` exclusively (NEVER `npm` or `yarn`), Redocly CLI, Vitest 2.1+, ESLint 9, Prettier 3.4+.
- **Canonical Sources**: `openapi/` (`openapi.yaml`, `paths/`, `components/{schemas,parameters,responses,securitySchemes}`), `generators/` (`zod`, `json-schema`, `mcp`, `collections`), `templates/` (Mustache), `scripts/`, `tests/`.
- **Generated Targets (READ-ONLY)**: `sdk/` (`typescript`, `javascript`, `php`, `csharp`, `java`, `python`, `go`), `collections/` (`postman`, `bruno`, `insomnia`, `hoppscotch`), `mcp/`, `generators/zod/generated/`, `openapi/bundled/`.

## Architecture & Contract-First Invariants

- **OpenAPI-First**: Define all endpoints, DTOs, parameters, responses, errors, and security schemes exclusively in `openapi/`.
- **Never Hand-Edit Generated Code**: NEVER edit files in `sdk/*`, `collections/*`, `mcp/*`, `generators/zod/generated/*`, or `openapi/bundled/*`; modify `openapi/`, `generators/`, `templates/`, or `scripts/` and regenerate.
- **DRY Modular Composition**: Zero schema duplication; compose models via `$ref`, `allOf`, `oneOf` from `openapi/components/` partitioned across all 14 ERP domains.
- **Multi-Tenancy & Auth**: Enforce `X-Tenant-ID` UUID header (or verified JWT tenant claim) on all domain endpoints; use `bearerAuth`, `oauth2`, and `apiKeyAuth`.
- **Errors & Versioning**: All errors strictly follow RFC 9457 (`application/problem+json`); follow SemVer 2.0.0; every `openapi/` change must pass `pnpm run test:breaking` (OASDiff).
- **Secrets Hygiene**: Never read, log, commit, or leak `.env*`, `auth.json`, `certs/`, or private keys.

## Coding, Typing & Localization Standards

- **Strict TypeScript**: `"strict": true`, `noImplicitAny`, `noUncheckedIndexedAccess`, zero warnings, never `any`; narrow `unknown` via Zod schemas or type guards.
- **Schema Parity**: Keep Zod, JSON Schema, MCP metadata, and API collections in 1:1 parity with OpenAPI 3.1 definitions.
- **Formatting**: Prettier (`endOfLine: "lf"`, `singleQuote: true`, `printWidth: 100`, `trailingComma: "none"`).
- **Language & Locales**: Write code, identifiers, comments, docs, and commit messages in English (keep official Italian fiscal identifiers: SDI, FatturaPA, Codice Fiscale, Partita IVA, PEC); preserve all 4 Fattura Facile locales (`it`, `de`, `fr`, `en`) across any localized schemas, enums, error metadata, or cross-repo contracts.

## Strict Git Workflow (`dev` Only, Zero PRs, Zero Leftovers)

- **Direct `dev` Integration**: Integrate all work directly into `dev` via local merge: `git checkout dev && git pull --rebase origin dev && git merge --no-ff <branch>`.
- **FORBIDDEN**: NEVER commit, merge, or push to `main`. NEVER create Pull Requests (`gh pr create` / `gh pr`).
- **Autonomous Conflict Resolution**: Resolve all merge conflicts autonomously while preserving Clean Architecture, Contract-First invariants, strict types, and all 4 locales (`it`, `de`, `fr`, `en`).
- **Mandatory End-of-Task Cleanup**: After pushing `dev`, ALWAYS delete merged local/remote feature branches (`git branch -D <branch>`, `git push origin --delete <branch>`), remove linked worktrees (`git worktree remove --force <path> && git worktree prune`), and delete any temporary/debug files created during the session so `git status` is completely clean.

## Quality Gates & Commands

- **Pre-Push Gate (Required, 0 Warnings/Errors)**: `pnpm run lint:openapi && pnpm run bundle:openapi && pnpm run lint && pnpm run format:check && pnpm run build && pnpm test`.
- **Never Push Unverified**: NEVER push to `origin dev` unless all quality gates pass with zero warnings/errors.
- **OpenAPI Spec Changes**: Also run `pnpm run test:breaking` and regenerate outputs via `pnpm run generate:all` (or targeted `pnpm run generate:zod`, `pnpm run generate:json-schema`, `pnpm run generate:mcp`, `pnpm run generate:collections`, `pnpm run generate:sdks`).
- **Helpers**: `pnpm run lint:fix`, `pnpm run format`, `pnpm run test:coverage`, `pnpm run docs`, `pnpm run docs:build`.
- **Windows PowerShell Note**: Use `pnpm.cmd` if `pnpm.ps1` execution is blocked by policy.
