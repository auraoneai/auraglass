'use client';
/* Shared helpers for the SURF 4.x compat adapters (REQ-SURF-13).
   Adapters destructure every 4.x prop they translate; whatever is left is
   filtered through domProps() so 4.x-only props (variant, elevation, size,
   respectMotionPreference, ...) never leak onto the 5.0 component's DOM
   element. The adapter's single deprecation warning (warnDeprecated(DEP-S id))
   is the only signal that those props are ignored. */
import * as React from 'react';

const PASS = new Set(['className', 'id', 'style', 'title', 'role', 'tabIndex', 'lang', 'dir', 'hidden']);

/** Keep only the global HTML attributes a 4.x consumer may have set. */
export function domProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    if (PASS.has(key) || key.startsWith('aria-') || key.startsWith('data-')) {
      if (key === 'className' && value === '') continue;
      if (key === 'title' && typeof value !== 'string') continue;
      out[key] = value;
    }
  }
  return out;
}

/** 4.x left/right placement → 5.0 logical side. */
export function sideOf(placement: unknown): 'start' | 'end' {
  return placement === 'right' ? 'end' : 'start';
}

/** A 4.x handler-only item (onClick, no href) renders as a <button>, which is
    what the app-shell-slots codemod emits: render={<button type="button" onClick={h} />}. */
export function itemRender(
  href: string | undefined,
  onClick: (() => void) | undefined,
  disabled?: boolean,
): { href: string } | { render: React.ReactElement } {
  if (href !== undefined) return { href };
  return { render: <button type="button" onClick={onClick} disabled={disabled} /> };
}
