@AGENTS.md

# Claude Code Agent Guidelines: fatturafacile-openapi-sdk

## Worktree & Execution Discipline
- Work strictly inside the designated branch or worktree.
- Read OpenAPI signatures and schemas before reading or generating large source directories.
- Never read, log, or leak secrets, `.env*`, `.git/`, `auth.json`, or keys in `certs/`.
- Package manager: `pnpm` exclusively. Never run `npm` or `yarn`.

## Mandatory Quality Gates Before Finishing
Always verify your changes with the relevant commands before completing any task:
1. `pnpm run lint:openapi` (Redocly OpenAPI validation)
2. `pnpm test` (Vitest test suite)
3. `pnpm run lint` & `pnpm run format:check` (ESLint and Prettier)
4. For OpenAPI spec modifications: `pnpm run test:breaking`
