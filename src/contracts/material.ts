/* AuraGlass 5.0 contract-v1.0. CONTRACT-owned: change only in a contract PR. Type-only except frozen constants. */
import type * as React from 'react';
import type { RadiusToken, SpaceToken } from './tokens';

export type MaterialVariant = 'regular' | 'clear' | 'identity';           // D-06
export type Thickness = 'thin' | 'regular' | 'thick';                     // D-07
export type Layer = 'chrome' | 'overlay' | 'transient' | 'content';       // §4.1
export type LayerAttr = Layer | 'scrim';                                  // 'scrim' is emitted only by overlay backdrops
export type ContentMaterial = 'content-raised' | 'content-sunken';
export type Backdrop = 'light' | 'dark' | 'media' | 'auto';
export type Tier = 'lightweight' | 'standard' | 'enhanced' | 'cinematic';
export type DomTier = Exclude<Tier, 'cinematic'>;                         // values allowed in data-ag-tier
export type Engine = 'chromium' | 'webkit' | 'gecko' | 'unknown';
export type Transparency = 'glass' | 'tinted' | 'solid';
export type Shape = 'fixed' | 'capsule' | 'concentric';
export type EdgeStyle = 'soft' | 'hard';                                  // erratum E-01: prop is edgeStyle, not style

export interface MaterialRole {
  layer?: Layer;
  variant?: MaterialVariant;      // default 'regular'; ignored for layer='content' unless set explicitly
  thickness?: Thickness;
  content?: ContentMaterial;      // layer='content' only; default 'content-raised'
  shape?: Shape;
  fallbackRadius?: RadiusToken;
  interactive?: boolean;
  prominent?: boolean;
  refraction?: boolean;
  allowNested?: boolean;
}

export interface MaterialAttributes {
  className: 'ag-surface';
  'data-ag-surface': '';
  'data-ag-layer': Layer;
  'data-ag-variant'?: MaterialVariant;
  'data-ag-thickness'?: Thickness;
  'data-ag-content'?: ContentMaterial;
  'data-ag-shape'?: Shape;
  'data-ag-interactive'?: '';
  'data-ag-prominent'?: '';
  'data-ag-refraction'?: '';
  'data-ag-allow-nested'?: '';
}
export type MaterialPropsFn = (role: MaterialRole) => MaterialAttributes;
export type UseMaterialTier = () => Tier;   // reads <html data-ag-tier> via useSyncExternalStore; 'cinematic' only inside @auraglass/labs

export interface SurfaceProps extends MaterialRole, Omit<React.HTMLAttributes<HTMLElement>, 'content'> {
  render?: React.ReactElement;
  ref?: React.Ref<HTMLElement>;
}
export interface SurfaceGroupProps { spacing?: SpaceToken; children: React.ReactNode; className?: string   /** Opt-in refraction flag on the group surface. */
  refraction?: boolean | undefined;
}
export interface EnvironmentProps { backdrop: Backdrop; image?: string; video?: string; children: React.ReactNode; className?: string }
export interface ScrollEdgeProps { edge: 'top' | 'bottom'; edgeStyle?: EdgeStyle }
export interface ConcentricFrameProps { radius: RadiusToken; inset: SpaceToken; children: React.ReactNode }

/** S-02: class grammar. Library CSS keys only on these, data-ag-* and data-state. */
export const SURFACE_CLASS = 'ag-surface' as const;
export type ComponentClass<K extends string> = `ag-${K}`;
export type PartClass<K extends string, P extends string> = `ag-${K}__${P}`;

/** S-01: attribute registry. Setter = the stream allowed to emit the attribute in dist/. */
export const AG_ATTRIBUTES = {
  // public, semver-stable (architecture §4.5)
  'data-ag-surface': { setter: 'MAT', values: [''] },
  'data-ag-layer': { setter: 'MAT', values: ['chrome', 'overlay', 'transient', 'content', 'scrim'] },
  'data-ag-variant': { setter: 'MAT', values: ['regular', 'clear', 'identity'] },
  'data-ag-thickness': { setter: 'MAT', values: ['thin', 'regular', 'thick'] },
  'data-ag-content': { setter: 'MAT', values: ['content-raised', 'content-sunken'] },
  'data-ag-shape': { setter: 'MAT', values: ['fixed', 'capsule', 'concentric'] },
  'data-ag-interactive': { setter: 'MAT', values: [''] },
  'data-ag-prominent': { setter: 'MAT', values: [''] },
  'data-ag-refraction': { setter: 'MAT', values: [''] },
  'data-ag-allow-nested': { setter: 'MAT', values: [''] },
  'data-ag-group': { setter: 'MAT', values: [''] },
  'data-ag-backdrop': { setter: 'ANY', values: ['light', 'dark', 'media', 'auto'] },
  'data-ag-engine': { setter: 'MAT', values: ['chromium', 'webkit', 'gecko', 'unknown'] },
  'data-ag-tier': { setter: 'MAT', values: ['lightweight', 'standard', 'enhanced'] },
  'data-ag-scheme': { setter: 'MAT', values: ['light', 'dark'] },
  'data-ag-contrast': { setter: 'MAT', values: ['standard', 'more'] },
  'data-ag-transparency': { setter: 'MAT', values: ['glass', 'tinted', 'solid'] },
  'data-ag-motion': { setter: 'MAT', values: ['full', 'calm', 'none'] },
  'data-ag-density': { setter: 'MAT', values: ['compact', 'regular', 'spacious'] },
  'data-ag-animating': { setter: 'MAT', values: [''] },
  'data-ag-part': { setter: 'ANY', values: 'kebab-case part name (S-33)' },
  'data-ag-preview': { setter: 'MAT', values: ['v5'], branch: 'release/4.x' },
  // ratified, public (MAT: a11y + motion)
  'data-ag-root': { setter: 'MAT', values: [''] },
  'data-ag-provider': { setter: 'MAT', values: [''] },
  'data-ag-portal-root': { setter: 'MAT', values: [''] },
  'data-ag-layer-root': { setter: 'MAT', values: ['overlay', 'transient', 'toast'] },
  'data-ag-announcer': { setter: 'MAT', values: [''] },
  'data-ag-obscured': { setter: 'MAT', values: [''] },
  'data-ag-focusable': { setter: 'ANY', values: [''] },
  'data-ag-scroll-container': { setter: 'ANY', values: [''] },
  'data-ag-continuous': { setter: 'MAT', values: ['on'] },
  'data-ag-offscreen': { setter: 'MAT', values: [''] },
  'data-ag-vt': { setter: 'MAT', values: [''] },
  'data-ag-vt-participant': { setter: 'MAT', values: [''] },
  'data-ag-vt-settled': { setter: 'MAT', values: [''] },
  'data-ag-pointer-light': { setter: 'MAT', values: [''] },
  'data-ag-highlights': { setter: 'MAT', values: [''] },
  // ratified, public (CMP)
  'data-ag-size': { setter: 'CMP|SURF', values: ['sm', 'md', 'lg'] },
  'data-ag-intent': { setter: 'CMP|SURF', values: ['neutral', 'info', 'success', 'warning', 'danger'] },
  'data-ag-overlay': { setter: 'CMP', values: ['dialog', 'alert-dialog', 'sheet', 'popover', 'menu', 'tooltip', 'toast', 'select', 'combobox', 'preview-card'] },
  'data-ag-overlay-depth': { setter: 'CMP', values: 'integer >= 0' },
  'data-ag-nested-open': { setter: 'CMP', values: [''] },
  // ratified, public (SURF)
  'data-ag-media-root': { setter: 'SURF', values: [''] },
  'data-ag-media-tone': { setter: 'SURF', values: ['light', 'dark'] },
  'data-ag-backdrop-preset': { setter: 'SURF', values: ['aurora', 'mesh', 'photo', 'video', 'grain'] },
  'data-ag-palette': { setter: 'SURF', values: 'preset palette id' },
  'data-ag-slot': { setter: 'SURF', values: 'AppShell slot name, declared in AppShell.meta.ts' },
  'data-ag-sidebar': { setter: 'SURF', values: ['expanded', 'collapsed', 'rail'] },
  'data-ag-sidebar-side': { setter: 'SURF', values: ['start', 'end'] },
  'data-ag-layout': { setter: 'SURF', values: ['auto', 'desktop', 'mobile'] },
  'data-ag-placement': { setter: 'SURF', values: ['inline', 'overlay'] },
  'data-ag-appearance': { setter: 'CMP|SURF', values: 'component-specific non-material look (e.g. sidebar|inset|floating, underline|pill), declared in meta' },
  'data-ag-inspector': { setter: 'SURF', values: ['open', 'closed'] },
  'data-ag-pinned-edge': { setter: 'SURF', values: ['start', 'end', 'top'] },
  // private to MAT (not semver, undocumented)
  'data-ag-sizeclass': { setter: 'MAT', values: 'private' },
  'data-ag-radius': { setter: 'MAT', values: 'private' },
  'data-ag-spacing': { setter: 'MAT', values: 'private' },
  'data-ag-inset': { setter: 'MAT', values: 'private' },
  'data-ag-edge': { setter: 'MAT', values: ['top', 'bottom'] },
  'data-ag-edge-style': { setter: 'MAT', values: ['soft', 'hard'] },
  'data-ag-lens-ready': { setter: 'MAT', values: 'private' },
  'data-ag-full-height': { setter: 'MAT', values: 'private' },
  // story-only: must never appear in dist/ (QUAL)
  'data-ag-story-content': { setter: 'QUAL', values: 'story-only' },
  'data-ag-story-kind': { setter: 'QUAL', values: ['lab', 'component', 'matrix', 'scene', 'showcase'] },
  'data-ag-cert-ready': { setter: 'QUAL', values: 'story-only' },
  'data-ag-lab-override': { setter: 'QUAL', values: 'story-only' },
  'data-ag-state-cell': { setter: 'QUAL', values: 'story-only' },
  'data-ag-seed': { setter: 'CONTRACT', values: 'seed-only; banned in dist/ (§1.2 R5)' },
} as const;
export type AgAttribute = keyof typeof AG_ATTRIBUTES;
/** Banned forever (D-20 and erratum to CTL): */
export const BANNED_ATTRIBUTES = ['data-ag-material', 'data-ag-button-variant', 'data-meets-wcag'] as const;
