"use client";
/* CMP-345: registry item account-menu — Menu composition replacing 4.x
   HeaderUserMenu. Registry items are never root-exported (D-15/D-17). */
import * as React from "react";
import { Menu, Avatar } from "aura-glass";

export interface AccountMenuItem {
  id: string;
  label: string;
  onSelect?: () => void;
  danger?: boolean;
}

export interface AccountMenuProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  items: AccountMenuItem[];
  onSignOut?: () => void;
}

export function AccountMenu({
  name,
  email,
  avatarSrc,
  items,
  onSignOut,
}: AccountMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger aria-label={`Account menu for ${name}`}>
        <Avatar.Root
          {...(avatarSrc !== undefined ? { src: avatarSrc } : {})}
          alt={name}
          name={name}
          size="sm"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end">
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>
                {name}
                {email ? ` — ${email}` : ""}
              </Menu.GroupLabel>
              {items.map((it) => (
                <Menu.Item
                  key={it.id}
                  {...(it.onSelect !== undefined
                    ? { onSelect: it.onSelect }
                    : {})}
                >
                  {it.label}
                </Menu.Item>
              ))}
            </Menu.Group>
            {onSignOut ? (
              <>
                <Menu.Separator />
                <Menu.Item onSelect={onSignOut} data-ag-intent="danger">
                  Sign out
                </Menu.Item>
              </>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
export default AccountMenu;
