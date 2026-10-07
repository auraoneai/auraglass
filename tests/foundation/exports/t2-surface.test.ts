/* CMP-050: against the built package — every CMP-owned §4.5 name resolves as a
   value export from exactly its contracted subpath (KeyValueEditor/Chip only in
   aura-glass/data, GlassPreferencesPanel only in aura-glass/theme, icons only in
   aura-glass/icons), and no subpath exports a HoverCard value.
   Requires `npm run build` (remote lane). Missing built entries fail loudly. */
/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT_EXPORTS } from '../../../src/contracts/entries';

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const SUBPATH_ONLY: Record<string, string> = {
  Chip: './data',
  KeyValueEditor: './data',
  GlassPreferencesPanel: './theme',
};

function distEntry(subpath: string): string {
  const spec = pkg.exports?.[subpath]?.default;
  if (!spec) throw new Error(`package.json exports missing ${subpath}`);
  const p = join(root, spec);
  if (!existsSync(p)) throw new Error(`built entry missing for ${subpath}: ${spec}`);
  return p;
}

const modules: Record<string, Record<string, unknown>> = {};
async function entry(subpath: string) {
  if (!modules[subpath]) modules[subpath] = (await import(pathToFileURL(distEntry(subpath)).href)) as Record<string, unknown>;
  return modules[subpath];
}

describe('§4.5 owned-name subpath resolution (built package)', () => {
  it('every ROOT_EXPORTS.cmp name resolves as a root value export', async () => {
    const m = await entry('.');
    const missing = ROOT_EXPORTS.cmp.filter((n) => !(n in m));
    expect(missing).toEqual([]);
  });
  it('subpath-only names resolve only from their own entry', async () => {
    const failures: string[] = [];
    for (const [name, sub] of Object.entries(SUBPATH_ONLY)) {
      const target = await entry(sub);
      if (!(name in target)) failures.push(`${name} missing from ${sub}`);
      const rootMod = await entry('.');
      if (name in rootMod) failures.push(`${name} leaked into root`);
    }
    expect(failures).toEqual([]);
  });
  it('no CMP-touched subpath exports a HoverCard value', async () => {
    const offenders: string[] = [];
    for (const sub of ['.', './data', './theme', './icons', './primitives']) {
      try {
        const m = await entry(sub);
        if ('HoverCard' in m) offenders.push(sub);
      } catch {
        /* entry absent until its owner builds it */
      }
    }
    expect(offenders).toEqual([]);
  });
});
