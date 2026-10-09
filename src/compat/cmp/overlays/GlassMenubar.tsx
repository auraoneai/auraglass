/* CMP-340 compat: GlassMenubar (4.x) -> Menubar (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { MenuPortal, MenuPositioner, MenuPopup, Menubar } from '../../../components/menu';
import { Menu } from '../../../components/menu';

const DEP = 'DEP-C0113';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassMenubarMenuItem { label?: React.ReactNode; onSelect?: () => void; disabled?: boolean }
export interface GlassMenubarMenu { label?: React.ReactNode; items?: readonly GlassMenubarMenuItem[]; content?: React.ReactNode }

export interface GlassMenubarProps {
  menus?: readonly GlassMenubarMenu[];
  createFileMenu?: unknown;
  createEditMenu?: unknown;
  children?: React.ReactNode;
  className?: string;
}

export function GlassMenubar({ menus, createFileMenu, createEditMenu, children, className }: GlassMenubarProps) {
  warnDeprecated(DEP);
  if (createFileMenu !== undefined) drop('createFileMenu:run-canonical-names-codemod');
  if (createEditMenu !== undefined) drop('createEditMenu:run-canonical-names-codemod');
  return (
    <Menubar.Root {...(className !== undefined ? { className } : {})}>
      {children}
      {menus?.map((m, i) => (
        <Menu.Root key={i}>
          <Menu.Trigger>{m.label}</Menu.Trigger>
          <MenuPortal>
            <MenuPositioner>
              <MenuPopup>
                {m.content ??
                  m.items?.map((it, j) => (
                    <Menu.Item
                      key={j}
                      {...(it.disabled !== undefined ? { disabled: it.disabled } : {})}
                      {...(it.onSelect !== undefined ? { onClick: it.onSelect } : {})}
                    >
                      {it.label}
                    </Menu.Item>
                  ))}
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </Menu.Root>
      ))}
    </Menubar.Root>
  );
}
