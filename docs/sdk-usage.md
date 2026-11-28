# Official Multi-Language Client SDKs

Fattura Facile provides officially maintained client SDKs across 7 major programming languages.

---

## 1. TypeScript / JavaScript (`@fatturafacile/sdk`)

Installation:

```bash
pnpm add @fatturafacile/sdk
```

Usage:

```typescript
import { FatturaFacileClient } from '@fatturafacile/sdk';

const client = new FatturaFacileClient({
  baseUrl: 'https://api.fatturafacile.eu',
  apiKey: 'ff_live_998877665544332211',
  tenantId: 'a0000000-0000-0000-0000-000000000001'
});

// Fetch invoices
const invoices = await client.request('GET', '/v1/invoices?limit=10');
console.log(invoices);
```

---

## 2. PHP (`fatturafacile/sdk-php`)

Installation:

```bash
composer require fatturafacile/sdk-php
```

Usage:

```php
use FatturaFacile\Sdk\Client;

$client = new Client(
    baseUrl: 'https://api.fatturafacile.eu',
    apiKey: 'ff_live_998877665544332211',
    tenantId: 'a0000000-0000-0000-0000-000000000001'
);

$invoices = $client->request('GET', '/v1/invoices');
print_r($invoices);
```

---

## 3. Python (`fatturafacile-sdk`)

Installation:

```bash
pip install fatturafacile-sdk
```

Usage:

```python
from fatturafacile_sdk import FatturaFacileClient

client = FatturaFacileClient(
    api_key="ff_live_998877665544332211",
    tenant_id="a0000000-0000-0000-0000-000000000001"
)

invoices = client.request("GET", "/v1/invoices")
print(invoices)
```

---

## 4. Go (`github.com/fatturafacile/fatturafacile-sdk-go`)

Installation:

```bash
go get github.com/fatturafacile/fatturafacile-sdk-go
```

Usage:

```go
package main

import (
    "context"
    "fmt"
    "github.com/fatturafacile/fatturafacile-sdk-go"
)

func main() {
    client := fatturafacile.NewClient(fatturafacile.ClientOptions{
        APIKey:   "ff_live_998877665544332211",
        TenantID: "a0000000-0000-0000-0000-000000000001",
    })

    var result map[string]interface{}
    err := client.Request(context.Background(), "GET", "/v1/invoices", nil, &result)
    if err != nil {
        panic(err)
    }
    fmt.Printf("%+v\n", result)
}
```

---

## 5. C# / .NET (`FatturaFacile.Sdk`)

Installation:

```bash
dotnet add package FatturaFacile.Sdk
```

Usage:

```csharp
using FatturaFacile.Sdk;

var client = new FatturaFacileClient(new FatturaFacileClientOptions
{
    ApiKey = "ff_live_998877665544332211",
    TenantId = "a0000000-0000-0000-0000-000000000001"
});

var invoices = await client.SendAsync<object>(HttpMethod.Get, "/v1/invoices");
```

---

## 6. Java (`com.fatturafacile:sdk-java`)

Maven Dependency:

```xml
<dependency>
    <groupId>com.fatturafacile</groupId>
    <artifactId>sdk-java</artifactId>
    <version>1.0.0</version>
</dependency>
```

Usage:

```java
import com.fatturafacile.sdk.FatturaFacileClient;
import java.util.Map;

FatturaFacileClient client = new FatturaFacileClient(
    "https://api.fatturafacile.eu",
    null,
    "ff_live_998877665544332211",
    "a0000000-0000-0000-0000-000000000001"
);

Map response = client.send("GET", "/v1/invoices", null, Map.class);
```
