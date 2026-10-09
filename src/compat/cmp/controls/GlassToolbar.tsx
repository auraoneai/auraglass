/* CMP-325 compat: GlassToolbar (4.x) -> Toolbar (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Toolbar } from '../../../components/toolbar';

const DEP = 'DEP-C0013';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassToolbarItem {
  id?: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: unknown) => void;
  disabled?: boolean;
  type?: 'button' | 'separator' | 'link';
  href?: string;
}

export interface GlassToolbarProps {
  orientation?: 'horizontal' | 'vertical';
  items?: readonly GlassToolbarItem[];
  'aria-label'?: string;
  children?: React.ReactNode;
  className?: string;
}

export function renderToolbarItems(items: readonly GlassToolbarItem[], dep: string) {
  return items.map((item, i) => {
    if (item.type === 'separator') return <Toolbar.Separator key={item.id ?? i} />;
    if (item.type === 'link')
      return <Toolbar.Link key={item.id ?? i} {...(item.href !== undefined ? { href: item.href } : {})}>{item.label}</Toolbar.Link>;
    if (item.icon !== undefined)
      return (
        <Toolbar.IconButton
          key={item.id ?? i}
          label={typeof item.label === 'string' ? item.label : (item.id ?? `item-${i}`)}
          icon={item.icon}
          {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
          {...(item.onClick !== undefined ? { onClick: item.onClick } : {})}
        />
      );
    return (
      <Toolbar.Button
        key={item.id ?? i}
        {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
        {...(item.onClick !== undefined ? { onClick: item.onClick } : {})}
      >
        {item.label}
      </Toolbar.Button>
    );
  });
}

/** @deprecated GlassToolbar DEP-C0013 since 4.3.0, removed in 5.0.0. {@link Toolbar} */
export function GlassToolbar({ items, children, ...rest }: GlassToolbarProps) {
  warnDeprecated(DEP);
  return (
    <Toolbar.Root aria-label={(rest as Record<string, unknown>)['aria-label'] as string ?? 'Toolbar'} {...rest}>
      {children}
      {items ? renderToolbarItems(items, DEP) : null}
    </Toolbar.Root>
  );
}
