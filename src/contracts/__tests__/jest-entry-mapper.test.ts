/* @jest-environment node */
/* C-4 (contract-v1.2, REQ-FIN-09): jest.config.js maps 'aura-glass' and every ENTRIES subpath with a src/ source to
   that source, and nothing else, so tests import the package exactly as consumers do. */
import { describe, expect, it } from '@jest/globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ENTRIES } from '../entries';

const root = join(__dirname, '..', '..', '..');
// The ESM config is transformed to CJS by the Jest transform, so require() returns { default }.
const mapper = (require(join(root, 'jest.config.js')) as { default: { moduleNameMapper: Record<string, string> } }).default.moduleNameMapper;
const pkgKeys = Object.keys(mapper).filter((k) => k.startsWith('^aura-glass'));
const resolveSpecifier = (spec: string): string | undefined => {
  for (const k of pkgKeys) {
    const m = new RegExp(k).exec(spec);
    if (m) return (mapper[k] ?? '').replace('<rootDir>', root).replace(/\$(\d)/g, (_, i: string) => m[Number(i)] ?? '');
  }
  return undefined;
};
const specifierOf = (subpath: string) => (subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.slice(2)}`);

describe('jest moduleNameMapper for aura-glass (C-4)', () => {
  const sourced = ENTRIES.filter((e) => e.source.startsWith('src/') || /\.json$/.test(e.source));

  it.each(sourced.map((e) => [e.subpath, e.source]))('%s resolves to %s', (subpath, source) => {
    expect(resolveSpecifier(specifierOf(subpath))).toBe(join(root, source));
    expect(existsSync(join(root, source))).toBe(true);
  });

  it('./deprecations.json resolves to the generated root file', () => {
    expect(resolveSpecifier('aura-glass/deprecations.json')).toBe(join(root, 'deprecations.json'));
  });

  it('./icons/<name> resolves under src/icons', () => {
    expect(resolveSpecifier('aura-glass/icons/action')).toBe(join(root, 'src/icons/action'));
  });

  it('maps no subpath that ENTRIES does not declare', () => {
    for (const spec of ['aura-glass/components', 'aura-glass/internal', 'aura-glass/index', 'aura-glass/src/internal/cn',
      'aura-glass/navigation', 'aura-glass/material/extra']) {
      expect(resolveSpecifier(spec)).toBeUndefined();
    }
  });

  it('has one mapper per sourced entry plus the ./icons/* pattern and ./deprecations.json', () => {
    const jsonEntries = ENTRIES.filter((e) => e.source === 'build:deprecations').length;
    expect(pkgKeys).toHaveLength(sourced.length + 1 /* icons pattern */ + jsonEntries);
  });
});
