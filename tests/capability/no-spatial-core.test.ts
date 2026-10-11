// tests/capability/no-spatial-core.test.ts — REQ-SURF-05/165 (S-47).
// three, @react-three/* imports and navigator.xr exist only inside src/three/**.
// Directory-absent scans are a clean pass at day 0; they tighten as lanes land.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const PATTERN = /from\s+['"](?:three|@react-three\/[^'"]+)['"]|\bnavigator\.xr\b|\bWebXRManager\b|\bXRSession\b/;

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|mts|cts|js|jsx)$/.test(name)) yield p;
  }
}

describe('no spatial machinery outside src/three', () => {
  it('src/** outside src/three has no three/@react-three/xr reference', () => {
    const hits: string[] = [];
    for (const f of walk(join(ROOT, 'src')) ?? []) {
      if (f.includes(`${join(ROOT, 'src/three')}`)) continue;
      const text = readFileSync(f, 'utf8');
      text.split('\n').forEach((line, i) => {
        if (PATTERN.test(line)) hits.push(`${f}:${i + 1}`);
      });
    }
    expect(hits).toEqual([]);
  });
  it('src/three exists only as a src/three tree (OI-01: empty at 5.0)', () => {
    const three = join(ROOT, 'src/three');
    if (existsSync(three)) {
      // OI-01 pins the 5.0 contract: index.ts exports nothing.
      const idx = join(three, 'index.ts');
      if (existsSync(idx)) {
        const text = readFileSync(idx, 'utf8');
        expect(text).not.toMatch(/export\s+\{[^}]*[A-Za-z]/);
      }
    }
  });
});
