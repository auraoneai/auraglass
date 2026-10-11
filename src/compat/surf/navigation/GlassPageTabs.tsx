/* GlassPageTabs — 4.x compat adapter (REQ-SURF-13, DEP-S0012) → Tabs. tabs[]
   → Tabs.List of Tabs.Tab (label + badge, disabled) and, with renderPanel
   (default true), one Tabs.Panel per tab — real panels, fixing the 4.x
   role="tab"-without-panels defect. onChange(value) ← onValueChange;
   activationMode 'automatic' → activateOnFocus. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Tabs } from '../../../components/tabs/Tabs';
import { domProps } from '../_shared';

export interface GlassPageTab {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  badge?: React.ReactNode;
  panel?: React.ReactNode;
}

export interface GlassPageTabsProps {
  tabs?: GlassPageTab[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  renderPanel?: boolean;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassPageTabs` compat adapter (DEP-S0012).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Tabs from aura-glass}.
 */
export function GlassPageTabs(props: GlassPageTabsProps) {
  warnDeprecated('DEP-S0012');
  const {
    tabs = [], value, defaultValue, onChange, orientation, activationMode, renderPanel = true,
    children: _children, ...rest
  } = props;
  return (
    <Tabs.Root
      {...(value !== undefined ? { value } : {})}
      defaultValue={defaultValue ?? tabs[0]?.value}
      {...(onChange ? { onValueChange: (v: string) => onChange(v) } : {})}
      {...(orientation ? { orientation } : {})}
      {...(activationMode ? { activateOnFocus: activationMode === 'automatic' } : {})}
      {...domProps(rest)}
    >
      <Tabs.List>
        {tabs.map((t) => (
          <Tabs.Tab key={t.value} value={t.value} {...(t.disabled ? { disabled: true } : {})}>
            {t.label}
            {t.badge != null ? <span> {t.badge}</span> : null}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {renderPanel
        ? tabs.map((t) => (
            <Tabs.Panel key={t.value} value={t.value}>
              {t.panel}
            </Tabs.Panel>
          ))
        : null}
    </Tabs.Root>
  );
}
