import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

async function bundleOpenApi(): Promise<void> {
  const rootDir = process.cwd();
  const inputSpec = path.join(rootDir, 'openapi', 'openapi.yaml');
  const outputDir = path.join(rootDir, 'openapi', 'bundled');
  const outputJson = path.join(outputDir, 'openapi.json');
  const outputYaml = path.join(outputDir, 'openapi.yaml');

  console.info('📦 Starting OpenAPI 3.1 bundling...');
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // Bundle JSON
    console.info(`-> Bundling JSON to ${path.relative(rootDir, outputJson)}...`);
    execSync(`npx --yes @redocly/cli bundle "${inputSpec}" --output "${outputJson}" --ext json`, {
      stdio: 'inherit'
    });

    // Bundle YAML
    console.info(`-> Bundling YAML to ${path.relative(rootDir, outputYaml)}...`);
    execSync(`npx --yes @redocly/cli bundle "${inputSpec}" --output "${outputYaml}" --ext yaml`, {
      stdio: 'inherit'
    });

    const stats = fs.statSync(outputJson);
    console.info(
      `✅ Successfully bundled OpenAPI 3.1 specification (${(stats.size / 1024).toFixed(1)} KB)`
    );
  } catch (error) {
    console.error('❌ Failed to bundle OpenAPI specification:', error);
    process.exit(1);
  }
}

void bundleOpenApi();
