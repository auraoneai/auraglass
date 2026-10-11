/* VisuallyHidden (CMP-033): <span data-ag-part="root" class="ag-visually-hidden">,
   server-safe, render prop, focusable variant un-hides on :focus-visible.
   Absorbs src/primitives/focus/ScreenReader.tsx. No asChild (use render). */
import * as React from 'react';
import { renderElement } from '../foundation/index';
import type { RenderProp } from '../contracts/components';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  render?: RenderProp<React.HTMLAttributes<HTMLSpanElement>>;
  /** When true the element becomes visible on :focus-visible (skip links). */
  focusable?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

export function VisuallyHidden({ render, focusable, ...props }: VisuallyHiddenProps): React.ReactElement {
  const spanProps = {
    'data-ag-part': 'root',
    ...(focusable ? { 'data-ag-focusable': '' } : {}),
    ...props,
    className: ['ag-visually-hidden', props.className].filter(Boolean).join(' '),
  };
  return renderElement(render, <span />, spanProps);
}

VisuallyHidden.displayName = 'VisuallyHidden';
