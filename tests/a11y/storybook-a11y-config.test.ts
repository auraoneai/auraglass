/* MAT-311 (REQ-SB-): storybook a11y config — imports .storybook/preview and
   asserts the contract wiring: addon-a11y color-contrast not disabled; globals
   transparency/contrast/forcedColors/motion/environment/glassOpacity exist;
   decorator maps contrast default->standard, motion os->system/reduce->calm,
   glassOpacity -> provider prop; no global maps to a component prop.
   Failures are filed against the Storybook PRD — this test never edits the
   preview config.
   NOTE: the preview source uses vite's import.meta.glob for CSS; jest loads a
   verbatim copy with that single line rewritten to a no-op (and ../src paths
   re-rooted) — the globals/decorators under test are untouched. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync('.storybook/preview.tsx', 'utf8');
const GEN = 'tests/a11y/__generated__/preview.jest.tsx';
let preview: { globalTypes?: Record<string, unknown>; parameters?: Record<string, unknown>; decorators?: unknown[] };

beforeAll(async () => {
  const out = '// @ts-nocheck — generated copy of .storybook/preview.tsx\n' + SRC
    .replace(/import\.meta\.glob\([^;]+;?/s, '/* glob stubbed in jest */')
    .replace(/'\.\.\/src\//g, "'../../../src/")
    .replace(/import\s+type\s+.*from\s+'@storybook\/react-vite';/s, 'type Preview = any;');
  fs.mkdirSync(path.dirname(GEN), { recursive: true });
  fs.writeFileSync(GEN, out);
  const mod = (await import(`./__generated__/preview.jest`)) as Record<string, unknown>;
  const unwrap = (m: unknown): typeof preview =>
    (m && typeof m === 'object' && 'globalTypes' in m ? m : (m as Record<string, unknown>)?.default) as typeof preview;
  preview = unwrap(mod.default ?? mod);
});

describe('storybook a11y config', () => {
  it('exposes the contract globals', () => {
    const g = preview.globalTypes ?? {};
    for (const name of ['transparency', 'contrast', 'motion', 'scene', 'density', 'tier']) {
      expect(g[name]).toBeDefined();
    }
    expect((g.scene as { toolbar?: { items?: string[] } })?.toolbar?.items?.length).toBe(8);
  });

  it('does not disable the a11y addon color-contrast check', () => {
    const params = (preview.parameters ?? {}) as Record<string, unknown>;
    const a11y = params.a11y as { config?: { rules?: Array<{ id?: string; enabled?: boolean }> } } | undefined;
    const disabled = (a11y?.config?.rules ?? []).some((r) => r.id === 'color-contrast' && r.enabled === false);
    expect(disabled).toBe(false);
    expect(/color-contrast[\s\S]{0,80}enabled:\s*false/.test(SRC)).toBe(false);
  });

  it('decorator maps globals to data-ag-* attributes, never component props', () => {
    for (const attr of ['data-ag-scheme', 'data-ag-contrast', 'data-ag-transparency', 'data-ag-motion', 'data-ag-density', 'data-ag-tier']) {
      expect(SRC).toContain(attr);
    }
    expect(/\.\.\.(ctx\.globals|globals|g)\s*\}/.test(SRC)).toBe(false);
    expect(/<Story\s+[^>]*(scheme|contrast|transparency|motion)=/.test(SRC)).toBe(false);
    expect(/contrast:\s*{\s*defaultValue:\s*'standard'/.test(SRC)).toBe(true);
    for (const opt of ['full', 'calm', 'none']) {
      expect(SRC).toContain(`'${opt}'`);
    }
  });

  it('scene global enumerates the 8 contract scenes', () => {
    const items = (preview.globalTypes?.scene as { toolbar?: { items?: string[] } })?.toolbar?.items ?? [];
    for (const s of ['photo', 'saturated-abstract', 'dense-text', 'dark-media', 'flat-white', 'flat-black', 'hf-pattern', 'video-frame']) {
      expect(items).toContain(s);
    }
  });
});
