# FatturaFacile OpenAPI and SDKs

[![CI](https://github.com/FatturaFacile/openapi-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/FatturaFacile/openapi-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1.0-brightgreen.svg)](https://spec.openapis.org/oas/v3.1.0)
[![Redocly](https://img.shields.io/badge/Redocly-linted-success.svg)](https://redocly.com)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev)

OpenAPI 3.1 contract for the [FatturaFacile](https://github.com/FatturaFacile/FatturaFacile) ERP API, with everything generated from it: runtime schemas (Zod and JSON Schema), API collections (Postman, Insomnia, Bruno, Hoppscotch), MCP tool metadata and client SDKs in seven languages.

> **Status: early stage (version 1.0.0 of the specification).** The specification covers a subset of the API (14 domains); the SDKs are thin request clients, not full typed wrappers of every endpoint. The [`web-api`](https://github.com/FatturaFacile/web-api) repository also keeps its own OpenAPI file; check there for the complete, current API surface.

## Overview

- **Contract first:** the specification in `openapi/` is the source. Generated output (`sdk/`, `collections/`, `dist/`, `mcp/`) is never edited by hand: change the specification, the generators in `generators/` or the templates in `templates/`, then regenerate.
- **Tenant context:** business endpoints take the tenant through the `X-Tenant-ID` header or a JWT claim.
- **Errors:** RFC 9457 problem details (`application/problem+json`).
- **Breaking-change gate:** `oasdiff` runs in CI against the base branch.
- **Domains (14):** authentication, users and roles, companies, customers, products, services, quotes, invoices, credit notes, payments, projects, tasks, files, notifications (one folder each under `openapi/paths/`).

### Generated artifacts

| Output                         | Location                                                | Committed           |
| :----------------------------- | :------------------------------------------------------ | :------------------ |
| Bundled specification          | `openapi/bundled/`                                      | no (build output)   |
| Zod and JSON Schema validators | `generators/zod/generated/`, `dist/`                    | Zod yes, `dist/` no |
| API collections                | `collections/{postman,insomnia,bruno,hoppscotch}`       | yes                 |
| MCP tool metadata (65 tools)   | `mcp/tools.json`, `mcp/index.ts`                        | yes                 |
| Client SDKs                    | `sdk/{typescript,javascript,php,csharp,java,python,go}` | yes                 |

### SDK example (TypeScript)

```typescript
import { FatturaFacileClient } from '@fatturafacile/sdk';

const client = new FatturaFacileClient({
  baseUrl: 'https://api.fatturafacile.eu', // set it explicitly, see the note below
  apiKey: process.env.FATTURAFACILE_API_KEY,
  tenantId: '<tenant-uuid>'
});

const invoices = await client.request('GET', '/v1/invoices?limit=25');
```

Note: the SDK default for `baseUrl` is `https://api.fatturafacile.com`; pass `baseUrl` explicitly. Usage in the other languages is in [docs/sdk-usage.md](docs/sdk-usage.md).

## Requirements

- Node.js 24 or later
- pnpm 12 (pinned in `packageManager`; `engines` requires pnpm 9 or later)
- Docker (optional, see below)
- Go, Java, Python, PHP and .NET toolchains only when you build the SDK of that language

## Getting started

```bash
git clone https://github.com/FatturaFacile/openapi-sdk.git
cd openapi-sdk
pnpm install --frozen-lockfile

pnpm run lint:openapi      # lint the specification (Redocly)
pnpm run bundle:openapi    # bundle into openapi/bundled/
pnpm run docs              # preview the documentation on http://localhost:8080
pnpm run generate:all      # Zod, JSON Schema, MCP, collections and SDKs
```

The Docker setup (`docker compose`) offers the same tasks as services: `openapi-tools` (lint), `docs-server` (documentation on port 8080), `sdk-generator` and `test-runner`.

## Configuration

No environment file is needed. The SDK reads the API key, base URL and tenant from its constructor options.

## Testing and linting

```bash
pnpm run lint:openapi   # specification
pnpm run bundle:openapi && pnpm run generate:all   # tests read the generated artifacts, run this first
pnpm test               # Vitest: contract, schema, collections and MCP metadata tests
pnpm run test:breaking  # oasdiff breaking-change check
pnpm run lint           # ESLint on scripts, generators and tests
pnpm run format:check   # Prettier
```

`generate:all` rewrites the committed collections and Zod output; commit the result with your change.

## CI/CD and branching

- `dev` is the default branch. Open pull requests against `dev`. Production is released from `main` with a GitHub release.
- `CI` (`ci.yml`) runs on pull requests and on pushes to `main` and `dev`: Redocly lint, bundle, breaking-change check, generators, ESLint and Prettier, build and tests.
- `Deploy dev` (`deploy-dev.yml`) runs the CI on every push to `dev`.
- `Release Assets` (`deploy.yml`) runs the CI when a GitHub release is published and attaches the bundled specification and the generated documentation, with checksums.
- `Publish Multi-Language SDKs` (`publish-sdks.yml`) runs on `v*` tags and publishes the TypeScript SDK to npm, the Python SDK to PyPI and the .NET SDK to NuGet. The PHP, Java and Go SDKs are not published by the workflow yet.

## Project structure

```text
openapi/        # canonical specification: openapi.yaml, paths/<domain>/, components/
generators/     # Zod, JSON Schema, MCP and collection generators
templates/      # Mustache templates for the SDK generators
scripts/        # bundle, breaking-change check, SDK generation
sdk/            # generated clients (typescript, javascript, php, csharp, java, python, go)
collections/    # generated API collections
mcp/            # generated MCP tool metadata
tests/          # Vitest suites
examples/       # usage examples (Node, Python, .NET, Laravel, WordPress/WooCommerce, Shopify, MCP, agents)
docs/           # guides
```

## Related repositories

| Repository                                                        | Relation                                           |
| :---------------------------------------------------------------- | :------------------------------------------------- |
| [`web-api`](https://github.com/FatturaFacile/web-api)             | The Laravel API described by the specification     |
| [`mcp-server`](https://github.com/FatturaFacile/mcp-server)       | MCP server for the same API                        |
| [`integrations`](https://github.com/FatturaFacile/integrations)   | Connectors that use a TypeScript client of the API |
| [`FatturaFacile`](https://github.com/FatturaFacile/FatturaFacile) | Organization overview and repository map           |

## Documentation

- [API overview](docs/index.md), [authentication](docs/auth.md), [multi-tenancy](docs/multi-tenancy.md), [SDK usage](docs/sdk-usage.md), [errors](docs/errors.md), [pagination, filtering and search](docs/pagination-filtering-search.md), [versioning](docs/versioning-compatibility.md), [security](docs/security.md)
- Project wiki: [FatturaFacile/FatturaFacile wiki](https://github.com/FatturaFacile/FatturaFacile/wiki)

## Contributing

Make API changes in `openapi/paths/` and `openapi/components/`, reuse the shared schemas in `openapi/components/schemas/common/`, then run `lint:openapi`, `test:breaking`, `generate:all` and `test` as above.

## License

[MIT](LICENSE)
