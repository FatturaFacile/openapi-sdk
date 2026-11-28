# fatturafacile/sdk-php

Official PHP 8.2+ client SDK for the Fattura Facile ERP platform.

## Installation

```bash
composer require fatturafacile/sdk-php
```

## Quick Start

```php
use FatturaFacile\Sdk\Client;

$client = new Client(
    baseUrl: 'https://api.fatturafacile.eu',
    apiKey: getenv('FATTURAFACILE_API_KEY'),
    tenantId: 'a0000000-0000-0000-0000-000000000001'
);

// Fetch customers
$customers = $client->request('GET', '/v1/customers?limit=10');
print_r($customers);
```

## Framework Integration

- Compatible with Laravel, Symfony, and WordPress.
- PSR-18 HTTP Client and PSR-7 Request/Response compatible.
