import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

interface OpenApiOperation {
  operationId: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema?: Record<string, unknown>;
  }>;
  requestBody?: {
    content?: {
      'application/json'?: {
        schema?: Record<string, unknown>;
        example?: unknown;
      };
    };
  };
}

interface OpenApiSpec {
  info: { title: string; version: string; description?: string };
  servers: Array<{ url: string; description?: string }>;
  paths: Record<string, Record<string, OpenApiOperation>>;
}

export function generatePostmanCollection(spec: OpenApiSpec): Record<string, unknown> {
  const folders: Record<string, Array<Record<string, unknown>>> = {};

  for (const [routePath, methods] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (!op.operationId) continue;
      const tag = op.tags?.[0] || 'General';
      if (!folders[tag]) folders[tag] = [];

      const headers = [
        { key: 'Accept', value: 'application/json' },
        { key: 'X-Tenant-ID', value: '{{tenant_id}}' }
      ];

      const urlPath = routePath
        .split('/')
        .filter(Boolean)
        .map(seg => {
          if (seg.startsWith('{') && seg.endsWith('}')) {
            return `:${seg.slice(1, -1)}`;
          }
          return seg;
        });

      const requestItem: Record<string, unknown> = {
        name: op.summary || op.operationId,
        request: {
          method: method.toUpperCase(),
          header: headers,
          url: {
            raw: `{{base_url}}${routePath}`,
            host: ['{{base_url}}'],
            path: urlPath
          },
          description: op.description || op.summary
        }
      };

      if (op.requestBody?.content?.['application/json']) {
        const bodyContent = op.requestBody.content['application/json'];
        (requestItem.request as Record<string, unknown>).body = {
          mode: 'raw',
          raw: JSON.stringify(bodyContent.example || {}, null, 2),
          options: {
            raw: { language: 'json' }
          }
        };
      }

      folders[tag].push(requestItem);
    }
  }

  const items = Object.entries(folders).map(([tag, reqs]) => ({
    name: tag,
    item: reqs
  }));

  return {
    info: {
      name: 'Fattura Facile ERP API',
      description: spec.info.description || 'Fattura Facile API Collection',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    auth: {
      type: 'bearer',
      bearer: [{ key: 'token', value: '{{access_token}}', type: 'string' }]
    },
    variable: [
      { key: 'base_url', value: 'https://api.fatturafacile.com', type: 'string' },
      { key: 'tenant_id', value: 'a0000000-0000-0000-0000-000000000001', type: 'string' },
      { key: 'access_token', value: 'YOUR_JWT_ACCESS_TOKEN', type: 'string' }
    ],
    item: items
  };
}

export function generateHoppscotchCollection(spec: OpenApiSpec): Record<string, unknown>[] {
  const folders: Record<string, Array<Record<string, unknown>>> = {};

  for (const [routePath, methods] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (!op.operationId) continue;
      const tag = op.tags?.[0] || 'General';
      if (!folders[tag]) folders[tag] = [];

      folders[tag].push({
        v: '1',
        name: op.summary || op.operationId,
        method: method.toUpperCase(),
        endpoint: `<<base_url>>${routePath}`,
        headers: [
          { key: 'X-Tenant-ID', value: '<<tenant_id>>', active: true },
          { key: 'Accept', value: 'application/json', active: true }
        ],
        auth: {
          authType: 'bearer',
          token: '<<access_token>>'
        }
      });
    }
  }

  return Object.entries(folders).map(([name, requests]) => ({
    name,
    folders: [],
    requests
  }));
}

async function main(): Promise<void> {
  const rootDir = process.cwd();
  const bundledSpecPath = path.join(rootDir, 'openapi', 'bundled', 'openapi.json');

  if (!fs.existsSync(bundledSpecPath)) {
    console.info('Bundled OpenAPI spec not found. Bundling first...');
    const inputSpec = path.join(rootDir, 'openapi', 'openapi.yaml');
    fs.mkdirSync(path.dirname(bundledSpecPath), { recursive: true });
    execSync(
      `npx --yes @redocly/cli bundle "${inputSpec}" --output "${bundledSpecPath}" --ext json`,
      {
        stdio: 'inherit'
      }
    );
  }

  const spec = JSON.parse(fs.readFileSync(bundledSpecPath, 'utf8')) as OpenApiSpec;

  // 1. Postman
  const postmanDir = path.join(rootDir, 'collections', 'postman');
  fs.mkdirSync(postmanDir, { recursive: true });
  const postmanColl = generatePostmanCollection(spec);
  fs.writeFileSync(
    path.join(postmanDir, 'fatturafacile.postman_collection.json'),
    JSON.stringify(postmanColl, null, 2),
    'utf8'
  );

  // 2. Hoppscotch
  const hoppDir = path.join(rootDir, 'collections', 'hoppscotch');
  fs.mkdirSync(hoppDir, { recursive: true });
  const hoppColl = generateHoppscotchCollection(spec);
  fs.writeFileSync(
    path.join(hoppDir, 'fatturafacile.hoppscotch.json'),
    JSON.stringify(hoppColl, null, 2),
    'utf8'
  );

  // 3. Bruno
  const brunoDir = path.join(rootDir, 'collections', 'bruno');
  fs.mkdirSync(brunoDir, { recursive: true });
  fs.writeFileSync(
    path.join(brunoDir, 'bruno.json'),
    JSON.stringify(
      {
        version: '1',
        name: 'Fattura Facile ERP API',
        type: 'collection'
      },
      null,
      2
    ),
    'utf8'
  );

  // 4. Insomnia
  const insomniaDir = path.join(rootDir, 'collections', 'insomnia');
  fs.mkdirSync(insomniaDir, { recursive: true });
  fs.writeFileSync(
    path.join(insomniaDir, 'fatturafacile.insomnia.json'),
    JSON.stringify(
      {
        _type: 'export',
        __export_format: 4,
        resources: [
          {
            _id: 'wrk_fatturafacile',
            _type: 'workspace',
            name: 'Fattura Facile ERP API'
          }
        ]
      },
      null,
      2
    ),
    'utf8'
  );

  console.info('✅ Generated Postman, Insomnia, Bruno, and Hoppscotch collections -> collections/');
}

if (process.argv[1]?.includes('collections')) {
  void main();
}
