import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { BasicCard as CardPatterns } from './patterns';

const previewShellStyle = {
  minHeight: '100vh',
  padding: '32px',
  boxSizing: 'border-box',
  color: '#111827',
  background:
    'radial-gradient(circle at top left, rgba(255, 255, 255, 0.94), transparent 34%), linear-gradient(145deg, #f8fafc 0%, #eef1f5 48%, #e3e7ec 100%)',
} satisfies CSSProperties;

const previewGridStyle = {
  width: 'min(1120px, 100%)',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 20,
} satisfies CSSProperties;

const introStyle = {
  width: 'min(1120px, 100%)',
  margin: '0 auto 20px',
  display: 'grid',
  gap: 8,
} satisfies CSSProperties;

const cardClassName = 'card-pattern-preview-card glass-border glass-shadow-2xl';

const sectionLabelStyle = {
  margin: 0,
  color: '#526071',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0,
  textTransform: 'uppercase',
} satisfies CSSProperties;

const headingStyle = {
  margin: 0,
  color: '#111827',
  fontSize: 28,
  lineHeight: 1.15,
  letterSpacing: 0,
} satisfies CSSProperties;

const bodyStyle = {
  margin: 0,
  color: '#526071',
  fontSize: 14,
  lineHeight: 1.55,
} satisfies CSSProperties;

const metricRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 10,
  marginTop: 18,
} satisfies CSSProperties;

const metricStyle = {
  padding: '12px',
  borderRadius: 8,
  background: 'rgba(255, 255, 255, 0.30)',
  border: '1px solid rgba(80, 102, 130, 0.18)',
} satisfies CSSProperties;

const buttonStyle = {
  minHeight: 36,
  padding: '0 14px',
  border: '1px solid rgba(80, 102, 130, 0.30)',
  borderRadius: 8,
  color: '#111827',
  background: 'rgba(255, 255, 255, 0.42)',
  fontWeight: 700,
} satisfies CSSProperties;

const secondaryButtonStyle = {
  ...buttonStyle,
  background: 'rgba(255, 255, 255, 0.20)',
} satisfies CSSProperties;

function PatternPreview({ glass = false }: { glass?: boolean }) {
  return (
    <div className="card-pattern-preview" style={previewShellStyle}>
      <style>
        {`
          .card-pattern-preview .glass-foundation-complete {
            background: rgba(255, 255, 255, 0.30);
            border-color: rgba(255, 255, 255, 0.82);
          }

          .card-pattern-preview .card-pattern-preview-card {
            min-height: 280px;
            background: rgba(255, 255, 255, 0.30);
          }

          .card-pattern-preview [class*="glass-text-primary"] {
            color: #111827;
          }

          .card-pattern-preview [class*="glass-text-secondary"] {
            color: #526071;
          }
        `}
      </style>
      <div style={introStyle}>
        <p style={sectionLabelStyle}>Card composition patterns</p>
        <h1 style={headingStyle}>
          Filled card previews for dashboard, review, and account workflows
        </h1>
        <p style={{ ...bodyStyle, maxWidth: 760 }}>
          Each preview includes real header, content, metrics, and actions so the
          pattern demonstrates usable card density across the full Storybook
          canvas.
        </p>
      </div>

      <div style={previewGridStyle}>
        <CardPatterns
          title="Release Readiness"
          description="Glass surface health and visual QA coverage"
          className={cardClassName}
          actions={
            <>
              <button type="button" style={secondaryButtonStyle}>
                Details
              </button>
              <button type="button" style={buttonStyle}>
                Review
              </button>
            </>
          }
        >
          <p style={bodyStyle}>
            Storybook, packaging, accessibility, and regression gates are
            grouped into one operating view for the release owner.
          </p>
          <div style={metricRowStyle}>
            {[
              ['356', 'components'],
              ['98%', 'stories passing'],
              ['12', 'open checks'],
            ].map(([value, label]) => (
              <div key={label} style={metricStyle}>
                <strong style={{ display: 'block', color: '#111827', fontSize: 22 }}>
                  {value}
                </strong>
                <span style={{ color: '#526071', fontSize: 12 }}>{label}</span>
              </div>
            ))}
          </div>
        </CardPatterns>

        <CardPatterns
          title="Workspace Activity"
          description="Recent collaboration events"
          className={cardClassName}
          actions={<button type="button" style={buttonStyle}>Open feed</button>}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              ['Design audit', 'Navigation cards updated for dark mode'],
              ['QA pass', 'Mobile liquid background verified'],
              ['Docs', 'Usage notes added to card composition examples'],
            ].map(([title, detail]) => (
              <div key={title} style={metricStyle}>
                <strong style={{ display: 'block', color: '#111827' }}>{title}</strong>
                <span style={{ color: '#526071', fontSize: 13 }}>{detail}</span>
              </div>
            ))}
          </div>
        </CardPatterns>

        <CardPatterns
          title={glass ? 'Liquid Glass Plan' : 'Implementation Plan'}
          description="Scoped work ready for handoff"
          className={cardClassName}
          actions={
            <>
              <button type="button" style={secondaryButtonStyle}>
                Export
              </button>
              <button type="button" style={buttonStyle}>
                Assign
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              'Normalize story canvas density',
              'Verify contrast in dark background mode',
              'Keep card actions reachable on mobile widths',
            ].map((item, index) => (
              <div
                key={item}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr',
                  gap: 10,
                  alignItems: 'center',
                  color: '#111827',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#111827',
                    background: glass
                      ? 'rgba(255, 255, 255, 0.52)'
                      : 'rgba(255, 255, 255, 0.36)',
                    fontWeight: 800,
                  }}
                >
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CardPatterns>
      </div>
    </div>
  );
}

const meta: Meta<typeof CardPatterns> = {
  title: 'Surfaces/Cards + Panels/patterns',
  component: CardPatterns,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Release Readiness',
    description: 'Glass surface health and visual QA coverage',
    children: 'Storybook, packaging, accessibility, and regression gates.',
  },
  render: () => <PatternPreview />,
};

export const WithGlassEffect: Story = {
  args: {
    title: 'Liquid Glass Plan',
    description: 'Scoped work ready for handoff',
    children: 'Preview content for Liquid Glass card composition.',
    intent: 'primary',
    elevation: 'level2',
  },
  render: () => <PatternPreview glass />,
};
