# fatturafacile-sdk (Python)

Official Python 3.10+ client SDK for the Fattura Facile ERP platform.

## Installation

```bash
pip install fatturafacile-sdk
```

## Quick Start

### Synchronous Client

```python
from fatturafacile_sdk import FatturaFacileClient

client = FatturaFacileClient(
    api_key="ff_live_your_key",
    tenant_id="a0000000-0000-0000-0000-000000000001"
)

invoices = client.request("GET", "/v1/invoices?limit=25")
print(invoices)
```

### Asynchronous Client

```python
import asyncio
from fatturafacile_sdk import AsyncFatturaFacileClient

async def main():
    client = AsyncFatturaFacileClient(
        api_key="ff_live_your_key",
        tenant_id="a0000000-0000-0000-0000-000000000001"
    )
    invoices = await client.request("GET", "/v1/invoices?limit=25")
    print(invoices)

asyncio.run(main())
```
