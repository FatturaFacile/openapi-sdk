# @fatturafacile/sdk (TypeScript & JavaScript)

Official TypeScript & JavaScript client SDK for the Fattura Facile ERP platform.

## Installation

```bash
pnpm add @fatturafacile/sdk
# or
npm install @fatturafacile/sdk
```

## Quick Start

```typescript
import { FatturaFacileClient } from '@fatturafacile/sdk';

const client = new FatturaFacileClient({
  baseUrl: 'https://api.fatturafacile.com',
  apiKey: process.env.FATTURAFACILE_API_KEY,
  tenantId: 'a0000000-0000-0000-0000-000000000001'
});

// Fetch invoices
const invoices = await client.request('GET', '/v1/invoices?limit=25');
console.log(invoices);
```

## Features

- Full TypeScript type definitions.
- Automatic exponential backoff retries.
- Rate-limit handling via `Retry-After`.
- Standard RFC 9457 Problem Details error parsing.
