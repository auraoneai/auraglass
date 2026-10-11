/* Server AppShell namespace (SURF-014): serializable props land as data-ag-*
   attributes; parts self-place via data-ag-slot (no displayName sniffing, no
   cloneElement). Client parts (SidebarToggle/InspectorToggle/Controller) live
   in their own 'use client' modules and are attached as namespace members —
   importing them here turns each into a client boundary, never the whole
   namespace. */

import * as React from 'react';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';
import { AppShellSidebarToggle } from './AppShell.SidebarToggle';
import { AppShellInspectorToggle } from './AppShell.InspectorToggle';
import { AppShellController } from './AppShell.Controller';
import type { SidebarState, InspectorState, ShellMode } from './appShellStore';

export type AppShellRootProps = PartProps<'div'> & {
  defaultSidebar?: SidebarState | undefined;
  defaultInspector?: InspectorState | undefined;
  sidebarSide?: 'start' | 'end' | undefined;
  /** 'auto' derives the mode from the shell's own width via container queries. */
  layout?: 'auto' | 'mobile' | ShellMode | undefined;
  /** What AppShellSidebarToggle collapses to from expanded (default 'rail'). */
  collapseTo?: Exclude<SidebarState, 'expanded'> | undefined;
  density?: 'compact' | 'regular' | 'comfortable' | undefined;
  backdrop?: 'none' | 'page' | 'region' | undefined;
  /** When set, sidebar/inspector persist to an `ag-shell-<key>` cookie. */
  persistKey?: string | undefined;
};

function Root({
  defaultSidebar = 'expanded',
  defaultInspector = 'closed',
  sidebarSide = 'start',
  layout = 'auto',
  collapseTo = 'rail',
  density,
  backdrop,
  persistKey,
  children,
  render,
  ...rest
}: AppShellRootProps) {
  const shellId = React.useId();
  // SURF-18: one useId-derived main id per shell, so two shells never collide
  // on one constant id. It reaches Main/SkipLink by element type on Root's
  // direct children — this module is on the SURF-07 server list, so no
  // context. An explicit Main `id` / SkipLink `href` always wins.
  const mainId = `ag-main-${shellId.replace(/[^A-Za-z0-9_-]/g, '')}`;
  const items = React.Children.toArray(children);
  const mainChild = items.find(
    (c): c is React.ReactElement<AppShellMainProps> => React.isValidElement(c) && c.type === Main,
  );
  const targetId = mainChild?.props.id ?? mainId;
  const threaded = items.map((c) => {
    if (!React.isValidElement(c)) return c;
    if (c.type === Main && (c.props as AppShellMainProps).id === undefined) {
      return React.cloneElement(c as React.ReactElement<AppShellMainProps>, { id: mainId });
    }
    if (c.type === SkipLink && mainChild && (c.props as AppShellSkipLinkProps).href === undefined) {
      return React.cloneElement(c as React.ReactElement<AppShellSkipLinkProps>, { href: `#${targetId}` });
    }
    return c;
  });
  if (process.env.NODE_ENV !== 'production') {
    const skipIdx = items.findIndex((c) => React.isValidElement(c) && c.type === SkipLink);
    if (skipIdx > 0) {
      console.warn(
        '[AppShell] SkipLink should be the first child of AppShell.Root so keyboard users reach it before any other content.',
      );
    }
    if (skipIdx >= 0 && !mainChild) {
      const skip = items[skipIdx] as React.ReactElement<AppShellSkipLinkProps>;
      if (skip.props.href === undefined) {
        console.warn(
          '[AppShell] SkipLink has no href and AppShell.Main is not a direct child of AppShell.Root; pass Main an id and SkipLink the matching href.',
        );
      }
    }
  }
  const props: Record<string, unknown> = {
    className: 'ag-app-shell',
    'data-ag-part': 'root',
    'data-ag-shell-id': shellId,
    'data-ag-sidebar': defaultSidebar,
    'data-ag-inspector': defaultInspector,
    'data-ag-sidebar-side': sidebarSide,
    'data-ag-layout': layout,
    'data-ag-collapse-to': collapseTo,
    ...(density ? { 'data-ag-density': density } : {}),
    ...(backdrop ? { 'data-ag-backdrop': backdrop } : {}),
    ...(persistKey ? { 'data-ag-persist-key': persistKey } : {}),
    ...rest,
  };
  return partElement('div', { render, ...props, children: threaded });
}
Root.displayName = 'AppShell.Root';

export type AppShellMainProps = PartProps<'main'> & {
  /** Scroll container for the page; also the skip-link target. Defaults to the
      owning Root's useId-derived id when Main is a direct child of Root. */
  id?: string;
};

function Main({ id = 'ag-main', children, render, ...rest }: AppShellMainProps) {
  return partElement('main', {
    render,
    id,
    tabIndex: -1,
    'data-ag-slot': 'main',
    ...rest,
    children,
  });
}
Main.displayName = 'AppShell.Main';

export type AppShellPageHeaderProps = Omit<PartProps<'header'>, 'title' | 'content'> & {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  /** Heading level for the title (default 1). */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

function PageHeader({
  title,
  eyebrow,
  description,
  actions,
  tabs,
  headingLevel = 1,
  children,
  render,
  ...rest
}: AppShellPageHeaderProps) {
  const H = `h${headingLevel}` as 'h1';
  return partElement('header', {
    render,
    'data-ag-part': 'page-header',
    className: 'ag-page-header',
    ...rest,
    children: (
      <>
        {eyebrow !== undefined ? <div data-ag-part="eyebrow">{eyebrow}</div> : null}
        <div className="ag-page-header__row">
          <H data-ag-part="title" className="ag-page-header__title">
            {title}
          </H>
          {actions !== undefined ? (
            <div data-ag-part="actions" className="ag-page-header__actions">
              {actions}
            </div>
          ) : null}
        </div>
        {description !== undefined ? <p data-ag-part="description">{description}</p> : null}
        {tabs !== undefined ? <div data-ag-part="tabs">{tabs}</div> : null}
        {children}
      </>
    ),
  });
}
PageHeader.displayName = 'AppShell.PageHeader';

export type AppShellSkipLinkProps = PartProps<'a'> & {
  /** Target of the skip link; defaults to the sibling AppShell.Main id. */
  href?: string;
};

function SkipLink({
  href = '#ag-main',
  children = 'Skip to content',
  render,
  ...rest
}: AppShellSkipLinkProps) {
  return partElement('a', {
    render,
    href,
    'data-ag-slot': 'skip',
    className: 'ag-skip-link',
    ...rest,
    children,
  });
}
SkipLink.displayName = 'AppShell.SkipLink';

export const AppShell = {
  Root,
  Main,
  PageHeader,
  SkipLink,
  SidebarToggle: AppShellSidebarToggle,
  InspectorToggle: AppShellInspectorToggle,
  Controller: AppShellController,
};
export type {
  SidebarState as AppShellSidebarState,
  InspectorState as AppShellInspectorState,
  ShellMode as AppShellMode,
};
