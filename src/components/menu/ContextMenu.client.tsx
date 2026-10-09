/* CMP-277 (REQ-CMP-104): ContextMenu — BU ContextMenu opens on contextmenu
   (right-click) on the Trigger and Shift+F10 per APG. Items reuse the menu
   visual contract via the same ag-menu-item classes. */
'use client';
import * as React from 'react';
import { ContextMenu as Base } from '@base-ui/react/context-menu';
import { usePortalContainer } from '../../foundation/portal';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason } from '../overlays/_shared/overlayTypes';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import { cn } from '../../internal';
import type {
  ContextMenuRootProps, ContextMenuTriggerProps, MenuPortalProps,
  MenuPositionerProps, MenuPopupProps, MenuItemProps, MenuGroupProps,
  MenuGroupLabelProps, MenuSeparatorProps, MenuCheckboxItemProps,
  MenuRadioGroupProps, MenuRadioItemProps,
} from './Menu.types';

interface Ctx { open: boolean }
const Ctx = React.createContext<Ctx>({ open: false });

function ContextMenuRoot({ open, defaultOpen, onOpenChange, loop = true, children }: ContextMenuRootProps) {
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  return (
    <Ctx.Provider value={{ open: current }}>
      <Base.Root
        open={controlled ? open : undefined}
        defaultOpen={defaultOpen}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          onOpenChange?.(o, { ...details, reason: toOverlayReason(details?.reason) } as OverlayOpenChangeDetails);
        }}
      >
        {children}
      </Base.Root>
    </Ctx.Provider>
  );
}

const ContextMenuTrigger = (function ({ ref, className, children, onKeyDown, ...rest }: ContextMenuTriggerProps & { ref?: React.Ref<HTMLDivElement> }) {
    // BU ContextMenu opens on contextmenu only — Shift+F10 is ours (CMP-277
    // APG): synthesize a contextmenu event at the trigger's center so BU does
    // anchor + open through its own path.
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !(e.key === 'F10' && e.shiftKey)) return;
      e.preventDefault();
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: r.left + r.width / 2,
        clientY: r.top + r.height / 2,
      }));
    };
    return (
      <Base.Trigger ref={ref} data-ag-part="context-trigger" className={cn('ag-contextmenu-trigger', className)} onKeyDown={handleKeyDown} {...rest}>
        {children}
      </Base.Trigger>
    );
  }
);

function ContextMenuPortal({ children, keepMounted }: MenuPortalProps) {
  const container = usePortalContainer();
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

const ContextMenuPositioner = (function ({ ref, className, children, ...rest }: MenuPositionerProps & { ref?: React.Ref<HTMLDivElement> }) {
    return (
      <Base.Positioner ref={ref} data-ag-part="positioner" className={cn('ag-menu-positioner', className)} {...defaultPositionerProps} {...rest}>
        {children}
      </Base.Positioner>
    );
  }
);

const ContextMenuPopup = (function ({ ref, className, children, ...rest }: MenuPopupProps & { ref?: React.Ref<HTMLDivElement> }) {
    const ctx = React.useContext(Ctx);
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
        className={cn('ag-menu-popup', 'ag-contextmenu-popup', className)}
        {...rest}
      >
        {children}
      </Base.Popup>
    );
  }
);

const ContextMenuItem = (function ({ ref, className, children, shortcut, ...rest }: MenuItemProps & { ref?: React.Ref<HTMLElement> }) {
    return (
      <Base.Item
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', className)}
        {...(shortcut !== undefined ? { 'aria-keyshortcuts': shortcut } : {})}
        {...rest}
      >
        <span className="ag-menu-item-label">{children}</span>
        {shortcut ? <kbd data-ag-part="shortcut" className="ag-menu-shortcut">{shortcut}</kbd> : null}
      </Base.Item>
    );
  }
);

const ContextMenuGroup = (function ({ ref, className, ...rest }: MenuGroupProps & { ref?: React.Ref<HTMLElement> }) {
    return <Base.Group ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group" className={cn('ag-menu-group', className)} {...rest} />;
  }
);

const ContextMenuGroupLabel = (function ({ ref, className, ...rest }: MenuGroupLabelProps & { ref?: React.Ref<HTMLElement> }) {
    return <Base.GroupLabel ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group-label" className={cn('ag-menu-group-label', className)} {...rest} />;
  }
);

const ContextMenuSeparator = (function ({ ref, className, ...rest }: MenuSeparatorProps & { ref?: React.Ref<HTMLElement> }) {
    return <Base.Separator ref={ref as React.Ref<HTMLDivElement>} data-ag-part="separator" className={cn('ag-menu-separator', className)} {...rest} />;
  }
);

const ContextMenuCheckboxItem = (function ({ ref, className, children, checked, onCheckedChange, ...rest }: MenuCheckboxItemProps & { ref?: React.Ref<HTMLElement> }) {
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
  }
);

function ContextMenuRadioGroup({ children, ...rest }: MenuRadioGroupProps) {
  return <Base.RadioGroup {...rest}>{children}</Base.RadioGroup>;
}

const ContextMenuRadioItem = (function ({ ref, className, children, ...rest }: MenuRadioItemProps & { ref?: React.Ref<HTMLElement> }) {
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
  }
);

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Positioner: ContextMenuPositioner,
  Popup: ContextMenuPopup,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Separator: ContextMenuSeparator,
  Content: ContextMenuPopup,
};
