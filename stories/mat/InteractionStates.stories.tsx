/* stories/mat/InteractionStates.stories.tsx — MAT-335 (REQ-MAT-09, SC-38).
   MAT Surface interactive forced into each state via the data-* hooks. Button/
   IconButton/Tabs item/Table row rows are omitted until those 5.0 components
   exist (CTL-055 first) — no placeholders. Play asserts disabled sets no host
   opacity (now), and per-state computed deltas once a --ag-state-* rule exists
   in the loaded sheets (pending otherwise). Light response only, no press
   scale. Plain assertions until @storybook/test is installed (PLAT-frozen
   package.json). Scheme comes from the `scheme` global, not a story-written
   data-ag-theme (REQ-FIN-59 / D.3-38). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../src/material/index';
import type { StoryAgParameters } from '../../src/contracts/testing';
import { PendingCallout } from './_shared';

const STATE_HOOKS = [
  { state: 'hover', attrs: { 'data-ag-hover': 'true' }, via: 'real :hover + data' },
  { state: 'active', attrs: { 'data-pressed': 'true' }, via: 'data-pressed' },
  { state: 'selected', attrs: { 'data-selected': 'true' }, via: 'data-selected' },
  { state: 'focus-visible', attrs: {}, via: 'real focus ring' },
  { state: 'disabled', attrs: { 'data-disabled': 'true' }, via: 'data-disabled' },
  { state: 'loading', attrs: { 'data-loading': 'true' }, via: 'data-loading' },
  { state: 'dragging', attrs: { 'data-dragging': 'true' }, via: 'data-dragging' },
  { state: 'drop-target', attrs: { 'data-drop-target': 'true' }, via: 'data-drop-target' },
] as const;

function StateGrid() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {STATE_HOOKS.map(({ state, attrs, via }) => (
        <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <code style={{ width: 110 }}>{state}</code>
          <Surface
            interactive
            {...attrs}
            className={`ag-statetest ag-statetest-${state}`}
            tabIndex={state === 'focus-visible' ? 0 : -1}
          >
            <span style={{ display: 'block', padding: 16 }}>Surface — {state}</span>
          </Surface>
          <span style={{ fontSize: 12, opacity: 0.65 }}>{via}</span>
        </div>
      ))}
      <PendingCallout what="Button / IconButton / Tabs item / Table row rows — pending CTL-055 (CMP lane)" />
    </div>
  );
}

const meta: Meta = {
  title: 'MAT/Interaction States',
  parameters: {
    layout: 'padded',
    ag: { subject: 'Surface', kind: 'lab' } satisfies StoryAgParameters,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  globals: { scheme: 'light' },
  render: () => <StateGrid />,
  play: async ({ canvasElement }) => {
    const disabled = canvasElement.querySelector('.ag-statetest-disabled');
    if (!(disabled instanceof HTMLElement)) throw new Error('InteractionStates: disabled row missing');
    // Disabled must never dim the host — assertable against the seed already.
    if (getComputedStyle(disabled).opacity !== '1') {
      throw new Error(`InteractionStates: disabled sets host opacity ${getComputedStyle(disabled).opacity}`);
    }

    let stateTokenSeen = false;
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (/--ag-state-/.test(rule.cssText)) { stateTokenSeen = true; break; }
        }
      } catch { /* cross-origin sheet */ }
      if (stateTokenSeen) break;
    }
    if (!stateTokenSeen) {
      console.info('pending: no --ag-state-* token rules loaded (styles layer MAT-341 blocked) — per-state computed-delta assertion activates when they land');
      return;
    }
    const rows = Array.from(canvasElement.querySelectorAll('.ag-statetest')) as HTMLElement[];
    let changed = 0;
    for (const el of rows) {
      const baseline = el.cloneNode(true) as HTMLElement;
      baseline.removeAttribute('data-pressed');
      baseline.removeAttribute('data-selected');
      baseline.removeAttribute('data-disabled');
      baseline.removeAttribute('data-loading');
      baseline.removeAttribute('data-dragging');
      baseline.removeAttribute('data-drop-target');
      baseline.removeAttribute('data-ag-hover');
      el.parentElement?.appendChild(baseline);
      const delta = getComputedStyle(el).cssText !== getComputedStyle(baseline).cssText;
      baseline.remove();
      if (delta) changed += 1;
    }
    if (changed < 1) {
      throw new Error('InteractionStates: no state row changed any computed property despite --ag-state-* rules');
    }
  },
};
