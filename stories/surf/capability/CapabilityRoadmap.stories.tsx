// CapabilityRoadmap — renders the capability ledger roadmap (REQ-SURF-187).
// Filterable by area, priority, owner, release, form and status; rejected
// rows (X-R01..X-R13) are listed with their reasons in a separate tab. All
// counts and filter options are computed once from the committed ledger JSON
// at build time (module scope), never hand-written.
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ledgerJson from '../../../docs/auraglass-5/capability-ledger.json';
import { Tabs } from '../../../src/components/tabs/Tabs';

interface Row {
  id: string;
  capability: string;
  area: string;
  priority: string;
  owner: string;
  release: string;
  status: string;
  form: string[];
  names: string[];
  evidence: string[];
  subpath: string | null;
}

const rows = (ledgerJson as { rows: Row[] }).rows;
const live = rows.filter((r) => r.status !== 'rejected');
const rejected = rows.filter((r) => r.status === 'rejected');

const FILTERS = ['area', 'priority', 'owner', 'release', 'form', 'status'] as const;
type FilterKey = (typeof FILTERS)[number];
type Filters = Record<FilterKey, string>;

const valuesOf = (r: Row, key: FilterKey): string[] => (key === 'form' ? r.form : [r[key]]);
const OPTIONS: Record<FilterKey, string[]> = Object.fromEntries(
  FILTERS.map((k) => [k, [...new Set(live.flatMap((r) => valuesOf(r, k)))].sort()]),
) as Record<FilterKey, string[]>;
const COUNTS = {
  live: live.length,
  rejected: rejected.length,
  byRelease: Object.fromEntries(OPTIONS.release.map((v) => [v, live.filter((r) => r.release === v).length])),
};
const ALL: Filters = { area: 'all', priority: 'all', owner: 'all', release: 'all', form: 'all', status: 'all' };
const reasonOf = (r: Row) => (r.evidence[0] ?? '').replace(/^exception:/, '');

const cell = { padding: 4, textAlign: 'start' as const, verticalAlign: 'top' as const };

export function Roadmap({ initial = ALL, tab = 'roadmap' }: { initial?: Partial<Filters>; tab?: 'roadmap' | 'rejected' }) {
  const [filters, setFilters] = useState<Filters>({ ...ALL, ...initial });
  const shown = live.filter((r) => FILTERS.every((k) => filters[k] === 'all' || valuesOf(r, k).includes(filters[k])));
  return (
    <div data-ag-part="root" style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1 style={{ fontSize: 20 }}>AuraGlass 5 capability roadmap</h1>
      <p>
        {COUNTS.live} capability rows ({Object.entries(COUNTS.byRelease).map(([k, v]) => `${k}: ${v}`).join(', ')}) ·{' '}
        {COUNTS.rejected} rejected · source: capability-ledger.json
      </p>
      <Tabs.Root defaultValue={tab}>
        <Tabs.List aria-label="Capability ledger views">
          <Tabs.Tab value="roadmap">Roadmap</Tabs.Tab>
          <Tabs.Tab value="rejected">Rejected ({COUNTS.rejected})</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="roadmap">
          <fieldset data-ag-part="filters" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, border: 0, padding: 0, margin: '12px 0' }}>
            <legend>Filter rows</legend>
            {FILTERS.map((k) => (
              <label key={k}>
                {k}{' '}
                <select
                  data-ag-part={`filter-${k}`}
                  value={filters[k]}
                  onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))}
                >
                  <option value="all">all</option>
                  {OPTIONS[k].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </label>
            ))}
          </fieldset>
          <p aria-live="polite" data-ag-part="match-count">{shown.length} of {COUNTS.live} rows</p>
          <table data-ag-part="roadmap-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <caption style={{ textAlign: 'start' }}>Capability rows</caption>
            <thead>
              <tr>
                {['id', 'capability', 'area', 'priority', 'owner', 'release', 'form', 'status'].map((h) => (
                  <th key={h} scope="col" style={cell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <th scope="row" style={cell}>{r.id}</th>
                  <td style={cell}>{r.capability}</td>
                  <td style={cell}>{r.area}</td>
                  <td style={cell}>{r.priority}</td>
                  <td style={cell}>{r.owner}</td>
                  <td style={cell}>{r.release}</td>
                  <td style={cell}>{r.form.join(', ')}{r.subpath ? ` (${r.subpath})` : ''}</td>
                  <td style={cell}>{r.status}</td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={8} style={cell}>no rows match</td></tr>
              )}
            </tbody>
          </table>
        </Tabs.Panel>
        <Tabs.Panel value="rejected">
          <table data-ag-part="rejected-table" style={{ borderCollapse: 'collapse', width: '100%', marginTop: 12 }}>
            <caption style={{ textAlign: 'start' }}>Rejected novelty (never re-admitted in 5.x)</caption>
            <thead>
              <tr>
                {['id', 'family', 'names', 'reason'].map((h) => (
                  <th key={h} scope="col" style={cell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rejected.map((r) => (
                <tr key={r.id}>
                  <th scope="row" style={cell}>{r.id}</th>
                  <td style={cell}>{r.capability}</td>
                  <td style={cell}>{r.names.join(', ')}</td>
                  <td style={cell}>{reasonOf(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}

const meta: Meta<typeof Roadmap> = {
  title: 'surf/capability/CapabilityRoadmap',
  component: Roadmap,
  // Roadmap is also imported by tests/capability/roadmap-story.test.tsx.
  excludeStories: ['Roadmap'],
  args: { initial: ALL, tab: 'roadmap' },
};
export default meta;

type Story = StoryObj<typeof Roadmap>;
export const Default: Story = {};
export const FiveZero: Story = { args: { initial: { release: '5.0' } } };
export const FiveOne: Story = { args: { initial: { release: '5.1' } } };
export const LabsPipeline: Story = { args: { initial: { release: '5.x' } } };
export const SurfP0: Story = { args: { initial: { owner: 'SURF', priority: 'P0' } } };
export const Rejected: Story = { args: { tab: 'rejected' } };
