/* GlassWorkspaceTabs — 4.x `aura-glass/workspace` compat adapter
   (REQ-SURF-13, DEP-S0014) → Tabs.Root. value/onValueChange map 1:1; the
   consumer's tab children render inside Tabs.Root. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tabs } from '../../../components/tabs/Tabs';
import { domProps } from '../_shared';

export interface GlassWorkspaceTabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassWorkspaceTabs` compat adapter (DEP-S0014).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Tabs from aura-glass}.
 */
export function GlassWorkspaceTabs(props: GlassWorkspaceTabsProps) {
  warnDeprecated('DEP-S0014');
  const { value, onValueChange, children, ...rest } = props;
  return (
    <Tabs.Root
      {...(value !== undefined ? { value } : {})}
      {...(onValueChange ? { onValueChange: (v: string) => onValueChange(v) } : {})}
      {...domProps(rest)}
    >
      {children}
    </Tabs.Root>
  );
}
