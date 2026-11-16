import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

interface OpenApiSchema {
  type?: string | string[];
  [key: string]: unknown;
}

interface OpenApiSpec {
  components?: {
    schemas?: Record<string, OpenApiSchema>;
  };
}

export function convertToJsonSchema(name: string, schema: OpenApiSchema): Record<string, unknown> {
  const jsonSchema: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `https://schemas.fatturafacile.com/v1/${name}.json`,
    title: name,
    ...schema
  };

  return jsonSchema;
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
  const schemas = spec.components?.schemas || {};
  const outputDir = path.join(rootDir, 'dist', 'json-schema');
  fs.mkdirSync(outputDir, { recursive: true });

  const allSchemas: Record<string, unknown> = {};

  for (const [name, schema] of Object.entries(schemas)) {
    const jsonSchema = convertToJsonSchema(name, schema);
    allSchemas[name] = jsonSchema;

    const singlePath = path.join(outputDir, `${name}.json`);
    fs.writeFileSync(singlePath, JSON.stringify(jsonSchema, null, 2), 'utf8');
  }

  const indexPath = path.join(outputDir, 'schemas.json');
  fs.writeFileSync(indexPath, JSON.stringify(allSchemas, null, 2), 'utf8');
  console.info(
    `✅ Generated ${Object.keys(schemas).length} JSON Schema Draft 2020-12 files -> ${path.relative(rootDir, outputDir)}`
  );
}

if (process.argv[1]?.includes('json-schema')) {
  void main();
}
