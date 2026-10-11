/* REQ-QUAL-08 (FIN-428): certification/scenes/Scenes.stories.tsx contract.
   Asserts the 8 story ids scenes--<id> (SCENE_ASSETS.storyId), tag `scene`, parameters.ag {subject:'scene:<id>', kind:'scene'},
   the scene global, and — rendered — 12 [data-ag-surface] cells (4 materials × 3 thicknesses, 2-line label + paragraph),
   the 6 flagship roots, and a root data-ag-backdrop equal to scenes.manifest.json.
   The storybook index.json half of QUAL-08 (exactly these ids in the built Storybook) runs on qual:build:storybook output. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { isExportStory, storyNameFromExport, toId } from 'storybook/internal/csf';
import * as stories from '../../certification/scenes/Scenes.stories';
import { AuraGlassProvider } from '../../src/index';
import { SCENES, SCENE_ASSETS, SCENE_BACKDROP, type SceneId } from '../../src/contracts/testing';

const ROOT = join(__dirname, '../..');
const manifest = JSON.parse(readFileSync(join(ROOT, SCENE_ASSETS.manifest), 'utf8')) as Record<SceneId, { backdrop: string }>;
const meta = stories.default as { title: string; tags?: string[] };
const storyExports = Object.keys(stories).filter((k) => k !== 'default' && isExportStory(k, stories.default as never));
type ComposedStory = React.ComponentType & { parameters: { ag?: unknown }; globals?: unknown; tags: string[] };
const composed = composeStories(stories) as unknown as Record<string, ComposedStory>;
const idOf = (exportName: string) => toId(meta.title, storyNameFromExport(exportName));
const exportFor = (scene: SceneId) => {
  const name = storyExports.find((k) => idOf(k) === SCENE_ASSETS.storyId(scene));
  if (!name) throw new Error(`no story export for ${SCENE_ASSETS.storyId(scene)}`);
  return name;
};

const FLAGSHIP_ROOTS: Record<string, string> = {
  Button: '.ag-button[data-ag-part="root"]',
  SegmentedControl: '.ag-segmented-control[data-ag-part="root"]',
  Slider: '.ag-slider[data-ag-part="root"]',
  TextField: '.ag-text-field[data-ag-part="root"]',
  Switch: '.ag-switch[data-ag-part="root"]',
  Toast: '.ag-toast[data-ag-part="root"]',
};

afterEach(() => cleanup());

describe('Scenes.stories.tsx (REQ-QUAL-08)', () => {
  it('exports exactly the 8 scene story ids', () => {
    expect(storyExports.map(idOf).sort()).toEqual(SCENES.map((s) => SCENE_ASSETS.storyId(s)).sort());
  });

  it('tags every story `scene`', () => {
    expect(meta.tags).toEqual(['scene']);
  });

  it.each(SCENES)('%s: parameters.ag and globals.scene', (scene) => {
    const story = composed[exportFor(scene)]!;
    expect(story.parameters.ag).toEqual({ subject: `scene:${scene}`, kind: 'scene' });
    expect(story.globals).toEqual({ scene });
    expect(story.tags).toEqual(expect.arrayContaining(['scene']));
  });

  it('manifest backdrop matches the frozen SCENE_BACKDROP for every scene', () => {
    expect(Object.fromEntries(SCENES.map((s) => [s, manifest[s].backdrop]))).toEqual(SCENE_BACKDROP);
  });

  it.each(SCENES)('%s: renders 12 surface cells + 6 flagship roots over the manifest backdrop', async (scene) => {
    const Story = composed[exportFor(scene)]!;
    const warn = jest.spyOn(console, 'warn'); const error = jest.spyOn(console, 'error');
    let view!: ReturnType<typeof render>;
    // the preview decorator mounts AuraGlassProvider around every story (S-41); mirror it here
    await act(async () => { view = render(React.createElement(AuraGlassProvider, null, React.createElement(Story))); });
    const root = view.container.querySelector('[data-ag-backdrop]') as HTMLElement;
    expect(root).not.toBeNull();
    expect(root.querySelector('[data-ag-scene-strip]')).not.toBeNull();
    expect(root.getAttribute('data-ag-backdrop')).toBe(manifest[scene].backdrop);

    const cells = Array.from(root.querySelectorAll<HTMLElement>('[data-ag-scene-cell]'));
    expect(cells).toHaveLength(12);
    expect(root.querySelectorAll('[data-ag-scene-cell][data-ag-surface]')).toHaveLength(12);
    const combos = cells.map((c) => c.getAttribute('data-ag-scene-cell')).sort();
    const expected = ['regular', 'clear', 'identity', 'content-raised']
      .flatMap((m) => ['thin', 'regular', 'thick'].map((t) => `${m}/${t}`)).sort();
    expect(combos).toEqual(expected);
    for (const cell of cells) {
      const [m, t] = cell.getAttribute('data-ag-scene-cell')!.split('/');
      expect(cell.getAttribute('data-ag-thickness')).toBe(t);
      if (m === 'content-raised') {
        expect(cell.getAttribute('data-ag-layer')).toBe('content');
        expect(cell.getAttribute('data-ag-content')).toBe('content-raised');
      } else {
        expect(cell.getAttribute('data-ag-variant')).toBe(m);
      }
      const label = cell.querySelector('p:first-child')!;
      expect(Array.from(label.children).map((s) => s.textContent)).toEqual([m, t]);
      expect(cell.querySelectorAll('p')).toHaveLength(2);
    }

    for (const [name, selector] of Object.entries(FLAGSHIP_ROOTS)) {
      const found = document.querySelectorAll(selector);
      if (found.length !== 1) throw new Error(`${scene}: expected exactly one ${name} root (${selector}), found ${found.length}`);
    }
    expect(warn.mock.calls).toEqual([]);
    expect(error.mock.calls).toEqual([]);
    warn.mockRestore(); error.mockRestore();
  });
});
