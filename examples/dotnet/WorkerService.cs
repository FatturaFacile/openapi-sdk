using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using FatturaFacile.Sdk;

namespace FatturaFacile.Examples.DotNet
{
    public class InvoiceSyncWorker : BackgroundService
    {
        private readonly ILogger<InvoiceSyncWorker> _logger;
        private readonly FatturaFacileClient _client;

        public InvoiceSyncWorker(ILogger<InvoiceSyncWorker> logger)
        {
            _logger = logger;
            _client = new FatturaFacileClient(new FatturaFacileClientOptions
            {
                ApiKey = Environment.GetEnvironmentVariable("FATTURAFACILE_API_KEY") ?? "ff_live_sample",
                TenantId = "a0000000-0000-0000-0000-000000000001"
            });
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Checking pending invoices in Fattura Facile at: {time}", DateTimeOffset.Now);
                try
                {
                    var response = await _client.SendAsync<object>(HttpMethod.Get, "/v1/invoices?status=sdi_transmitted", null, stoppingToken);
                    _logger.LogInformation("Queried pending invoices successfully.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error syncing invoices.");
                }

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
