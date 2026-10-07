/* stories/mat/ContrastFloors.stories.tsx — MAT-337 (REQ-MAT-03).
   Renders tokens/generated/opacity-floors.json as a table: rows
   transparency x thickness x backdrop; columns preset x scheme x contrast;
   floorAlpha and minRatio as text in every cell (heat tint may accompany,
   never replace, the text). Reports pending until lane 2a-T generates the
   floors file — no hand-typed values. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { PendingCallout, globJson } from './_shared';

interface FloorRow {
  transparency?: string;
  thickness?: string;
  backdrop?: string;
  cells?: Record<string, { floorAlpha?: number | string; minRatio?: number | string }>;
  [k: string]: unknown;
}

const floors = globJson('/tokens/generated/opacity-floors.json');

function cellHeat(ratio: number | string | undefined): React.CSSProperties {
  const r = Number(ratio);
  if (!Number.isFinite(r)) return {};
  if (r >= 7) return { background: 'rgba(34,197,94,0.18)' };
  if (r >= 4.5) return { background: 'rgba(245,158,11,0.18)' };
  return { background: 'rgba(239,68,68,0.18)' };
}

function FloorsTable({ data }: { data: Record<string, unknown> }) {
  const rows = (Array.isArray(data.rows) ? data.rows : []) as FloorRow[];
  const columns = (Array.isArray(data.columns) ? data.columns : Object.keys(rows[0]?.cells ?? {})) as string[];
  if (rows.length === 0) return <PendingCallout what="opacity-floors.json present but no rows array" />;
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '4px 10px', borderBottom: '2px solid #94a3b8' }}>
            transparency x thickness x backdrop
          </th>
          {columns.map((c) => (
            <th key={c} style={{ textAlign: 'left', padding: '4px 10px', borderBottom: '2px solid #94a3b8' }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td style={{ padding: '3px 10px', borderBottom: '1px solid #e2e8f0' }}>
              {[row.transparency ?? '?', row.thickness ?? '?', row.backdrop ?? '?'].join(' x ')}
            </td>
            {columns.map((c) => {
              const cell = row.cells?.[c] ?? {};
              return (
                <td key={c} style={{ padding: '3px 10px', borderBottom: '1px solid #e2e8f0', ...cellHeat(cell.minRatio) }}>
                  floorAlpha {String(cell.floorAlpha ?? '—')} · minRatio {String(cell.minRatio ?? '—')}
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
  parameters: { layout: 'padded' },
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
