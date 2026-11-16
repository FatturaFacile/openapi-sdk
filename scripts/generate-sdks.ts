import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_LANGUAGES = ['typescript', 'javascript', 'php', 'csharp', 'java', 'python', 'go'];

export async function generateSdk(target: string): Promise<void> {
  const rootDir = process.cwd();
  const bundledSpec = path.join(rootDir, 'openapi', 'bundled', 'openapi.yaml');

  if (!fs.existsSync(bundledSpec)) {
    console.info('Bundled OpenAPI spec missing; bundling first...');
    const inputSpec = path.join(rootDir, 'openapi', 'openapi.yaml');
    fs.mkdirSync(path.dirname(bundledSpec), { recursive: true });
    execSync(`npx --yes @redocly/cli bundle "${inputSpec}" --output "${bundledSpec}" --ext yaml`, {
      stdio: 'inherit'
    });
  }

  console.info(`🚀 Generating SDK for target: [${target}]...`);
  try {
    execSync(`npx --yes @openapitools/openapi-generator-cli generate --generator-key ${target}`, {
      stdio: 'inherit'
    });
    console.info(`✅ Successfully generated SDK for: ${target}`);
  } catch {
    console.warn(
      `⚠️ OpenAPI Generator CLI execution for ${target} logged a warning or completed with non-zero code.`
    );
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const targetArg = args.find(a => a.startsWith('--target='));
  const selectedTarget = targetArg ? targetArg.split('=')[1] : null;

  if (selectedTarget) {
    await generateSdk(selectedTarget);
  } else {
    console.info(`📦 Generating core multi-language SDKs (${TARGET_LANGUAGES.join(', ')})...`);
    for (const lang of TARGET_LANGUAGES) {
      await generateSdk(lang);
    }
  }
}

if (process.argv[1]?.includes('generate-sdks')) {
  void main();
}
