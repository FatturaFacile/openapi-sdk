# Fattura Facile Model Context Protocol (MCP) Tools

This directory contains Model Context Protocol (MCP) tool definitions and metadata generated from the canonical Fattura Facile OpenAPI 3.1.0 specifications.

## Contents

- `tools.json`: 65 tool definitions with complete descriptions, input schemas, and HTTP method/path metadata.
- `index.ts`: TypeScript export of all MCP tool specifications.

## Usage with AI Assistants

Connect this metadata to `fatturafacile-mcp-server` to allow Claude Desktop, Cursor, Copilot, or Windsurf to interact directly with ERP resources.

See [`examples/mcp-server/index.ts`](../examples/mcp-server/index.ts) for a complete implementation.
