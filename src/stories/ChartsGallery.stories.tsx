import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const items = [
  ['GlassChart', 'Unified chart surface with line, bar, area, and pie modes.', 'Components/Charts/GlassChart'],
  ['GlassDataChart', 'Dataset-driven Chart.js composition with toolbar, legend, and tooltips.', 'Components/Charts/GlassDataChart'],
  ['ModularGlassDataChart', 'Composable renderer, filters, legend, and KPI chart primitives.', 'Components/Charts/ModularGlassDataChart'],
  ['GlassLineChart', 'SVG line chart with multi-series comparison and hover points.', 'Components/Charts/GlassLineChart'],
  ['GlassBarChart', 'Grouped bars for operational dashboards and compact reports.', 'Components/Charts/GlassBarChart'],
  ['GlassAreaChart', 'Filled trend chart for volume, revenue, and utilization series.', 'Components/Charts/GlassAreaChart'],
  ['GlassPieChart', 'Pie and donut chart for share-of-total breakdowns.', 'Components/Charts/GlassPieChart'],
  ['Chart Components', 'Axis, grid, tooltip, legend, renderer, filters, and KPI internals.', 'Components/Components/*'],
];

const ChartsGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>Visualization</span>
      <h1 style={styles.title}>Charts Gallery</h1>
      <p style={styles.copy}>
        Chart stories are grouped by production use case, with explicit data, readable legends, and bounded responsive frames.
      </p>
    </section>
    <section style={styles.grid}>
      {items.map(([name, description, path]) => (
        <article key={name} style={styles.card}>
          <h2 style={styles.cardTitle}>{name}</h2>
          <p style={styles.cardCopy}>{description}</p>
          <code style={styles.code}>{path}</code>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    padding: '32px',
    color: '#0f172a',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 46%, #ecfdf5 100%)',
    boxSizing: 'border-box',
  },
  header: { maxWidth: 1120, margin: '0 auto 24px', display: 'grid', gap: 8 },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: 0, color: '#0369a1', textTransform: 'uppercase' },
  title: { margin: 0, fontSize: 34, lineHeight: 1.1, letterSpacing: 0 },
  copy: { margin: 0, maxWidth: 760, color: '#334155', fontSize: 16 },
  grid: { maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  card: { minHeight: 156, padding: 18, borderRadius: 8, border: '1px solid rgba(15, 23, 42, 0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)', backdropFilter: 'blur(18px)', display: 'grid', alignContent: 'start', gap: 10 },
  cardTitle: { margin: 0, fontSize: 18, lineHeight: 1.2, color: '#0f172a' },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.45 },
  code: { color: '#075985', background: 'rgba(14, 165, 233, 0.12)', borderRadius: 6, padding: '6px 8px', overflowWrap: 'anywhere', fontSize: 12 },
};

const meta: Meta<typeof ChartsGallery> = {
  title: 'Reference/Category Galleries/Charts Gallery',
  component: ChartsGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
