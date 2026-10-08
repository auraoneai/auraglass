/* CMP-314: Collapsible on BU Collapsible, APG Disclosure. Root/Trigger/
   Content; open/defaultOpen/onOpenChange(open, details); our data-state is
   expanded|collapsed (BU's own attrs pass through unchanged).
   parts [root, trigger, content]. */
'use client';
import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { cn } from '../../internal/index';
import { toChangeDetails } from '../../foundation/index';

export interface CollapsibleRootProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: unknown) => void;
  disabled?: boolean;
}

function Root({ open, defaultOpen, onOpenChange, className, ref, ...rest }: CollapsibleRootProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false);
  const current = open ?? uncontrolled;
  return (
    <BaseCollapsible.Root
      {...rest}
      ref={ref}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(o: boolean, details: unknown) => {
        setUncontrolled(o);
        onOpenChange?.(o, toChangeDetails(details));
      }}
      data-ag-part="root"
      data-state={current ? 'expanded' : 'collapsed'}
      className={cn('ag-collapsible', className)}
    />
  );
}

function Trigger({ className, ref, ...rest }: React.ComponentProps<typeof BaseCollapsible.Trigger>) {
  return <BaseCollapsible.Trigger {...rest} ref={ref} data-ag-part="trigger" className={cn('ag-collapsible-trigger', className)} />;
}

function Content({ className, ref, ...rest }: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return <BaseCollapsible.Panel {...rest} ref={ref} data-ag-part="content" className={cn('ag-collapsible-content', className)} />;
}

export const Collapsible = { Root, Trigger, Content };
