/* CMP-296/CMP-420: Heading — T0 server leaf. Required `level` 1–6 renders
   h1..h6; `size` is independent of level (display|title-1|title-2|title-3 plus
   the granular sm|md|lg|xl|display axis; DisplayText absorbed). parts [root]. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { renderElement } from '../../foundation/index';
import type { RenderProp } from '../../contracts/components';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level 1..6 — controls the rendered element only. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of `level`. */
  size?: 'display' | 'title-1' | 'title-2' | 'title-3' | 'sm' | 'md' | 'lg' | 'xl';
  render?: RenderProp<React.HTMLAttributes<HTMLHeadingElement>>;
}

export function Heading({
  level,
  size = 'md',
  render,
  className,
  ref,
  ...rest
}: HeadingProps & { ref?: React.Ref<HTMLHeadingElement> | undefined }) {
  const Tag = `h${level}` as 'h1';
  const props = {
    ...rest,
    ref,
    'data-ag-part': 'root',
    'data-level': level,
    'data-ag-size': size,
    className: cn('ag-heading', `ag-heading-size-${size}`, className),
  } as React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement> };
  return renderElement(render, <Tag />, props);
}
