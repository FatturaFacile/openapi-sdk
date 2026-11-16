---
paths:
  - '**'
---

# Working rules for every AI tool (Claude Code, Codex, Gemini/Antigravity, Copilot, Cursor, Junie)

This file is the single source of cross-tool rules for this repository. Tool entry files (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.agy/instructions.md`, `.gemini/GEMINI.md`, `.github/copilot-instructions.md`) point here.
Detailed commands and architectural reference: `.github/copilot-instructions.md`.

## Target Repository Scope & Identity

- **Repository**: `fatturafacile-openapi-sdk` (Single Source of Truth for Fattura Facile ERP API contracts and official client SDKs).
- **License**: MIT License.
- **Deliverables**: OpenAPI 3.1.x specifications, Zod/JSON Schema validation rules, API client collections (Postman, Insomnia, Bruno, Hoppscotch), MCP tool metadata, and multi-language client SDKs (`typescript`, `javascript`, `php`, `csharp`, `java`, `python`, `go`).

## Language & Communication

- Write all code, schemas, comments, documentation, commit messages, and test names in English.
- Domain legal/fiscal terms (e.g., SDI, Codice Fiscale, Partita IVA, IBAN, QR-IBAN) are preserved as official identifiers.
- Chat replies follow the language the user writes in.

## Mandatory Architectural Invariants

1. **Contract-First (OpenAPI 3.1.x)**:
   - The canonical definition of any endpoint, DTO, parameter, or response is in `openapi/`.
   - Never hand-edit generated SDK code (`sdk/*`) or generated collections (`collections/*`). Always update `openapi/` or generator templates (`templates/`, `generators/`, `scripts/`).
2. **DRY & Modular Spec Composition**:
   - Reusable components reside in `openapi/components/`. Zero duplicate schema definitions; compose via `$ref`.
   - Domain-modularized paths: `openapi/paths/<domain>/` and `openapi/components/schemas/<domain>/`.
3. **Multi-Tenancy & Standardized Security**:
   - All tenant-scoped operations enforce tenant identification (`X-Tenant-ID` header or route parameters).
   - Uniform security schemes (OAuth2, Bearer JWT, API Key) and standard RFC 9457 error representations.
4. **Strict Versioning & Compatibility**:
   - Semantic Versioning (SemVer).
   - Breaking changes must be detected and validated via `oasdiff` before releases.

## Agent Behaviour & Code Quality

- Fix every error encountered (schema validation failure, lint error, broken test, type mismatch).
- Read only what is necessary (focused interfaces and signatures, not entire files). Emit minimal, focused diffs without conversational filler.
- Never add or modify dependencies without explicit need. Package manager: `pnpm` only. Never run `npm` or `yarn`.
- Secret Hygiene: Never read, log, or commit `.env*`, `auth.json`, `.git/`, or cryptographic keys in `certs/`.
- Isolated Scratch: Ephemeral files belong in `.sandbox/scratch/` or `.sandbox/output/`.
