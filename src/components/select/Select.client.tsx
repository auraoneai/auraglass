'use client';

import * as React from 'react';
import { Select as Base } from '@base-ui/react/select';
import { defaultPositionerProps } from '../overlays/_shared/positioning';
import { overlayMaterial } from '../overlays/_shared/overlaySurface';
import { materialProps } from '../../material';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { toChangeDetails } from '../../foundation';
import { cn } from '../../internal';
import { childAsRender } from '../overlays/_shared/renderChild';
import { sizeAttrs, DEFAULT_CONTROL_SIZE } from '../control-shared/size';
import type { ControlSize } from '../control-shared/size';
function ChevronGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" width="1em" height="1em">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" width="1em" height="1em">
      <path d="m3 8.5 3.5 3.5L13 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
  SelectGroupProps,
  SelectGroupLabelProps,
  SelectSeparatorProps,
} from './Select.types';

const SelectSizeContext = React.createContext<ControlSize>(DEFAULT_CONTROL_SIZE);

const finePointer = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(pointer: fine)').matches
    : true;

function SelectRoot<Value = string>({
  onValueChange,
  onOpenChange,
  size = DEFAULT_CONTROL_SIZE,
  form,
  name,
  children,
  ...rest
}: SelectRootProps<Value>) {
  const scopeRef = React.useRef<HTMLSpanElement | null>(null);
  const [resetNonce, setResetNonce] = React.useState(0);
  /* Form reset: BU keeps selection internally, so restore defaultValue by
   * remounting the root (uncontrolled) or notifying the owner (controlled). */
  React.useEffect(() => {
    const formEl = form
      ? document.getElementById(form)
      : scopeRef.current?.parentElement?.closest('form');
    if (!formEl) return;
    const onReset = () => {
      queueMicrotask(() => setResetNonce((n) => n + 1));
    };
    formEl.addEventListener('reset', onReset);
    return () => formEl.removeEventListener('reset', onReset);
  }, [form]);
  return (
    <SelectSizeContext.Provider value={size}>
      <span ref={scopeRef} hidden />
      <Base.Root
        key={resetNonce}
        {...(rest as Record<string, unknown>)}
        {...(form ? { form } : {})}
        {...(name ? { name } : {})}
        onValueChange={(v, d) => onValueChange?.(v as Value | Value[] | null, toChangeDetails(d))}
        onOpenChange={(o, d) => onOpenChange?.(o, toChangeDetails(d))}
      >
        {children}
      </Base.Root>
    </SelectSizeContext.Provider>
  );
}

function SelectTrigger({ placeholder, children, className, ref, disabled, focusableWhenDisabled, ...rest }: SelectTriggerProps) {
  const size = React.useContext(SelectSizeContext);
  const { render, children: triggerChildren } = childAsRender(children);
  return (
    <Base.Trigger
      data-ag-part="trigger"
      render={render}
      {...sizeAttrs(size)}
      {...materialProps({ layer: 'content', content: 'content-sunken', interactive: true })}
      className={cn('ag-select', className)}
      ref={ref}
      disabled={disabled}
      {...rest}
      {...(disabled && focusableWhenDisabled === true ? { tabIndex: 0 } : {})}
      {...(disabled && focusableWhenDisabled === false ? { tabIndex: -1 } : {})}
    >
      {triggerChildren ?? (
        <>
          <Base.Value data-ag-part="value" placeholder={placeholder} />
          <Base.Icon data-ag-part="icon" aria-hidden="true">
            <ChevronGlyph />
          </Base.Icon>
        </>
      )}
    </Base.Trigger>
  );
}

function SelectValue({ children, className }: SelectValueProps) {
  return (
    <span data-ag-part="value" className={className}>
      {children}
    </span>
  );
}

function SelectContent({ children, className }: SelectContentProps) {
  const container = usePortalContainer('overlay');
  const size = React.useContext(SelectSizeContext);
  const [alignToTrigger] = React.useState<boolean>(finePointer);
  return (
    <Base.Portal container={container}>
      <Base.Positioner
        data-ag-part="positioner"
        side="bottom"
        align="start"
        {...defaultPositionerProps}
        alignItemWithTrigger={alignToTrigger}
        {...sizeAttrs(size)}
      >
        <Base.Popup
          data-ag-part="popup"
          {...overlayMaterial('select')}
          className={cn('ag-select-popup', className)}
          /* CMP-205: popup open state mirrored as data-state like every overlay popup. */
          render={(props, state) => <div {...props} data-state={state.open ? 'open' : 'closed'} />}
        >
          <Base.ScrollUpArrow data-ag-part="scroll-up" keepMounted />
          <Base.List data-ag-part="list">{children}</Base.List>
          <Base.ScrollDownArrow data-ag-part="scroll-down" keepMounted />
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

function SelectItem<Value = string>({
  value,
  disabled,
  label,
  children,
  className,
  ref,
  ...rest
}: SelectItemProps<Value>) {
  return (
    <Base.Item
      data-ag-part="item"
      value={value}
      disabled={disabled}
      {...(label !== undefined ? { label: typeof label === 'string' ? label : undefined } : {})}
      className={cn('ag-select-item', className)}
      ref={ref}
      {...rest}
    >
      <Base.ItemIndicator data-ag-part="item-indicator" keepMounted>
        <CheckGlyph />
      </Base.ItemIndicator>
      <Base.ItemText>{children ?? label}</Base.ItemText>
    </Base.Item>
  );
}

function SelectItemIndicator({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <Base.ItemIndicator data-ag-part="item-indicator" keepMounted className={className}>
      {children ?? <CheckGlyph />}
    </Base.ItemIndicator>
  );
}

function SelectGroup({ children, className }: SelectGroupProps) {
  return (
    <Base.Group data-ag-part="group" className={className}>
      {children}
    </Base.Group>
  );
}

function SelectGroupLabel({ children, className }: SelectGroupLabelProps) {
  return (
    <Base.GroupLabel data-ag-part="group-label" className={className}>
      {children}
    </Base.GroupLabel>
  );
}

function SelectSeparator({ className }: SelectSeparatorProps) {
  return <Base.Separator data-ag-part="separator" className={className} />;
}

/** Select — BU Select leaf (REQ-CMP-65/67). Parts: trigger, value, icon,
 *  positioner, popup, list, item, item-indicator, group, group-label,
 *  separator, scroll-up, scroll-down. */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  /** Alias of GroupLabel (PRD Select.Label). */
  Label: SelectGroupLabel,
  Separator: SelectSeparator,
};
