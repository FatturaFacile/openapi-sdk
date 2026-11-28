import { FatturaFacileClient } from '../../sdk/typescript/src/client.js';

async function run() {
  const client = new FatturaFacileClient({
    baseUrl: 'https://api.fatturafacile.eu',
    apiKey: process.env.FATTURAFACILE_API_KEY || 'ff_live_sample',
    tenantId: 'a0000000-0000-0000-0000-000000000001'
  });

  console.log('1. Fetching customers...');
  const customers = await client.request('GET', '/v1/customers?limit=5');
  console.log('Customers:', customers);

  console.log('2. Fetching recent invoices...');
  const invoices = await client.request('GET', '/v1/invoices?limit=5');
  console.log('Invoices:', invoices);
}

void run();
