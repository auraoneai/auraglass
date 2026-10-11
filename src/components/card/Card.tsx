/* CMP-300 + REQ-CMP-113: Card — compound (Root, Header, Title, Description,
   Body, Footer) per COMPOUND_PARTS. Root takes MaterialBearingProps
   (variant|thickness|prominent|refraction — content layer by default);
   `interactive` emits data-ag-interactive and consumers give the card a real
   interactive element via `render` (link/button) — no forced tabIndex on a
   div. Server-safe. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';
import { renderElement } from '../../foundation/index';
import type { MaterialBearingProps, RenderProp } from '../../contracts/components';

export interface CardRootProps extends MaterialBearingProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Marks the card interactive (data-ag-interactive); pair with `render`. */
  interactive?: boolean;
  render?: RenderProp<React.HTMLAttributes<HTMLElement>>;
}

function Root({
  interactive,
  variant,
  thickness,
  prominent,
  refraction,
  render,
  tabIndex,
  className,
  ref,
  ...rest
}: CardRootProps & { ref?: React.Ref<HTMLElement> | undefined }) {
  const role: Parameters<typeof materialProps>[0] = { layer: 'content' };
  if (variant !== undefined) role.variant = variant;
  if (thickness !== undefined) role.thickness = thickness;
  if (prominent !== undefined) role.prominent = prominent;
  if (refraction !== undefined) role.refraction = refraction;
  if (interactive !== undefined) role.interactive = interactive;
  const mat = materialProps(role);
  const props = {
    ...rest,
    ...mat,
    ref,
    'data-ag-part': 'root',
    className: cn('ag-card', mat.className, interactive ? 'ag-card-interactive' : undefined, className),
  } as React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  return renderElement(render, <div />, props);
}

function Header({ className, ref, ...rest }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return <div {...rest} ref={ref} data-ag-part="header" className={cn('ag-card-header', className)} />;
}

function Title({ className, ref, ...rest }: React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement> | undefined }) {
  return <h3 {...rest} ref={ref} data-ag-part="title" className={cn('ag-card-title', className)} />;
}

function Description({ className, ref, ...rest }: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> | undefined }) {
  return <p {...rest} ref={ref} data-ag-part="description" className={cn('ag-card-description', className)} />;
}

function Body({ className, ref, ...rest }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return <div {...rest} ref={ref} data-ag-part="body" className={cn('ag-card-body', className)} />;
}

function Footer({ className, ref, ...rest }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return <div {...rest} ref={ref} data-ag-part="footer" className={cn('ag-card-footer', className)} />;
}

export const Card = Object.assign(Root, { Root, Header, Title, Description, Body, Footer });
