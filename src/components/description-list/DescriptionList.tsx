/* CMP-304/CMP-423: DescriptionList — <dl> with .Item (<div>), .Term (<dt>),
   .Details (<dd>). layout stacked|inline; terms stack above details below a
   400px container (container query in DescriptionList.css). parts
   [root, item, label, value]; server. */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  layout?: 'stacked' | 'inline';
}

function Root({ layout = 'stacked', className, ref, ...rest }: DescriptionListProps & { ref?: React.Ref<HTMLDListElement> | undefined }) {
  return (
    <dl
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-layout={layout}
      className={cn('ag-dl', className)}
    />
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
