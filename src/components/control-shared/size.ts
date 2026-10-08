/** Shared control size grammar (CMP-095). */
export type ControlSize = 'sm' | 'md' | 'lg';
export const DEFAULT_CONTROL_SIZE: ControlSize = 'md';

export interface ControlSizeAttrs {
  'data-ag-size': ControlSize;
  'data-ag-size-class': 'control';
}

export function sizeAttrs(size?: ControlSize): ControlSizeAttrs {
  return { 'data-ag-size': size ?? DEFAULT_CONTROL_SIZE, 'data-ag-size-class': 'control' };
}
