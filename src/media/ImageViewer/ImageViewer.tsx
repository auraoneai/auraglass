'use client';
/* REQ-SURF-141..145 — ImageViewer: id-keyed items; the popup is CMP Dialog
 * (one portal into the overlay layer root, one LayerStack entry, one Escape
 * owner — REQ-FIN-07 transfer); ≤3 <img>; zoom 1–8× step 1.25; wheel zoom
 * only ctrl/meta-or-zoomed; pan pointer capture; two-pointer pinch; Counter
 * announces once; Inspector side ≥768 px / bottom below. */
import * as React from 'react';
import { ImageViewerContext, type ImageViewerContextValue } from './ivContext';
import type { ImageViewerItem } from './types';
import { Trigger } from './parts/Trigger';
import { Popup, type ImageViewerPopupProps } from './parts/Popup';
import { Stage } from './parts/Stage';
import { Toolbar } from './parts/Toolbar';
import { Caption } from './parts/Caption';
import { Inspector } from './parts/Inspector';
import { Prev } from './parts/Prev';
import { Next } from './parts/Next';
import { Counter } from './parts/Counter';
import { ZoomIn } from './parts/ZoomIn';
import { ZoomOut } from './parts/ZoomOut';
import { ZoomReset } from './parts/ZoomReset';
import { Close } from './parts/Close';

export type { ImageViewerItem } from './types';
export type { ImageViewerPopupProps } from './parts/Popup';

export interface ImageViewerRootProps {
  items: ImageViewerItem[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((id: string) => void) | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  loop?: boolean | undefined;
  /** Sample the current image's tone (after decode) into the Stage's
   * data-ag-media-tone. Cross-origin images need `crossOrigin` on the item
   * plus CORS headers; otherwise no tone is written. Default true. */
  sampleTone?: boolean | undefined;
  children?: React.ReactNode;
}

const clampZoom = (z: number) => Math.min(8, Math.max(1, z));

function Root(props: ImageViewerRootProps): React.ReactElement {
  const { items, value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, loop = false, sampleTone = true, children } = props;
  const isControlledV = value !== undefined;
  const isControlledO = open !== undefined;
  const [innerId, setInnerId] = React.useState<string | undefined>(defaultValue ?? items[0]?.id);
  const [innerOpen, setInnerOpen] = React.useState(!!defaultOpen);
  const [zoom, setZoom] = React.useState(1);
  const currentId = isControlledV ? value : innerId;
  const isOpen = isControlledO ? open : innerOpen;
  const index = Math.max(0, items.findIndex((i) => i.id === currentId));
  const current = items[index] ?? null;
  const popupId = React.useId();
  const setZoomClamped = React.useCallback((z: number) => setZoom(clampZoom(z)), []);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const [captionId, setCaptionId] = React.useState<string | null>(null);
  const [hasInspector, setHasInspector] = React.useState(false);

  const setIndex = (i: number) => {
    const item = items[i];
    if (!item) return;
    if (!isControlledV) setInnerId(item.id);
    onValueChange?.(item.id);
    setZoom(1);
  };
  const step = (d: number) => {
    if (items.length === 0) return;
    let n = index + d;
    if (loop) n = ((n % items.length) + items.length) % items.length;
    else n = Math.min(items.length - 1, Math.max(0, n));
    setIndex(n);
  };
  const setOpen = (o: boolean) => {
    if (!isControlledO) setInnerOpen(o);
    onOpenChange?.(o);
    if (!o) setZoom(1);
  };

  const ctx: ImageViewerContextValue = {
    items, index, current, open: !!isOpen, zoom, loop, popupId,
    setIndex, next: () => step(1), prev: () => step(-1), setOpen,
    setZoom: setZoomClamped,
    triggerRef, captionId, setCaptionId, hasInspector, setHasInspector, sampleTone,
  };
  return <ImageViewerContext.Provider value={ctx}>{children}</ImageViewerContext.Provider>;
}

export const ImageViewer = {
  Root, Trigger, Popup, Stage, Toolbar, Caption, Inspector, Prev, Next,
  Counter, ZoomIn, ZoomOut, ZoomReset, Close,
} as const;
export type ImageViewer = typeof ImageViewer;
