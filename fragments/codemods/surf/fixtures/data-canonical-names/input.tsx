import { GlassDataGrid, GlassTreeView, GlassFilterBar, GlassDatePicker, GlassStatCard } from 'aura-glass';

export const View = () => (
  <section>
    <GlassFilterBar />
    <GlassDataGrid />
    <GlassTreeView />
    <GlassDatePicker />
    <GlassStatCard />
  </section>
);
