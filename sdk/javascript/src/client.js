export class FatturaFacileClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || 'https://api.fatturafacile.com').replace(/\/$/, '');
    this.accessToken = options.accessToken;
    this.apiKey = options.apiKey;
    this.tenantId = options.tenantId;
    this.timeoutMs = options.timeoutMs || 30000;
  }

  async request(method, path, body = null) {
    const url = `${this.baseUrl}/${path.replace(/^\//, '')}`;
    const headers = {
      Accept: 'application/json'
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    } else if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    if (this.tenantId) {
      headers['X-Tenant-ID'] = this.tenantId;
    }

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error [${response.status}]: ${errText}`);
    }

    if (response.status === 204) return null;
    return response.json();
  }
}
