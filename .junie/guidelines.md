# JetBrains AI Assistant & Junie Guidelines: fatturafacile-openapi-sdk

Refer to canonical rules in: [AGENTS.md](file:///C:/dev/fattura-facile/openapi-sdk/AGENTS.md)

## Development & Execution Rules
- **Package Manager**: Use `pnpm` exclusively (`pnpm@9.15.0`).
- **Contract-First**: OpenAPI 3.1.x in `openapi/` is the Single Source of Truth.
- **Generated Code**: Never modify files in `sdk/*` or `collections/*` directly; modify `openapi/` or `generators/` and regenerate.

## Local Build & Test Commands
- **Lint OpenAPI Specs**: `pnpm run lint:openapi`
- **Execute Test Suite**: `pnpm test`
- **TypeScript Build**: `pnpm run build`
- **Code Lint & Format**: `pnpm run lint` and `pnpm run format:check`
- **Run All Generators**: `pnpm run generate:all`
