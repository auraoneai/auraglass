/* CMP-304/CMP-423: DescriptionList — <dl> with .Item (<div>), .Term (<dt>),
   .Details (<dd>). layout stacked|inline; terms stack above details below a
   400px container (container query in DescriptionList.css). parts
   [root, item, label, value]; server. */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface DescriptionListItem {
  term: React.ReactNode;
  details: React.ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  layout?: 'stacked' | 'inline';
  /** Orientation shorthand: 'horizontal' = inline, 'vertical' = stacked.
     Wins over `layout` when set. */
  orientation?: 'horizontal' | 'vertical';
  /** Flat API — renders Item/Term/Details parts for each row; compound
     children may still be used instead. */
  items?: readonly DescriptionListItem[];
}

function Root({
  layout = 'stacked',
  orientation,
  items,
  className,
  ref,
  children,
  ...rest
}: DescriptionListProps & { ref?: React.Ref<HTMLDListElement> | undefined }) {
  const resolved = orientation === 'horizontal' ? 'inline' : orientation === 'vertical' ? 'stacked' : layout;
  return (
    <dl
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-layout={resolved}
      className={cn('ag-dl', className)}
    >
      {items
        ? items.map((item, i) => (
            <Item key={i}>
              <Term>{item.term}</Term>
              <Details>{item.details}</Details>
            </Item>
          ))
        : children}
    </dl>
  );
}

function Item({ className, ref, ...rest }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return <div {...rest} ref={ref} data-ag-part="item" className={cn('ag-dl-item', className)} />;
}

function Term({ className, ref, ...rest }: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> | undefined }) {
  return <dt {...rest} ref={ref} data-ag-part="label" className={cn('ag-dl-term', className)} />;
}

function Details({ className, ref, ...rest }: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> | undefined }) {
  return <dd {...rest} ref={ref} data-ag-part="value" className={cn('ag-dl-details', className)} />;
}

export const DescriptionList = Object.assign(Root, { Item, Term, Details });
