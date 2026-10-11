/* CMP-295/CMP-420: Text — T0 server leaf. `type` selects the S-03 --ag-type-<role>-*
   roles (body default, callout, caption, label, mono); size xs|sm|md|lg is
   independent. muted + intent neutral|success|warning|danger (SC-24 →
   data-ag-intent); weight + truncate styling hooks via data attrs. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { renderElement } from '../../foundation/index';
import type { RenderProp } from '../../contracts/components';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** S-03 type role; defaults to 'body'. */
  type?: 'body' | 'callout' | 'caption' | 'label' | 'mono';
  /** Optional override; unset = the type role's own size. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | undefined;
  muted?: boolean;
  intent?: 'neutral' | 'success' | 'warning' | 'danger';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  /** Element or render function used instead of the default <p>. */
  render?: RenderProp<React.HTMLAttributes<HTMLElement>>;
}

export function Text({
  type = 'body',
  size,
  muted,
  intent,
  weight,
  truncate,
  render,
  className,
  ref,
  ...rest
}: TextProps & { ref?: React.Ref<HTMLElement> | undefined }) {
  const props: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> } = {
    ...rest,
    ref,
    'data-ag-part': 'root',
    'data-ag-type': type,
    'data-ag-size': size ?? undefined,
    'data-ag-intent': intent ?? 'neutral',
    'data-ag-muted': muted ? '' : undefined,
    'data-ag-weight': weight,
    'data-ag-truncate': truncate ? '' : undefined,
    className: cn('ag-text', `ag-text-type-${type}`, size ? `ag-text-size-${size}` : undefined, className),
  } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  return renderElement(render, <p />, props);
}
