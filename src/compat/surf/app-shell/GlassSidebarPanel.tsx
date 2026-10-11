/* GlassSidebarPanel — 4.x `aura-glass/app-shell` compat adapter
   (REQ-SURF-13, DEP-S0035) → Sidebar.Root. title → Sidebar.Header, children →
   Sidebar.Content, footer → Sidebar.Footer. 4.x `collapsed` hid the panel with
   aria-hidden over focusable children (the defect the 5.0 sidebar fixes);
   here collapsed renders the panel `hidden` + `inert` so nothing inside stays
   focusable. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sidebar } from '../../../app-shell/Sidebar';
import { domProps } from '../_shared';

export interface GlassSidebarPanelProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassSidebarPanel` compat adapter (DEP-S0035).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Sidebar from aura-glass/app-shell}.
 */
export function GlassSidebarPanel(props: GlassSidebarPanelProps) {
  warnDeprecated('DEP-S0035');
  const { title, footer, collapsed = false, children, ...rest } = props;
  return (
    <Sidebar.Root
      {...domProps(rest)}
      {...(collapsed ? { hidden: true, inert: true } : {})}
    >
      {title != null ? <Sidebar.Header>{title}</Sidebar.Header> : null}
      <Sidebar.Content>{children}</Sidebar.Content>
      {footer != null ? <Sidebar.Footer>{footer}</Sidebar.Footer> : null}
    </Sidebar.Root>
  );
}
