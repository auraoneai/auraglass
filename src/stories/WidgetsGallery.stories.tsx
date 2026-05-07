import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const widgets = [
  ['MetricWidget', 'KPI cards with trend, status, and compact comparison states.'],
  ['ChartWidget', 'Dashboard chart container for line, bar, and area snapshots.'],
  ['TableWidget', 'Dense table card with sortable-looking rows and readable values.'],
];

const WidgetsGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>Dashboard Templates</span>
      <h1 style={styles.title}>Widgets Gallery</h1>
      <p style={styles.copy}>Reusable widgets are shown as dashboard-ready cards with stable heights and readable content density.</p>
    </section>
    <section style={styles.grid}>
      {widgets.map(([name, description], index) => (
        <article key={name} style={styles.card}>
          <div style={styles.metric}>{index === 0 ? '+12.8%' : index === 1 ? '6 series' : '24 rows'}</div>
          <h2 style={styles.cardTitle}>{name}</h2>
          <p style={styles.cardCopy}>{description}</p>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100dvh', padding: 32, boxSizing: 'border-box', color: '#0f172a', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 48%, #ecfdf5 100%)' },
  header: { maxWidth: 1040, margin: '0 auto 24px', display: 'grid', gap: 8 },
  kicker: { color: '#047857', fontWeight: 800, fontSize: 12, letterSpacing: 0, textTransform: 'uppercase' },
  title: { margin: 0, fontSize: 34, lineHeight: 1.1, letterSpacing: 0 },
  copy: { margin: 0, color: '#334155', fontSize: 16 },
  grid: { maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  card: { minHeight: 180, padding: 20, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 16px 42px rgba(15,23,42,0.10)', display: 'grid', alignContent: 'start', gap: 10 },
  metric: { width: 'fit-content', borderRadius: 6, padding: '6px 10px', background: 'rgba(14,165,233,0.14)', color: '#075985', fontWeight: 800, fontSize: 13 },
  cardTitle: { margin: 0, fontSize: 19 },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
};

const meta: Meta<typeof WidgetsGallery> = {
  title: 'Reference/Category Galleries/Widgets Gallery',
  component: WidgetsGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
