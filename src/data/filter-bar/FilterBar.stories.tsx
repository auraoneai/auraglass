import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FilterBar } from './FilterBar';
import { makeRule, emptyGroup } from './filter-model';
import { applyModel } from './filter-model-ops';

const meta = {
  title: 'surf/filter-bar',
  parameters: { ag: { subject: 'FilterBar', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const SCHEMA = [
  { id: 'name', label: 'Name', type: 'text' as const },
  { id: 'qty', label: 'Quantity', type: 'number' as const },
  { id: 'status', label: 'Status', type: 'enum' as const, options: [{ value: 'open', label: 'Open' }] },
];
const seed = applyModel(emptyGroup(), (m) => {
  m.addRule(makeRule(SCHEMA[0]!, 'contains', 'acme'));
  m.addRule(makeRule(SCHEMA[2]!, 'is', 'open'));
});

const renderBar = () => (
  <FilterBar
    schema={SCHEMA}
    defaultValue={seed}
    resultCount={128}
    search={{ value: '', onValueChange: () => {}, placeholder: 'Search orders' }}
    quickFilters={[{ id: 'big', label: 'Qty > 100', rule: makeRule(SCHEMA[1]!, '>', 100) }]}
  />
);
export const Basic: Story = { render: renderBar };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderBar };
