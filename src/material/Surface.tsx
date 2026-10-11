/* MAT-136 — Surface. Emits materialProps() attributes; no `as`, no deleted
   optical props (types.ts never-markers make them compile errors). Dev warnings
   run from the ref callback — no 'use client' directive. */
import * as React from 'react';
import { cn } from '../internal';
import type { SurfaceProps } from './types';
import { materialProps } from './materialProps';
import { warnSurface } from './dev/warnings';

const composeRef = (
  a: React.Ref<HTMLElement> | undefined,
  b: (el: HTMLElement | null) => void,
): ((node: HTMLElement | null) => void) => (node) => {
  b(node);
  if (typeof a === 'function') return a(node) as void;
  if (a && typeof a === 'object') (a as React.MutableRefObject<HTMLElement | null>).current = node;
  return undefined;
};

export function Surface({ render, className, style, ref, ...rest }: SurfaceProps) {
  const {
    layer, variant, thickness, content, shape, fallbackRadius,
    interactive, prominent, refraction, allowNested,
    // never-props: present only for @ts-expect-error coverage at the type level
    ...domProps
  } = rest;

  const role = Object.fromEntries(
    Object.entries({
      layer, variant, thickness, content, shape, fallbackRadius,
      interactive, prominent, refraction, allowNested,
    }).filter(([, v]) => v !== undefined),
  ) as Parameters<typeof materialProps>[0];
  const attrs = materialProps(role);

  const renderRef = render && React.isValidElement(render)
    ? (render.props as { ref?: React.Ref<HTMLElement> }).ref
    : undefined;
  // consumer ref -> dev warnings, then the render element's own ref last
  const warnAndConsumerRef = composeRef(
    ref as React.Ref<HTMLElement> | undefined,
    warnSurface,
  ) as (el: HTMLElement | null) => void;
  const finalRef = composeRef(renderRef, warnAndConsumerRef);

  const cls = cn('ag-surface', className);
  const merged: Record<string, unknown> = {
    ...attrs,
    ...domProps,          // consumer wins for non-data-ag-* attributes
    className: cls,
    style,                // by reference — never merged or rewritten
    ref: finalRef,
  };
  // data-ag-* attributes are authoritative: re-apply over any consumer spread
  for (const [k, v] of Object.entries(attrs)) {
    merged[k] = v;
  }

  if (render && React.isValidElement(render)) {
    const rp = (render.props ?? {}) as Record<string, unknown>;
    return React.cloneElement(render, {
      ...merged,
      className: cn(cls, rp.className as string),
    } as Record<string, unknown>);
  }
  return React.createElement('div', merged);
}
