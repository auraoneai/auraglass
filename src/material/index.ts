/* @ag-contract-seed: S-05, S-06. Owner MAT replaces internals; exports frozen.
   materialProps is the FINAL implementation (§4.10 emission rules); the rest are seeds. */
import * as React from 'react';
import type {
  MaterialRole, MaterialAttributes, SurfaceProps, SurfaceGroupProps,
  EnvironmentProps, ScrollEdgeProps, ConcentricFrameProps, Tier,
} from '../contracts/material';
import { SURFACE_CLASS } from '../contracts/material';

/** S-05. Final emission rules (§4.10): */
export function materialProps(role: MaterialRole = {}): MaterialAttributes {
  const layer = role.layer ?? 'content';
  const out: Record<string, string> = {
    'data-ag-surface': '',
    'data-ag-layer': layer,
  };
  const variant = role.variant ?? 'regular';
  if (!(layer === 'content' && role.variant === undefined)) out['data-ag-variant'] = variant;
  if (layer === 'content') out['data-ag-content'] = role.content ?? 'content-raised';
  if (role.thickness !== undefined) out['data-ag-thickness'] = role.thickness;
  if (role.shape !== undefined) out['data-ag-shape'] = role.shape;
  if (role.fallbackRadius !== undefined) out['data-ag-radius'] = role.fallbackRadius;
  if (role.interactive === true) out['data-ag-interactive'] = '';
  if (role.prominent === true) out['data-ag-prominent'] = '';
  if (role.refraction === true) out['data-ag-refraction'] = '';
  if (role.allowNested === true) out['data-ag-allow-nested'] = '';
  return out as unknown as MaterialAttributes;
}

export function Surface({ render, className, style, ref, ...rest }: SurfaceProps) {
  const {
    layer, variant, thickness, content, shape, fallbackRadius,
    interactive, prominent, refraction, allowNested, ...domProps
  } = rest;
  const cls = [SURFACE_CLASS, className].filter(Boolean).join(' ');
  const role = Object.fromEntries(
    Object.entries({
      layer, variant, thickness, content, shape, fallbackRadius,
      interactive, prominent, refraction, allowNested,
    }).filter(([, v]) => v !== undefined),
  ) as MaterialRole;
  const merged = {
    ...materialProps(role),
    ...domProps,
    className: cls,
    style,
    ref,
  };
  if (render && React.isValidElement(render)) {
    const rp = (render.props ?? {}) as Record<string, unknown>;
    return React.cloneElement(render, {
      ...merged,
      className: [cls, rp.className].filter(Boolean).join(' '),
    } as Record<string, unknown>);
  }
  return React.createElement('div', merged);
}

export function SurfaceGroup({ spacing, children, className }: SurfaceGroupProps) {
  return React.createElement('div', {
    'data-ag-group': '',
    className,
    style: spacing !== undefined ? ({ '--ag-group-spacing': `var(--ag-space-${spacing})` } as React.CSSProperties) : undefined,
  }, children);
}

export function Environment({ backdrop, image, video, children, className }: EnvironmentProps) {
  const style: React.CSSProperties = {};
  if (image) (style as Record<string, string>)['--ag-backdrop-image'] = `url(${image})`;
  if (video) (style as Record<string, string>)['--ag-backdrop-video'] = `url(${video})`;
  return React.createElement('div', { 'data-ag-backdrop': backdrop, className, style }, children);
}

export function ScrollEdge({ edge, edgeStyle }: ScrollEdgeProps) {
  return React.createElement('div', { 'data-ag-edge': edge, 'data-ag-edge-style': edgeStyle });
}

export function ConcentricFrame({ radius, inset, children }: ConcentricFrameProps) {
  return React.createElement('div', {
    style: { '--ag-radius-outer': `var(--ag-radius-${radius})`, '--ag-inset': `var(--ag-space-${inset})` } as React.CSSProperties,
  }, children);
}

export function useMaterialTier(): Tier {
  return 'standard';
}
