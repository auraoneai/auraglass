/* CMP-340 compat: GlassDropdownMenu* (4.x) -> Menu (1:1 parts) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per §10.2/metas. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Menu } from '../../../components/menu';
import { MenuPortal, MenuArrow, MenuCheckboxItemIndicator, MenuRadioItemIndicator } from '../../../components/menu/Menu.client';
import type { OverlayOpenChangeDetails } from '../../../components/overlays/_shared';
import { splitPlacement } from './GlassPopover';

const DEP = 'DEP-C0111';
const warn = () => warnDeprecated(DEP);
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

/* 1:1 part adapters per §10.2 — asChild -> render on every interactive part. */

export function GlassDropdownMenuRoot(props: Record<string, unknown> & { children?: React.ReactNode }) {
  warn();
  const { onOpenChange, onClose, ...rest } = props;
  return (
    <Menu.Root
      {...(rest as object)}
      {...(onOpenChange !== undefined || onClose !== undefined
        ? { onOpenChange: (o: boolean, d: OverlayOpenChangeDetails) => {
              (onOpenChange as ((v: boolean) => void) | undefined)?.(o);
              if (!o) (onClose as (() => void) | undefined)?.();
            } }
        : {})}
    />
  );
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.Trigger}. */
export function GlassDropdownMenuTrigger({ asChild, children, ...rest }: Record<string, unknown> & { asChild?: boolean; children?: React.ReactNode }) {
  warnDeprecated('DEP-C0285'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Menu.Trigger {...(rest as object)} {...(asChild ? { render: children as never } : {})}>{asChild ? undefined : children}</Menu.Trigger>;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.Portal}. */
export function GlassDropdownMenuPortal(props: React.ComponentProps<typeof MenuPortal>) {
  warnDeprecated('DEP-C0294'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <MenuPortal {...props} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.Popup}. */
export function GlassDropdownMenuContent({ placement, side, align, sideOffset, children, ...rest }: Record<string, unknown> & { placement?: string; side?: 'top'|'bottom'|'left'|'right'; align?: 'start'|'center'|'end'; sideOffset?: number; children?: React.ReactNode }) {
  warnDeprecated('DEP-C0286'); // own symbol id (REQ-PLAT-30: once per symbol)
  const pos = splitPlacement(placement);
  return (
    <Menu.Content
      {...(side !== undefined ? { side } : pos.side !== undefined ? { side: pos.side } : {})}
      {...(align !== undefined ? { align } : pos.align !== undefined ? { align: pos.align } : {})}
      {...(sideOffset !== undefined ? { sideOffset } : {})}
      {...(rest as object)}
    >
      {children}
    </Menu.Content>
  );
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.Item}. */
export function GlassDropdownMenuItem({ asChild, onSelect, onClick, children, ...rest }: Record<string, unknown> & { asChild?: boolean; onSelect?: (e: unknown) => void; children?: React.ReactNode }) {
  warnDeprecated('DEP-C0287'); // own symbol id (REQ-PLAT-30: once per symbol)
  const cb = onSelect ?? onClick;
  return (
    <Menu.Item {...(rest as object)} {...(asChild ? { render: children as never } : {})}
      {...(cb !== undefined ? { onClick: cb as never } : {})}>
      {asChild ? undefined : children}
    </Menu.Item>
  );
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.CheckboxItem}. */
export function GlassDropdownMenuCheckboxItem({ checked, onCheckedChange, onSelect, children, ...rest }: Record<string, unknown> & { checked?: boolean; onCheckedChange?: (c: boolean) => void; onSelect?: (e: unknown) => void; children?: React.ReactNode }) {
  warnDeprecated('DEP-C0288'); // own symbol id (REQ-PLAT-30: once per symbol)
  return (
    <Menu.CheckboxItem
      {...(rest as object)}
      {...(checked !== undefined ? { checked } : {})}
      {...(onCheckedChange !== undefined ? { onCheckedChange: onCheckedChange as never } : {})}
      {...(onSelect !== undefined ? { onClick: onSelect as never } : {})}
    >
      <MenuCheckboxItemIndicator />
      {children}
    </Menu.CheckboxItem>
  );
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.RadioGroup}. */
export function GlassDropdownMenuRadioGroup(props: Record<string, unknown> & { children?: React.ReactNode }) {
  warnDeprecated('DEP-C0289'); // own symbol id (REQ-PLAT-30: once per symbol)
  const { onValueChange, onChange, ...rest } = props;
  return (
    <Menu.RadioGroup
      {...(rest as object)}
      {...(onValueChange !== undefined || onChange !== undefined
        ? { onValueChange: ((onValueChange ?? onChange) as never) }
        : {})}
    />
  );
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.RadioItem}. */
export function GlassDropdownMenuRadioItem({ children, ...rest }: Record<string, unknown> & { value?: string; children?: React.ReactNode }) {
  warnDeprecated('DEP-C0290'); // own symbol id (REQ-PLAT-30: once per symbol)
  return (
    <Menu.RadioItem value={(rest as { value?: string }).value ?? ''} {...(rest as object)}>
      <MenuRadioItemIndicator />
      {children}
    </Menu.RadioItem>
  );
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.Group}. */
export function GlassDropdownMenuGroup(props: Record<string, unknown> & { children?: React.ReactNode }) {
  warnDeprecated('DEP-C0293'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Menu.Group {...(props as object)} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.GroupLabel}. */
export function GlassDropdownMenuLabel(props: Record<string, unknown> & { children?: React.ReactNode }) {
  warnDeprecated('DEP-C0291'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Menu.GroupLabel {...(props as object)} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.Separator}. */
export function GlassDropdownMenuSeparator(props: Record<string, unknown>) {
  warnDeprecated('DEP-C0292'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Menu.Separator {...(props as object)} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.SubmenuRoot}. */
export function GlassDropdownMenuSub(props: Record<string, unknown> & { children?: React.ReactNode }) {
  warnDeprecated('DEP-C0295'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Menu.Submenu {...(props as object)} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.SubmenuTrigger}. */
export function GlassDropdownMenuSubTrigger({ asChild, children, ...rest }: Record<string, unknown> & { asChild?: boolean; children?: React.ReactNode }) {
  warnDeprecated('DEP-C0296'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <Menu.SubmenuTrigger {...(rest as object)} {...(asChild ? { render: children as never } : {})}>{asChild ? undefined : children}</Menu.SubmenuTrigger>;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu.Arrow}. */
export function GlassDropdownMenuArrow(props: Record<string, unknown>) {
  warnDeprecated('DEP-C0297'); // own symbol id (REQ-PLAT-30: once per symbol)
  return <MenuArrow {...(props as object)} />;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Menu}. */
export const GlassDropdownMenu = {
  Root: GlassDropdownMenuRoot,
  Trigger: GlassDropdownMenuTrigger,
  Portal: GlassDropdownMenuPortal,
  Content: GlassDropdownMenuContent,
  Item: GlassDropdownMenuItem,
  CheckboxItem: GlassDropdownMenuCheckboxItem,
  RadioGroup: GlassDropdownMenuRadioGroup,
  RadioItem: GlassDropdownMenuRadioItem,
  Group: GlassDropdownMenuGroup,
  Label: GlassDropdownMenuLabel,
  Separator: GlassDropdownMenuSeparator,
  Sub: GlassDropdownMenuSub,
  SubTrigger: GlassDropdownMenuSubTrigger,
  Arrow: GlassDropdownMenuArrow,
};
export default GlassDropdownMenu;
