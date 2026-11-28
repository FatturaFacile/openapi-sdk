using System;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FatturaFacile.Sdk
{
    public class FatturaFacileClientOptions
    {
        public string BaseUrl { get; set; } = "https://api.fatturafacile.eu";
        public string? AccessToken { get; set; }
        public string? ApiKey { get; set; }
        public string? TenantId { get; set; }
    }

    public class FatturaFacileClient
    {
        private readonly HttpClient _httpClient;
        private readonly FatturaFacileClientOptions _options;

        public FatturaFacileClient(FatturaFacileClientOptions options, HttpClient? httpClient = null)
        {
            _options = options;
            _httpClient = httpClient ?? new HttpClient();
            if (!_options.BaseUrl.EndsWith("/"))
            {
                _options.BaseUrl += "/";
            }
        }

        public async Task<T?> SendAsync<T>(HttpMethod method, string path, object? body = null, CancellationToken cancellationToken = default)
        {
            var url = new Uri(new Uri(_options.BaseUrl), path.TrimStart('/'));
            using var request = new HttpRequestMessage(method, url);

            request.Headers.Add("Accept", "application/json");
            if (!string.IsNullOrEmpty(_options.AccessToken))
            {
                request.Headers.Add("Authorization", $"Bearer {_options.AccessToken}");
            }
            else if (!string.IsNullOrEmpty(_options.ApiKey))
            {
                request.Headers.Add("X-API-Key", _options.ApiKey);
            }

            if (!string.IsNullOrEmpty(_options.TenantId))
            {
                request.Headers.Add("X-Tenant-ID", _options.TenantId);
            }

            if (body != null)
            {
                var json = JsonConvert.SerializeObject(body);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"API request failed with status {response.StatusCode}: {responseContent}");
            }

            if (string.IsNullOrWhiteSpace(responseContent))
            {
                return default;
            }

            return JsonConvert.DeserializeObject<T>(responseContent);
        }
    }
}
