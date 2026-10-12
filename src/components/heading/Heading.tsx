/* CMP-296/CMP-420 + REQ-CMP-111: Heading — T0 server leaf. Required `level`
   1–6 renders h1..h6; `size` is display|title-1|title-2|title-3 (plus the granular sm|md|lg|xl
   axis) with a
   level-derived default (1→title-1, 2→title-2, 3+→title-3; DisplayText
   absorbed). parts [root]. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { renderElement } from '../../foundation/index';
import type { RenderProp } from '../../contracts/components';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level 1..6 — controls the rendered element only. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual role; defaults by level — 1→'title-1', 2→'title-2', 3+→'title-3'. */
  size?: 'display' | 'title-1' | 'title-2' | 'title-3' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
  /** Replaces the rendered element; the component props and state are merged onto it. */
  render?: RenderProp<React.HTMLAttributes<HTMLHeadingElement>>;
}

export function Heading({
  level,
  size,
  render,
  className,
  ref,
  ...rest
}: HeadingProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLHeadingElement> | undefined }) {
  const Tag = `h${level}` as 'h1';
  const resolvedSize = size ?? (level === 1 ? 'title-1' : level === 2 ? 'title-2' : 'title-3');
  const props = {
    ...rest,
    'data-ag-part': 'root',
    'data-level': level,
    'data-ag-size': resolvedSize,
    className: cn('ag-heading', `ag-heading-size-${resolvedSize}`, className),
  } as React.HTMLAttributes<HTMLHeadingElement>;
  return renderElement(render, <Tag ref={ref} />, props);
}
