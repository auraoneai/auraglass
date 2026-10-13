// @ts-nocheck
import { GlassDataGrid, GlassTreeView, GlassFilterBar, GlassDatePicker, GlassStatCard } from 'aura-glass';

export const View = () => (
  <section>
    <GlassFilterBar {...v} />
    <GlassDataGrid data={v} columns={v} />
    <GlassTreeView {...v} />
    <GlassDatePicker />
    <GlassStatCard {...v} />
  </section>
);
