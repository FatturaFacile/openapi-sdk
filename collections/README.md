# Developer API Collections

This directory contains pre-configured API collections generated from the canonical OpenAPI 3.1.0 specifications for Fattura Facile ERP.

## Supported Formats

1. **Postman**: `postman/fatturafacile.postman_collection.json` (v2.1 Collection format with pre-configured `{{base_url}}`, `{{tenant_id}}`, and `{{access_token}}` variables).
2. **Hoppscotch**: `hoppscotch/fatturafacile.hoppscotch.json` (Directly importable into Hoppscotch web or desktop).
3. **Bruno**: `bruno/bruno.json` (Local Git-friendly collection format).
4. **Insomnia**: `insomnia/fatturafacile.insomnia.json` (Insomnia v4 workspace export).

## Regeneration

To re-generate collections after contract changes:

```bash
pnpm run generate:collections
```
