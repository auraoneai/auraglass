// CapabilityRoadmap — renders the capability ledger roadmap, filterable by
// release (PROMPT-4e). Data source is the committed ledger JSON; rejected
// rows are collapsed into a count and never listed.
import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import ledgerJson from '../../../docs/auraglass-5/capability-ledger.json';

interface Row {
  id: string;
  capability: string;
  area: string;
  priority: string;
  owner: string;
  release: string;
  status: string;
  form: string[];
  subpath?: string;
}

const rows = (ledgerJson as { rows: Row[] }).rows;
const RELEASES = ['all', '5.0', '5.1', '5.x', 'never'];

function Roadmap({ release }: { release: string }) {
  const [q, setQ] = useState('');
  const [rel, setRel] = useState(release);
  const live = useMemo(() => rows.filter((r) => r.release !== 'never'), []);
  const rejected = rows.length - live.length;
  const filtered = live.filter(
    (r) =>
      (rel === 'all' || r.release === rel) &&
      (!q || r.capability.toLowerCase().includes(q.toLowerCase()) || r.id.includes(q.toUpperCase()))
  );
  return (
    <div data-ag-part="root" style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1 style={{ fontSize: 20 }}>AuraGlass 5.0 capability roadmap</h1>
      <p style={{ color: '#666' }}>
        {live.length} live rows · {rejected} rejected · source: capability-ledger.json
      </p>
      <label>
        Filter by release:{' '}
        <select value={rel} onChange={(e) => setRel(e.target.value)} data-ag-part="release-filter">
          {RELEASES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>{' '}
      <input
        placeholder="search capability or id"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        data-ag-part="search"
      />
      <table style={{ borderCollapse: 'collapse', marginTop: 12, width: '100%' }}>
        <thead>
          <tr>
            {['id', 'capability', 'area', 'prio', 'owner', 'release', 'form', 'status'].map((h) => (
              <th key={h} style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 4 }}>{r.id}</td>
              <td style={{ padding: 4 }}>{r.capability}</td>
              <td style={{ padding: 4 }}>{r.area}</td>
              <td style={{ padding: 4 }}>{r.priority}</td>
              <td style={{ padding: 4 }}>{r.owner}</td>
              <td style={{ padding: 4 }}>{r.release}</td>
              <td style={{ padding: 4 }}>{(r.form ?? []).join(',')}</td>
              <td style={{ padding: 4 }}>{r.status}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={8} style={{ padding: 8, color: '#888' }}>no rows match</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const meta: Meta<typeof Roadmap> = {
  title: 'surf/capability/CapabilityRoadmap',
  component: Roadmap,
  args: { release: 'all' },
};
export default meta;

type Story = StoryObj<typeof Roadmap>;
export const Default: Story = {};
export const FiveZero: Story = { args: { release: '5.0' } };
export const FiveOne: Story = { args: { release: '5.1' } };
export const LabsPipeline: Story = { args: { release: '5.x' } };
