import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const sections = [
  {
    name: 'Start Here',
    count: 'Curated',
    description: 'Guided public examples, showcase flows, and the certified component map.',
    paths: ['Curated/Start Here', 'Showcase/*', 'Categories/Core'],
  },
  {
    name: 'Application UI',
    count: 'Layouts',
    description: 'App shells, navigation, modals, input workflows, tables, lists, and dashboards.',
    paths: ['Components/Layout/*', 'Navigation/*', 'Templates/*'],
  },
  {
    name: 'Data and Charts',
    count: 'Analytics',
    description: 'Chart primitives, data tables, metrics, widgets, and dense information displays.',
    paths: ['Components/Charts/*', 'Components/Components/Chart*', 'Categories/Charts'],
  },
  {
    name: 'Liquid Glass',
    count: 'Material',
    description: 'Material layers, toolbar systems, media controls, segmented controls, and glass surfaces.',
    paths: ['Primitives/LiquidGlass*', 'Button/LiquidGlass*', 'Media/LiquidGlass*'],
  },
  {
    name: 'Advanced Systems',
    count: 'Effects',
    description: 'AI, collaboration, particles, WebGL, Houdini, 3D, and adaptive performance examples.',
    paths: ['Advanced/*', 'AI/*', 'Effects/*'],
  },
  {
    name: 'Quality Coverage',
    count: 'QA',
    description: 'Inventory, certification, accessibility, and visual audit support stories.',
    paths: ['Certification/*', 'Accessibility/*', 'Utils/ErrorBoundary'],
  },
];

const ComponentGallery = () => (
  <main style={styles.page}>
    <section style={styles.header}>
      <div>
        <span style={styles.kicker}>AuraGlass</span>
        <h1 style={styles.title}>Component Gallery</h1>
        <p style={styles.copy}>
          A production-quality catalog overview for the full Storybook. Stories are grouped by developer task so the gallery remains useful at desktop and mobile sizes.
        </p>
      </div>
      <aside style={styles.summary}>
        <strong style={styles.summaryValue}>412</strong>
        <span style={styles.summaryLabel}>component stories organized into focused families</span>
      </aside>
    </section>
    <section style={styles.grid}>
      {sections.map((section) => (
        <article key={section.name} style={styles.card}>
          <span style={styles.badge}>{section.count}</span>
          <h2 style={styles.cardTitle}>{section.name}</h2>
          <p style={styles.cardCopy}>{section.description}</p>
          <div style={styles.pathList}>
            {section.paths.map((path) => (
              <code key={path} style={styles.code}>
                {path}
              </code>
            ))}
          </div>
        </article>
      ))}
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    padding: 32,
    boxSizing: 'border-box',
    color: '#0f172a',
    background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 48%, #ecfdf5 100%)',
  },
  header: {
    maxWidth: 1180,
    margin: '0 auto 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    gap: 20,
    alignItems: 'stretch',
  },
  kicker: { fontSize: 12, fontWeight: 800, letterSpacing: 0, color: '#0369a1', textTransform: 'uppercase' },
  title: { margin: '8px 0', fontSize: 38, lineHeight: 1.06, letterSpacing: 0 },
  copy: { margin: 0, color: '#334155', fontSize: 16, lineHeight: 1.55, maxWidth: 760 },
  summary: {
    borderRadius: 8,
    border: '1px solid rgba(15,23,42,0.12)',
    background: 'rgba(255,255,255,0.72)',
    boxShadow: '0 16px 42px rgba(15,23,42,0.10)',
    padding: 20,
    display: 'grid',
    alignContent: 'center',
    gap: 4,
  },
  summaryValue: { fontSize: 42, lineHeight: 1, color: '#075985' },
  summaryLabel: { color: '#475569', lineHeight: 1.4 },
  grid: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  card: {
    minHeight: 230,
    padding: 20,
    borderRadius: 8,
    border: '1px solid rgba(15,23,42,0.12)',
    background: 'rgba(255,255,255,0.74)',
    boxShadow: '0 16px 42px rgba(15,23,42,0.10)',
    backdropFilter: 'blur(18px)',
    display: 'grid',
    alignContent: 'start',
    gap: 10,
  },
  badge: { width: 'fit-content', borderRadius: 6, padding: '5px 9px', background: 'rgba(14,165,233,0.14)', color: '#075985', fontWeight: 800, fontSize: 12 },
  cardTitle: { margin: 0, fontSize: 21, lineHeight: 1.2, color: '#0f172a' },
  cardCopy: { margin: 0, color: '#475569', lineHeight: 1.5 },
  pathList: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  code: { borderRadius: 6, padding: '5px 7px', background: 'rgba(15,23,42,0.06)', color: '#0f172a', fontSize: 12, overflowWrap: 'anywhere' },
};

const meta: Meta<typeof ComponentGallery> = {
  title: 'Reference/Category Galleries/Component Gallery',
  component: ComponentGallery,
  parameters: { layout: 'fullscreen', previewSurface: 'app' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
