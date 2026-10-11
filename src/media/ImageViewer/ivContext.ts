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
  /** REQ-SURF-142: the Trigger that opened the popup; focus returns here on close. */
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  /** REQ-SURF-142: id of the mounted Caption (the popup's aria-labelledby target), else null. */
  captionId: string | null;
  setCaptionId(id: string | null): void;
  /** REQ-SURF-145: true while an Inspector part is mounted (layout reserves its region). */
  hasInspector: boolean;
  setHasInspector(v: boolean): void;
  /** REQ-SURF-145: sample the current image tone onto the Stage. */
  sampleTone: boolean;
}
export const ImageViewerContext = React.createContext<ImageViewerContextValue | null>(null);
export function useImageViewer(part: string): ImageViewerContextValue {
  const c = React.useContext(ImageViewerContext);
  if (!c) throw new Error(`ImageViewer.${part} must render inside <ImageViewer.Root>`);
  return c;
}
