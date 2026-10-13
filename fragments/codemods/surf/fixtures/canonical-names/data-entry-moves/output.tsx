// @ts-nocheck
import { Table, TreeView, FilterBar, StatCard } from 'aura-glass/data';
import { DatePicker } from 'aura-glass/date';

export const View = () => (
  <section>
    <FilterBar {...v} />
    <Table data={v} columns={v} />
    <TreeView {...v} />
    <DatePicker />
    <StatCard {...v} />
  </section>
);
