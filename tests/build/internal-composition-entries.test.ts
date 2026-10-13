/* @jest-environment node */
/* REQ-QUAL-56 x REQ-CMP-06 / REQ-SURF-124: in-repo-only exports whose only
   consumers are stories importing the module by relative path (SourceScope,
   ComboboxLoading) are tree-shaken out of the module's dist twin unless the
   module is a tsdown entry of its own. internalCompositionEntries lists
   exactly those modules for tsdown.config.ts — never as manifest/package
   subpaths — and only while a shipped entry reaches them seed-free. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Graph = typeof import('../../scripts/build/lib/graph.mjs');
let g: Graph;
let keep: ReturnType<Graph['buildableEntries']>['keep'];

beforeAll(async () => {
  g = await import('../../scripts/build/lib/graph.mjs');
  keep = g.buildableEntries().keep;
});

const EXPECTED: Array<{ source: string; name: string; consumer: string }> = [
  { source: 'src/ai/sources/SourceList.tsx', name: 'SourceScope', consumer: 'src/ai/sources/Sources.stories.tsx' },
  { source: 'src/components/combobox/Combobox.client.tsx', name: 'ComboboxLoading', consumer: 'stories/cmp/components/Combobox.stories.tsx' },
  { source: 'src/components/color-picker/colors.ts', name: 'hsvToHex', consumer: 'src/components/color-picker/ColorPicker.client.tsx' },
  { source: 'src/components/control-shared/size.ts', name: 'DEFAULT_CONTROL_SIZE', consumer: 'src/components/combobox/Combobox.client.tsx' },
  { source: 'src/data/filter-bar/filter-model.ts', name: 'emptyGroup', consumer: 'src/data/filter-bar/filter-model-ops.ts' },
  { source: 'src/date/legacy-bridge.ts', name: 'toDateValue', consumer: 'src/compat/surf/date/shared.ts' },
  { source: 'src/date/useContainerWidth.ts', name: 'SHEET_BELOW_PX', consumer: 'src/date/DatePicker.tsx' },
  { source: 'src/motion/ticker.ts', name: 'scheduleFrame', consumer: 'src/ai/thread/useThreadScroll.ts' },
  { source: 'src/motion/tokens.generated.ts', name: 'motionTokens', consumer: 'src/motion/adapter/springs.ts' },
  { source: 'src/theme/color.ts', name: 'formatOklch', consumer: 'src/components/color-picker/colors.ts' },
  { source: 'src/tokens/generated/presets.ts', name: 'PRESET_SCOPE', consumer: 'src/theme/presets.ts' },
];

describe('internal composition entries (REQ-QUAL-56)', () => {
  it('lists exactly the modules carrying story- or cross-module-consumed in-repo exports', () => {
    expect(g.internalCompositionEntries(keep)).toEqual(
      EXPECTED.map(({ source }) => ({ source, internal: true })),
    );
  });

  it('each listed module exports an in-repo name referenced by its consumer', () => {
    for (const { source, name, consumer } of EXPECTED) {
      const text = readFileSync(join(g.ROOT, source), 'utf8');
      expect(new RegExp(`export\\s+(?:(?:function|const|class)\\s+|\\{[^}]*\\b)${name}\\b`).test(text)).toBe(true);
      expect(readFileSync(join(g.ROOT, consumer), 'utf8')).toContain(name);
    }
  });

  it('none is a manifest entry source or a package subpath', () => {
    const manifestSources = new Set(g.manifestEntries().js.map((e) => e.source));
    const pkg = JSON.parse(readFileSync(join(g.ROOT, 'package.json'), 'utf8')) as { exports?: Record<string, unknown> };
    for (const { source } of EXPECTED) {
      expect(manifestSources.has(source)).toBe(false);
      const stem = source.replace(/^src\//, '').replace(/\.tsx?$/, '');
      expect(pkg.exports?.[`./${stem}`]).toBeUndefined();
    }
  });

  it('gates on shipped reachability: empty keep yields nothing', () => {
    expect(g.internalCompositionEntries([])).toEqual([]);
  });

  it('tsdown.config.ts spreads the internal entries into its entry map', () => {
    expect(readFileSync(join(g.ROOT, 'tsdown.config.ts'), 'utf8')).toContain('internalCompositionEntries(keep)');
  });
});
