@AGENTS.md

# Agent rules: fatturafacile-openapi-sdk

Read in this order before planning or editing:

1. `AGENTS.md` (OpenAPI 3.1.x, SDK architecture, TypeScript standards)
2. `.ai/rules/index.md` and every rule file it maps to your paths (always `.ai/rules/project.md`)
3. `.github/copilot-instructions.md` (architecture, build, validation, test and lint commands)

Package manager: `pnpm` only. Never read or leak `.env*`, `.git/`, `auth.json` or keys in `certs/`.

Key Commands:

- Lint specs: `pnpm run lint:openapi`
- Run test suite: `pnpm test`
- Build all generators: `pnpm run generate:all`
