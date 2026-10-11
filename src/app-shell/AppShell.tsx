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
import { parseAppShellCookie } from './parseAppShellCookie';
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
  // SURF-18: one useId-derived main id per shell, shared with Main/SkipLink
  // through context so two shells never collide on '#ag-main'.
  const mainId = `ag-main-${shellId.replace(/:/g, '')}`;
  const childArr = React.Children.toArray(children);
  if (process.env.NODE_ENV !== 'production') {
    const skipIdx = childArr.findIndex(
      (c) => React.isValidElement(c) && (c.type as { displayName?: string }).displayName === 'AppShell.SkipLink',
    );
    if (skipIdx > 0) {
      console.warn(
        '[AppShell] SkipLink should be the first child of AppShell.Root so keyboard users reach it before any other content.',
      );
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
  return partElement('div', {
    render,
    ...props,
    children: <AppShellContext.Provider value={{ mainId }}>{children}</AppShellContext.Provider>,
  });
}
Root.displayName = 'AppShell.Root';

/** Per-shell ids shared between Root/Main/SkipLink (SURF-18). */
const AppShellContext = React.createContext<{ mainId: string }>({ mainId: 'ag-main' });

export type AppShellMainProps = PartProps<'main'> & {
  /** Scroll container for the page; also the skip-link target. */
  id?: string;
};

function Main({ id, children, render, ...rest }: AppShellMainProps) {
  const { mainId } = React.useContext(AppShellContext);
  return partElement('main', {
    render,
    id: id ?? mainId,
    tabIndex: -1,
    'data-ag-part': 'main',
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
  /** Target of the skip link; defaults to the AppShell.Main id. */
  href?: string;
};

function SkipLink({
  href,
  children = 'Skip to content',
  render,
  ...rest
}: AppShellSkipLinkProps) {
  const { mainId } = React.useContext(AppShellContext);
  return partElement('a', {
    render,
    href: href ?? `#${mainId}`,
    'data-ag-part': 'skip-link',
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
  parseCookie: parseAppShellCookie,
};
export type {
  SidebarState as AppShellSidebarState,
  InspectorState as AppShellInspectorState,
  ShellMode as AppShellMode,
};
