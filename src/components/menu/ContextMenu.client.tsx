/* CMP-277 (REQ-CMP-104): ContextMenu — BU ContextMenu opens on contextmenu
   (right-click) on the Trigger and Shift+F10 per APG. Items reuse the menu
   visual contract via the same ag-menu-item classes. */
'use client';
import * as React from 'react';
import { ContextMenu as Base } from '@base-ui/react/context-menu';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { overlayMaterial, defaultPositionerProps, useOverlayLayer, useOverlayAnimating } from '../overlays/_shared';
import { toOverlayReason } from '../overlays/_shared/overlayTypes';
import { useRoutedRootActions } from '../overlays/_shared/useOverlayLayer';
import type { OverlayRootActions } from '../overlays/_shared/useOverlayLayer';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import { cn } from '../../internal';
import { useControllableWarning } from '../../foundation/controllable';
import { stateRender, toDataState } from '../../foundation/state';
import type {
  ContextMenuRootProps, ContextMenuTriggerProps, MenuPortalProps,
  MenuPositionerProps, MenuPopupProps, MenuContentProps, MenuItemProps, MenuGroupProps,
  MenuGroupLabelProps, MenuSeparatorProps, MenuCheckboxItemProps,
  MenuRadioGroupProps, MenuRadioItemProps,
} from './Menu.types';

/* REQ-CMP-12: `actions` is the root's close path for the LayerStack Escape. */
interface Ctx {
  open: boolean;
  opener: React.MutableRefObject<HTMLElement | null> | null;
  actions?: React.RefObject<OverlayRootActions | null>;
}
const Ctx = /*#__PURE__*/ React.createContext<Ctx>({ open: false, opener: null });

/* REQ-CMP-105: focus restores on every close. BU returns focus itself for
   Escape/item activation; an outside press on a non-focusable spot leaves
   focus on <body>, so after close we hand it back to the element that had
   focus when the menu opened — never stealing it from a control the press
   focused. */
function restoreFocusAfterClose(opener: HTMLElement | null) {
  setTimeout(() => {
    const active = document.activeElement;
    if (!opener || !opener.isConnected) return;
    if (active === null || active === document.body || active === document.documentElement) opener.focus({ preventScroll: true });
  }, 0);
}

function ContextMenuRoot({ open, defaultOpen, onOpenChange, loop = true, children }: ContextMenuRootProps) {
  useControllableWarning('ContextMenu', 'open', open);
  const [internal, setInternal] = React.useState(Boolean(defaultOpen));
  const controlled = open !== undefined;
  const current = controlled ? open : internal;
  const opener = React.useRef<HTMLElement | null>(null);
  const buActions = React.useRef<{ close: () => void; unmount: () => void } | null>(null);
  const routed = useRoutedRootActions(() => buActions.current?.close());
  const value = React.useMemo(() => ({ open: current, opener, actions: routed.actions }), [current, routed.actions]);
  return (
    <Ctx.Provider value={value}>
      <Base.Root
        open={controlled ? open : undefined}
        defaultOpen={defaultOpen}
        loopFocus={loop}
        actionsRef={buActions as React.RefObject<{ close: () => void; unmount: () => void } | null>}
        onOpenChange={(o, details) => {
          if (!controlled) setInternal(o);
          if (!o) restoreFocusAfterClose(opener.current);
          const reason = !o && routed.takeEscape() ? 'escape-key' : toOverlayReason(details?.reason);
          onOpenChange?.(o, { event: details?.event, reason } satisfies OverlayOpenChangeDetails);
        }}
      >
        {children}
      </Base.Root>
    </Ctx.Provider>
  );
}

const CONTEXT_LONG_PRESS_MS = 500;
function ContextMenuTrigger({ className, children, onKeyDown, onPointerDown, onPointerUp, onPointerCancel, onPointerMove, render, ref, ...rest }: ContextMenuTriggerProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    // BU ContextMenu opens on contextmenu only — Shift+F10 and the ContextMenu
    // key are ours (CMP-277 APG, REQ-CMP-105): synthesize a contextmenu event at
    // the trigger's center so BU does anchor + open through its own path. The
    // keydown is prevented so a browser that also fires a native contextmenu
    // for the key does not open the menu twice.
    const synth = (el: HTMLElement, x: number, y: number) => {
      el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    };
    const { opener } = React.useContext(Ctx);
    const { onContextMenuCapture } = rest;
    const recordOpener: React.MouseEventHandler<HTMLDivElement> = (e) => {
      onContextMenuCapture?.(e);
      const active = document.activeElement;
      if (opener) opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
    };
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu')) return;
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
      if (e.defaultPrevented || e.pointerType !== 'touch') return;
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
        onContextMenuCapture={recordOpener}
        /* REQ-CMP-07: normalised open|closed on the trigger region */
        render={stateRender<{ open: boolean }>((s) => toDataState({ open: s.open }), render, 'div')}
      >
        {children}
      </Base.Trigger>
    );
  }

function ContextMenuPortal({ children, keepMounted }: MenuPortalProps) {
  const container = usePortalContainer();
  return <Base.Portal container={container} {...(keepMounted !== undefined ? { keepMounted } : {})}>{children}</Base.Portal>;
}

function ContextMenuPositioner({ className, children, ref, ...rest }: MenuPositionerProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    return (
      <Base.Positioner ref={ref} data-ag-part="positioner" className={cn('ag-menu-positioner', className)} {...defaultPositionerProps} {...rest}>
        {children}
      </Base.Positioner>
    );
  }

function ContextMenuPopup({ className, children, ref, ...rest }: MenuPopupProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
    const ctx = React.useContext(Ctx);
    const [el, setEl] = React.useState<HTMLDivElement | null>(null);
    const animatingRef = useOverlayAnimating();
    useOverlayLayer({ kind: 'menu', modal: false, open: ctx.open, element: el, actions: ctx.actions });
    const setRefs: React.RefCallback<HTMLDivElement> = (node) => {
      setEl(node);
      animatingRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };
    /* REQ-CMP-105: BU's focus manager lands on the popup itself for
       pointer-opened (right-click, long-press, the synthesized Shift+F10 /
       ContextMenu-key event) context menus; APG wants the first item. */
    const { onFocus } = rest;
    const handleFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
      onFocus?.(e);
      if (e.defaultPrevented || e.target !== e.currentTarget) return;
      const first = e.currentTarget.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])');
      first?.focus();
    };
    return (
      <Base.Popup
        ref={setRefs}
        data-ag-part="popup"
        data-state={ctx.open ? 'open' : 'closed'}
        {...overlayMaterial('menu')}
        className={cn('ag-menu-popup', 'ag-contextmenu-popup', className)}
        {...rest}
        onFocus={handleFocus}
      >
        {children}
      </Base.Popup>
    );
  }

/* REQ-CMP-06: the contract Content part is the whole overlay stack, so callers never
   compose the internal Portal/Positioner/Popup themselves. */
function ContextMenuContent({ side, align, sideOffset, keepMounted, ref, ...popupProps }: MenuContentProps) {
  return (
    <ContextMenuPortal {...(keepMounted !== undefined ? { keepMounted } : {})}>
      <ContextMenuPositioner
        {...(side !== undefined ? { side } : {})}
        {...(align !== undefined ? { align } : {})}
        {...(sideOffset !== undefined ? { sideOffset } : {})}
      >
        <ContextMenuPopup {...(ref !== undefined ? { ref } : {})} {...popupProps} />
      </ContextMenuPositioner>
    </ContextMenuPortal>
  );
}

function ContextMenuItem({ className, children, shortcut, ref, ...rest }: MenuItemProps & { ref?: React.Ref<HTMLElement> | undefined }) {
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

function ContextMenuGroup({ className, ref, ...rest }: MenuGroupProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.Group ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group" className={cn('ag-menu-group', className)} {...rest} />;
  }

function ContextMenuGroupLabel({ className, ref, ...rest }: MenuGroupLabelProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.GroupLabel ref={ref as React.Ref<HTMLDivElement>} data-ag-part="group-label" className={cn('ag-menu-group-label', className)} {...rest} />;
  }

function ContextMenuSeparator({ className, ref, ...rest }: MenuSeparatorProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return <Base.Separator ref={ref as React.Ref<HTMLDivElement>} data-ag-part="separator" className={cn('ag-menu-separator', className)} {...rest} />;
  }

function ContextMenuCheckboxItem({ className, children, checked, onCheckedChange, render, ref, ...rest }: MenuCheckboxItemProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.CheckboxItem
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', 'ag-menu-checkbox-item', className)}
        {...(typeof checked === 'boolean' ? { checked } : {})}
        {...(checked === 'indeterminate' ? { 'aria-checked': 'mixed', 'data-indeterminate': true } : {})}
        {...(onCheckedChange !== undefined ? { onCheckedChange: (c: boolean) => onCheckedChange(c) } : {})}
        {...rest}
        render={stateRender<{ checked: boolean }>((s) => toDataState({ checked: checked === 'indeterminate' ? 'mixed' : s.checked }), render, 'div')}
      >
        <span className="ag-menu-item-indicator" data-ag-part="indicator" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
      </Base.CheckboxItem>
    );
  }

function ContextMenuRadioGroup({ children, ...rest }: MenuRadioGroupProps) {
  return <Base.RadioGroup {...rest}>{children}</Base.RadioGroup>;
}

function ContextMenuRadioItem({ className, children, render, ref, ...rest }: MenuRadioItemProps & { ref?: React.Ref<HTMLElement> | undefined }) {
    return (
      <Base.RadioItem
        ref={ref as React.Ref<HTMLDivElement>}
        data-ag-part="item"
        className={cn('ag-menu-item', 'ag-menu-radio-item', className)}
        {...rest}
        render={stateRender<{ checked: boolean }>((s) => toDataState({ checked: s.checked }), render, 'div')}
      >
        <span className="ag-menu-item-indicator" data-ag-part="indicator" aria-hidden="true" />
        <span className="ag-menu-item-label">{children}</span>
      </Base.RadioItem>
    );
  }


export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Item: ContextMenuItem,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Separator: ContextMenuSeparator,
  /** Contract composite: Content = Portal>Positioner>Popup. */
  Content: ContextMenuContent,
};

/** Internal overlay parts (not contract surface, REQ-CMP-06): in-repo composition only. */
export {
  ContextMenuPortal, ContextMenuPositioner, ContextMenuPopup,
  ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem,
};
