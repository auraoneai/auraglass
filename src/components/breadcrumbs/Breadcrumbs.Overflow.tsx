'use client';
/* Breadcrumbs overflow island (SURF-077): IconButton-labelled trigger
   (labels.showMore(n) ?? 'Show N more', computed on the server and passed as
   `label`) opening a CMP Menu of the collapsed link items. Serializable props
   only — functions never cross the RSC boundary. */

import * as React from 'react';
import { Menu } from '../menu';
import { IconButton } from '../icon-button';

const MenuTrigger = Menu.Trigger as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuContent = Menu.Content as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuItem = Menu.Item as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuRoot = Menu.Root as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;

export type BreadcrumbsOverflowItem = { href?: string | undefined; label: React.ReactNode };

export type BreadcrumbsOverflowProps = {
  /** Pre-computed "Show N more" label. */
  label?: string | undefined;
  /** Collapsed middle items — serializable {href,label} pairs from the
      server Root (SURF-056); React elements also accepted for compat. */
  items?: Array<BreadcrumbsOverflowItem | React.ReactNode> | undefined;
  /** Initial menu state (uncontrolled). */
  defaultOpen?: boolean | undefined;
};

const isPair = (v: unknown): v is BreadcrumbsOverflowItem =>
  typeof v === 'object' && v !== null && 'label' in (v as object);

export function BreadcrumbsOverflow({ label = 'Show more', items = [], defaultOpen }: BreadcrumbsOverflowProps) {
  // Real CMP Menu stacks Popup inside Positioner (optionally Portal); the
  // contract double maps Content straight to Base.Popup, so wrap only when
  // the parts exist.
  const MaybePortal = ('Portal' in Menu ? Menu.Portal : React.Fragment) as React.FC<{ children?: React.ReactNode }>;
  const MaybePositioner = ('Positioner' in Menu ? Menu.Positioner : React.Fragment) as React.FC<{ children?: React.ReactNode }>;
  return (
    <MenuRoot {...(defaultOpen !== undefined ? { defaultOpen } : {})}>
      <MenuTrigger
        render={<IconButton label={label} icon={'\u2026'} />}
        data-ag-part="ellipsis"
        className="ag-breadcrumbs__ellipsis"
      />
      <MaybePortal>
        <MaybePositioner>
          <MenuContent data-ag-part="overflow-menu">
            {items.map((item, i) =>
              isPair(item) ? (
                <MenuItem key={i} render={<a href={item.href} />}>
                  {item.label}
                </MenuItem>
              ) : (
                <MenuItem key={i}>{item}</MenuItem>
              ),
            )}
          </MenuContent>
        </MaybePositioner>
      </MaybePortal>
    </MenuRoot>
  );
}
