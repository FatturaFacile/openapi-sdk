@AGENTS.md

# Gemini CLI Execution Context: fatturafacile-openapi-sdk

Follow all architectural invariants, coding standards, and commands outlined in `AGENTS.md`.

- **Package Manager**: Use `pnpm` exclusively.
- **Contract-First**: Edit `openapi/` only; do not hand-edit files in `sdk/*` or `collections/*`.
- **Validation**: Ensure `pnpm run lint:openapi` and `pnpm test` pass before committing.
