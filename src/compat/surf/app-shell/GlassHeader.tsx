/* GlassHeader — 4.x compat adapter (REQ-SURF-13, DEP-S0002) → TopBar. logo →
   TopBar.Leading, navigation → TopBar.Center, search/actions/userMenu →
   TopBar.Trailing. The built-in burger (mobileMenuOpen/onMobileMenuToggle) is
   replaced by AppShell.SidebarToggle and is not rendered. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TopBar } from '../../../app-shell/TopBar';
import { domProps } from '../_shared';

export interface GlassHeaderAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface GlassHeaderProps {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  actions?: GlassHeaderAction[];
  search?: { placeholder?: string; onSearch?: (query: string) => void };
  userMenu?: { user: { name: string; email?: string }; items?: { id: string; label: string }[] };
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassHeader` compat adapter (DEP-S0002).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TopBar from aura-glass/app-shell}.
 */
export function GlassHeader(props: GlassHeaderProps) {
  warnDeprecated('DEP-S0002');
  const { logo, navigation, breadcrumbs, actions, search, userMenu, children, ...rest } = props;
  const trailing = search || (actions && actions.length) || userMenu;
  return (
    <TopBar.Root {...domProps(rest)}>
      {logo != null ? <TopBar.Leading>{logo}</TopBar.Leading> : null}
      {navigation != null || breadcrumbs != null ? (
        <TopBar.Center>
          {breadcrumbs}
          {navigation}
        </TopBar.Center>
      ) : null}
      {children}
      {trailing ? (
        <TopBar.Trailing>
          {search ? (
            <input
              type="search"
              placeholder={search.placeholder}
              aria-label={search.placeholder ?? 'Search'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') search.onSearch?.(e.currentTarget.value);
              }}
            />
          ) : null}
          {(actions ?? []).map((a) =>
            a.href !== undefined ? (
              <a key={a.id} href={a.href}>
                {a.icon}
                {a.label}
                {a.badge !== undefined ? <span>{a.badge}</span> : null}
              </a>
            ) : (
              <button key={a.id} type="button" onClick={a.onClick} disabled={a.disabled}>
                {a.icon}
                {a.label}
                {a.badge !== undefined ? <span>{a.badge}</span> : null}
              </button>
            ),
          )}
          {userMenu ? <button type="button">{userMenu.user.name}</button> : null}
        </TopBar.Trailing>
      ) : null}
    </TopBar.Root>
  );
}
