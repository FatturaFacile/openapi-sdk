export interface FatturaFacileClientOptions {
  baseUrl?: string;
  accessToken?: string;
  apiKey?: string;
  tenantId?: string;
  maxRetries?: number;
  timeoutMs?: number;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  invalidParams?: Array<{ name: string; reason: string; code?: string }>;
}

export class FatturaFacileApiError extends Error {
  public readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail || problem.title || `API Error: ${problem.status}`);
    this.name = 'FatturaFacileApiError';
    this.problem = problem;
  }
}

export class FatturaFacileClient {
  private readonly baseUrl: string;
  private readonly accessToken?: string;
  private readonly apiKey?: string;
  private readonly tenantId?: string;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(options: FatturaFacileClientOptions = {}) {
    this.baseUrl = (options.baseUrl || 'https://api.fatturafacile.eu').replace(/\/$/, '');
    this.accessToken = options.accessToken;
    this.apiKey = options.apiKey;
    this.tenantId = options.tenantId;
    this.maxRetries = options.maxRetries ?? 3;
    this.timeoutMs = options.timeoutMs ?? 30000;
  }

  public async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...customHeaders
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    } else if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    if (this.tenantId && !headers['X-Tenant-ID']) {
      headers['X-Tenant-ID'] = this.tenantId;
    }

    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(url, {
          method,
          headers,
          body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Rate limit retry handling (429 Too Many Requests)
        if (response.status === 429 && attempt <= this.maxRetries) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.pow(2, attempt) * 500;
          await new Promise(res => setTimeout(res, delay));
          continue;
        }

        // Server error retry (502, 503, 504)
        if (response.status >= 502 && attempt <= this.maxRetries) {
          const delay = Math.pow(2, attempt) * 500;
          await new Promise(res => setTimeout(res, delay));
          continue;
        }

        if (!response.ok) {
          let problem: ProblemDetails;
          try {
            problem = (await response.json()) as ProblemDetails;
          } catch {
            problem = {
              type: 'https://api.fatturafacile.eu/errors/generic',
              title: response.statusText || 'HTTP Error',
              status: response.status,
              detail: `Request failed with status ${response.status}`
            };
          }
          throw new FatturaFacileApiError(problem);
        }

        if (response.status === 204) {
          return undefined as T;
        }

        return (await response.json()) as T;
      } catch (error) {
        if (error instanceof FatturaFacileApiError) {
          throw error;
        }
        if (attempt > this.maxRetries) {
          throw error;
        }
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(res => setTimeout(res, delay));
      }
    }

    throw new Error('Maximum request retry attempts exceeded.');
  }
}
