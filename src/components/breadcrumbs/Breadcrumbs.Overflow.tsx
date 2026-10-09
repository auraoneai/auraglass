'use client';
/* Breadcrumbs overflow island (SURF-077): IconButton-labelled trigger
   (labels.showMore(n) ?? 'Show N more', computed on the server and passed as
   `label`) opening a CMP Menu of the collapsed link items. Serializable props
   only — functions never cross the RSC boundary. */

import * as React from 'react';
import { MenuPortal, MenuPositioner, Menu } from '../menu';

const MenuTrigger = Menu.Trigger as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuContent = Menu.Content as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuItem = Menu.Item as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const MenuRoot = Menu.Root as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;

export type BreadcrumbsOverflowProps = {
  /** Pre-computed "Show N more" label. */
  label?: string | undefined;
  /** Collapsed middle items (link elements). */
  items?: React.ReactNode[] | undefined;
};

export function BreadcrumbsOverflow({ label = 'Show more', items = [] }: BreadcrumbsOverflowProps) {
  // Real CMP Menu stacks Popup inside Positioner (optionally Portal); the
  // contract double maps Content straight to Base.Popup, so wrap only when
  // the parts exist.
  const MaybePortal = ('Portal' in Menu ? MenuPortal : React.Fragment) as React.FC<{ children?: React.ReactNode }>;
  const MaybePositioner = ('Positioner' in Menu ? MenuPositioner : React.Fragment) as React.FC<{ children?: React.ReactNode }>;
  return (
    <MenuRoot>
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
