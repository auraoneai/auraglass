/* Server Sidebar (SURF-034): chrome thick material column; Root carries
   data-ag-appearance sidebar|inset|floating (inset wraps in ConcentricFrame);
   data-ag-variant is emitted ONLY when a material variant is explicitly
   requested — appearance is never a variant. Content is the only scroll
   area. Nav/item parts live in SidebarNav (server) and SidebarCollapsible
   (client). */

import * as React from 'react';
import type { PartProps } from '../contracts/components';
import type { MaterialVariant } from '../contracts/material';
import { partElement } from './_internal/partElement';
import { ConcentricFrame, Surface } from '../material';
import { SidebarNav, SidebarItem, SidebarItemIcon, SidebarItemBadge } from './Sidebar.Nav';
import { SidebarCollapsible } from './Sidebar.Collapsible';
import { SidebarDrawer } from './Sidebar.Drawer';

export type SidebarRootProps = PartProps<'aside'> & {
  labels?: { navigation?: string } | undefined;
  /** 'sidebar' = flush column; 'inset' = framed inside main padding;
      'floating' = detached chrome panel. Never maps to data-ag-variant. */
  appearance?: 'sidebar' | 'inset' | 'floating' | undefined;
  /** Material variant override — the ONLY source of data-ag-variant. */
  variant?: MaterialVariant | undefined;
};

function SidebarRoot({ appearance = 'sidebar', variant, labels, children, render, ...rest }: SidebarRootProps) {
  const aside = partElement('aside', {
    render,
    'data-ag-slot': 'sidebar',
    'data-ag-part': 'sidebar',
    className: 'ag-sidebar',
    ...(labels?.navigation !== undefined ? { 'aria-label': labels.navigation } : {}),
    'data-ag-appearance': appearance,
    ...rest,
    children,
  });
  const surfaced = (
    <Surface
      layer="chrome"
      thickness="thick"
      {...(variant ? { variant } : {})}
      render={aside}
    />
  );
  // The drawer is auto-mounted with the same children so consumers do not
  // duplicate the tree (SURF-31). It renders content only in drawer modes.
  const drawer = <SidebarDrawer>{children}</SidebarDrawer>;
  if (appearance === 'inset') {
    return (
      <>
        <ConcentricFrame radius="md" inset="2">{surfaced}</ConcentricFrame>
        {drawer}
      </>
    );
  }
  return (
    <>
      {surfaced}
      {drawer}
    </>
  );
}
SidebarRoot.displayName = 'Sidebar.Root';

function SidebarHeader({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', { render, 'data-ag-part': 'sidebar-header', ...rest, children });
}
SidebarHeader.displayName = 'Sidebar.Header';

function SidebarContent({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', {
    render,
    'data-ag-part': 'sidebar-content',
    className: 'ag-sidebar__content',
    ...rest,
    children,
  });
}
SidebarContent.displayName = 'Sidebar.Content';

function SidebarFooter({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', { render, 'data-ag-part': 'sidebar-footer', ...rest, children });
}
SidebarFooter.displayName = 'Sidebar.Footer';

export type SidebarGroupProps = PartProps<'li'> & { label?: React.ReactNode };

function SidebarGroup({ label, children, render, ...rest }: SidebarGroupProps) {
  return partElement('li', {
    render,
    'data-ag-part': 'sidebar-group',
    ...rest,
    children: (
      <>
        {label !== undefined ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
        <ul data-ag-part="sidebar-group-items">{children}</ul>
      </>
    ),
  });
}
SidebarGroup.displayName = 'Sidebar.Group';

function SidebarGroupLabel({ children, render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render,
    'data-ag-part': 'sidebar-group-label',
    className: 'ag-sidebar__group-label',
    ...rest,
    children,
  });
}
SidebarGroupLabel.displayName = 'Sidebar.GroupLabel';

function SidebarSeparator({ render, ...rest }: PartProps<'li'>) {
  return partElement('li', {
    render,
    'data-ag-part': 'sidebar-separator',
    'aria-hidden': 'true',
    className: 'ag-sidebar__separator',
    ...rest,
  });
}
SidebarSeparator.displayName = 'Sidebar.Separator';

export const Sidebar = {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Separator: SidebarSeparator,
  Nav: SidebarNav,
  Item: SidebarItem,
  ItemIcon: SidebarItemIcon,
  ItemBadge: SidebarItemBadge,
  Collapsible: SidebarCollapsible,
  Drawer: SidebarDrawer,
};
