import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const items = [
  {
    name: 'App Navigation',
    description: 'Header, responsive nav, bottom nav, and navigation menu examples.',
  },
  {
    name: 'Glass Surfaces',
    description: 'Inset sidebar, inspector panel, toolbar, tab bar, segmented control, and accessory bar.',
  },
  {
    name: 'Wayfinding',
    description: 'Breadcrumb, pagination, user menu, popover menu, and tabs.',
  },
  {
    name: 'Mobile Patterns',
    description: 'Bottom accessories, adaptive sheet navigation, and touch-safe controls.',
  },
];

const NavigationGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>Wayfinding</span>
      <h1 style={styles.title}>Navigation Gallery</h1>
      <p style={styles.copy}>Navigation stories show realistic density, stable hit targets, and complete responsive states.</p>
    </section>
    <section style={styles.grid}>
      {items.map((item) => (
        <article key={item.name} style={styles.card}>
          <h2 style={styles.cardTitle}>{item.name}</h2>
          <p style={styles.cardCopy}>{item.description}</p>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100dvh', padding: 32, color: '#0f172a', boxSizing: 'border-box', background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 46%, #ecfdf5 100%)' },
  header: { maxWidth: 1040, margin: '0 auto 24px', display: 'grid', gap: 8 },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: 0, textTransform: 'uppercase', color: '#047857' },
  title: { margin: 0, fontSize: 34, lineHeight: 1.1, letterSpacing: 0 },
  copy: { margin: 0, color: '#334155', fontSize: 16 },
  grid: { maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 },
  card: { minHeight: 156, padding: 18, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 16px 42px rgba(15,23,42,0.10)' },
  cardTitle: { margin: '0 0 8px', fontSize: 19 },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
};

const meta: Meta<typeof NavigationGallery> = {
  title: 'Reference/Category Galleries/Navigation Gallery',
  component: NavigationGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
