import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const items = [
  ['Action icons', 'Save, close, search, filter, and navigation icons used inside buttons.'],
  ['Status icons', 'Success, warning, error, and neutral indicators for data-display stories.'],
  ['Navigation icons', 'Sidebar, tab bar, breadcrumb, and toolbar icon examples.'],
  ['Media icons', 'Playback, volume, seek, and now-playing controls.'],
];

const IconsGallery = () => <CategoryGallery title="Icons Gallery" kicker="Symbols" items={items} />;

const CategoryGallery = ({ title, kicker, items }: { title: string; kicker: string; items: string[][] }) => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>{kicker}</span>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.copy}>Icon examples emphasize clear affordances and use icon buttons where symbols are the expected control language.</p>
    </section>
    <section style={styles.grid}>
      {items.map(([name, description]) => (
        <article key={name} style={styles.card}>
          <div style={styles.iconRow}>
            <span style={styles.iconBox} />
            <span style={styles.iconBox} />
            <span style={styles.iconBox} />
          </div>
          <h2 style={styles.cardTitle}>{name}</h2>
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
  grid: { maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 },
  card: { minHeight: 176, padding: 18, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 16px 42px rgba(15,23,42,0.10)' },
  iconRow: { display: 'flex', gap: 8, marginBottom: 14 },
  iconBox: { width: 34, height: 34, borderRadius: 6, background: 'linear-gradient(135deg, #0284c7, #10b981)' },
  cardTitle: { margin: '0 0 8px', fontSize: 19 },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
};

const meta: Meta<typeof IconsGallery> = {
  title: 'Reference/Category Galleries/Icons Gallery',
  component: IconsGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
