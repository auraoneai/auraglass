/* GlassTopBar — 4.x `aura-glass/app-shell` compat adapter (REQ-SURF-13,
   DEP-S0003) → TopBar. brand → Leading, navigation → Center (inside a <nav>,
   as in 4.x), actions → Trailing. `sticky` is a placement concern of the 5.0
   shell and is dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { TopBar } from '../../../app-shell/TopBar';
import { domProps } from '../_shared';

export interface GlassTopBarProps {
  brand?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  sticky?: boolean;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassTopBar` compat adapter (DEP-S0003).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TopBar from aura-glass/app-shell}.
 */
export function GlassTopBar(props: GlassTopBarProps) {
  warnDeprecated('DEP-S0003');
  const { brand, navigation, actions, sticky: _sticky, children, ...rest } = props;
  return (
    <TopBar.Root {...domProps(rest)}>
      {brand != null ? <TopBar.Leading>{brand}</TopBar.Leading> : null}
      {navigation != null ? (
        <TopBar.Center>
          <nav aria-label="Primary">{navigation}</nav>
        </TopBar.Center>
      ) : null}
      {children}
      {actions != null ? <TopBar.Trailing>{actions}</TopBar.Trailing> : null}
    </TopBar.Root>
  );
}
