/* GlassInspector — 4.x compat adapter (REQ-SURF-13, DEP-S0008) → Inspector.
   Covers the workspace GlassInspectorPanel shape: title → Inspector.Header
   (and the required aria-label), children → Inspector.Content. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Inspector } from '../../../app-shell/Inspector';
import { domProps } from '../_shared';

export interface GlassInspectorProps {
  title?: React.ReactNode;
  'aria-label'?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassInspector` compat adapter (DEP-S0008).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Inspector from aura-glass/app-shell}.
 */
export function GlassInspector(props: GlassInspectorProps) {
  warnDeprecated('DEP-S0008');
  const { title, 'aria-label': ariaLabel, children, ...rest } = props;
  const label = ariaLabel ?? (typeof title === 'string' ? title : 'Inspector');
  return (
    <Inspector.Root {...domProps(rest)} aria-label={label}>
      {/* InspectorHeaderProps intersects the HTML `title` string with the
          ReactNode title prop; the part renders it as the heading node. */}
      {title != null ? <Inspector.Header title={title as never} /> : null}
      <Inspector.Content>{children}</Inspector.Content>
    </Inspector.Root>
  );
}
