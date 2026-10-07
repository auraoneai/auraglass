// tests/capability/no-alias-exports.test.ts — REQ-SURF-185.
// X-R11 alias exports (Autocomplete, TagInput, HoverCard, NotificationCenter,
// Banner, Lightbox, Dock, NavBar) never appear as value exports from any
// export surface: entry index barrels, registry descriptors, packages/labs.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const ALIASES = ['Autocomplete', 'TagInput', 'HoverCard', 'NotificationCenter', 'Banner', 'Lightbox', 'Dock', 'NavBar'];
const SCAN_ROOTS = ['src', 'registry', 'packages/labs/src', 'apps/docs/content'];

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|mts|cts|js|jsx|json)$/.test(name)) yield p;
  }
}

const EXPORT_RE = /export\s+(?:\*|\{[^}]*\}|\w+|default\s+\w+)\s*(?:from\s+['"][^'"]+['"])?/g;
const NAME_RE = (n: string) => new RegExp(`\\b${n}\\b`);

describe('no alias exports (REQ-SURF-185)', () => {
  it('no X-R11 alias name is exported from any scan root', () => {
    const hits: string[] = [];
    for (const root of SCAN_ROOTS) {
      for (const file of walk(join(ROOT, root)) ?? []) {
        const text = readFileSync(file, 'utf8');
        for (const m of text.matchAll(EXPORT_RE)) {
          for (const a of ALIASES) {
            if (NAME_RE(a).test(m[0])) hits.push(`${file}: ${a}`);
          }
        }
      }
    }
    expect(hits).toEqual([]);
  });
  it('X-R11 remains a rejected row naming every alias', () => {
    const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8'));
    const r11 = ledger.rows.find((r: any) => r.id === 'X-R11');
    expect(r11.status).toBe('rejected');
    for (const a of ALIASES) expect(r11.names).toContain(a);
  });
});
