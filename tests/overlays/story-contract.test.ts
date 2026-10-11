/* @jest-environment node */
/* CMP-261 (SC-31/OVL-055): Dialog.stories.tsx contract — Flagships/Overlays
   title, flagship+certified tags, Playground opens via defaultOpen, stable
   overlays-dialog--* ids on every story, meta axis coverage for size. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import dialogMeta from '../../src/components/dialog/Dialog.meta';
import sheetMeta from '../../src/components/sheet/Sheet.meta';

const SRC = readFileSync(join(process.cwd(), 'stories/cmp/components/Dialog.stories.tsx'), 'utf8');
const SHEET_SRC = readFileSync(join(process.cwd(), 'stories/cmp/components/Sheet.stories.tsx'), 'utf8');
const ALERT_SRC = readFileSync(join(process.cwd(), 'stories/cmp/components/AlertDialog.stories.tsx'), 'utf8');

describe('overlay story contracts (CMP-261)', () => {
  it('Dialog.stories.tsx: Flagships/Overlays/Dialog title + certified/flagship tags', () => {
    expect(SRC).toContain("title: 'Flagships/Overlays/Dialog'");
    expect(SRC).toContain("'flagship'");
    expect(SRC).toContain("'certified'");
  });

  it('Dialog Playground opens via defaultOpen (story is interactive on load)', () => {
    const pg = SRC.slice(SRC.indexOf('export const Playground'));
    const body = pg.slice(0, pg.indexOf('export const', 5) === -1 ? undefined : pg.indexOf('export const', 5));
    expect(body).toContain('defaultOpen');
    expect(body).toContain('Dialog.Trigger');
  });

  it('every overlay story carries a stable overlays-* id', () => {
    for (const [file, src, prefix] of [
      ['Dialog.stories.tsx', SRC, 'overlays-dialog--'],
      ['Sheet.stories.tsx', SHEET_SRC, 'overlays-sheet--'],
      ['AlertDialog.stories.tsx', ALERT_SRC, 'overlays-alert-dialog--'],
    ] as const) {
      const stories = src.match(/export const (\w+): Story/g) ?? [];
      const ids = src.match(/id: '([^']+)'/g) ?? [];
      expect(ids.length).toBeGreaterThanOrEqual(stories.length);
      for (const id of ids) expect(id).toContain(`'${prefix}`);
      void file;
    }
  });

  it('Sheet.stories.tsx covers the six contract scenes', () => {
    for (const s of ['RightPanel', 'LeftPanelRTL', 'BottomDetents', 'ActionPreset', 'NonModalInspector', 'FullHeight']) {
      expect(SHEET_SRC).toContain(`export const ${s}`);
    }
  });

  it('meta size axis values appear in the Dialog story file (args or scene)', () => {
    for (const v of (dialogMeta.variants.size ?? []) as readonly string[]) {
      expect(SRC + SHEET_SRC).toContain(v);
    }
    void sheetMeta;
  });
});
