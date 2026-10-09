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
};

export interface OverlayMaterialOpts {
  variant?: MaterialAttributes['data-ag-variant'] | 'regular' | 'clear' | 'identity' | undefined;
  thickness?: 'thick' | 'regular' | 'thin' | undefined;
  prominent?: boolean | undefined;
}

/* REQ-CMP-97: variant/thickness/prominent are overridable by the component
   (popover honours its material-bearing root props) while the layer/thickness
   kind defaults stay. */
export function overlayMaterial(kind: OverlayKind, opts: OverlayMaterialOpts = {}): MaterialAttributes & { 'data-ag-overlay': OverlayKind } {
  return {
    ...materialProps({
      layer: 'overlay',
      thickness: opts.thickness ?? THICKNESS[kind],
      variant: (opts.variant as never) ?? 'regular',
      prominent: opts.prominent,
    }),
    'data-ag-overlay': kind,
  };
}
