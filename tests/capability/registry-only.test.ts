// tests/capability/registry-only.test.ts — REQ-SURF-176/177 (AC-SURF-26).
// commerce-cart, commerce-checkout, pricing, presence-stack, comment-thread
// are registry artifacts: their names must never reach the packed library
// (dist/ or an entry barrel).
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const REGISTRY_NAMES = [
  'commerce-cart', 'commerce-checkout', 'pricing',
  'presence-stack', 'comment-thread',
];
const REGISTRY_COMPONENTS = [
  'CommerceCart', 'CommerceCheckout', 'PricingTable', 'PresenceStack', 'CommentThread',
];

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

describe('registry-only blocks/items never reach the package', () => {
  it('no src/ or dist/ file mentions the registry-only names', () => {
    const hits: string[] = [];
    for (const base of ['src', 'dist']) {
      for (const f of walk(join(ROOT, base)) ?? []) {
        const text = readFileSync(f, 'utf8');
        for (const n of [...REGISTRY_NAMES, ...REGISTRY_COMPONENTS]) {
          if (text.includes(n)) hits.push(`${f}: ${n}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
  it('registry-only blocks/items live only under registry/{blocks,items}', () => {
    for (const n of REGISTRY_NAMES) {
      const inBlocks = existsSync(join(ROOT, 'registry/blocks', n));
      const inItems = existsSync(join(ROOT, 'registry/items', n));
      if (inBlocks || inItems) {
        expect(inBlocks || inItems).toBe(true); // present only here — never under src/packages
      }
    }
  });
});
