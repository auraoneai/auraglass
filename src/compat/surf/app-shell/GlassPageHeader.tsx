/* GlassPageHeader — 4.x compat adapter (REQ-SURF-13, DEP-S0006) →
   AppShell.PageHeader. eyebrow/title/description/actions map 1:1; children
   follow the description, as in 4.x. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AppShell } from '../../../app-shell/AppShell';
import { domProps } from '../_shared';

export interface GlassPageHeaderProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassPageHeader` compat adapter (DEP-S0006).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link AppShell.PageHeader from aura-glass/app-shell}.
 */
export function GlassPageHeader(props: GlassPageHeaderProps) {
  warnDeprecated('DEP-S0006');
  const { eyebrow, title, description, actions, children, ...rest } = props;
  return (
    <AppShell.PageHeader
      title={title ?? null}
      {...(eyebrow != null ? { eyebrow } : {})}
      {...(description != null ? { description } : {})}
      {...(actions != null ? { actions } : {})}
      {...domProps(rest)}
    >
      {children}
    </AppShell.PageHeader>
  );
}
