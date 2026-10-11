/* GlassBreadcrumbs — 4.x `aura-glass/app-shell` compat adapter
   (REQ-SURF-13 / REQ-SURF-55, DEP-S0036) → Breadcrumbs. items[{label, href}]
   → Breadcrumbs.Item > Link; the last item → Breadcrumbs.Current
   (aria-current="page"). Breadcrumbs.Item owns the aria-hidden separator.
   Moved here from #302 (FIN-E.1 row 30: SURF names live in src/compat/surf). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Breadcrumbs } from '../../../components/breadcrumbs/Breadcrumbs';
import { domProps } from '../_shared';

export interface LegacyBreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  isCurrentPage?: boolean;
}

/** Shared by GlassBreadcrumb (compound `items` form) and GlassBreadcrumbs. */
export function breadcrumbItems(items: readonly LegacyBreadcrumbItem[]): React.ReactNode {
  return items.map((item, index) => {
    const current = item.isCurrentPage ?? index === items.length - 1;
    return (
      <Breadcrumbs.Item key={index}>
        {current ? (
          <Breadcrumbs.Current>{item.label}</Breadcrumbs.Current>
        ) : item.href !== undefined ? (
          <Breadcrumbs.Link href={item.href}>{item.label}</Breadcrumbs.Link>
        ) : (
          <span>{item.label}</span>
        )}
      </Breadcrumbs.Item>
    );
  });
}

export interface GlassBreadcrumbsProps {
  items?: LegacyBreadcrumbItem[];
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassBreadcrumbs` compat adapter (DEP-S0036).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Breadcrumbs from aura-glass}.
 */
export function GlassBreadcrumbs(props: GlassBreadcrumbsProps) {
  warnDeprecated('DEP-S0036');
  const { items = [], children: _children, ...rest } = props;
  return <Breadcrumbs.Root {...domProps(rest)}>{breadcrumbItems(items)}</Breadcrumbs.Root>;
}
