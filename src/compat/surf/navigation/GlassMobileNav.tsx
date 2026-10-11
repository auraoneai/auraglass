/* GlassMobileNav — 4.x compat adapter (REQ-SURF-13, DEP-S0018) → the 5.0
   sidebar drawer composition: a modal CMP Sheet (side start/end from
   position) holding Sidebar parts. open/onOpenChange map 1:1; title → Sheet
   title, logo → Sidebar.Header, each navigation section → Sidebar.Group with
   its label, items → Sidebar.Item (current when href === activePath),
   footer → Sidebar.Footer. Inside an AppShell, SidebarDrawer is the
   store-driven equivalent; this adapter keeps the 4.x controlled API. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Sheet } from '../../../components/sheet';
import { Sidebar } from '../../../app-shell/Sidebar';
import { navItems, type LegacyNavItem } from '../app-shell/_navItems';

export interface MobileNavSection {
  id: string;
  label?: string;
  items: LegacyNavItem[];
}

export interface GlassMobileNavProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  logo?: React.ReactNode;
  title?: string;
  navigation?: MobileNavSection[];
  activePath?: string;
  footer?: React.ReactNode;
  id?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

const SIDE = { left: 'start', right: 'end', top: 'top', bottom: 'bottom' } as const;

/**
 * 4.x `GlassMobileNav` compat adapter (DEP-S0018).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link SidebarDrawer from aura-glass/app-shell}.
 */
export function GlassMobileNav(props: GlassMobileNavProps) {
  warnDeprecated('DEP-S0018');
  const { open, onOpenChange, position = 'left', logo, title, navigation = [], activePath, footer, id, children } = props;
  return (
    <Sheet.Root
      {...(open !== undefined ? { open } : {})}
      {...(onOpenChange ? { onOpenChange: (o: boolean) => onOpenChange(o) } : {})}
      side={SIDE[position]}
      modal
    >
      <Sheet.Content {...(id !== undefined ? { id } : {})}>
        {title !== undefined ? <Sheet.Title>{title}</Sheet.Title> : null}
        <Sidebar.Root>
          {logo != null ? <Sidebar.Header>{logo}</Sidebar.Header> : null}
          <Sidebar.Content>
            <Sidebar.Nav aria-label={title ?? 'Navigation'}>
              {navigation.map((section) =>
                section.label !== undefined ? (
                  <Sidebar.Group key={section.id} label={section.label}>
                    {navItems(section.items, { current: activePath })}
                  </Sidebar.Group>
                ) : (
                  <React.Fragment key={section.id}>{navItems(section.items, { current: activePath })}</React.Fragment>
                ),
              )}
            </Sidebar.Nav>
            {children}
          </Sidebar.Content>
          {footer != null ? <Sidebar.Footer>{footer}</Sidebar.Footer> : null}
        </Sidebar.Root>
      </Sheet.Content>
    </Sheet.Root>
  );
}
