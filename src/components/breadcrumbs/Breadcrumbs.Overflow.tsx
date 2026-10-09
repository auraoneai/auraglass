'use client';
/* Breadcrumbs overflow island (SURF-077): IconButton-labelled trigger
   (labels.showMore(n) ?? 'Show N more', computed on the server and passed as
   `label`) opening a CMP Menu of the collapsed link items. Serializable props
   only — functions never cross the RSC boundary. */

import * as React from 'react';
import { Menu } from '../menu';

const MenuTrigger = Menu.Trigger as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuContent = Menu.Content as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuItem = Menu.Item as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuRoot = Menu.Root as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;

export type BreadcrumbsOverflowProps = {
  /** Pre-computed "Show N more" label. */
  label?: string | undefined;
  /** Collapsed middle items (link elements). */
  items?: React.ReactNode[] | undefined;
  /** Render the overflow menu open (stories/tests; otherwise user-opened). */
  defaultOpen?: boolean | undefined;
};

export function BreadcrumbsOverflow({ label = 'Show more', items = [], defaultOpen }: BreadcrumbsOverflowProps) {
  // Real CMP Menu stacks Popup inside Positioner (optionally Portal); the
  // contract double maps Content straight to Base.Popup, so wrap only when
  // the parts exist.
  const MaybePortal = ('Portal' in Menu ? Menu.Portal : React.Fragment) as React.FC<{ children?: React.ReactNode }>;
  const MaybePositioner = ('Positioner' in Menu ? Menu.Positioner : React.Fragment) as React.FC<{ children?: React.ReactNode }>;
  return (
    <MenuRoot defaultOpen={defaultOpen}>
      <MenuTrigger aria-label={label} data-ag-part="ellipsis" className="ag-breadcrumbs__ellipsis">
        {'\u2026'}
      </MenuTrigger>
      <MaybePortal>
        <MaybePositioner>
          <MenuContent data-ag-part="overflow-menu">
            {items.map((item, i) => (
              <MenuItem key={i}>{item}</MenuItem>
            ))}
          </MenuContent>
        </MaybePositioner>
      </MaybePortal>
    </MenuRoot>
  );
}
