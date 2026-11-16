<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use FatturaFacile\Sdk\Client;

class FatturaFacileServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Client::class, function ($app) {
            return new Client(
                baseUrl: config('services.fatturafacile.base_url', 'https://api.fatturafacile.com'),
                apiKey: config('services.fatturafacile.api_key'),
                tenantId: config('services.fatturafacile.tenant_id')
            );
        });
    }

    public function boot(): void
    {
        // Bootstrapping configuration publishing if needed
    }
}
