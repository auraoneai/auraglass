/* S-01 setter paths: MAT-owned data-ag-* attributes that CMP/SURF elements carry.
   The attribute names are written only here (setter MAT, src/contracts/material.ts
   AG_ATTRIBUTES); callers decide when an element carries them. Internal: not
   exported from the package entries. */
import type { SpaceToken } from '../contracts/material';

/** SurfaceGroup marker + private spacing token (REQ-MAT-25). */
export function surfaceGroupAttributes(spacing: SpaceToken | undefined): { 'data-ag-group': ''; 'data-ag-spacing'?: SpaceToken } {
  return spacing === undefined ? { 'data-ag-group': '' } : { 'data-ag-group': '', 'data-ag-spacing': spacing };
}

/** Opt-in pointer light host (REQ-MOT-40). */
export function pointerLightAttributes(on: boolean | undefined): { 'data-ag-pointer-light'?: '' } {
  return on ? { 'data-ag-pointer-light': '' } : {};
}

/** Subtree preference scope: density / motion written on a component root. */
export function preferenceScopeAttributes(scope: {
  density?: 'compact' | 'regular' | 'spacious' | undefined;
  motion?: 'full' | 'calm' | 'none' | undefined;
}): { 'data-ag-density'?: 'compact' | 'regular' | 'spacious'; 'data-ag-motion'?: 'full' | 'calm' | 'none' } {
  return {
    ...(scope.density ? { 'data-ag-density': scope.density } : {}),
    ...(scope.motion ? { 'data-ag-motion': scope.motion } : {}),
  };
}

/** data-ag-animating while an element runs a material/motion transition. */
export function setAnimating(el: Element, on: boolean): void {
  el.toggleAttribute('data-ag-animating', on);
}

/** View-transition participant marker read by the motion seam (REQ-MOT view transitions). */
export function viewTransitionParticipantAttributes(): { 'data-ag-vt-participant': '' } {
  return { 'data-ag-vt-participant': '' };
}
