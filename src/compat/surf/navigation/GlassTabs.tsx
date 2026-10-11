/* GlassTabs — 4.x compat adapter (REQ-SURF-13, DEP-S0011) → Tabs.Root.
   value/defaultValue/onValueChange/orientation map 1:1; variant 'pills' →
   appearance 'pill', 'underline' → 'underline'; activationMode 'automatic' →
   activateOnFocus. The legacy selectedTab/onTabChange spellings are accepted.
   Children are the consumer's tab parts. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tabs } from '../../../components/tabs/Tabs';
import { domProps } from '../_shared';

export interface GlassTabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  selectedTab?: string;
  onTabChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'minimal';
  activationMode?: 'automatic' | 'manual';
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassTabs` compat adapter (DEP-S0011).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Tabs from aura-glass}.
 */
export function GlassTabs(props: GlassTabsProps) {
  warnDeprecated('DEP-S0011');
  const {
    value, defaultValue, onValueChange, selectedTab, onTabChange, orientation, variant, activationMode,
    children, ...rest
  } = props;
  const controlled = value ?? selectedTab;
  const onChange = onValueChange ?? onTabChange;
  return (
    <Tabs.Root
      {...(controlled !== undefined ? { value: controlled } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onChange ? { onValueChange: (v: string) => onChange(v) } : {})}
      {...(orientation ? { orientation } : {})}
      {...(variant === 'pills' ? { appearance: 'pill' as const } : variant === 'underline' ? { appearance: 'underline' as const } : {})}
      {...(activationMode ? { activateOnFocus: activationMode === 'automatic' } : {})}
      {...domProps(rest)}
    >
      {children}
    </Tabs.Root>
  );
}
