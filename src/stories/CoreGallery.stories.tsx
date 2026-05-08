import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const sections = [
  ['Foundations', 'Primitives, tokens, accessibility providers, theme provider, and error boundaries.'],
  ['Inputs', 'Checkboxes, steppers, transfer lists, tree select, control groups, and form templates.'],
  ['Surfaces', 'Cards, containers, modals, popovers, drawers, sheets, hover cards, and tooltips.'],
  ['Content', 'Buttons, ratings, media controls, search, data display, charts, and layouts.'],
  ['Advanced', 'AI, collaboration, effects, Houdini, WebGL, particles, and performance stories.'],
  ['Certification', 'Inventory and visual coverage stories used by the production Storybook sweep.'],
];

const CoreGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <span style={styles.kicker}>System Map</span>
      <h1 style={styles.title}>Core Gallery</h1>
      <p style={styles.copy}>
        A scannable entry point for the complete AuraGlass component catalog, replacing the generated long-form file list with grouped developer paths.
      </p>
    </section>
    <section style={styles.grid}>
      {sections.map(([name, description]) => (
        <article key={name} style={styles.card}>
          <h2 style={styles.cardTitle}>{name}</h2>
          <p style={styles.cardCopy}>{description}</p>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100dvh', padding: 32, color: '#0f172a', boxSizing: 'border-box', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 46%, #ecfdf5 100%)' },
  header: { maxWidth: 1120, margin: '0 auto 24px', display: 'grid', gap: 8 },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: 0, textTransform: 'uppercase', color: '#0369a1' },
  title: { margin: 0, fontSize: 36, lineHeight: 1.08, letterSpacing: 0 },
  copy: { margin: 0, maxWidth: 800, color: '#334155', fontSize: 16, lineHeight: 1.55 },
  grid: { maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 },
  card: { minHeight: 166, padding: 20, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 16px 42px rgba(15,23,42,0.10)' },
  cardTitle: { margin: '0 0 8px', fontSize: 20, color: '#0f172a' },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
};

const meta: Meta<typeof CoreGallery> = {
  title: 'Reference/Category Galleries/Core Gallery',
  component: CoreGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
