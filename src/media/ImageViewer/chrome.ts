/* REQ-SURF-145 — the MAT chrome material for ImageViewer's Toolbar and
 * Caption: layer=chrome, variant=clear (the popup declares
 * data-ag-backdrop='media', so MAT's clear-over-media rules apply). */
import { materialProps } from '../../material';

export const chromeMaterial = materialProps({ layer: 'chrome', variant: 'clear' });
export const chromeClass = (part: string): string => `ag-surface ${part}`;
