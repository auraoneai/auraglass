import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const items = [
  ['Command and search', 'Command surfaces, spotlight search, intelligent search, and tabbed search flows.'],
  ['Guidance', 'Coachmarks, contextual help, and progressive interaction examples.'],
  ['Workspace tools', 'Maps, transfer lists, trees, and command-heavy surfaces.'],
  ['Feedback loops', 'Toast, typing, reactions, and lightweight collaboration moments.'],
];

const InteractiveGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>Interaction</span>
      <h1 style={styles.title}>Interactive Gallery</h1>
      <p style={styles.copy}>Interactive stories expose complete controls and states while staying readable in both desktop and mobile preview frames.</p>
    </section>
    <section style={styles.grid}>
      {items.map(([name, description]) => (
        <article key={name} style={styles.card}>
          <h2 style={styles.cardTitle}>{name}</h2>
          <p style={styles.cardCopy}>{description}</p>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100dvh', padding: 32, color: '#0f172a', boxSizing: 'border-box', background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 46%, #ecfdf5 100%)' },
  header: { maxWidth: 1040, margin: '0 auto 24px', display: 'grid', gap: 8 },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: 0, textTransform: 'uppercase', color: '#0369a1' },
  title: { margin: 0, fontSize: 34, lineHeight: 1.1, letterSpacing: 0 },
  copy: { margin: 0, color: '#334155', fontSize: 16 },
  grid: { maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 },
  card: { minHeight: 156, padding: 18, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 16px 42px rgba(15,23,42,0.10)' },
  cardTitle: { margin: '0 0 8px', fontSize: 19 },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
};

const meta: Meta<typeof InteractiveGallery> = {
  title: 'Reference/Category Galleries/Interactive Gallery',
  component: InteractiveGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
