'use client';
import * as React from 'react';
import type { ImageViewerItem } from './types';

export interface ImageViewerContextValue {
  items: ImageViewerItem[];
  index: number;
  current: ImageViewerItem | null;
  open: boolean;
  zoom: number;
  setIndex(i: number): void;
  next(): void; prev(): void;
  setOpen(o: boolean): void;
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
