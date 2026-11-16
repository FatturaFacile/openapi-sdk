import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Developer API Collections Quality Assurance', () => {
  const root = process.cwd();

  it('generates valid Postman collection v2.1', () => {
    const postmanPath = path.join(
      root,
      'collections',
      'postman',
      'fatturafacile.postman_collection.json'
    );
    expect(fs.existsSync(postmanPath)).toBe(true);
    const collection = JSON.parse(fs.readFileSync(postmanPath, 'utf8'));
    expect(collection.info.schema).toContain('v2.1.0');
    expect(collection.item.length).toBeGreaterThanOrEqual(10);
    expect(collection.auth.type).toBe('bearer');
  });

  it('generates valid Hoppscotch collection', () => {
    const hoppPath = path.join(root, 'collections', 'hoppscotch', 'fatturafacile.hoppscotch.json');
    expect(fs.existsSync(hoppPath)).toBe(true);
    const collection = JSON.parse(fs.readFileSync(hoppPath, 'utf8'));
    expect(Array.isArray(collection)).toBe(true);
    expect(collection.length).toBeGreaterThanOrEqual(10);
  });

  it('generates Bruno collection manifest', () => {
    const brunoPath = path.join(root, 'collections', 'bruno', 'bruno.json');
    expect(fs.existsSync(brunoPath)).toBe(true);
  });

  it('generates Insomnia workspace export', () => {
    const insomniaPath = path.join(root, 'collections', 'insomnia', 'fatturafacile.insomnia.json');
    expect(fs.existsSync(insomniaPath)).toBe(true);
  });
});
