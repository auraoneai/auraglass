/* CMP-300: Card — compound (Root, Header, Title, Description, Body, Footer)
   per COMPOUND_PARTS. Material-bearing root (content layer by default);
   `interactive` marks the whole card focusable/hoverable. Server-safe. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';
import type { MaterialRole } from '../../contracts/material';

export interface CardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  material?: MaterialRole;
}

function Root({
  interactive,
  material,
  tabIndex,
  className,
  ref,
  ...rest
}: CardRootProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const mat = materialProps(material);
  return (
    <div
      {...rest}
      {...mat}
      ref={ref}
      data-ag-part="root"
      data-ag-interactive={interactive ? '' : undefined}
      tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
      className={cn('ag-card', interactive ? 'ag-card-interactive' : undefined, className)}
    />
  );
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
