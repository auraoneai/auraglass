/* MAT-308: A11y/Targets — fine vs coarse hit targets rendered with HitArea and
   a story-local debug outline so the remote target-size spec can measure rects
   and detect hit-area overlap / host-layout drift. REQ-MAT-27: story-only
   markers are plain data-* (never unregistered data-ag-*); the outline rule is
   scoped to this story instead of shipping in targets.css. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HitArea } from '../HitArea';
import type { StoryAgParameters } from '../../contracts/testing';

function IconButton({ label, small }: { label: string; small?: boolean }) {
  return (
    <button
      type="button"
      data-ag-part="icon-button"
      data-small={small ? '' : undefined}
      aria-label={label}
      data-ag-hit-clamp="both"
      style={{ position: 'relative', width: 24, height: 24 }}
    >
      {label}
      <HitArea data-ag-part="hit-area" />
    </button>
  );
}

const DEBUG_TARGETS_CSS =
  '[data-debug-targets] [data-ag-part="hit-area"] { outline: 1px dashed var(--ag-color-focus-outer, Highlight); }';

function Targets() {
  return (
    <div data-debug-targets="" style={{ padding: 16 }}>
      <style>{DEBUG_TARGETS_CSS}</style>
      <p>Fine pointer: 24×24. Coarse: ≥44×44 (HitArea inflates in coarse media).</p>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <IconButton label="←" />
        <IconButton label="×" />
        <IconButton label="✓" />
        <IconButton label="…" small />
        <button type="button" data-ag-part="button" data-ag-hit-clamp="none" style={{ position: 'relative' }}>
          Normal button
          <HitArea data-ag-part="hit-area" />
        </button>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 4 }}>
        <input type="checkbox" data-ag-part="checkbox" aria-label="check" style={{ position: 'relative' }} />
        <input type="radio" data-ag-part="radio" name="tg" aria-label="radio" style={{ position: 'relative' }} />
        <input type="range" data-ag-part="slider" aria-label="slider" />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/Targets',
  component: Targets,
  parameters: {
    ag: { subject: 'A11yTargets', kind: 'component', scenes: ['flat-white', 'flat-black'] } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj = {};
export const DebugTargets: StoryObj = {};
