/** @jest-environment node */
/* CMP-006: Base UI pin gate. dependencies['@base-ui/react'] is an exact version,
   the docs allowlist agrees, the package is absent from peerDependencies, and
   every §4.5 part resolves from the pinned install (open item O-06). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const allowlist = JSON.parse(readFileSync(join(root, 'docs', 'dependency-allowlist.json'), 'utf8')) as
  | { dependencies?: Record<string, string>; packages?: Record<string, string> }
  | Record<string, unknown>;

const PIN = /^\d+\.\d+\.\d+$/;

describe('Base UI dependency pin (REQ-CMP-01)', () => {
  it('dependencies pins an exact version', () => {
    const spec = pkg.dependencies?.['@base-ui/react'];
    expect(spec).toBeDefined();
    expect(spec).toMatch(PIN);
  });

  it('the allowlist holds the same name and version', () => {
    const text = readFileSync(join(root, 'docs', 'dependency-allowlist.json'), 'utf8');
    const spec = pkg.dependencies?.['@base-ui/react'] ?? '';
    expect(text).toContain('@base-ui/react');
    expect(text).toContain(spec);
  });

  it('is absent from peerDependencies', () => {
    expect(pkg.peerDependencies?.['@base-ui/react']).toBeUndefined();
  });
});

describe('§4.5 Base UI parts resolve (O-06)', () => {
  const PARTS: Array<[string, string]> = [
    ['Accordion', 'Root'],
    ['Avatar', 'Root'],
    ['Meter', 'Root'],
    ['Progress', 'Root'],
    ['Separator', 'Separator'],
    ['Form', 'Form'],
  ];
  for (const [ns, part] of PARTS) {
    it(`@base-ui/react/${ns.toLowerCase()} exposes ${ns}.${part}`, () => {
      const mod = require(`@base-ui/react/${ns.toLowerCase()}`) as Record<string, unknown>;
      const nsObj = (mod[ns] ?? mod) as Record<string, unknown>;
      const resolved = part === ns ? nsObj : nsObj[part];
      if (typeof resolved === 'undefined') {
        throw new Error(`missing @base-ui/react ${ns}.${part} (exports: ${Object.keys(nsObj).slice(0, 10).join(',')})`);
      }
      expect(typeof resolved).not.toBe('undefined');
    });
  }
});
