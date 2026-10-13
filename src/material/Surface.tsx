/* MAT-136 — Surface. Emits materialProps() attributes; no `as`, no deleted
   optical props (types.ts never-markers make them compile errors). No
   'use client' directive: Surface is a Server Component, so it never creates
   a ref callback (a function ref in an RSC tree fails serialization); dev
   warnings run from the SurfaceWarnAnchor client leaf instead (dev only).
   REQ-MAT-24: `style` is forwarded only when passed; refs are React 19
   ref-as-prop (RefObject). */
import * as React from 'react';
import { cn } from '../internal';
import type { SurfaceProps } from './types';
import { materialProps } from './materialProps';
import { SurfaceWarnAnchor } from './dev/SurfaceWarnAnchor.client';

const setRef = (r: React.Ref<HTMLElement> | undefined, node: HTMLElement | null): void => {
  if (typeof r === 'function') { (r as (n: HTMLElement | null) => void)(node); return; }
  if (r && typeof r === 'object') (r as React.RefObject<HTMLElement | null>).current = node;
};

/** Compose the consumer ref with the render element's own ref. Only called
    when at least one exists — both can only originate in client code. */
const composeRefs = (
  a: React.Ref<HTMLElement> | undefined,
  b: React.Ref<HTMLElement> | undefined,
): React.Ref<HTMLElement> => {
  if (!a) return b as React.Ref<HTMLElement>;
  if (!b) return a;
  return (node: HTMLElement | null) => { setRef(a, node); setRef(b, node); };
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
  const consumerRef = ref as React.Ref<HTMLElement> | undefined;
  // REQ-MAT-38: the NODE_ENV ternary folds in a production consumer build, so
  // the dev anchor (and the warnings module behind it) drops out of the bundle
  const devAnchor = process.env.NODE_ENV !== 'production'
    ? React.createElement(SurfaceWarnAnchor, { key: 'ag-surface-warn-anchor' })
    : null;

  const cls = cn('ag-surface', className);
  const { children, ...domRest } = domProps as { children?: React.ReactNode } & Record<string, unknown>;
  const merged: Record<string, unknown> = {
    ...attrs,
    ...domRest,          // consumer wins for non-data-ag-* attributes
    className: cls,
    // by reference — never merged or rewritten; the key is added only when the
    // consumer passed `style`, so cloneElement keeps a render element's own style
    ...(style !== undefined ? { style } : {}),
    // a ref key exists only when a consumer/render ref was actually passed
    ...(consumerRef !== undefined || renderRef !== undefined
      ? { ref: composeRefs(consumerRef, renderRef) }
      : {}),
  };
  // data-ag-* attributes are authoritative: re-apply over any consumer spread
  for (const [k, v] of Object.entries(attrs)) {
    merged[k] = v;
  }

  if (render && React.isValidElement(render)) {
    const rp = (render.props ?? {}) as Record<string, unknown>;
    const baseChildren = children !== undefined ? children : (rp.children as React.ReactNode);
    return React.cloneElement(render, {
      ...merged,
      className: cn(cls, rp.className as string),
    } as Record<string, unknown>, baseChildren, devAnchor);
  }
  return React.createElement('div', merged, children, devAnchor);
}
