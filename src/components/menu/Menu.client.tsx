/* CMP-273..276, 278 (REQ-CMP-102/103/104/105): Menu over Base UI Menu —
   APG menu-button keyboard (loop=true default, Enter/Space/ArrowDown opens +
   first item, ArrowUp opens + last), roles menu/menuitem{,checkbox,radio},
   aria-checked='mixed' for indeterminate, aria-disabled items stay focusable,
   shortcut kbd + aria-keyshortcuts, submenu hover + ArrowRight (BU safe
   triangle), Trigger openOnHover dev-warns outside a Menubar. */
'use client';
import * as React from 'react';
import { childAsRender } from '../overlays/_shared/renderChild';
import { Menu as Base } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason } from '../overlays/_shared/overlayTypes';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import { cn } from '../../internal';
import { useControllableWarning } from '../../foundation/controllable';
import type {
  MenuRootProps, MenuTriggerProps, MenuPortalProps, MenuPositionerProps,
  MenuPopupProps, MenuContentProps, MenuArrowProps, MenuItemProps, MenuLinkItemProps,
  MenuCheckboxItemProps, MenuCheckboxItemIndicatorProps, MenuRadioGroupProps,
  MenuRadioItemProps, MenuRadioItemIndicatorProps, MenuGroupProps,
  MenuGroupLabelProps, MenuSeparatorProps, MenuSubmenuProps, MenuSubmenuTriggerProps,
  MenubarProps,
} from './Menu.types';

interface MenuCtx { open: boolean }
const MenuCtx = React.createContext<MenuCtx>({ open: false });
/* Own menubar marker — BU's useMenubarContext is internal-only (not exported
   from the package index, and a deep import would hit the dual .mjs/.js
   instance split anyway). Our Menubar wraps children in this provider. */
const MenubarCtx = React.createContext(false);

function MenuRoot({ open, defaultOpen, onOpenChange, loop = true, orientation, children }: MenuRootProps) {
  useControllableWarning('Menu', 'open', open);
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  return (
    <MenuCtx.Provider value={{ open: current }}>
      <Base.Root
        open={controlled ? open : undefined}
        defaultOpen={defaultOpen}
        loopFocus={loop}
        orientation={orientation}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          onOpenChange?.(o, { ...details, reason: toOverlayReason(details?.reason) } as OverlayOpenChangeDetails);
        }}
      >
        {children}
      </Base.Root>
    </MenuCtx.Provider>
  );
}

function MenuTrigger({ openOnHover, delay, className, children, ref, ...rest }: MenuTriggerProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    const trigger = rest.render === undefined ? childAsRender(children) : { render: rest.render, children };
    // openOnHover is only meaningful inside a Menubar (CMP-276)
    const inMenubar = React.useContext(MenubarCtx);
    if (process.env.NODE_ENV !== 'production' && openOnHover && !inMenubar) {
      console.warn('[aura-glass] Menu.Trigger openOnHover is only allowed inside a Menubar.');
    }
    return (
      <Base.Trigger
        ref={ref as React.Ref<HTMLButtonElement>}
        data-ag-part="trigger"
        className={cn('ag-menu-trigger', className)}
        {...(openOnHover !== undefined ? { openOnHover } : {})}
        {...(delay !== undefined ? { delay } : {})}
        {...rest}
        render={trigger.render}
      >
        <span data-ag-part="hit-area" aria-hidden="true" />
        {trigger.children}
      </Base.Trigger>
    );
}

function MenuPortal({ children, keepMounted }: MenuPortalProps) {
  const container = usePortalContainer();
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

function MenuPositioner({ className, children, ref, ...rest }: MenuPositionerProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return (
      <Base.Positioner
        ref={ref}
        data-ag-part="positioner"
        className={cn('ag-menu-positioner', className)}
        {...defaultPositionerProps}
        {...rest}
      >
        {children}
      </Base.Positioner>
    );
}

function MenuPopup({ className, children, ref, ...rest }: MenuPopupProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    const ctx = React.useContext(MenuCtx);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);
    const animatingRef = useOverlayAnimating();
    const { depth } = useOverlayLayer({ kind: 'menu', modal: false, open: ctx.open, element: el });
    const setRefs: React.RefCallback<HTMLDivElement> = (node) => {
      setEl(node);
      animatingRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };
    return (
      <Base.Popup
        ref={setRefs}
        data-ag-part="popup"
        data-ag-overlay-depth={depth}
        data-state={ctx.open ? 'open' : 'closed'}
        {...overlayMaterial('menu')}
        className={cn('ag-menu-popup', className)}
        {...rest}
      >
        {children}
      </Base.Popup>
    );
}

function MenuArrow({ className, ref, ...rest }: MenuArrowProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return <Base.Arrow ref={ref} data-ag-part="arrow" className={cn('ag-menu-arrow', className)} {...rest} />;
}

/* REQ-CMP-102: the visible kbd is decorative — the item already exposes the
   shortcut via aria-keyshortcuts, so hide the element from AT. */
const shortcutKbd = (shortcut: string | undefined) => (
  shortcut ? <kbd data-ag-part="shortcut" className="ag-menu-shortcut" aria-hidden="true">{shortcut}</kbd> : null
);

function MenuItem({ className, children, shortcut, disabled, focusableWhenDisabled, ref, ...rest }: MenuItemProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.Item
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', className)}
        disabled={disabled}
        {...(shortcut !== undefined ? { 'aria-keyshortcuts': shortcut } : {})}
        {...rest}
        {...(disabled && focusableWhenDisabled === true ? { tabIndex: 0 } : {})}
        {...(disabled && focusableWhenDisabled === false ? { tabIndex: -1 } : {})}
      >
        <span data-ag-part="hit-area" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
        {shortcutKbd(shortcut)}
      </Base.Item>
    );
}

function MenuLinkItem({ className, children, href, target, rel, shortcut, ref, ...rest }: MenuLinkItemProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.LinkItem
        ref={ref as React.Ref<HTMLAnchorElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', 'ag-menu-item-link', className)}
        href={href}
        {...(target !== undefined ? { target } : {})}
        {...(rel !== undefined ? { rel } : {})}
        {...(shortcut !== undefined ? { 'aria-keyshortcuts': shortcut } : {})}
        {...rest}
      >
        <span data-ag-part="hit-area" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
        {shortcutKbd(shortcut)}
      </Base.LinkItem>
    );
}

function MenuCheckboxItem({ className, children, checked, onCheckedChange, ref, ...rest }: MenuCheckboxItemProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    // CMP-275: 'indeterminate' → aria-checked="mixed" on the item
    return (
      <Base.CheckboxItem
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', 'ag-menu-checkbox-item', className)}
        {...(typeof checked === 'boolean' ? { checked } : {})}
        {...(checked === 'indeterminate' ? { 'aria-checked': 'mixed', 'data-indeterminate': true } : {})}
        {...(onCheckedChange !== undefined ? { onCheckedChange: (c: boolean) => onCheckedChange(c) } : {})}
        {...rest}
      >
        <span className="ag-menu-item-indicator" data-ag-part="indicator" aria-hidden="true" />
        <span data-ag-part="hit-area" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
      </Base.CheckboxItem>
    );
}

function MenuCheckboxItemIndicator({ className, children, ref, ...rest }: MenuCheckboxItemIndicatorProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.CheckboxItemIndicator ref={ref as React.Ref<HTMLSpanElement>} data-ag-part="indicator" className={cn('ag-menu-indicator', className)} {...rest}>
        {children}
      </Base.CheckboxItemIndicator>
    );
}

function MenuRadioGroup({ children, ...rest }: MenuRadioGroupProps) {
  return <Base.RadioGroup {...rest}>{children}</Base.RadioGroup>;
}

function MenuRadioItem({ className, children, ref, ...rest }: MenuRadioItemProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.RadioItem
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', 'ag-menu-radio-item', className)}
        {...rest}
      >
        <span className="ag-menu-item-indicator" data-ag-part="indicator" aria-hidden="true" />
        <span data-ag-part="hit-area" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
      </Base.RadioItem>
    );
}

function MenuRadioItemIndicator({ className, children, ref, ...rest }: MenuRadioItemIndicatorProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.RadioItemIndicator ref={ref as React.Ref<HTMLSpanElement>} data-ag-part="indicator" className={cn('ag-menu-indicator', className)} {...rest}>
        {children}
      </Base.RadioItemIndicator>
    );
}

function MenuGroup({ className, ref, ...rest }: MenuGroupProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.Group ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group" className={cn('ag-menu-group', className)} {...rest} />;
}

function MenuGroupLabel({ className, ref, ...rest }: MenuGroupLabelProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.GroupLabel ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group-label" className={cn('ag-menu-group-label', className)} {...rest} />;
}

function MenuSeparator({ className, ref, ...rest }: MenuSeparatorProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.Separator ref={ref as React.Ref<HTMLDivElement>} data-ag-part="separator" className={cn('ag-menu-separator', className)} {...rest} />;
}

function MenuSubmenu(props: MenuSubmenuProps) {
  const { open, defaultOpen, onOpenChange, children, ...rest } = props;
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  return (
    <MenuCtx.Provider value={{ open: current }}>
      <Base.SubmenuRoot
        open={controlled ? open : undefined}
        defaultOpen={defaultOpen}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          onOpenChange?.(o, { ...details, reason: toOverlayReason(details?.reason) } as OverlayOpenChangeDetails);
        }}
        {...rest}
      >
        {children}
      </Base.SubmenuRoot>
    </MenuCtx.Provider>
  );
}

function MenuSubmenuTrigger({ className, children, ref, ...rest }: MenuSubmenuTriggerProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.SubmenuTrigger
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="submenu-trigger"
        className={cn('ag-menu-item', 'ag-menu-submenu-trigger', className)}
        {...rest}
      >
        <span data-ag-part="hit-area" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
        <span data-ag-part="submenu-indicator" aria-hidden="true" className="ag-menu-submenu-indicator" />
      </Base.SubmenuTrigger>
    );
}

function MenubarRoot({ className, orientation = 'horizontal', ref, ...rest }: MenubarProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return (
      <MenubarCtx.Provider value={true}>
        <BaseMenubar
          ref={ref}
          role="menubar"
          aria-orientation={orientation}
          orientation={orientation}
          data-ag-part="root"
          className={cn('ag-menubar', className)}
          {...rest}
        />
      </MenubarCtx.Provider>
    );
}

/* REQ-CMP-102: real Content composite = Portal>Positioner>Popup — mirrors the
   Popover contract (REQ-CMP-97) so callers get the full overlay stack. */
function MenuContent({ side, align, sideOffset, keepMounted, ref, ...props }: MenuContentProps) {
  // The popup's part name is component-owned: a caller data-ag-part is not forwarded
  // (Menu.Content has never forwarded it; consumers key on data-ag-part="popup").
  const { 'data-ag-part': _part, ...popupProps } = props as MenuPopupProps & { 'data-ag-part'?: string };
  return (
    <MenuPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
      <MenuPositioner
        {...(side !== undefined ? { side } : {})}
        {...(align !== undefined ? { align } : {})}
        {...(sideOffset !== undefined ? { sideOffset } : {})}
      >
        <MenuPopup {...(ref !== undefined ? { ref } : {})} {...popupProps} />
      </MenuPositioner>
    </MenuPortal>
  );
}

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
  Submenu: MenuSubmenu,
  SubmenuTrigger: MenuSubmenuTrigger,
  /** Contract composite: Content = Portal>Positioner>Popup */
  Content: MenuContent,
};

/* REQ-CMP-105: Menubar is a compound — Menubar.Root is the real root (loop
   default true via BU), Menubar.Menu aliases Menu.Root. The flat callable
   stays as a deprecated alias so existing <Menubar> keeps working. */
export const Menubar = Object.assign(MenubarRoot, { Root: MenubarRoot, Menu: MenuRoot });

export { MenuPortal, MenuPositioner, MenuPopup, MenuArrow, MenuLinkItem, MenuCheckboxItemIndicator, MenuRadioItemIndicator };
