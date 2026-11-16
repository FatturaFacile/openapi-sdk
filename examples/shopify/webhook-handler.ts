import { FatturaFacileClient } from '../../sdk/typescript/src/client.js';

export async function handleShopifyOrderPaid(shopifyOrder: any) {
  const client = new FatturaFacileClient({
    apiKey: process.env.FATTURAFACILE_API_KEY,
    tenantId: process.env.FATTURAFACILE_TENANT_ID
  });

  const invoicePayload = {
    customerId:
      shopifyOrder.customer?.metafield_fatturafacile_id || 'c1000000-0000-0000-0000-000000000001',
    documentType: 'TD01',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    autoTransmitSdi: true,
    lines: shopifyOrder.line_items.map((item: any) => ({
      description: item.title,
      quantity: item.quantity,
      unitPrice: {
        amount: parseFloat(item.price),
        currency: shopifyOrder.currency
      },
      vatRate: 22.0,
      totalNet: {
        amount: parseFloat(item.price) * item.quantity,
        currency: shopifyOrder.currency
      }
    }))
  };

  console.log('Generating invoice in Fattura Facile...');
  const invoice = await client.request('POST', '/v1/invoices', invoicePayload);
  console.log('Created invoice:', invoice);
  return invoice;
}
