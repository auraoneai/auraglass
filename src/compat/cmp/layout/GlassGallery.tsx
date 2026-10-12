/* CMP-127 compat: GlassGallery (4.x) -> ImageList flat items API (5.0).
   warnDeprecated fires at call time, once per page load per symbol; never throws.
   Mapping: images[] -> items[] (caption -> title, missing alt -> ''),
   columns -> cols, gap and className pass through. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList } from '../../../components/image-list';
import type { ImageListItem } from '../../../components/image-list';

const DEP = 'DEP-C0262';

export interface GlassGalleryProps {
  images?: readonly { src: string; alt?: string; caption?: string }[];
  columns?: number;
  gap?: number | string;
  className?: string;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link ImageList}. */
export function GlassGallery({ images, columns, gap, className }: GlassGalleryProps) {
  warnDeprecated(DEP);
  const items: ImageListItem[] | undefined = images?.map((im) => ({
    src: im.src,
    alt: im.alt ?? '',
    title: im.caption,
  }));
  return (
    <ImageList
      {...(columns !== undefined ? { cols: columns } : {})}
      {...(gap !== undefined ? { gap } : {})}
      {...(items !== undefined ? { items } : {})}
      {...(className !== undefined ? { className } : {})}
    />
  );
}
