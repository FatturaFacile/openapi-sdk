# GitHub Copilot Instructions: fatturafacile-openapi-sdk

All agent behaviors, architecture standards, and invariants are governed by `AGENTS.md` at the repository root.

## Architecture & Code Generation Rules
- **Contract-First (OpenAPI 3.1.x)**: All API routes, models, query parameters, error responses, and security schemes are authored in `openapi/`.
- **Never manually edit** generated SDK files in `sdk/` or generated collections in `collections/`.
- **Package Manager**: Use `pnpm` exclusively (`pnpm@9.15.0`). Never suggest or execute `npm` or `yarn`.
- **TypeScript**: Strict type checking with zero-warning tolerance; never use `any`.

## Core Verification & Test Commands
- **Lint OpenAPI**: `pnpm run lint:openapi`
- **Run Tests**: `pnpm test`
- **Breaking Changes**: `pnpm run test:breaking`
- **Lint & Format**: `pnpm run lint` and `pnpm run format:check`
- **Build**: `pnpm run build`
- **Generate All Artifacts**: `pnpm run generate:all`
