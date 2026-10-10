'use client';
/* Tabs (SURF-062/063/064): own public types over @base-ui/react Tabs.
   Root is a plain div (no landmark). Ids from useId + value. Indicator is the
   view-transition participant: activation goes through the motion seam
   (startMorph); the CSS fallback animates translate/scale only. */

import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { startMorph } from '../../motion';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';

export type TabsValue = string;

export type TabsRootProps = Omit<PartProps<'div'>, 'onChange' | 'defaultValue'> & {
  value?: TabsValue | undefined;
  defaultValue?: TabsValue | undefined;
  onValueChange?: ((value: TabsValue) => void) | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Roving focus activates the focused tab (default false — manual activation). */
  activateOnFocus?: boolean | undefined;
  appearance?: 'pill' | 'underline' | undefined;
  size?: 'sm' | 'md' | undefined;
};

const TabsCtx = React.createContext<{
  idBase: string;
  active: TabsValue | null;
  activateOnFocus: boolean;
}>({ idBase: 'ag-tabs', active: null, activateOnFocus: false });

function TabsRoot({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activateOnFocus = false,
  appearance = 'underline',
  size = 'md',
  children,
  render,
  ...rest
}: TabsRootProps) {
  const idBase = React.useId();
  const [active, setActive] = React.useState<TabsValue | null>(
    (value ?? defaultValue ?? null) as TabsValue | null,
  );
  const change = React.useCallback(
    (v: unknown) => {
      const next = v as TabsValue;
      setActive(next);
      onValueChange?.(next);
    },
    [onValueChange],
  );
  React.useEffect(() => {
    if (value !== undefined) setActive(value);
  }, [value]);
  return (
    <TabsCtx.Provider value={{ idBase, active, activateOnFocus }}>
      <BaseTabs.Root
        value={(value ?? active) as never}
        defaultValue={defaultValue as never}
        onValueChange={change as never}
        orientation={orientation}
        render={partElement('div', {
          render,
          'data-ag-part': 'tabs',
          'data-ag-appearance': appearance,
          className: 'ag-tabs',
          'data-ag-size': size,
          ...rest,
          children,
        })}
      />
    </TabsCtx.Provider>
  );
}
TabsRoot.displayName = 'Tabs.Root';

export type TabsListProps = PartProps<'div'> & {
  /** Roving focus activates the focused tab (default false — manual activation). */
  activateOnFocus?: boolean | undefined;
};

function TabsList({ activateOnFocus, children, render, ...rest }: TabsListProps) {
  const ctxActivate = React.useContext(TabsCtx).activateOnFocus;
  return (
    <BaseTabs.List
      activateOnFocus={activateOnFocus ?? ctxActivate}
      render={partElement('div', {
        render,
        'data-ag-part': 'list',
        className: 'ag-tabs__list',
        role: 'tablist',
        ...rest,
        children,
      })}
    />
  );
}
TabsList.displayName = 'Tabs.List';

export type TabsTabProps = Omit<PartProps<'button'>, 'value'> & {
  value: TabsValue;
  disabled?: boolean | undefined;
};

function TabsTab({ value, children, render, ...rest }: TabsTabProps) {
  const { idBase } = React.useContext(TabsCtx);
  const el = partElement('button', {
    render: render as React.ReactElement | undefined,
    id: `${idBase}-tab-${value}`,
    role: 'tab',
    'data-ag-part': 'tab',
    ...rest,
    children: (
      <>
        <span data-ag-part="hit-area" aria-hidden="true" />
        {children}
      </>
    ),
  });
  return (
    <BaseTabs.Tab
      value={value as never}
      render={((props: object, state: object) =>
        React.cloneElement(el as React.ReactElement<Record<string, unknown>>, {
          ...(props as Record<string, unknown>),
          'data-state': (state as { active?: boolean; selected?: boolean }).active ||
            (state as { selected?: boolean }).selected
            ? 'active'
            : 'inactive',
          'data-ag-part': 'tab',
          className: 'ag-tabs__tab',
        })) as never}
    />
  );
}
TabsTab.displayName = 'Tabs.Tab';

export type TabsPanelProps = Omit<PartProps<'div'>, 'value'> & {
  value: TabsValue;
  /** Keep the inactive panel mounted (hidden) instead of unmounting. */
  keepMounted?: boolean | undefined;
};

function TabsPanel({ value, keepMounted, children, render, ...rest }: TabsPanelProps) {
  const { idBase } = React.useContext(TabsCtx);
  return (
    <BaseTabs.Panel
      value={value as never}
      keepMounted={keepMounted}
      render={partElement('div', {
        render: render as React.ReactElement | undefined,
        id: `${idBase}-panel-${value}`,
        role: 'tabpanel',
        'data-ag-part': 'panel',
        className: 'ag-tabs__panel',
        'aria-labelledby': `${idBase}-tab-${value}`,
        ...rest,
        children,
      })}
    />
  );
}
TabsPanel.displayName = 'Tabs.Panel';

export function TabsIndicator({ render, ...rest }: PartProps<'div'>) {
  const vtName = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <BaseTabs.Indicator
      render={partElement('div', {
        render,
        'data-ag-part': 'indicator',
        'data-ag-vt-participant': '',
        className: 'ag-tabs__indicator',
        style: { viewTransitionName: `ag-tabs-indicator-${vtName}` },
        'aria-hidden': true,
        ...rest,
      })}
    />
  );
}
TabsIndicator.displayName = 'Tabs.Indicator';

export { startMorph };

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
};
