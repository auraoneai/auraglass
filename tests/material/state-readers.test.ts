/* REQ-FIN-02 (REQ-MAT-09): every emitted --_ag-state-* private scalar must have
   a var() reader in material.css — a state token nothing reads is a dead spec.
   Emitted set = the ag.cssVar names in tokens/sys/interaction.tokens.json
   (the compiler's contract) plus any --_ag-state-* declared in generated css. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '..', '..');
const MATERIAL_CSS = readFileSync(join(ROOT, 'src/material/css/material.css'), 'utf8');

const collectEmitted = (): Set<string> => {
  const names = new Set<string>();
  const tokens = JSON.parse(readFileSync(join(ROOT, 'tokens/sys/interaction.tokens.json'), 'utf8'));
  const walk = (o: unknown): void => {
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (k === 'ag.cssVar' && typeof v === 'string' && v.startsWith('--_ag-state-')) names.add(v);
      else if (typeof v === 'object') walk(v);
    }
  };
  walk(tokens);
  // plus any --_ag-state-* declared inside generated css (compiler outputs)
  const gen = join(ROOT, 'src/material/css/generated');
  if (existsSync(gen)) {
    for (const f of readdirSync(gen)) {
      if (!f.endsWith('.css')) continue;
      for (const m of readFileSync(join(gen, f), 'utf8').matchAll(/--_ag-state-[a-z-]+/g)) names.add(m[0]);
    }
  }
  return names;
};

describe('REQ-FIN-02 state readers', () => {
  it('every emitted --_ag-state-* has a var() reader in material.css', () => {
    const emitted = [...collectEmitted()].sort();
    expect(emitted.length).toBeGreaterThanOrEqual(9);
    const unread = emitted.filter((v) => !MATERIAL_CSS.includes(`var(${v}`));
    expect(unread).toEqual([]);
  });

  it('reads at least 9 distinct --_ag-state-* vars (AC-FIN-02)', () => {
    const read = new Set([...MATERIAL_CSS.matchAll(/var\((--_ag-state-[a-z-]+)/g)].map((m) => m[1]));
    expect(read.size).toBeGreaterThanOrEqual(9);
  });

  it('no .ag-surface class selector survives in src/material/css (AC-FIN-02)', () => {
    for (const f of ['material.css', 'lens.css']) {
      const css = readFileSync(join(ROOT, 'src/material/css', f), 'utf8');
      expect(css).not.toMatch(/\.ag-surface/);
    }
  });

  it('state section carries forced-colors + contrast-more forms (REQ-MAT-09)', () => {
    const forced = MATERIAL_CSS.slice(MATERIAL_CSS.indexOf('@media (forced-colors: active)'));
    expect(forced).toContain('Highlight');
    expect(forced).toContain('GrayText');
    expect(MATERIAL_CSS).toContain('[data-ag-contrast="more"]');
  });
});
