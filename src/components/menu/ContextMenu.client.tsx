/* CMP-277 (REQ-CMP-104): ContextMenu — BU ContextMenu opens on contextmenu
   (right-click) on the Trigger and Shift+F10 per APG. Items reuse the menu
   visual contract via the same ag-menu-item classes. */
'use client';
import * as React from 'react';
import { ContextMenu as Base } from '@base-ui/react/context-menu';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
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

const CONTEXT_LONG_PRESS_MS = 500;

const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger({ className, children, onKeyDown, onPointerDown, onPointerUp, onPointerCancel, onPointerMove, ...rest }, ref) {
    // BU ContextMenu opens on contextmenu only — Shift+F10 is ours (CMP-277
    // APG): synthesize a contextmenu event at the trigger's center so BU does
    // anchor + open through its own path.
    const synth = (el: HTMLElement, x: number, y: number) => {
      el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    };
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !(e.key === 'F10' && e.shiftKey)) return;
      e.preventDefault();
      const r = e.currentTarget.getBoundingClientRect();
      synth(e.currentTarget, r.left + r.width / 2, r.top + r.height / 2);
    };
    /* REQ-CMP-105: coarse-pointer long-press (500ms) opens the context menu at
       the press point — BU has no touch path. */
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancel = React.useCallback(() => {
      if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    }, []);
    React.useEffect(() => cancel, [cancel]);
    const handleDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
      onPointerDown?.(e);
      if (e.pointerType !== 'touch') return;
      const el = e.currentTarget; const { clientX, clientY } = e;
      cancel();
      timer.current = setTimeout(() => { timer.current = null; synth(el, clientX, clientY); }, CONTEXT_LONG_PRESS_MS);
    };
    const handleEnd: React.PointerEventHandler<HTMLDivElement> = (e) => {
      cancel();
      if (e.type === 'pointerup') onPointerUp?.(e as React.PointerEvent<HTMLDivElement>);
      else if (e.type === 'pointercancel') onPointerCancel?.(e);
      else onPointerMove?.(e as React.PointerEvent<HTMLDivElement>);
    };
    return (
      <Base.Trigger
        ref={ref}
        data-ag-part="context-trigger"
        className={cn('ag-contextmenu-trigger', className)}
        onKeyDown={handleKeyDown}
        onPointerDown={handleDown}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        onPointerMove={handleEnd}
        {...rest}
      >
        {children}
      </Base.Trigger>
    );
  },
);

function ContextMenuPortal({ children, keepMounted }: MenuPortalProps) {
  const container = usePortalContainer();
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

const ContextMenuPositioner = React.forwardRef<HTMLDivElement, MenuPositionerProps>(
  function ContextMenuPositioner({ className, children, ...rest }, ref) {
    return (
      <Base.Positioner ref={ref} data-ag-part="positioner" className={cn('ag-menu-positioner', className)} {...defaultPositionerProps} {...rest}>
        {children}
      </Base.Positioner>
    );
  },
);

const ContextMenuPopup = React.forwardRef<HTMLDivElement, MenuPopupProps>(
  function ContextMenuPopup({ className, children, ...rest }, ref) {
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
  },
);

const ContextMenuItem = React.forwardRef<HTMLElement, MenuItemProps>(
  function ContextMenuItem({ className, children, shortcut, ...rest }, ref) {
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
  },
);

const ContextMenuGroup = React.forwardRef<HTMLElement, MenuGroupProps>(
  function ContextMenuGroup({ className, ...rest }, ref) {
    return <Base.Group ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group" className={cn('ag-menu-group', className)} {...rest} />;
  },
);

const ContextMenuGroupLabel = React.forwardRef<HTMLElement, MenuGroupLabelProps>(
  function ContextMenuGroupLabel({ className, ...rest }, ref) {
    return <Base.GroupLabel ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group-label" className={cn('ag-menu-group-label', className)} {...rest} />;
  },
);

const ContextMenuSeparator = React.forwardRef<HTMLElement, MenuSeparatorProps>(
  function ContextMenuSeparator({ className, ...rest }, ref) {
    return <Base.Separator ref={ref as React.Ref<HTMLDivElement>} data-ag-part="separator" className={cn('ag-menu-separator', className)} {...rest} />;
  },
);

const ContextMenuCheckboxItem = React.forwardRef<HTMLElement, MenuCheckboxItemProps>(
  function ContextMenuCheckboxItem({ className, children, checked, onCheckedChange, ...rest }, ref) {
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

function ContextMenuRadioGroup({ children, ...rest }: MenuRadioGroupProps) {
  return <Base.RadioGroup {...rest}>{children}</Base.RadioGroup>;
}

const ContextMenuRadioItem = React.forwardRef<HTMLElement, MenuRadioItemProps>(
  function ContextMenuRadioItem({ className, children, ...rest }, ref) {
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
