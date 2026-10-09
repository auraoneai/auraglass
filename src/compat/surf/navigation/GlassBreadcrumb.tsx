/* GlassBreadcrumb — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Breadcrumbs } from '../../../components/breadcrumbs/Breadcrumbs';

/** @deprecated GlassBreadcrumbProps DEP-S0672 since 4.2.0, removed in 6.0.0. */
export type GlassBreadcrumbProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassBreadcrumb(props: GlassBreadcrumbProps) {
  warnDeprecated('DEP-S0672');
  const { children, ...rest } = props as Record<string, React.ReactNode>;
  return <Breadcrumbs.Root {...rest}>{children}</Breadcrumbs.Root>;
}
