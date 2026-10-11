/* CMP-192 (REQ-CMP-85): overlayMaterial(kind) — the single place overlay popups
   get their layer=overlay material attributes. Thickness by kind:
   dialog/alert/sheet thick; popover/menu/select/combobox regular;
   tooltip/toast thin (REQ-CMP-78).
   Per-instance material (REQ-CMP-78, REQ-CMP-97): a component may override
   the kind's thickness and choose variant 'regular' | 'identity'; 'prominent'
   is honoured only on dialog and popover. */
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
  /** Per-instance overlay material is restricted to 'regular' | 'identity' (REQ-CMP-78). */
  variant?: 'regular' | 'identity' | undefined;
  /** Overrides the kind's default thickness (REQ-CMP-97). */
  thickness?: 'thick' | 'regular' | 'thin' | undefined;
  /** Honoured only on dialog and popover (REQ-CMP-78); ignored elsewhere. */
  prominent?: boolean | undefined;
}

const PROMINENT_KINDS: ReadonlySet<OverlayKind> = new Set<OverlayKind>(['dialog', 'popover']);

export function overlayMaterial(
  kind: OverlayKind,
  opts: OverlayMaterialOptions = {},
): MaterialAttributes & { 'data-ag-overlay': OverlayKind } {
  const prominent = opts.prominent === true && PROMINENT_KINDS.has(kind);
  return {
    ...materialProps({
      layer: 'overlay',
      thickness: opts.thickness ?? THICKNESS[kind],
      variant: opts.variant ?? 'regular',
      ...(prominent ? { prominent: true } : {}),
    }),
    'data-ag-overlay': kind,
  };
}
