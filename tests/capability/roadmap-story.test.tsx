// tests/capability/roadmap-story.test.tsx — REQ-SURF-187.
// The CapabilityRoadmap story renders 6 filter controls (area, priority,
// owner, release, form, status) over the 58 capability rows, filters them,
// and lists X-R01..X-R13 with reasons in a separate Rejected tab.
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Roadmap } from '../../stories/surf/capability/CapabilityRoadmap.stories';

const ledger = JSON.parse(readFileSync(join(__dirname, '../../docs/auraglass-5/capability-ledger.json'), 'utf8'));
const bodyRows = (table: HTMLElement) => within(table).getAllByRole('row').slice(1);

describe('CapabilityRoadmap story', () => {
  it('renders 6 filter controls and all 58 capability rows', () => {
    const { container } = render(<Roadmap />);
    const selects = container.querySelectorAll('select[data-ag-part^="filter-"]');
    expect([...selects].map((s) => s.getAttribute('data-ag-part'))).toEqual([
      'filter-area', 'filter-priority', 'filter-owner', 'filter-release', 'filter-form', 'filter-status',
    ]);
    for (const k of ['area', 'priority', 'owner', 'release', 'form', 'status']) expect(screen.getByLabelText(k)).toBeTruthy();
    const table = container.querySelector<HTMLElement>('[data-ag-part="roadmap-table"]')!;
    expect(bodyRows(table)).toHaveLength(58);
  });

  it('filters combine (owner SURF + priority P0) and match the ledger', () => {
    const { container } = render(<Roadmap />);
    fireEvent.change(screen.getByLabelText('owner'), { target: { value: 'SURF' } });
    fireEvent.change(screen.getByLabelText('priority'), { target: { value: 'P0' } });
    const want = ledger.rows.filter((r: any) => r.status !== 'rejected' && r.owner === 'SURF' && r.priority === 'P0').map((r: any) => r.id);
    expect(want.length).toBeGreaterThan(0);
    const table = container.querySelector<HTMLElement>('[data-ag-part="roadmap-table"]')!;
    expect(bodyRows(table).map((tr) => tr.querySelector('th')!.textContent)).toEqual(want);
    fireEvent.change(screen.getByLabelText('form'), { target: { value: 'labs' } });
    expect(within(table).getByText('no rows match')).toBeTruthy();
  });

  it('the Rejected tab lists 13 rows with their reasons', () => {
    const { container } = render(<Roadmap />);
    fireEvent.click(screen.getByRole('tab', { name: 'Rejected (13)' }));
    const table = container.querySelector<HTMLElement>('[data-ag-part="rejected-table"]')!;
    const trs = bodyRows(table);
    expect(trs.map((tr) => tr.querySelector('th')!.textContent)).toEqual(
      Array.from({ length: 13 }, (_, i) => `X-R${String(i + 1).padStart(2, '0')}`),
    );
    expect(trs[10]!.textContent).toContain('expressible as parts/props');
  });
});
