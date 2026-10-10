/* stories/mat/ContrastFloors.stories.tsx — MAT-337 (REQ-MAT-03).
   Renders tokens/generated/opacity-floors.json as a table: rows
   transparency x thickness x backdrop; columns preset x scheme x contrast;
   floorAlpha, minRatio and the WCAG band as text in every cell (no story-
   supplied tint, ink or background: REQ-FIN-59 / REQ-FIN-106, D.3-38). Reports pending until lane 2a-T generates the
   floors file — no hand-typed values. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import type { StoryAgParameters } from '../../src/contracts/testing';
import { PendingCallout, globJson } from './_shared';

interface FloorRow {
  transparency?: string;
  thickness?: string;
  backdrop?: string;
  cells?: Record<string, { floorAlpha?: number | string; minRatio?: number | string }>;
  [k: string]: unknown;
}

const floors = globJson('/tokens/generated/opacity-floors.json');

/** WCAG band for a cell's minRatio, as text: colour is never the carrier and
    the story paints no ink or background of its own (REQ-FIN-59 / D.3-38). */
function band(ratio: number | string | undefined): string {
  const r = Number(ratio);
  if (!Number.isFinite(r)) return '—';
  if (r >= 7) return 'AAA';
  if (r >= 4.5) return 'AA';
  return 'below AA';
}

function FloorsTable({ data }: { data: Record<string, unknown> }) {
  const rows = (Array.isArray(data.rows) ? data.rows : []) as FloorRow[];
  const columns = (Array.isArray(data.columns) ? data.columns : Object.keys(rows[0]?.cells ?? {})) as string[];
  if (rows.length === 0) return <PendingCallout what="opacity-floors.json present but no rows array" />;
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '4px 10px', borderBottom: '2px solid currentColor' }}>
            transparency x thickness x backdrop
          </th>
          {columns.map((c) => (
            <th key={c} style={{ textAlign: 'left', padding: '4px 10px', borderBottom: '2px solid currentColor' }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td style={{ padding: '3px 10px', borderBottom: '1px solid currentColor' }}>
              {[row.transparency ?? '?', row.thickness ?? '?', row.backdrop ?? '?'].join(' x ')}
            </td>
            {columns.map((c) => {
              const cell = row.cells?.[c] ?? {};
              return (
                <td key={c} data-band={band(cell.minRatio)} style={{ padding: '3px 10px', borderBottom: '1px solid currentColor' }}>
                  floorAlpha {String(cell.floorAlpha ?? '—')} · minRatio {String(cell.minRatio ?? '—')} · {band(cell.minRatio)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const meta: Meta = {
  title: 'MAT/Contrast Floors',
  parameters: {
    layout: 'padded',
    ag: { subject: 'MatContrastFloors', kind: 'lab' } satisfies StoryAgParameters,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Table: Story = {
  render: () =>
    floors ? (
      <FloorsTable data={floors} />
    ) : (
      <PendingCallout what="tokens/generated/opacity-floors.json — pending lane 2a-T token generation" />
    ),
  play: async ({ canvasElement }) => {
    const pending = canvasElement.querySelector('[data-ag-pending]');
    if (pending) {
      console.info(`pending: ${pending.getAttribute('data-ag-pending')}`);
      return;
    }
    const cells = canvasElement.querySelectorAll('tbody td');
    if (cells.length === 0) throw new Error('ContrastFloors: table rendered with no cells');
    for (const td of Array.from(cells)) {
      if (!/floorAlpha|x /.test(td.textContent ?? '')) {
        throw new Error(`ContrastFloors: cell missing text value: ${td.textContent?.slice(0, 40)}`);
      }
    }
  },
};
