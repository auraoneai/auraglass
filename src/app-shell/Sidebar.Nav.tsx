/* Server Sidebar.Nav + Sidebar.Item family (SURF-035/036):
   <nav aria-label> (dev-warned when missing) > ul > li > item.
   Item renders <a href> by default — href is required unless a render prop is
   supplied; render merges onto the element; current → aria-current="page";
   render=<button> dev-warns that destinations should be links.
   SURF-28: when both the render element (e.g. a RouterLink) and the Item
   carry onClick/onKeyDown, the two are composed with Base UI mergeProps —
   the Item (user) handler runs first, then the render element's — instead
   of the render element's prop silently replacing the Item's.
   Rail state keeps accessible names: labels are visually hidden (MAT seam
   class), not removed. */

import * as React from 'react';
import { mergeProps } from '../foundation/base-ui/merge-props';
import { LandmarkBeacon } from './_internal/LandmarkBeacon';
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
    children: <ul><LandmarkBeacon role="navigation" name={rest['aria-label'] as string | undefined} />{children}</ul>,
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
  const link = partElement('a', {
    render: composeRenderHandlers(render, rest),
    ...(href !== undefined ? { href } : {}),
    'data-ag-part': 'sidebar-item',
    className: 'ag-sidebar__item',
    ...(current ? { 'aria-current': 'page', 'data-current': '' } : {}),
    ...rest,
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

const COMPOSED_HANDLERS = ['onClick', 'onKeyDown'] as const;

/** Returns `render` with onClick/onKeyDown composed against the Item's own
    handlers. mergeProps runs the rightmost handler first, so the Item props
    go on the right (user handler first, render element's second). */
function composeRenderHandlers(
  render: SidebarItemProps['render'],
  own: Record<string, unknown>,
): SidebarItemProps['render'] {
  if (!React.isValidElement(render)) return render;
  const rp = (render.props ?? {}) as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  for (const key of COMPOSED_HANDLERS) {
    if (typeof rp[key] === 'function' && typeof own[key] === 'function' && rp[key] !== own[key]) {
      outer[key] = rp[key];
      inner[key] = own[key];
    }
  }
  if (Object.keys(outer).length === 0) return render;
  const merged = mergeProps<'a'>(outer, inner) as Record<string, unknown>;
  const handlers: Record<string, unknown> = {};
  for (const key of Object.keys(outer)) handlers[key] = merged[key];
  return React.cloneElement(render, handlers);
}

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
