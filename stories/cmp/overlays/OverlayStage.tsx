/* Shared stage for the Flagships/Overlays stories (not a story file).
   Before this, overlay stories rendered a bare trigger in the corner of an
   un-sized Environment: the scene image only covered the trigger's line box,
   so dialogs, sheets and popovers sat over a blank white page with nothing
   for the glass to refract. The stage fills the viewport (the preview's
   Environment grows with it, so the scene paints edge to edge) and centres a
   small app window — real content-layer UI behind the overlay layer.

   Material roles: the window is content (content-raised, opaque, no blur);
   the overlay opened from it is the only glass. */
import * as React from 'react';
import { Environment, Surface } from '../../../src/root/mat';

export interface OverlayStageProps {
  /** Window heading (the app context the overlay was opened from). */
  title?: string;
  /** Window subheading. */
  subtitle?: string;
  /** Controls placed in the window toolbar (usually the overlay trigger). */
  children?: React.ReactNode;
  /** Content rendered on the stage above the window (e.g. a floating bar). */
  above?: React.ReactNode;
  /** Replaces the sample rows inside the window. */
  content?: React.ReactNode;
}

const ROWS = [
  { label: 'Launch checklist', meta: 'Updated 2h ago', hue: 255 },
  { label: 'Design review notes', meta: 'Shared with 4 people', hue: 160 },
  { label: 'Q3 roadmap', meta: 'Draft', hue: 25 },
] as const;

const stage: React.CSSProperties = {
  boxSizing: 'border-box',
  minBlockSize: '100dvh',
  display: 'grid',
  justifyItems: 'center',
  alignContent: 'center',
  gap: 'var(--ag-space-2)',
  padding: 'var(--ag-space-8) var(--ag-space-2)',
  fontFamily: 'var(--ag-font-sans)',
  fontSize: 'var(--ag-type-body-size)',
  lineHeight: 'var(--ag-type-body-leading)',
};

/* Environment clips (overflow: hidden), so the region pads its content by
   more than the window shadow's reach. The pad paints nothing. */
const regionPad: React.CSSProperties = { padding: 'var(--ag-space-6)' };

const windowStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  display: 'grid',
  gap: 'var(--ag-space-4)',
  padding: 'var(--ag-space-5)',
  borderRadius: 'var(--ag-radius-xl)',
};

const header: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--ag-space-4)',
  flexWrap: 'wrap',
};

const toolbar: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--ag-space-2)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--ag-type-title-3-size)',
  fontWeight: 'var(--ag-type-title-3-weight)' as React.CSSProperties['fontWeight'],
  lineHeight: 'var(--ag-type-title-3-leading)',
};

const muted: React.CSSProperties = {
  margin: 0,
  color: 'var(--ag-on-surface-muted, var(--ag-color-on-surface-muted))',
  fontSize: 'var(--ag-type-callout-size)',
};

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: 'var(--ag-space-3)',
  padding: 'var(--ag-space-3) 0',
  borderBlockStart: '1px solid color-mix(in oklab, var(--ag-color-border) 22%, transparent)',
};

const swatch = (hue: number): React.CSSProperties => ({
  inlineSize: 'var(--ag-space-8)',
  blockSize: 'var(--ag-space-8)',
  borderRadius: 'var(--ag-radius-sm)',
  background: `linear-gradient(135deg, oklch(0.72 0.14 ${hue}), oklch(0.58 0.17 ${hue + 30}))`,
});

/**
 * A region that declares a light backdrop, so text and controls inside it
 * resolve to on-light colours. The window is an opaque light surface, so this
 * is literally true there; for a light glass bar floating on the scene it is
 * what keeps its labels dark (see the media-backdrop note in the PR).
 */
export function LightRegion({ children, width }: { children: React.ReactNode; width?: string }): React.ReactElement {
  return (
    <div style={{ inlineSize: width ?? 'auto', maxInlineSize: '100%' }}>
      <Environment backdrop="light">
        <div style={regionPad}>{children}</div>
      </Environment>
    </div>
  );
}

export function OverlayStage({
  title = 'Workspace',
  subtitle = 'Three documents',
  children,
  above,
  content,
}: OverlayStageProps): React.ReactElement {
  return (
    <div style={stage}>
      {above}
      <LightRegion width="min(608px, 100%)">
        <Surface layer="content" content="content-raised" style={windowStyle}>
          <div style={header}>
            <div>
              <h2 style={titleStyle}>{title}</h2>
              <p style={muted}>{subtitle}</p>
            </div>
            {children ? <div style={toolbar}>{children}</div> : null}
          </div>
          {content ?? (
            <div>
              {ROWS.map((r) => (
                <div key={r.label} style={rowStyle}>
                  <span aria-hidden="true" style={swatch(r.hue)} />
                  <span>{r.label}</span>
                  <span style={muted}>{r.meta}</span>
                </div>
              ))}
            </div>
          )}
        </Surface>
      </LightRegion>
    </div>
  );
}
