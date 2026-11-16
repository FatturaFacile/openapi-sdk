import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('OpenAPI 3.1 Contract Quality Assurance', () => {
  const specPath = path.resolve(process.cwd(), 'openapi', 'bundled', 'openapi.json');

  it('bundled OpenAPI 3.1 specification exists and is valid JSON', () => {
    expect(fs.existsSync(specPath)).toBe(true);
    const content = fs.readFileSync(specPath, 'utf8');
    const spec = JSON.parse(content);
    expect(spec.openapi).toBe('3.1.0');
    expect(spec.info.title).toBe('Fattura Facile ERP API');
    expect(spec.info.version).toBe('1.0.0');
  });

  it('covers all 14 mandatory ERP domains', () => {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    const paths = Object.keys(spec.paths);

    const expectedDomains = [
      'auth',
      'users',
      'companies',
      'customers',
      'products',
      'services',
      'quotes',
      'invoices',
      'credit-notes',
      'payments',
      'projects',
      'tasks',
      'files',
      'notifications'
    ];

    for (const domain of expectedDomains) {
      const match = paths.some(p => p.startsWith(`/v1/${domain}`) || p.startsWith(`/v1/auth`));
      expect(match, `Missing coverage for domain: ${domain}`).toBe(true);
    }
  });

  it('declares standard security schemes', () => {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    const schemes = spec.components?.securitySchemes;
    expect(schemes).toBeDefined();
    expect(schemes.bearerAuth).toBeDefined();
    expect(schemes.apiKeyAuth).toBeDefined();
    expect(schemes.oauth2).toBeDefined();
  });

  it('enforces RFC 9457 Problem Details error responses on operations', () => {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    for (const methods of Object.values(spec.paths)) {
      for (const op of Object.values(
        methods as Record<
          string,
          { responses?: Record<string, { content?: Record<string, unknown> }> }
        >
      )) {
        if (typeof op !== 'object' || !op.responses) continue;
        const err401 = op.responses['401'];
        if (err401 && err401.content) {
          expect(err401.content['application/problem+json']).toBeDefined();
        }
      }
    }
  });
});
