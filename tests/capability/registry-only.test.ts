/** @jest-environment node */
// tests/capability/registry-only.test.ts — REQ-SURF-177 (REQ-FIN-88,
// AC-FIN-88; AC-SURF-26). commerce-cart, commerce-checkout, pricing,
// presence-stack and comment-thread are registry artifacts: their names must
// never reach the published package. The scan runs over the dist/ of an
// EXTRACTED `npm pack` tarball ($AG_TARBALL_DIR = the tarball's `package/`
// directory, set by the surf:test:registry-lint lane) — never the repo's
// dist/, which is not what consumers install. Without $AG_TARBALL_DIR the
// tarball case fails with the command to run; it never passes vacuously.
// The scanner itself is proven on fixture dists (one leaking, one clean).
import { describe, expect, it } from '@jest/globals';
import { existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const REGISTRY_ONLY = [
  'commerce-cart', 'commerce-checkout', 'pricing', 'presence-stack', 'comment-thread',
  'CommerceCart', 'CommerceCheckout', 'PricingTable', 'PlanComparison', 'PresenceStack', 'CommentThread',
];
/* Kebab ids are matched as registry paths/ids; PascalCase names as identifiers. */
const PATTERNS = REGISTRY_ONLY.map((n) => ({
  name: n,
  re: /^[A-Z]/.test(n) ? new RegExp(`\\b${n}\\b`) : new RegExp(`(?:registry/(?:blocks|items)/|["'\`/])${n}(?:["'\`/]|$)`),
}));

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

/** Every `file: name` hit of a registry-only name under `<pkgDir>/dist`. Throws when dist/ is absent. */
export function registryLeaks(pkgDir: string): string[] {
  const dist = join(pkgDir, 'dist');
  if (!existsSync(dist)) throw new Error(`${dist} does not exist — not an extracted package`);
  const hits: string[] = [];
  for (const f of walk(dist)) {
    const text = readFileSync(f, 'utf8');
    for (const { name, re } of PATTERNS) if (re.test(text)) hits.push(`${f.slice(pkgDir.length + 1)}: ${name}`);
  }
  return hits;
}

const fixturePkg = (files: Record<string, string>) => {
  const dir = mkdtempSync(join(tmpdir(), 'ag-registry-only-'));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
  return dir;
};

describe('registry-only scanner (fixture dists)', () => {
  it("flags a dist that contains 'CommerceCart'", () => {
    const dir = fixturePkg({
      'dist/index.js': 'export { Button } from "./button.js";\n',
      'dist/commerce.js': 'export function CommerceCart() { return null; }\n',
    });
    try {
      expect(registryLeaks(dir)).toEqual(['dist/commerce.js: CommerceCart']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('flags a registry path and a d.ts identifier', () => {
    const dir = fixturePkg({
      'dist/index.d.ts': 'export declare const PresenceStack: unknown;\n',
      'dist/registry.json': '{"items":["registry/blocks/pricing/index.tsx"]}\n',
    });
    try {
      expect(registryLeaks(dir).sort()).toEqual(['dist/index.d.ts: PresenceStack', 'dist/registry.json: pricing']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('passes a clean dist and does not match substrings (e.g. "pricingTier")', () => {
    const dir = fixturePkg({ 'dist/index.js': 'export const pricingTier = 1; export function Button() {}\n' });
    try {
      expect(registryLeaks(dir)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('refuses a directory without dist/ (never a vacuous pass)', () => {
    const dir = fixturePkg({ 'package.json': '{}' });
    try {
      expect(() => registryLeaks(dir)).toThrow(/does not exist/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('the packed tarball never ships registry-only names', () => {
  it('extracted tarball dist/ has 0 registry-only names', () => {
    const pkg = process.env['AG_TARBALL_DIR'];
    if (pkg === undefined || pkg === '') {
      throw new Error(
        'AG_TARBALL_DIR unset. Run in the surf:test:registry-lint lane, or: npm run build && ' +
        'T=$(mktemp -d) && npm pack --ignore-scripts --pack-destination "$T" && tar -xzf "$T"/*.tgz -C "$T" && ' +
        'AG_TARBALL_DIR="$T/package" npx jest tests/capability/registry-only.test.ts',
      );
    }
    expect(registryLeaks(pkg)).toEqual([]);
  });
});
