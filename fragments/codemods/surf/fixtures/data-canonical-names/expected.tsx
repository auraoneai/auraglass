// @ts-nocheck
import { Table, TreeView, FilterBar } from 'aura-glass/data';
import { DatePicker } from 'aura-glass/date';
import { StatCard } from 'aura-glass/data';

export const View = () => (
  <section>
    <FilterBar />
    <Table />
    <TreeView />
    <DatePicker />
    <StatCard />
  </section>
);
