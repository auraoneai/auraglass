/* Story stage for the Flagships/Controls stories (not a CSF file).
   The preview frame paints the scene (Environment + backdrop image) but
   nothing else, so every control story used to render loose on the scene
   with UA typography (serif), no spacing and nothing behind the glass.
   These helpers give each story a real composition, using only tokens and
   the public material API:
   - Stage    page column: system font stack, rhythm, backdrop-aware ink
   - Section  caption + note + content (captions read on the scene)
   - Scene    content BEHIND chrome glass, as DOM siblings of the glass (a
              descendant would hit the engine's nesting rule and lose its
              backdrop): colour fields + large type, so blur, tint floor and
              legibility are visible
   - Panel    content-raised card for form controls (content material,
              never glass), declaring its own light/dark ink via Environment
   No literal colours, no inline optics, no data-ag-part (stories must only
   render the parts their meta declares). */
import * as React from 'react';
import { Environment, Surface } from '../../../src/material';

const ink = 'var(--_ag-on-surface, var(--ag-color-on-surface))';

export function Stage({ children, maxWidth = 960 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        padding: 'var(--ag-space-10) var(--ag-space-8)',
        fontFamily: 'var(--ag-font-sans)',
        fontSize: 'var(--ag-type-body-size)',
        lineHeight: 'var(--ag-type-body-leading)',
        color: ink,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div style={{ display: 'grid', gap: 'var(--ag-space-8)', maxInlineSize: `${maxWidth}px`, marginInline: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--ag-space-3)' }}>
      <header style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 'var(--ag-type-title-3-size)',
            lineHeight: 'var(--ag-type-title-3-leading)',
            fontWeight: 'var(--ag-type-title-3-weight)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h2>
        {note ? (
          <p style={{ margin: 0, fontSize: 'var(--ag-type-callout-size)', lineHeight: 'var(--ag-type-callout-leading)', opacity: 0.8 }}>
            {note}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function Row({
  children,
  gap = 'var(--ag-space-3)',
  align = 'center',
  wrap = true,
}: {
  children: React.ReactNode;
  gap?: string;
  align?: React.CSSProperties['alignItems'];
  wrap?: boolean;
}) {
  return <div style={{ display: 'flex', flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: align, gap }}>{children}</div>;
}

/** Small caption used for matrix row / column labels. */
export function Caption({ children, width }: { children: React.ReactNode; width?: string }) {
  return (
    <span
      style={{
        inlineSize: width,
        flex: width ? 'none' : undefined,
        fontSize: 'var(--ag-type-caption-size)',
        lineHeight: 'var(--ag-type-caption-leading)',
        fontWeight: 'var(--ag-type-label-weight)',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        opacity: 0.78,
      }}
    >
      {children}
    </span>
  );
}

/* Colour fields for the scene, from the semantic palette only. */
const ART = [
  'radial-gradient(circle at 12% 28%, color-mix(in oklab, var(--ag-color-warning) 90%, transparent), transparent 34%)',
  'radial-gradient(circle at 46% 92%, color-mix(in oklab, var(--ag-color-danger) 80%, transparent), transparent 38%)',
  'radial-gradient(circle at 86% 18%, color-mix(in oklab, var(--ag-color-info) 85%, transparent), transparent 40%)',
  'linear-gradient(120deg, var(--ag-color-accent), color-mix(in oklab, var(--ag-color-success) 70%, var(--ag-color-accent)))',
].join(', ');

const ART_LINES = [
  'Northern lights over the fjord',
  'Field notes · Week 41',
  'Tromsø — 69.6° N',
];

/**
 * Content behind chrome glass. `children` are laid over the artwork as
 * siblings of it, so glass controls sample real, high-contrast detail.
 */
export function Scene({
  children,
  minBlockSize = 'calc(var(--ag-space-16) * 3)',
  align = 'center',
  justify = 'center',
}: {
  children: React.ReactNode;
  minBlockSize?: string;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        minBlockSize,
        borderRadius: 'var(--ag-radius-xl)',
        overflow: 'hidden',
        isolation: 'isolate',
        boxShadow: 'var(--ag-shadow-regular)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          gridArea: '1 / 1',
          display: 'grid',
          alignContent: 'space-between',
          padding: 'var(--ag-space-6)',
          backgroundImage: ART,
          color: 'var(--ag-color-on-accent)',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontSize: 'var(--ag-type-display-size)',
            lineHeight: 'var(--ag-type-display-leading)',
            fontWeight: 'var(--ag-type-display-weight)',
            letterSpacing: '-0.02em',
            maxInlineSize: '14ch',
          }}
        >
          {ART_LINES[0]}
        </span>
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--ag-space-4)', fontSize: 'var(--ag-type-callout-size)', fontWeight: 'var(--ag-type-label-weight)' }}>
          <span>{ART_LINES[1]}</span>
          <span>{ART_LINES[2]}</span>
        </span>
      </div>
      <div
        style={{
          gridArea: '1 / 1',
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: align,
          justifyContent: justify,
          alignContent: align,
          gap: 'var(--ag-space-3)',
          padding: 'var(--ag-space-6)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Content-raised card for form controls. The Environment inside re-declares
 * the ink for an opaque canvas card, so a card on a media scene does not
 * inherit the scene's flipped (white) on-surface ink.
 */
export function Panel({
  title,
  description,
  children,
  width = 440,
  footer,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: number;
  footer?: React.ReactNode;
}) {
  return (
    <Surface
      layer="content"
      style={{
        inlineSize: `min(100%, ${width}px)`,
        borderRadius: 'var(--ag-radius-xl)',
        color: 'var(--ag-color-on-surface)',
      }}
    >
      <Environment backdrop="auto">
        <div style={{ display: 'grid', gap: 'var(--ag-space-5)', padding: 'var(--ag-space-6)' }}>
          {title || description ? (
            <header style={{ display: 'grid', gap: 'var(--ag-space-1)' }}>
              {title ? (
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'var(--ag-type-title-3-size)',
                    lineHeight: 'var(--ag-type-title-3-leading)',
                    fontWeight: 'var(--ag-type-title-3-weight)',
                  }}
                >
                  {title}
                </h3>
              ) : null}
              {description ? (
                <p
                  style={{
                    margin: 0,
                    color: 'var(--ag-color-on-surface-muted)',
                    fontSize: 'var(--ag-type-callout-size)',
                    lineHeight: 'var(--ag-type-callout-leading)',
                  }}
                >
                  {description}
                </p>
              ) : null}
            </header>
          ) : null}
          {children}
          {footer ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--ag-space-2)',
                paddingBlockStart: 'var(--ag-space-4)',
                borderBlockStart: 'calc(var(--ag-focus-width) / 2) solid color-mix(in oklab, var(--ag-color-on-surface) 12%, transparent)',
              }}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </Environment>
    </Surface>
  );
}

/** A settings row: label + optional hint on the start side, control on the end side. */
export function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--ag-space-4)' }}>
      <div style={{ display: 'grid', gap: 'var(--ag-space-0)', minInlineSize: 0 }}>
        <span style={{ fontWeight: 'var(--ag-type-label-weight)' }}>{label}</span>
        {hint ? (
          <span style={{ color: 'var(--ag-color-on-surface-muted)', fontSize: 'var(--ag-type-caption-size)', lineHeight: 'var(--ag-type-caption-leading)' }}>
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** 16px line glyphs for stories (currentColor, 1.6 stroke). */
export function Glyph({ name }: { name: 'close' | 'plus' | 'share' | 'heart' | 'trash' | 'undo' | 'redo' | 'bold' | 'italic' | 'underline' | 'pointer' | 'move' | 'pin' | 'search' | 'gear' }) {
  const d: Record<string, string> = {
    close: 'M4.5 4.5l7 7M11.5 4.5l-7 7',
    plus: 'M8 3.5v9M3.5 8h9',
    share: 'M8 2.5v7M5.25 5.25 8 2.5l2.75 2.75M4 8.5v4h8v-4',
    heart: 'M8 13s-4.75-2.9-4.75-6.25A2.5 2.5 0 0 1 8 5.1a2.5 2.5 0 0 1 4.75 1.65C12.75 10.1 8 13 8 13Z',
    trash: 'M3.5 4.5h9M6.5 4.5V3h3v1.5M5 4.5l.5 8h5l.5-8',
    undo: 'M6 4 3 7l3 3M3.5 7H9a3.5 3.5 0 0 1 0 7H7',
    redo: 'M10 4l3 3-3 3M12.5 7H7a3.5 3.5 0 0 0 0 7h2',
    bold: 'M5 3h3.75a2.25 2.25 0 0 1 0 4.5H5zM5 7.5h4.25a2.25 2.25 0 0 1 0 4.5H5z',
    italic: 'M9.5 3H12M4 13h2.5M10.75 3 5.25 13',
    underline: 'M5 3v4.5a3 3 0 0 0 6 0V3M4 13h8',
    pointer: 'M4 2.5l8 5-3.5.75L10.5 13l-1.75.75-2-4.75L4 11.5z',
    move: 'M8 2v12M2 8h12M8 2 6.5 3.5M8 2l1.5 1.5M8 14l-1.5-1.5M8 14l1.5-1.5M2 8l1.5-1.5M2 8l1.5 1.5M14 8l-1.5-1.5M14 8l-1.5 1.5',
    pin: 'M6 2.5h4M7 2.5v4L4.5 9h7L9 6.5v-4M8 9v4.5',
    search: 'M7 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM10.25 10.25 13.5 13.5',
    gear: 'M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4',
  };
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d={d[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
