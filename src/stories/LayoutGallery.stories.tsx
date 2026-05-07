import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const groups = [
  ['Primitives', 'Box, GlassBox, GlassFlex, GlassGrid, GlassStack, HStack, and VStack for predictable composition.'],
  ['Application Frames', 'GlassAppShell, ZSpaceAppLayout, SplitPane, ScrollArea, Container, and Separator examples.'],
  ['Generative Layouts', 'Island, masonry, tessellation, orbital, fractal, and golden-ratio layouts with bounded canvases.'],
  ['Dashboard Templates', 'Dashboard, widgets, data table, detail view, list view, form, and wizard templates.'],
];

const examples = ['Responsive shells', 'Scrollable panes', 'Dense grids', 'Template surfaces', 'Dashboard cards', 'Mobile-safe layouts'];

const LayoutGallery = () => (
  <main style={styles.page}>
    <section style={styles.hero}>
      <div>
        <span style={styles.kicker}>Composition</span>
        <h1 style={styles.title}>Layout Gallery</h1>
        <p style={styles.copy}>
          Layout stories should fill the preview intentionally, show realistic nested content, and keep overflow inside the story frame.
        </p>
      </div>
      <div style={styles.preview} aria-hidden="true">
        <div style={styles.previewHeader} />
        <div style={styles.previewGrid}>
          {examples.map((label, index) => (
            <div key={label} style={{ ...styles.previewTile, gridColumn: index === 0 ? 'span 2' : undefined }}>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section style={styles.grid}>
      {groups.map(([name, description]) => (
        <article key={name} style={styles.card}>
          <h2 style={styles.cardTitle}>{name}</h2>
          <p style={styles.cardCopy}>{description}</p>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100dvh', padding: 32, boxSizing: 'border-box', color: '#111827', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0fdf4 100%)' },
  hero: { maxWidth: 1180, margin: '0 auto 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24, alignItems: 'center' },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: 0, color: '#047857', textTransform: 'uppercase' },
  title: { margin: '8px 0', fontSize: 36, lineHeight: 1.08, letterSpacing: 0 },
  copy: { margin: 0, color: '#334155', fontSize: 16, lineHeight: 1.55 },
  preview: { borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.72)', boxShadow: '0 18px 50px rgba(15,23,42,0.12)', padding: 14, backdropFilter: 'blur(18px)' },
  previewHeader: { height: 36, borderRadius: 6, background: 'linear-gradient(90deg, #0284c7, #10b981)' },
  previewGrid: { marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 },
  previewTile: { minHeight: 76, borderRadius: 6, background: 'rgba(15,23,42,0.06)', display: 'grid', placeItems: 'center', color: '#334155', fontWeight: 700, fontSize: 13, textAlign: 'center', padding: 8 },
  grid: { maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 },
  card: { padding: 18, borderRadius: 8, border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(255,255,255,0.70)', boxShadow: '0 14px 35px rgba(15,23,42,0.09)' },
  cardTitle: { margin: '0 0 8px', fontSize: 18 },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
};

const meta: Meta<typeof LayoutGallery> = {
  title: 'Reference/Category Galleries/Layout Gallery',
  component: LayoutGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
