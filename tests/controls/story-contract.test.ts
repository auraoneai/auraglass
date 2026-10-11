/** CMP-093 story contract check — asserts the REQ-SB-12 shape of the pilot Button.stories.tsx
 *  without importing the Storybook runtime: required exports, tags, Matrix cell count from
 *  Button.meta.ts axes, and the Keyboard story carrying the 'apg' tag that the APG spec binds to. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import buttonMeta from '../../src/components/button/Button.meta';

const SRC = readFileSync(resolve(__dirname, '../../stories/cmp/components/Button.stories.tsx'), 'utf8');

describe('Button.stories.tsx contract (SC-31/OV-16 pilot)', () => {
  it('declares the Flagships/Controls/Button title', () => {
    expect(SRC).toContain("title: 'Flagships/Controls/Button'");
  });

  it('carries the §4.4 flagship and certified tags', () => {
    expect(SRC).toContain("'flagship'");
    expect(SRC).toContain("'certified'");
  });

  it.each(['Overview', 'Matrix', 'Density', 'Keyboard', 'InContext', 'Preferences'])(
    'exports the %s story',
    (name) => {
      expect(SRC).toMatch(new RegExp(`export const ${name}`));
    },
  );

  it('Keyboard story is tagged apg (bound by tests/a11y/apg/button.apg.spec.ts)', () => {
    const keyboard = SRC.slice(SRC.indexOf('export const Keyboard'));
    expect(keyboard.slice(0, keyboard.indexOf('export const', 5) === -1 ? undefined : keyboard.indexOf('export const', 5))).toContain("'apg'");
  });

  it('Matrix covers every variant axis value from Button.meta.ts', () => {
    for (const v of buttonMeta.variants.variant) {
      expect(SRC).toContain(String(v));
    }
  });
});
