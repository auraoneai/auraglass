'use client';
/* Sidebar.Collapsible (SURF-038): CMP Collapsible seam. Trigger aria-expanded,
   panel hidden when closed. defaultOpen=true when a direct Sidebar.Item child
   is current (computed by the server parent — pass hasCurrent); an explicit
   defaultOpen always wins. */

import * as React from 'react';
import { Collapsible } from '../components/collapsible';
import type { FC, ReactNode } from 'react';

/* CMP seed compounds are typed Record<part, FC>; bind parts locally. */
const CollapsibleRoot = Collapsible.Root as FC<{ defaultOpen?: boolean; children?: ReactNode }>;
const CollapsibleTrigger = Collapsible.Trigger as FC<Record<string, unknown> & { children?: ReactNode }>;
const CollapsibleContent = Collapsible.Content as FC<Record<string, unknown> & { children?: ReactNode }>;
import type { PartProps } from '../contracts/components';

export type SidebarCollapsibleProps = PartProps<'li'> & {
  /** Trigger label. */
  label?: React.ReactNode;
  defaultOpen?: boolean | undefined;
  /** Server-computed: does a direct Sidebar.Item child carry current? */
  hasCurrent?: boolean | undefined;
};

export function SidebarCollapsible({
  label,
  defaultOpen,
  hasCurrent,
  children,
  ...rest
}: SidebarCollapsibleProps) {
  const open = defaultOpen ?? hasCurrent ?? false;
  return (
    <CollapsibleRoot defaultOpen={open}>
      <li data-ag-part="sidebar-collapsible" {...(rest as Record<string, unknown>)}>
        <CollapsibleTrigger aria-expanded={open} className="ag-sidebar__item">
          {label}
        </CollapsibleTrigger>
        <CollapsibleContent {...(open ? {} : { hidden: true })}>
          <ul>{children}</ul>
        </CollapsibleContent>
      </li>
    </CollapsibleRoot>
  );
}
