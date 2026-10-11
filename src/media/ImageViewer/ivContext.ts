'use client';
import * as React from 'react';
import type { ImageViewerItem } from './types';
import type { toChangeDetails } from '../../foundation';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

export interface ImageViewerContextValue {
  items: ImageViewerItem[];
  index: number;
  current: ImageViewerItem | null;
  open: boolean;
  zoom: number;
  setIndex(i: number, details: ChangeDetails): void;
  next(details: ChangeDetails): void; prev(details: ChangeDetails): void;
  setOpen(o: boolean, details: ChangeDetails): void;
  setZoom(z: number): void;
  loop: boolean;
  popupId: string;
}
export const ImageViewerContext = React.createContext<ImageViewerContextValue | null>(null);
export function useImageViewer(part: string): ImageViewerContextValue {
  const c = React.useContext(ImageViewerContext);
  if (!c) throw new Error(`ImageViewer.${part} must render inside <ImageViewer.Root>`);
  return c;
}
