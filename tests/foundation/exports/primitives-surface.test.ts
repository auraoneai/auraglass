/* CMP-036: against the built package — aura-glass/primitives runtime keys equal
   exactly the six frozen names; the root entry has no legacy Glass* primitive
   re-exports. Requires `npm run build` first (remote lane runs it). */
/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function distEntry(subpath: string): string {
  const spec = pkg.exports?.[subpath]?.default;
  if (!spec) throw new Error(`package.json exports missing ${subpath}`);
  const p = join(root, spec);
  if (!existsSync(p)) throw new Error(`built entry missing for ${subpath}: ${spec} (run npm run build)`);
  return p;
}

describe('aura-glass/primitives surface', () => {
  it('runtime keys equal exactly the six names', async () => {
    const mod = (await import(pathToFileURL(distEntry('./primitives')).href)) as Record<string, unknown>;
    expect(Object.keys(mod).sort()).toEqual(
      ['DismissableLayer', 'FocusScope', 'Label', 'Portal', 'Slot', 'VisuallyHidden'].sort(),
    );
  });
  it('root entry exports no legacy Glass* primitive names', async () => {
    const mod = (await import(pathToFileURL(distEntry('.')).href)) as Record<string, unknown>;
    const offenders = Object.keys(mod).filter((k) =>
      /^Glass(Slot|Portal|FocusScope|DismissableLayer|LabelPrimitive|RovingFocusGroup|Positioner)$/.test(k) ||
      k === 'LabelRoot',
    );
    expect(offenders).toEqual([]);
  });
});
