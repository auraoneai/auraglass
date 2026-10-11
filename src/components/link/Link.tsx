/* CMP-305/CMP-423: Link — <a> with a render prop for router links.
   target='_blank' automatically adds rel='noopener noreferrer' and a
   VisuallyHidden " (opens in new tab)" suffix. intent neutral|danger (SC-24);
   underline always|hover|none. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { renderElement } from '../../foundation/index';
import type { RenderProp } from '../../contracts/components';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  intent?: 'neutral' | 'danger';
  underline?: 'always' | 'hover' | 'none';
  render?: RenderProp<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export function Link({
  intent = 'neutral',
  underline = 'hover',
  render,
  target,
  rel,
  children,
  className,
  ref,
  ...rest
}: LinkProps & { ref?: React.Ref<HTMLAnchorElement> | undefined }) {
  const external = target === '_blank';
  const props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { ref?: React.Ref<HTMLAnchorElement> } = {
    ...rest,
    ref,
    target,
    rel: external ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel,
    'data-ag-part': 'root',
    'data-ag-intent': intent,
    'data-ag-underline': underline,
    className: cn('ag-link', className),
    children: (
      <>
        <span data-ag-part="hit-area" aria-hidden="true" />
        {children}
        {external ? <VisuallyHidden> (opens in new tab)</VisuallyHidden> : null}
      </>
    ),
  } as React.AnchorHTMLAttributes<HTMLAnchorElement> & { ref?: React.Ref<HTMLAnchorElement> };
  return renderElement(render, <a />, props);
}
