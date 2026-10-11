'use client';
/* Sidebar.Collapsible (SURF-033/038): CMP Collapsible seam — Base UI owns
   aria-expanded/hidden on the trigger and panel. The Collapsible root IS the
   <li data-ag-part='sidebar-collapsible'> (render prop) so list nesting stays
   valid. Default-open is computed by scanning React.Children for a
   Sidebar.Item with current (recursively); an explicit defaultOpen wins. */

import * as React from 'react';
import { Collapsible } from '../components/collapsible';
import type { FC, ReactNode } from 'react';
import { SidebarItem } from './Sidebar.Nav';

/* CMP seed compounds are typed Record<part, FC>; bind parts locally. */
const CollapsibleRoot = Collapsible.Root as FC<{
  defaultOpen?: boolean;
  render?: React.ReactElement;
  children?: ReactNode;
}>;
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

function hasCurrentItem(node: React.ReactNode): boolean {
  let found = false;
  React.Children.forEach(node, (child) => {
    if (found || !React.isValidElement(child)) return;
    if (child.type === SidebarItem && (child.props as { current?: boolean }).current) {
      found = true;
      return;
    }
    const kids = (child.props as { children?: React.ReactNode }).children;
    if (kids !== undefined && hasCurrentItem(kids)) found = true;
  });
  return found;
}

export function SidebarCollapsible({
  label,
  defaultOpen,
  hasCurrent,
  children,
  ...rest
}: SidebarCollapsibleProps) {
  const open = defaultOpen ?? hasCurrent ?? hasCurrentItem(children);
  return (
    <CollapsibleRoot
      defaultOpen={open}
      render={<li data-ag-part="sidebar-collapsible" {...(rest as Record<string, unknown>)} />}
    >
      <CollapsibleTrigger className="ag-sidebar__item">
        {label}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul>{children}</ul>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}
