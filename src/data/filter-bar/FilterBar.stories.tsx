import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FilterBar } from './FilterBar';
import { makeRule, emptyGroup, type FilterField, type FilterGroup } from './filter-model';
import { applyModel } from './filter-model-ops';

const meta = {
  title: 'surf/filter-bar',
  parameters: { ag: { subject: 'FilterBar', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/* SURF-198: five fields covering text, number, date-range, multi-enum and
   boolean (plus an enum used by the quick filter). */
const SCHEMA: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'qty', label: 'Quantity', type: 'number' },
  { id: 'placed', label: 'Placed', type: 'date-range' },
  { id: 'tags', label: 'Tags', type: 'multi-enum', options: [{ value: 'rush', label: 'Rush' }, { value: 'gift', label: 'Gift' }] },
  { id: 'paid', label: 'Paid', type: 'boolean' },
  { id: 'status', label: 'Status', type: 'enum', options: [{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }] },
];
const seed = applyModel(emptyGroup(), (m) => {
  m.addRule(makeRule(SCHEMA[0]!, 'contains', 'acme'));
  m.addRule(makeRule(SCHEMA[5]!, 'is', 'open'));
  m.addRule(makeRule(SCHEMA[1]!, 'between', { start: 10, end: 50 }));
  m.addRule(makeRule(SCHEMA[3]!, 'any-of', ['rush', 'gift']));
  m.addRule(makeRule(SCHEMA[4]!, 'is', true));
  m.addRule(makeRule(SCHEMA[2]!, 'between', { start: '2026-01-01', end: '2026-03-31' }));
});
const QUICK = [
  { id: 'big', label: 'Qty > 100', rule: makeRule(SCHEMA[1]!, '>', 100) },
  { id: 'open', label: 'Open only', rule: makeRule(SCHEMA[5]!, 'is', 'open') },
];

function DefaultBar() {
  const [q, setQ] = React.useState('');
  return (
    <FilterBar
      schema={SCHEMA}
      defaultValue={seed}
      resultCount={128}
      search={{ value: q, onValueChange: setQ, placeholder: 'Search orders' }}
    />
  );
}

function QuickBar() {
  return <FilterBar schema={SCHEMA} defaultValue={seed} resultCount={128} quickFilters={QUICK} />;
}

/* UrlSync: the serialized query string follows every edit (FilterBar.serialize). */
function UrlSyncBar() {
  const [value, setValue] = React.useState<FilterGroup>(seed);
  return (
    <div>
      <FilterBar schema={SCHEMA} value={value} onValueChange={setValue} />
      <output data-testid="filter-query">{FilterBar.serialize(value).toString()}</output>
    </div>
  );
}

export const Default: Story = { render: () => <DefaultBar /> };
export const WithQuickFilters: Story = { render: () => <QuickBar /> };
export const UrlSync: Story = { render: () => <UrlSyncBar /> };
export const RTL: Story = { globals: { dir: 'rtl' }, render: () => <QuickBar /> };
