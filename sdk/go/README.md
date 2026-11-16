# fatturafacile-sdk-go

Official Go client library for the Fattura Facile ERP platform.

## Installation

```bash
go get github.com/fatturafacile/fatturafacile-sdk-go
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    "github.com/fatturafacile/fatturafacile-sdk-go"
)

func main() {
    client := fatturafacile.NewClient(fatturafacile.ClientOptions{
        APIKey:   "ff_live_your_key",
        TenantID: "a0000000-0000-0000-0000-000000000001",
    })

    var result map[string]interface{}
    err := client.Request(context.Background(), "GET", "/v1/invoices?limit=10", nil, &result)
    if err != nil {
        panic(err)
    }
    fmt.Printf("%+v\n", result)
}
```
