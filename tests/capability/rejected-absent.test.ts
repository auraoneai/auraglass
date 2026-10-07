// tests/capability/rejected-absent.test.ts — REQ-SURF-185.
// Beyond X-R11 aliases, no rejected-name symbol ships on an export surface.
// Complements no-alias-exports with the full X-R01..R13 name set.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8'));
const BANNED = new Set<string>();
for (const r of ledger.rows) {
  if (r.status === 'rejected') for (const n of r.names) BANNED.add(String(n));
}

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/index\.(ts|tsx|mts)$/.test(name)) yield p;
  }
}

describe('rejected names absent from entry barrels', () => {
  it('no index barrel re-exports a rejected symbol', () => {
    const hits: string[] = [];
    for (const base of ['src', 'packages/labs/src']) {
      for (const f of walk(join(ROOT, base)) ?? []) {
        const text = readFileSync(f, 'utf8');
        for (const m of text.matchAll(/export\s+\{([^}]*)\}/g)) {
          const names = m[1]!.split(',').map((s) => s.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop());
          for (const n of names) if (n && BANNED.has(n)) hits.push(`${f}: ${n}`);
        }
        for (const m of text.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g)) {
          if (BANNED.has(m[1]!)) hits.push(`${f}: ${m[1]}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
