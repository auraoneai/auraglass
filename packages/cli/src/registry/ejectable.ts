/** REQ-PLAT-87: ejectable components for `add --source` — the flagship
 *  components (ComponentMeta.flagship 1..44 families) plus T2 core, derived
 *  from the in-repo src/**.meta.ts files (name slugged). T0 material
 *  (Surface/SurfaceGroup/Environment) is never ejectable. When a fetched
 *  source item carries meta.auraglass.tier/flagship, that metadata decides;
 *  otherwise this list decides. */
export const EJECTABLE_SLUGS: ReadonlySet<string> = new Set([
  'accordion', 'activity-feed', 'agent-steps', 'alert', 'alert-dialog',
  'app-shell', 'avatar', 'avatar-group', 'backdrop', 'badge', 'breadcrumbs',
  'button', 'button-group', 'calendar', 'carousel-rail', 'chart-frame',
  'checkbox', 'checkbox-group', 'chip', 'citation', 'collapsible',
  'color-picker', 'combobox', 'command', 'command-palette', 'composer',
  'date-field', 'date-picker', 'date-range-picker', 'dialog', 'empty-state',
  'error-state', 'field', 'fieldset', 'file-upload', 'filter-bar', 'form',
  'glass-preferences-panel', 'icon-button', 'image-list', 'image-viewer',
  'inline-edit', 'key-value-editor', 'loading-state', 'media-controls',
  'media-scrubber', 'menu', 'message', 'meter', 'now-playing-bar',
  'number-field', 'pagination', 'popover', 'progress', 'provider-error-state',
  'radio-group', 'rating', 'reasoning', 'resizable-panels', 'scroll-area',
  'search-field', 'segmented-control', 'select', 'sheet', 'sidebar',
  'skeleton', 'slider', 'source-list', 'source-transition', 'sparkline',
  'stat-card', 'steps', 'streaming-text', 'switch', 'tab-bar', 'table',
  'tabs', 'text-field', 'thread', 'time-field', 'time-picker', 'timeline',
  'toast', 'toggle-group', 'tool-call', 'toolbar', 'tooltip', 'top-bar',
  'tour', 'tree-view', 'usage-meter',
]);

export interface EjectMeta { tier?: string | undefined; flagship?: number | boolean | undefined }

/** Decide ejectability: explicit item metadata wins; absent metadata falls
 *  back to the flagship + T2-core slug list. */
export function isEjectable(slug: string, meta?: EjectMeta | undefined): boolean {
  if (meta?.tier !== undefined) {
    return /^(t1|t2|flagship|core)$/i.test(meta.tier.trim());
  }
  if (meta?.flagship !== undefined) {
    return meta.flagship === true || (typeof meta.flagship === 'number' && meta.flagship >= 1 && meta.flagship <= 44);
  }
  return EJECTABLE_SLUGS.has(slug);
}
