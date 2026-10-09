/* CMP-192 (REQ-CMP-85): overlayMaterial(kind) — the single place overlay popups
   get their layer=overlay material attributes. Thickness by kind:
   dialog/alert/sheet thick; popover/menu regular; tooltip/toast thin. */
import { materialProps } from '../../../material';
import type { MaterialAttributes } from '../../../contracts/material';
import type { OverlayKind } from './overlayTypes';

const THICKNESS: Record<OverlayKind, 'thick' | 'regular' | 'thin'> = {
  dialog: 'thick',
  'alert-dialog': 'thick',
  sheet: 'thick',
  popover: 'regular',
  menu: 'regular',
  tooltip: 'thin',
  toast: 'thin',
  select: 'regular',
  combobox: 'regular',
};

export interface OverlayMaterialOptions {
  /** Per-instance overlay material is restricted to 'regular' | 'identity'. */
  variant?: 'regular' | 'identity';
  /** 'prominent' is honoured only on dialog and popover per REQ-CMP-78. */
  prominent?: boolean;
}

const PROMINENT_KINDS: ReadonlySet<OverlayKind> = new Set(['dialog', 'popover']);

export function overlayMaterial(
  kind: OverlayKind,
  opts: OverlayMaterialOptions = {},
): MaterialAttributes & { 'data-ag-overlay': OverlayKind } {
  return {
    ...materialProps({ layer: 'overlay', thickness: THICKNESS[kind], variant: opts.variant ?? 'regular' }),
    'data-ag-overlay': kind,
    ...(opts.prominent === true && PROMINENT_KINDS.has(kind) ? { 'data-ag-prominent': '' } : {}),
  } as MaterialAttributes & { 'data-ag-overlay': OverlayKind };
}
