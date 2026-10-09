/* CMP-426 compat: GlassGallery (4.x) -> ImageList items API (5.0). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ImageList } from '../../../components/image-list';
import type { ImageListItem } from '../../../components/image-list';
import { __compatWrap as wrap } from './_shared';

const DEP = 'DEP-C0234';

export interface GlassGalleryProps {
  images?: readonly { src: string; alt?: string; caption?: string }[];
  columns?: number;
  gap?: number | string;
  className?: string;
}

export function GlassGallery({ images, columns, gap, className }: GlassGalleryProps) {
  warnDeprecated(DEP);
  const items: ImageListItem[] | undefined = images?.map((im) => ({
    src: im.src,
    alt: im.alt ?? '',
    title: im.caption,
  }));
  return wrap('GlassGallery', (
    <ImageList
      cols={columns}
      {...(gap !== undefined ? { gap } : {})}
      {...(items !== undefined ? { items } : {})}
      {...(className !== undefined ? { className } : {})}
    />
  ));
}
