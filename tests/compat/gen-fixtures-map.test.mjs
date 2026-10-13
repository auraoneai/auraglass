/* @jest-environment node */
/* tests/compat/gen-fixtures-map.test.mjs — CMP-054: the fixtures-map
   generator's dest rules and drift against the committed map. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { buildFixturesMap, renderFixturesMap } from '../../scripts/compat/gen-fixtures-map.mjs';

const row = (name, dest, pub = true) => ({ name, dest, pub, target: 'Target' });

describe('buildFixturesMap', () => {
  it('fragment compat promise wins (flagship appendix row)', () => {
    const map = buildFixturesMap(
      [row('GlassButton', 'compat')],
      [{ symbol: 'GlassButton', compat: 'GlassButton', replacement: 'Button' }],
    );
    expect(map.GlassButton).toEqual({ target: 'Button', dest: 'compat' });
  });

  it('appendix-compat without a fragment promise is removed (consolidated)', () => {
    const map = buildFixturesMap([row('GlassPanel', 'compat')], []);
    expect(map.GlassPanel.dest).toBe('removed');
  });

  it('an entry without compat removes; registry:/labs: replacements route', () => {
    const map = buildFixturesMap(
      [row('Gone', 'compat'), row('ToRegistry', 'registry'), row('ToLabs', 'labs')],
      [
        { symbol: 'Gone', replacement: 'presets (no picker ships)' },
        { symbol: 'ToRegistry', replacement: 'registry:ok-item' },
        { symbol: 'ToLabs', replacement: 'labs:Field' },
      ],
    );
    expect(map.Gone.dest).toBe('removed');
    expect(map.ToRegistry.dest).toBe('registry');
    expect(map.ToLabs.dest).toBe('labs');
  });

  it('a compat promise on any duplicate-symbol entry wins', () => {
    const map = buildFixturesMap(
      [row('MagneticButton', 'compat')],
      [
        { symbol: 'MagneticButton', replacement: 'Button' },
        { symbol: 'MagneticButton', compat: 'MagneticButton', replacement: 'Button' },
      ],
    );
    expect(map.MagneticButton.dest).toBe('compat');
  });

  it('skips private rows and non-leaving dests', () => {
    const map = buildFixturesMap([row('Private', 'compat', false), row('Kept', 'core')], []);
    expect(Object.keys(map)).toEqual([]);
  });
});

describe('committed fixtures map', () => {
  it('equals the generator output (no drift)', async () => {
    const root = process.cwd();
    const committed = readFileSync(join(root, 'tests/compat/fixtures-map.json'), 'utf8');
    expect(committed).toBe(await renderFixturesMap(root));
  });
});
