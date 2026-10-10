'use client';
/* TabBar (SURF-068..071): bottom/floating navigation bar. The SurfaceGroup
   (chrome) owns the only backdrop-filter; items tint/rim only. semantics='navigation'
   renders nav landmarks; semantics='tabs' renders Tabs.List semantics and
   requires a matching Tabs.Panel per item (dev error when absent). */

import * as React from 'react';
import { SurfaceGroup, ScrollEdge } from '../../material';
import { SearchField } from '../search-field';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';
import { PanelRegistryContext, useOwnOrOuterPanelRegistry } from './panelRegistry';

const TabBarCtx = React.createContext<{ semantics: 'navigation' | 'tabs' }>({
  semantics: 'navigation',
});

export type TabBarRootProps = PartProps<'nav'> & {
  semantics?: 'navigation' | 'tabs' | undefined;
  /** bar = flush bottom bar; floating = detached capsule. */
  appearance?: 'bar' | 'floating' | undefined;
  placement?: 'bottom' | 'floating' | 'inline' | 'overlay' | undefined;
  /** Collapse labels while scrolling (CSS scroll-timeline; motion calm|none disables). */
  minimizeOnScroll?: boolean | undefined;
  /** Keep Accessory visible while minimized. */
  accessoryPlacement?: 'minimize' | 'persist' | undefined;
  /** Request the enhanced material tier (inert until MAT enables it). */
  refraction?: boolean | undefined;
  'aria-label'?: string | undefined;
};

function TabBarRoot({
  semantics = 'navigation',
  appearance,
  placement = 'bottom',
  minimizeOnScroll = false,
  accessoryPlacement,
  refraction,
  children,
  render,
  'aria-label': ariaLabel,
  ...rest
}: TabBarRootProps) {
  const registry = useOwnOrOuterPanelRegistry();
  const ctxValue = React.useMemo(() => ({ semantics }), [semantics]);
  const items = React.Children.toArray(children).filter(Boolean);
  const accessories = items.filter(
    (c) => React.isValidElement(c) && c.type === TabBarAccessory,
  );
  const listItems = items.filter((c) => !accessories.includes(c));
  const values = listItems
    .map((c) => (React.isValidElement(c) ? (c.props as { value?: unknown }).value : undefined))
    .filter((v): v is string => typeof v === 'string');
  const valuesKey = values.join('\u0000');

  // SURF-051: semantics='tabs' requires every Item value to have a Panel.
  // Checked once per commit that changes the item set: the layout effect
  // defers to a microtask so every Tabs.Panel layout effect of the same
  // commit (inside the bar or a sibling under the same Tabs.Root) has
  // registered first. Panel (un)registration never re-renders the bar.
  React.useLayoutEffect(() => {
    if (semantics !== 'tabs' || process.env['NODE_ENV'] !== 'development') return undefined;
    let cancelled = false;
    const expected = valuesKey === '' ? [] : valuesKey.split('\u0000');
    queueMicrotask(() => {
      if (cancelled) return;
      const missing = expected.filter((v) => !registry.panels.has(v));
      if (missing.length > 0) {
        console.error(
          `[auraglass] TabBar semantics="tabs": no Tabs.Panel registered for value(s) ${missing.join(', ')}.`,
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [semantics, valuesKey, registry]);

  const itemCount = React.useRef(0);
  if (process.env['NODE_ENV'] === 'development') {
    const n = listItems.length;
    if (n !== itemCount.current) {
      itemCount.current = n;
      if (n > 5) {
        console.warn(`[auraglass] TabBar: ${n} items — keep 2..5 visible destinations.`);
      }
    }
  }

  if (process.env['NODE_ENV'] === 'development' && semantics === 'navigation' && ariaLabel === undefined) {
    console.warn('[auraglass] TabBar: aria-label is required on navigation tab bars.');
  }

  // SURF-054: Accessory renders inside the SurfaceGroup above the list.
  const inner = (
    <>
      {accessories}
      <ul className="ag-tab-bar__list" role={semantics === 'tabs' ? 'tablist' : undefined}>
        {listItems}
      </ul>
    </>
  );

  const nav = partElement(semantics === 'navigation' ? 'nav' : 'div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'tab-bar',
    'data-ag-slot': 'tabbar',
    'data-ag-appearance': appearance ?? (placement === 'floating' ? 'floating' : 'bar'),
    'data-ag-placement': placement,
    'data-ag-semantics': semantics,
    ...(minimizeOnScroll ? { 'data-ag-minimize-on-scroll': '' } : {}),
    ...(accessoryPlacement ? { 'data-ag-accessory-placement': accessoryPlacement } : {}),
    ...(refraction ? { 'data-ag-refraction': '' } : {}),
    ...(semantics === 'navigation' && ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {}),
    ...rest,
    children: inner,
  });

  return (
    <PanelRegistryContext.Provider value={registry}>
    <TabBarCtx.Provider value={ctxValue}>
      <SurfaceGroup className="ag-tab-bar" spacing="0" {...(refraction ? { refraction: true } : {})}>
        {nav}
        <ScrollEdge edge="bottom" edgeStyle="soft" />
      </SurfaceGroup>
    </TabBarCtx.Provider>
    </PanelRegistryContext.Provider>
  );
}
TabBarRoot.displayName = 'TabBar.Root';

export type TabBarItemProps = Omit<PartProps<'a'>, 'value'> & {
  /** Tab value — required under semantics='tabs' (matches a Tabs.Panel value). */
  value?: string | undefined;
  current?: boolean | undefined;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string | undefined;
};

function TabBarItem({ value, current, icon, badge, href, children, render, ...rest }: TabBarItemProps) {
  const { semantics } = React.useContext(TabBarCtx);
  if (process.env['NODE_ENV'] === 'development') {
    if (href === undefined && render === undefined) {
      console.warn('[auraglass] TabBar.Item: href is required unless a render prop is given.');
    }
    if (React.isValidElement(render) && render.type === 'button') {
      console.warn('[auraglass] TabBar.Item: destinations should be links — render=<button> is discouraged.');
    }
  }
  const a = partElement('a', {
    render: render as React.ReactElement | undefined,
    href,
    'data-ag-part': 'tab-bar-item',
    className: 'ag-tab-bar__item',
    ...(current ? { 'aria-current': 'page' as const } : {}),
    ...(semantics === 'tabs' && value !== undefined ? { role: 'tab', 'data-ag-value': value } : {}),
    ...rest,
    children: (
      <>
        {icon !== undefined ? (
          <span data-ag-part="tab-bar-item-icon" className="ag-tab-bar__item-icon" aria-hidden>
            {icon}
          </span>
        ) : null}
        <span data-ag-part="tab-bar-item-label" className="ag-tab-bar__item-label">
          {children}
        </span>
        {badge !== undefined ? (
          <span data-ag-part="tab-bar-item-badge" className="ag-tab-bar__item-badge">
            {badge}
          </span>
        ) : null}
      </>
    ),
  });
  return <li data-ag-part="tab-bar-item-wrap">{a}</li>;
}
TabBarItem.displayName = 'TabBar.Item';

export function TabBarItemIcon({ children, render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render,
    'data-ag-part': 'tab-bar-item-icon',
    'aria-hidden': true,
    ...rest,
    children,
  });
}
TabBarItemIcon.displayName = 'TabBar.ItemIcon';

export function TabBarItemLabel({ children, render, ...rest }: PartProps<'span'>) {
  return partElement('span', { render, 'data-ag-part': 'tab-bar-item-label', ...rest, children });
}
TabBarItemLabel.displayName = 'TabBar.ItemLabel';

export function TabBarItemBadge({ children, render, ...rest }: PartProps<'span'>) {
  return partElement('span', { render, 'data-ag-part': 'tab-bar-item-badge', ...rest, children });
}
TabBarItemBadge.displayName = 'TabBar.ItemBadge';

export function TabBarAccessory({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', { render, 'data-ag-part': 'tab-bar-accessory', className: 'ag-tab-bar__accessory', ...rest, children });
}
TabBarAccessory.displayName = 'TabBar.Accessory';

export function TabBarSearch({ render, ...rest }: PartProps<'div'>) {
  return partElement('div', {
    render,
    'data-ag-part': 'tab-bar-search',
    className: 'ag-tab-bar__search',
    ...rest,
    children: <SearchField aria-label="Search" />,
  });
}
TabBarSearch.displayName = 'TabBar.Search';

/** Register a Tabs.Panel value so TabBar semantics='tabs' can validate it
    (layout effect: registered before the bar's post-commit check). */
export function useTabBarPanel(value: string): void {
  const registry = React.useContext(PanelRegistryContext);
  React.useLayoutEffect(() => (registry ? registry.register(value) : undefined), [registry, value]);
}

export const TabBar = {
  Root: TabBarRoot,
  Item: TabBarItem,
  ItemIcon: TabBarItemIcon,
  ItemLabel: TabBarItemLabel,
  ItemBadge: TabBarItemBadge,
  Accessory: TabBarAccessory,
  Search: TabBarSearch,
};
