'use client';
/* Tabs (SURF-062/063/064): own public types over @base-ui/react Tabs.
   Root is a plain div (no landmark). Ids from useId + value. Indicator is the
   view-transition participant: activation goes through the motion seam
   (startMorph); the CSS fallback animates translate/scale only. */

import * as React from 'react';
import { flushSync } from 'react-dom';
import { Tabs as BaseTabs } from '../../foundation/base-ui/tabs';
import { startMorph, useMorphName } from '../../motion';
import { withMorph } from '../control-shared/morph';
import { DirectionProvider } from '../../foundation/base-ui/direction-provider';
import { viewTransitionParticipantAttributes } from '../../material/stateAttributes';
import { PanelRegistryContext, TabsRootPresenceContext, useOwnOrOuterPanelRegistry, useTabBarPanel } from '../tab-bar/panelRegistry';
import { toChangeDetails } from '../../foundation';
import { partElement } from '../../app-shell/_internal/partElement';
/* S-30 ChangeDetails from the public contract module, so the emitted d.ts never
   names the private foundation seam (REQ-CMP-01). */
import type { ChangeDetails, PartProps } from '../../contracts/components';

export type TabsValue = string;

export type TabsRootProps = Omit<PartProps<'div'>, 'onChange' | 'defaultValue'> & {
  value?: TabsValue | undefined;
  defaultValue?: TabsValue | undefined;
  /** (value, details) — details.reason comes from Base UI's event details (SURF-047). */
  onValueChange?: ((value: TabsValue, details: ChangeDetails) => void) | undefined;
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
  appearance = 'pill',
  size = 'md',
  children,
  render,
  ...rest
}: TabsRootProps) {
  const idBase = React.useId();
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [active, setActive] = React.useState<TabsValue | null>(
    (value ?? defaultValue ?? null) as TabsValue | null,
  );
  const change = React.useCallback(
    (v: unknown, eventDetails?: unknown) => {
      const next = v as TabsValue;
      // S-30/S-32: Base UI's event details are normalised onto the contract
      // ChangeDetails (never the Base UI type itself).
      const details: ChangeDetails = toChangeDetails(eventDetails);
      const apply = () => {
        setActive(next);
      };
      // SURF-049: morph the indicator via the MAT seam when one is mounted
      // inside this root; otherwise activate directly.
      const indicator = rootRef.current?.querySelector<HTMLElement>('[data-ag-vt-participant]');
      if (indicator) {
        startMorph(() => flushSync(apply), { surfaces: [indicator] });
      } else {
        apply();
      }
      onValueChange?.(next, details);
    },
    [onValueChange],
  );
  React.useEffect(() => {
    if (value !== undefined) setActive(value);
  }, [value]);
  // SURF-48: RTL reverses Left/Right. Base UI's composite reads direction
  // from DirectionProvider only (never the DOM dir attribute), so resolve the
  // closest [dir] (the root itself included) after mount — the server and
  // first client render use 'ltr', no hydration mismatch.
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');
  React.useLayoutEffect(() => {
    const d = rootRef.current?.closest('[dir]')?.getAttribute('dir');
    setDir(d?.toLowerCase() === 'rtl' ? 'rtl' : 'ltr');
  });
  // SURF-051: share a panel registry with a TabBar(semantics='tabs') placed
  // inside or around this root.
  const registry = useOwnOrOuterPanelRegistry();
  return (
    <PanelRegistryContext.Provider value={registry}>
    <TabsRootPresenceContext.Provider value={true}>
    <TabsCtx.Provider value={{ idBase, active, activateOnFocus }}>
    <DirectionProvider direction={dir}>
      <BaseTabs.Root
        data-ag-part="tabs"
        value={(value ?? active) as never}
        defaultValue={defaultValue as never}
        onValueChange={change as never}
        orientation={orientation}
        render={partElement('div', {
          render,
          ref: rootRef,
          'data-ag-part': 'tabs',
          'data-ag-appearance': appearance,
          className: 'ag-tabs',
          'data-ag-size': size,
          ...rest,
          children,
        })}
      />
    </DirectionProvider>
    </TabsCtx.Provider>
    </TabsRootPresenceContext.Provider>
    </PanelRegistryContext.Provider>
  );
}
TabsRoot.displayName = 'Tabs.Root';

export type TabsListProps = PartProps<'div'> & {
  /** Roving focus activates the focused tab (default false — manual activation). */
  activateOnFocus?: boolean | undefined;
};

function TabsList({ activateOnFocus, children, render, ...rest }: TabsListProps) {
  const ctxActivate = React.useContext(TabsCtx).activateOnFocus;
  const { idBase, active } = React.useContext(TabsCtx);
  const listRef = React.useRef<HTMLElement | null>(null);

  // SURF-050: mark which ends overflow so the mask fade only applies where
  // content is actually clipped. scrollIntoView(nearest) on activation keeps
  // the active tab visible without scroll buttons.
  React.useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () => {
      el.dataset['overflowStart'] = el.scrollLeft > 0 ? 'true' : 'false';
      el.dataset['overflowEnd'] =
        el.scrollLeft + el.clientWidth < el.scrollWidth - 1 ? 'true' : 'false';
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, []);

  React.useLayoutEffect(() => {
    const el = listRef.current;
    if (!el || active === null) return;
    const tab = el.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
    tab?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    void idBase;
  }, [active, idBase]);

  return (
    <BaseTabs.List
      data-ag-part="list"
      activateOnFocus={activateOnFocus ?? ctxActivate}
      render={partElement('div', {
        render,
        ref: listRef,
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

function TabsTab({ value, disabled, children, render, ...rest }: TabsTabProps) {
  // BU owns the tab<->panel id pair (aria-controls/aria-labelledby resolve
  // natively both ways, SURF-048) — we only add the part contract.
  const el = partElement('button', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'tab',
    ...rest,
    // REQ-MAT-62: MAT hit area — >= 24px fine / 44px coarse, no layout change
    children: <>{children}<span data-ag-part="hit-area" aria-hidden="true" /></>,
  });
  return (
    <BaseTabs.Tab
      data-ag-part="tab"
      value={value as never}
      {...(disabled !== undefined ? { disabled } : {})}
      render={((props: object, state: object) =>
        React.cloneElement(el as React.ReactElement<Record<string, unknown>>, {
          ...(props as Record<string, unknown>),
          'data-state': (state as { active?: boolean; selected?: boolean }).active ||
            (state as { selected?: boolean }).selected
            ? 'active'
            : 'inactive',
          'data-ag-part': 'tab',
          // REQ-MAT-61: the MAT ring is drawn inside the scrolling tab list
          'data-ag-focus-inset': '',
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
  // Register into an enclosing TabBar (semantics='tabs' dev-check) — noop
  // outside one (SURF-051).
  useTabBarPanel(value);
  const el = partElement('div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'panel',
    className: 'ag-tabs__panel',
    ...rest,
    children,
  });
  // SURF-050: data-state from the Base UI state render function (BU reports
  // `hidden` for an inactive panel).
  return (
    <BaseTabs.Panel
      data-ag-part="panel"
      value={value as never}
      keepMounted={keepMounted}
      render={((props: object, state: object) =>
        React.cloneElement(el as React.ReactElement<Record<string, unknown>>, {
          ...(props as Record<string, unknown>),
          'data-state': (state as { hidden?: boolean }).hidden ? 'inactive' : 'active',
          'data-ag-part': 'panel',
          className: 'ag-tabs__panel',
        })) as never}
    />
  );
}
TabsPanel.displayName = 'Tabs.Panel';

export function TabsIndicator({ render, ...rest }: PartProps<'div'>) {
  /* REQ-MAT-48: useId() name sanitised to [a-z0-9-] (useMorphName), the
     participant marker, and <ViewTransition share="ag-morph"> on React 19.3+. */
  const vtName = useMorphName('tabs-indicator');
  return withMorph(
    vtName,
    <BaseTabs.Indicator
      data-ag-part="indicator"
      render={partElement('div', {
        render,
        'data-ag-part': 'indicator',
        ...viewTransitionParticipantAttributes(),
        'data-state': 'active',
        className: 'ag-tabs__indicator',
        style: { viewTransitionName: vtName },
        'aria-hidden': true,
        ...rest,
      })}
    />,
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
