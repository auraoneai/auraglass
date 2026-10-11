/* MAT-308: A11y/FocusRing — every focusable part across scenes plus an
   aria-disabled row; the remote focus-appearance spec Tabs through them and
   measures the visible indicator on all 8 scenes x 3 engines. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HitArea } from '../HitArea';
import type { StoryAgParameters } from '../../contracts/testing';

const PARTS: Array<{ part: string; node: React.ReactNode }> = [
  { part: 'button', node: <button type="button" data-ag-part="button">Button</button> },
  { part: 'link', node: <a href="#focus" data-ag-part="link">Link</a> },
  { part: 'radio', node: <label><input type="radio" name="fr" data-ag-part="radio" /> Radio</label> },
  { part: 'checkbox', node: <label><input type="checkbox" data-ag-part="checkbox" /> Checkbox</label> },
  { part: 'switch', node: <label><input type="checkbox" role="switch" data-ag-part="switch" /> Switch</label> },
  { part: 'slider', node: <input type="range" data-ag-part="slider" aria-label="slider" /> },
  { part: 'text-input', node: <input type="text" data-ag-part="text-input" aria-label="text" /> },
  { part: 'tab', node: <button type="button" role="tab" data-ag-part="tab">Tab</button> },
  { part: 'menu-item', node: <button type="button" role="menuitem" data-ag-part="menu-item">Menu item</button> },
  { part: 'toast-action', node: <button type="button" data-ag-part="toast-action">Toast action</button> },
];

function FocusRingGrid() {
  return (
    <div style={{ padding: 16 }}>
      <p>Tab through every part; each must show a ≥3:1 ring on every scene.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {PARTS.map(({ part, node }) => (
          <div key={part} data-ag-surface="" data-ag-variant="regular"
            style={{ position: 'relative', padding: 16 }}>
            {node}
            <div style={{ fontSize: 10, opacity: 0.6, marginTop: 8 }}>{part}</div>
            <HitArea data-ag-part="hit-area" />
          </div>
        ))}
      </div>
      <div data-ag-surface="" data-ag-variant="regular" style={{ marginTop: 16, padding: 16 }}>
        <button type="button" data-ag-part="button" aria-disabled="true">aria-disabled button</button>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/FocusRing',
  component: FocusRingGrid,
  parameters: {
    layout: 'fullscreen',
    ag: { subject: 'A11yFocusRing', kind: 'matrix', scenes: 'all' } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj = {};
