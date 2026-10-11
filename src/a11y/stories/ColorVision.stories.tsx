/* MAT-314: A11y/ColorVision — the intent matrix (danger, warning, success,
   info, selected, current, invalid) plus an SVG feColorMatrix toggle that
   simulates protan/deutan/tritan so reviewers can eyeball the cues the
   color-vision e2e spec measures numerically. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { feColorMatrix } from '../../../tests/e2e/mat/helpers/machado';
import type { StoryAgParameters } from '../../contracts/testing';

const INTENTS = [
  ['danger', '#d92d20', 'Error / destructive'],
  ['warning', '#b54708', 'Warning'],
  ['success', '#067647', 'Success'],
  ['info', '#175cd3', 'Information'],
  ['selected', '#4f39f6', 'Selected'],
  ['current', '#5925dc', 'Current item'],
  ['invalid', '#d92d20', 'Invalid input'],
] as const;

function IntentMatrix() {
  const [filter, setFilter] = React.useState<'none' | 'protan' | 'deutan' | 'tritan'>('none');
  return (
    <div style={{ padding: 16 }}>
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="ag-cvd-protan"><feColorMatrix type="matrix" values={feColorMatrix('protan')} /></filter>
        <filter id="ag-cvd-deutan"><feColorMatrix type="matrix" values={feColorMatrix('deutan')} /></filter>
        <filter id="ag-cvd-tritan"><feColorMatrix type="matrix" values={feColorMatrix('tritan')} /></filter>
      </svg>
      <div role="group" aria-label="CVD simulation">
        {(['none', 'protan', 'deutan', 'tritan'] as const).map((f) => (
          <button key={f} type="button" data-ag-part="cvd-toggle" aria-pressed={filter === f}
            onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div style={filter === 'none' ? undefined : { filter: `url(#ag-cvd-${filter})` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 12 }}>
          {INTENTS.map(([name, color, desc]) => (
            <div
              key={name}
              data-ag-part="intent-cell"
              data-ag-intent={name}
              style={{ border: `2px solid ${color}`, padding: 12, borderRadius: 8 }}
            >
              <span data-ag-part="intent-icon" aria-label={name} style={{ color, fontWeight: 700 }}>
                {name === 'danger' || name === 'invalid' ? '✕' : name === 'warning' ? '⚠' : name === 'success' ? '✓' : 'i'}
              </span>{' '}
              <b style={{ color }}>{name}</b>
              <div style={{ fontSize: 11 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button type="button" data-ag-part="tab" aria-selected="true">FilterBar · All</button>
          <button type="button" data-ag-part="tab" aria-selected="false">Unread</button>
          <button type="button" data-ag-part="tab" aria-selected="false">Flagged</button>
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/ColorVision',
  component: IntentMatrix,
  parameters: {
    ag: { subject: 'A11yColorVision', kind: 'component', scenes: ['flat-white', 'flat-black'] } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj = {};
