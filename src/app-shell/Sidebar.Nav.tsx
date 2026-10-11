/* Server Sidebar.Nav + Sidebar.Item family (SURF-035/036):
   <nav aria-label> (dev-warned when missing) > ul > li > item.
   Item renders <a href> by default — href is required unless a render prop is
   supplied; render merges onto the element; current → aria-current="page";
   render=<button> dev-warns that destinations should be links.
   Rail state keeps accessible names: labels are visually hidden (MAT seam
   class), not removed. */

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';
import { SidebarItemTooltip } from './Sidebar.ItemTooltip';

export type SidebarNavProps = PartProps<'nav'> & { 'aria-label'?: string | undefined };

export function SidebarNav({ children, render, ...rest }: SidebarNavProps) {
  if (process.env['NODE_ENV'] === 'development' && rest['aria-label'] === undefined) {
    console.warn('[auraglass] Sidebar.Nav: aria-label is required — nav landmarks must be labelled.');
  }
  return partElement('nav', {
    render,
    'data-ag-part': 'sidebar-nav',
    ...rest,
    children: <ul>{children}</ul>,
  });
}
SidebarNav.displayName = 'Sidebar.Nav';

export type SidebarItemProps = Omit<PartProps<'a'>, 'href'> & {
  href?: string | undefined;
  /** Current destination — emits aria-current="page". */
  current?: boolean | undefined;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
};

export function SidebarItem({ href, current, icon, badge, children, render, ...rest }: SidebarItemProps) {
  if (process.env['NODE_ENV'] === 'development') {
    if (href === undefined && render === undefined) {
      console.warn('[auraglass] Sidebar.Item: href is required unless a render prop is given.');
    }
    if (render && React.isValidElement(render) && render.type === 'button') {
      console.warn('[auraglass] Sidebar.Item: destinations should be links — render=<button> is discouraged.');
    }
  }
  // REQ-FIN-81: compose onClick/onKeyDown locally (not in foundation) so a
  // render element's handler (e.g. a RouterLink's) and the Item's own handler
  // both fire — the user's Item handler first. Base UI mergeProps runs the
  // rightmost handler first, so the Item's handlers go on the right.
  let renderEl = render;
  const own: Record<string, unknown> = { ...rest };
  if (React.isValidElement(render)) {
    const rp = render.props as Record<string, unknown>;
    const fromRender: Record<string, unknown> = {};
    const fromItem: Record<string, unknown> = {};
    for (const key of ['onClick', 'onKeyDown'] as const) {
      if (typeof rp[key] === 'function' && typeof own[key] === 'function') {
        fromRender[key] = rp[key];
        fromItem[key] = own[key];
        delete own[key];
      }
    }
    if (Object.keys(fromItem).length > 0) {
      renderEl = React.cloneElement(render, mergeProps(fromRender, fromItem) as never);
    }
  }
  const link = partElement('a', {
    render: renderEl,
    ...(href !== undefined ? { href } : {}),
    'data-ag-part': 'sidebar-item',
    className: 'ag-sidebar__item',
    ...(current ? { 'aria-current': 'page', 'data-ag-current': '' } : {}),
    ...own,
    children: (
      <>
        {icon !== undefined ? <SidebarItemIcon>{icon}</SidebarItemIcon> : null}
        <span className="ag-sidebar__item-label">{children}</span>
        {badge !== undefined ? <SidebarItemBadge>{badge}</SidebarItemBadge> : null}
      </>
    ),
  });
  return (
    <li data-ag-part="sidebar-item-li">
      <SidebarItemTooltip label={children}>{link}</SidebarItemTooltip>
    </li>
  );
}
SidebarItem.displayName = 'Sidebar.Item';

export function SidebarItemIcon({ children, render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render,
    'data-ag-part': 'sidebar-item-icon',
    'aria-hidden': 'true',
    ...rest,
    children,
  });
}
SidebarItemIcon.displayName = 'Sidebar.ItemIcon';

export function SidebarItemBadge({ children, render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render,
    'data-ag-part': 'sidebar-item-badge',
    ...rest,
    children,
  });
}
SidebarItemBadge.displayName = 'Sidebar.ItemBadge';
