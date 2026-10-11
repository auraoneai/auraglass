/* @jest-environment node */
/* REQ-PLAT-74 acceptance: a fragment containing !important, or a rule outside
   an @layer ag.* block, makes the css assembly fail. Offenders in other WPs'
   files ship only while they hold a row in REQ-FIN-14's expiring baseline
   (scripts/integration/baselines/css-files.json, FIN-A; PRD-F §4.3 rule 3),
   and that baseline is read fail-closed. Each case is a throwaway mini-repo
   handed to collectCssFragments as its root. */
import { afterEach, describe, expect, it } from '@jest/globals';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { collectCssFragments, CSS_FILES_BASELINE } from '../../scripts/build/lib/css.mjs';

const ORDER = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';
const roots: string[] = [];

function miniRepo(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'ag-css-frag-'));
  roots.push(root);
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), body);
  }
  return root;
}

const row = (file: string) => ({ file, layer: 'ag.components', bundle: 'styles.css', order: 10 });
const fragments = (...rows: object[]) => ({ 'fragments/css/cmp.json': JSON.stringify(rows) });
const baselineRow = { file: 'src/x/Bad.css', owner: 'CMP', reqFin: 'REQ-FIN-70', expires: 'RC-1' };
const expiryLib = (problems: string[]) =>
  `export function rowProblems() { return ${JSON.stringify(problems)}; }\n`;

afterEach(() => { for (const r of roots.splice(0)) rmSync(r, { recursive: true, force: true }); });

describe('css fragment validation (REQ-PLAT-74)', () => {
  it('accepts a self-layered fragment', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Good.css')),
      'src/x/Good.css': `${ORDER}\n@layer ag.components { .ag-x { color: CanvasText; } }\n`,
    });
    const out = await collectCssFragments(root);
    expect(out.map((f: { file: string }) => f.file)).toEqual(['src/x/Good.css']);
    expect(out[0].baselined).toBeUndefined();
  });

  it('rejects a fragment containing !important', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Bad.css')),
      'src/x/Bad.css': `${ORDER}\n@layer ag.components { .ag-x { color: red !important; } }\n`,
    });
    await expect(collectCssFragments(root)).rejects.toThrow(/src\/x\/Bad\.css: !important is forbidden/);
  });

  it('rejects a style rule outside an @layer ag.* block', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Bad.css')),
      'src/x/Bad.css': `${ORDER}\n@layer ag.components { .ag-x { color: CanvasText; } }\n.ag-y { color: CanvasText; }\n`,
    });
    await expect(collectCssFragments(root)).rejects.toThrow(/statement outside an @layer ag\.\* block: \.ag-y/);
  });

  it('rejects a non-contract layer name', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Bad.css')),
      'src/x/Bad.css': '@layer media { .ag-x { color: CanvasText; } }\n',
    });
    await expect(collectCssFragments(root)).rejects.toThrow(/@layer media is not a contract layer/);
  });

  it('ships a baselined offender, carrying the violation and its row', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Bad.css')),
      'src/x/Bad.css': '.ag-x { color: red !important; }\n',
      [CSS_FILES_BASELINE]: JSON.stringify([baselineRow]),
      'scripts/integration/lib/baseline-expiry.mjs': expiryLib([]),
    });
    const [entry] = await collectCssFragments(root);
    expect(entry.baselined).toMatch(/!important is forbidden \[BASELINED CMP REQ-FIN-70, expires RC-1\]/);
  });

  it('still rejects an offender that has no baseline row', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Bad.css'), row('src/x/Other.css')),
      'src/x/Bad.css': '.ag-x { color: CanvasText; }\n',
      'src/x/Other.css': '.ag-y { color: CanvasText; }\n',
      [CSS_FILES_BASELINE]: JSON.stringify([baselineRow]),
      'scripts/integration/lib/baseline-expiry.mjs': expiryLib([]),
    });
    await expect(collectCssFragments(root)).rejects.toThrow(/src\/x\/Other\.css: statement outside/);
  });

  it('fails when the baseline reports malformed or expired rows', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Bad.css')),
      'src/x/Bad.css': '.ag-x { color: CanvasText; }\n',
      [CSS_FILES_BASELINE]: JSON.stringify([baselineRow]),
      'scripts/integration/lib/baseline-expiry.mjs': expiryLib(['css assembly: expired baseline row src/x/Bad.css']),
    });
    await expect(collectCssFragments(root)).rejects.toThrow(/expired baseline row src\/x\/Bad\.css/);
  });

  it('fails closed when the baseline exists without its expiry rule', async () => {
    const root = miniRepo({
      ...fragments(row('src/x/Bad.css')),
      'src/x/Bad.css': '.ag-x { color: CanvasText; }\n',
      [CSS_FILES_BASELINE]: JSON.stringify([baselineRow]),
    });
    await expect(collectCssFragments(root)).rejects.toThrow(/baseline-expiry\.mjs \(its expiry rule\) is missing/);
  });
});
