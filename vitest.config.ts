import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/**', 'dist/**', 'sdk/**', 'coverage/**', '**/*.d.ts']
    }
  },
  resolve: {
    alias: {
      '@generators': resolve(__dirname, './generators'),
      '@scripts': resolve(__dirname, './scripts'),
      '@tests': resolve(__dirname, './tests')
    }
  }
});
