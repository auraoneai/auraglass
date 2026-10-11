/* CMP-273..276, 278 (REQ-CMP-102/103/104/105): Menu over Base UI Menu —
   APG menu-button keyboard (loop=true default, Enter/Space/ArrowDown opens +
   first item, ArrowUp opens + last), roles menu/menuitem{,checkbox,radio},
   aria-checked='mixed' for indeterminate, aria-disabled items stay focusable,
   shortcut kbd + aria-keyshortcuts, submenu hover + ArrowRight (BU safe
   triangle), Trigger openOnHover dev-warns outside a Menubar. */
'use client';
import * as React from 'react';
import { Menu as Base } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason } from '../overlays/_shared/overlayTypes';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import { cn } from '../../internal';
import type {
  MenuRootProps, MenuTriggerProps, MenuPortalProps, MenuPositionerProps,
  MenuPopupProps, MenuArrowProps, MenuItemProps, MenuLinkItemProps,
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

const MenuTrigger = React.forwardRef<HTMLElement, MenuTriggerProps>(
  function MenuTrigger({ openOnHover, delay, className, children, ...rest }, ref) {
    // openOnHover is only meaningful inside a Menubar (CMP-276)
    const inMenubar = React.useContext(MenubarCtx);
    if (process.env.NODE_ENV !== 'production' && openOnHover && !inMenubar) {
      // eslint-disable-next-line no-console
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
      >
        {children}
      </Base.Trigger>
    );
  },
);

function MenuPortal({ children, keepMounted }: MenuPortalProps) {
  const container = usePortalContainer();
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

const MenuPositioner = React.forwardRef<HTMLDivElement, MenuPositionerProps>(
  function MenuPositioner({ className, children, ...rest }, ref) {
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
  },
);

const MenuPopup = React.forwardRef<HTMLDivElement, MenuPopupProps>(
  function MenuPopup({ className, children, ...rest }, ref) {
    const ctx = React.useContext(MenuCtx);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);
    const animatingRef = useOverlayAnimating();
    useOverlayLayer({ kind: 'menu', modal: false, open: ctx.open, element: el });
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
        data-state={ctx.open ? 'open' : 'closed'}
        {...overlayMaterial('menu')}
        className={cn('ag-menu-popup', className)}
        {...rest}
      >
        {children}
      </Base.Popup>
    );
  },
);

const MenuArrow = React.forwardRef<HTMLDivElement, MenuArrowProps>(
  function MenuArrow({ className, ...rest }, ref) {
    return <Base.Arrow ref={ref} data-ag-part="arrow" className={cn('ag-menu-arrow', className)} {...rest} />;
  },
);

/* REQ-CMP-102: the visible kbd is decorative — the item already exposes the
   shortcut via aria-keyshortcuts, so hide the element from AT. */
const shortcutKbd = (shortcut: string | undefined) => (
  shortcut ? <kbd data-ag-part="shortcut" className="ag-menu-shortcut" aria-hidden="true">{shortcut}</kbd> : null
);

const MenuItem = React.forwardRef<HTMLElement, MenuItemProps>(
  function MenuItem({ className, children, shortcut, disabled, focusableWhenDisabled, ...rest }, ref) {
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
        <span className="ag-menu-item-label">{children}</span>
        {shortcutKbd(shortcut)}
      </Base.Item>
    );
  },
);

const MenuLinkItem = React.forwardRef<HTMLElement, MenuLinkItemProps>(
  function MenuLinkItem({ className, children, href, target, rel, shortcut, ...rest }, ref) {
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
        <span className="ag-menu-item-label">{children}</span>
        {shortcutKbd(shortcut)}
      </Base.LinkItem>
    );
  },
);

const MenuCheckboxItem = React.forwardRef<HTMLElement, MenuCheckboxItemProps>(
  function MenuCheckboxItem({ className, children, checked, onCheckedChange, ...rest }, ref) {
    // CMP-275: 'indeterminate' → aria-checked="mixed" on the item
    return (
      <Base.CheckboxItem
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', 'ag-menu-checkbox-item', className)}
        {...(typeof checked === 'boolean' ? { checked } : {})}
        {...(checked === 'indeterminate' ? { 'aria-checked': 'mixed', 'data-ag-indeterminate': true } : {})}
        {...(onCheckedChange !== undefined ? { onCheckedChange: (c: boolean) => onCheckedChange(c) } : {})}
        {...rest}
      >
        <span className="ag-menu-item-indicator" data-ag-part="indicator" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
      </Base.CheckboxItem>
    );
  },
);

const MenuCheckboxItemIndicator = React.forwardRef<HTMLElement, MenuCheckboxItemIndicatorProps>(
  function MenuCheckboxItemIndicator({ className, children, ...rest }, ref) {
    return (
      <Base.CheckboxItemIndicator ref={ref as React.Ref<HTMLSpanElement>} data-ag-part="indicator" className={cn('ag-menu-indicator', className)} {...rest}>
        {children}
      </Base.CheckboxItemIndicator>
    );
  },
);

function MenuRadioGroup({ children, ...rest }: MenuRadioGroupProps) {
  return <Base.RadioGroup {...rest}>{children}</Base.RadioGroup>;
}

const MenuRadioItem = React.forwardRef<HTMLElement, MenuRadioItemProps>(
  function MenuRadioItem({ className, children, ...rest }, ref) {
    return (
      <Base.RadioItem
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', 'ag-menu-radio-item', className)}
        {...rest}
      >
        <span className="ag-menu-item-indicator" data-ag-part="indicator" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
      </Base.RadioItem>
    );
  },
);

const MenuRadioItemIndicator = React.forwardRef<HTMLElement, MenuRadioItemIndicatorProps>(
  function MenuRadioItemIndicator({ className, children, ...rest }, ref) {
    return (
      <Base.RadioItemIndicator ref={ref as React.Ref<HTMLSpanElement>} data-ag-part="indicator" className={cn('ag-menu-indicator', className)} {...rest}>
        {children}
      </Base.RadioItemIndicator>
    );
  },
);

const MenuGroup = React.forwardRef<HTMLElement, MenuGroupProps>(
  function MenuGroup({ className, ...rest }, ref) {
    return <Base.Group ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group" className={cn('ag-menu-group', className)} {...rest} />;
  },
);

const MenuGroupLabel = React.forwardRef<HTMLElement, MenuGroupLabelProps>(
  function MenuGroupLabel({ className, ...rest }, ref) {
    return <Base.GroupLabel ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group-label" className={cn('ag-menu-group-label', className)} {...rest} />;
  },
);

const MenuSeparator = React.forwardRef<HTMLElement, MenuSeparatorProps>(
  function MenuSeparator({ className, ...rest }, ref) {
    return <Base.Separator ref={ref as React.Ref<HTMLDivElement>} data-ag-part="separator" className={cn('ag-menu-separator', className)} {...rest} />;
  },
);

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

const MenuSubmenuTrigger = React.forwardRef<HTMLElement, MenuSubmenuTriggerProps>(
  function MenuSubmenuTrigger({ className, children, ...rest }, ref) {
    return (
      <Base.SubmenuTrigger
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="submenu-trigger"
        className={cn('ag-menu-item', 'ag-menu-submenu-trigger', className)}
        {...rest}
      >
        <span className="ag-menu-item-label">{children}</span>
        <span data-ag-part="submenu-indicator" aria-hidden="true" className="ag-menu-submenu-indicator" />
      </Base.SubmenuTrigger>
    );
  },
);

const MenubarRoot = React.forwardRef<HTMLDivElement, MenubarProps>(
  function MenubarRoot({ className, orientation = 'horizontal', ...rest }, ref) {
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
  },
);

/* REQ-CMP-102: real Content composite = Portal>Positioner>Popup — mirrors the
   Popover contract (REQ-CMP-97) so callers get the full overlay stack. */
function MenuContent({ children }: { children: React.ReactNode }) {
  return (
    <MenuPortal>
      <MenuPositioner>
        <MenuPopup>{children}</MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  );
}

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Arrow: MenuArrow,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
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

