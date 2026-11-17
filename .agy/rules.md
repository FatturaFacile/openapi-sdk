# Antigravity Rules: fatturafacile-openapi-sdk

Refer to canonical rules in: [AGENTS.md](file:///C:/dev/fattura-facile/openapi-sdk/AGENTS.md)

## Summary
- **Contract-First**: Canonical API specifications are in `openapi/`. Never edit generated code under `sdk/` or `collections/`.
- **Package Manager**: Use `pnpm` exclusively (`pnpm@9.15.0`).
- **Core Verification Commands**:
  - `pnpm run lint:openapi`
  - `pnpm test`
  - `pnpm run lint`
  - `pnpm run format:check`
  - `pnpm run generate:all`
