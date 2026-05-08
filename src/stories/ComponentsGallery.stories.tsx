import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const sections = [
  ['Chart internals', 'AtmosphericEffects, ChartFilters, ChartLegend, ChartRenderer, ChartTooltip, and KpiChart.'],
  ['Navigation internals', 'CollapsedMenu, ScrollButtons, and TabItem composition helpers.'],
  ['Story quality', 'Each component card points developers toward focused stories rather than a cramped file dump.'],
];

const ComponentsGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>Component Internals</span>
      <h1 style={styles.title}>Components Gallery</h1>
      <p style={styles.copy}>A compact map of lower-level component stories used by charts, navigation, and template examples.</p>
    </section>
    <section style={styles.grid}>
      {sections.map(([title, description]) => (
        <article key={title} style={styles.card}>
          <h2 style={styles.cardTitle}>{title}</h2>
          <p style={styles.cardCopy}>{description}</p>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100dvh', padding: 32, color: '#0f172a', boxSizing: 'border-box', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 46%, #ecfdf5 100%)' },
  header: { maxWidth: 1040, margin: '0 auto 24px', display: 'grid', gap: 8 },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: 0, textTransform: 'uppercase', color: '#0369a1' },
  title: { margin: 0, fontSize: 34, lineHeight: 1.1, letterSpacing: 0 },
  copy: { margin: 0, color: '#334155', fontSize: 16 },
  grid: { maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
  card: { minHeight: 166, padding: 20, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 16px 42px rgba(15,23,42,0.10)' },
  cardTitle: { margin: '0 0 10px', fontSize: 20, color: '#0f172a' },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
};

const meta: Meta<typeof ComponentsGallery> = {
  title: 'Reference/Category Galleries/Components Gallery',
  component: ComponentsGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
