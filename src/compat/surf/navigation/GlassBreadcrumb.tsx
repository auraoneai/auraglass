/* GlassBreadcrumb — 4.x compat adapter (REQ-SURF-13, DEP-S0019) →
   Breadcrumbs. maxItems maps 1:1 (collapse into the overflow menu); the
   compound `items` form maps to Breadcrumbs.Item/Link/Current; element
   children pass through as Breadcrumbs items. separator/elevation/size are
   presentation props without a 5.0 equivalent (the Separator glyph is fixed
   and flips under RTL). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Breadcrumbs } from '../../../components/breadcrumbs/Breadcrumbs';
import { domProps } from '../_shared';
import { breadcrumbItems, type LegacyBreadcrumbItem } from './GlassBreadcrumbs';

export interface GlassBreadcrumbProps {
  items?: LegacyBreadcrumbItem[];
  maxItems?: number;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassBreadcrumb` compat adapter (DEP-S0019).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Breadcrumbs from aura-glass}.
 */
export function GlassBreadcrumb(props: GlassBreadcrumbProps) {
  warnDeprecated('DEP-S0019');
  const { items, maxItems, children, ...rest } = props;
  return (
    <Breadcrumbs.Root {...(maxItems !== undefined ? { maxItems } : {})} {...domProps(rest)}>
      {items ? breadcrumbItems(items) : children}
    </Breadcrumbs.Root>
  );
}
