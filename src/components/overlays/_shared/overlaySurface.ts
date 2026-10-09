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

export function overlayMaterial(kind: OverlayKind): MaterialAttributes & { 'data-ag-overlay': OverlayKind } {
  return {
    ...materialProps({ layer: 'overlay', thickness: THICKNESS[kind], variant: 'regular' }),
    'data-ag-overlay': kind,
  };
}
