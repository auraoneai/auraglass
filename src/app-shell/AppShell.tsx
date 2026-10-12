/* Server AppShell namespace (SURF-014): serializable props land as data-ag-*
   attributes; parts self-place via data-ag-slot (no displayName sniffing, no
   cloneElement). Client parts (SidebarToggle/InspectorToggle/Controller) live
   in their own 'use client' modules and are attached as namespace members —
   importing them here turns each into a client boundary, never the whole
   namespace. */

import * as React from 'react';
import type { PartProps } from '../contracts/components';
import { partElement } from './_internal/partElement';
import { Sidebar } from './Sidebar';
import { AppShellSidebarToggle } from './AppShell.SidebarToggle';
import { AppShellInspectorToggle } from './AppShell.InspectorToggle';
import { AppShellController } from './AppShell.Controller';
import { parseAppShellCookie } from './parseAppShellCookie';
import type { SidebarState, InspectorState } from './appShellStore';

export type AppShellRootProps = PartProps<'div'> & {
  /** Initial sidebar state when uncontrolled. */
  defaultSidebar?: SidebarState | undefined;
  /** Initial inspector state when uncontrolled. */
  defaultInspector?: InspectorState | undefined;
  /** Inline side the sidebar docks to. */
  sidebarSide?: 'start' | 'end' | undefined;
  /** Contract values (AG_ATTRIBUTES data-ag-layout): 'auto' lets the
      `ag-app-shell` container queries resolve compact/medium/expanded/wide
      from the shell's own width (REQ-SURF-17); 'desktop'/'mobile' pin the
      wide/compact geometry (SURF-20). */
  layout?: 'auto' | 'desktop' | 'mobile' | undefined;
  /** When set, sidebar/inspector persist to an `ag-shell-<key>` cookie. */
  persistKey?: string | undefined;
};

function Root({
  defaultSidebar = 'expanded',
  defaultInspector = 'closed',
  sidebarSide = 'start',
  layout = 'auto',
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
    // SURF-30: a server-rendered collapsed shell must not wait for a client
    // part to create the store record — thread `inert` into a direct
    // Sidebar.Root child so the SSR markup is already inert (the store keeps
    // owning it after hydration). An explicit `inert` prop always wins.
    if (
      c.type === Sidebar.Root &&
      defaultSidebar === 'collapsed' &&
      (c.props as { inert?: boolean }).inert === undefined
    ) {
      return React.cloneElement(c as React.ReactElement<{ inert?: boolean }>, { inert: true });
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
    'data-shell-id': shellId,
    'data-ag-sidebar': defaultSidebar,
    'data-ag-inspector': defaultInspector,
    'data-ag-sidebar-side': sidebarSide,
    'data-ag-layout': layout,
    ...(persistKey ? { 'data-persist-key': persistKey } : {}),
    ...rest,
  };
  // REQ-SURF-17: Root is the `ag-app-shell` inline-size container; a
  // container cannot query itself, so the grid and every container rule live
  // on this inner frame. It carries no data-ag-part (it is not a styling hook
  // for consumers) and is always Root's only child.
  return partElement('div', {
    render,
    ...props,
    children: <div className="ag-app-shell__frame">{threaded}</div>,
  });
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
    'data-ag-part': 'main',
    'data-ag-slot': 'main',
    // REQ-SURF-193: MAT's scroll-padding rung (src/a11y/css/scroll-padding.css)
    // pads both block edges of this scroller from --ag-scroll-padding-top/bottom,
    // and useStickyScrollPadding writes sticky chrome heights here.
    'data-ag-scroll-container': '',
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
};

export type AppShellMode = NonNullable<AppShellRootProps['layout']>;
