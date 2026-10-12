'use client';
/* DatePopup (REQ-SURF-98/101/102/104): the one popup presentation for the date
   pickers, with a CMP Button trigger.

   At or above SHEET_BELOW_PX of container width it is a CMP Popover
   (LayerStack kind 'popover') anchored below the trigger. Below it it is a CMP
   Sheet side="bottom" (LayerStack kind 'sheet', modal, scrim, focus trapped,
   flush with the viewport bottom). In both, Escape closes only the topmost
   layer and focus returns to the trigger; the popup carries
   data-presentation="popover" | "sheet".

   Open state is owned by the caller (the RAC picker state), so a date
   selection that closes the RAC picker closes the popup too. */
import * as React from 'react';
import { Button } from '../components/button';
import { Popover } from '../components/popover';
import { PopoverPortal, PopoverPositioner, PopoverPopup } from '../components/popover/Popover.client';
import { Sheet } from '../components/sheet/Sheet.client';

export interface DatePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** true → CMP Sheet side="bottom"; false → CMP Popover below the trigger. */
  compact: boolean;
  triggerLabel: React.ReactNode;
  triggerPart: string;
  triggerDescribedBy?: string | undefined;
  triggerDisabled?: boolean | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  popupPart: string;
  popupClassName: string;
  popupLabelledBy?: string | undefined;
  popupLabel?: string | undefined;
  dir?: 'ltr' | 'rtl' | undefined;
  /** CSS selector(s) (inside the popup), tried in order, for the element that
      receives focus on open. */
  initialFocusSelector?: string | readonly string[] | undefined;
  children: React.ReactNode;
}

/** Focus target on open: the calendar's roving cell (selected date, else today). */
export const CALENDAR_INITIAL_FOCUS = '.ag-calendar__cell[tabindex="0"]';

type AnyProps = Record<string, unknown>;

export function DatePopup({
  open,
  onOpenChange,
  compact,
  triggerLabel,
  triggerPart,
  triggerDescribedBy,
  triggerDisabled,
  size = 'md',
  popupPart,
  popupClassName,
  popupLabelledBy,
  popupLabel,
  dir,
  initialFocusSelector,
  children,
}: DatePopupProps) {
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  const initialFocus = React.useCallback((): HTMLElement | null | undefined => {
    const root = popupRef.current;
    if (!root) return undefined;
    const selectors = typeof initialFocusSelector === 'string' ? [initialFocusSelector] : (initialFocusSelector ?? []);
    for (const sel of selectors) {
      const target = root.querySelector<HTMLElement>(sel);
      if (target) return target;
    }
    return undefined;
  }, [initialFocusSelector]);

  /* The trigger sits inside the RAC field group, whose press handler moves
     focus to the last segment on a mouse press. RAC's own Button stops press
     propagation; the CMP Button must do the same, or opening the popup would
     first focus a segment and Escape would restore focus there. */
  const stopPress = (handler: unknown) => (e: React.SyntheticEvent) => {
    if (typeof handler === 'function') (handler as (ev: React.SyntheticEvent) => void)(e);
    e.stopPropagation();
  };

  const renderTrigger = (props: AnyProps) => (
    <Button
      {...(props as React.ComponentProps<typeof Button>)}
      onPointerDown={stopPress(props.onPointerDown)}
      onMouseDown={stopPress(props.onMouseDown)}
      data-ag-part={triggerPart}
      data-ag-focusable=""
      className="ag-date-picker__trigger"
      variant="clear"
      size={size}
      suppressInnerParts
      disabled={triggerDisabled}
      {...(triggerDescribedBy !== undefined ? { 'aria-describedby': triggerDescribedBy } : {})}
    >
      {triggerLabel}
    </Button>
  );

  const popupProps: AnyProps = {
    ref: popupRef,
    'data-ag-part': popupPart,
    className: popupClassName,
    initialFocus,
    ...(popupLabelledBy !== undefined ? { 'aria-labelledby': popupLabelledBy } : {}),
    ...(popupLabel !== undefined ? { 'aria-label': popupLabel } : {}),
    ...(dir !== undefined ? { dir } : {}),
  };

  if (compact) {
    return (
      <Sheet.Root side="bottom" open={open} onOpenChange={(o) => onOpenChange(o)}>
        <Sheet.Trigger render={renderTrigger} />
        {open ? (
          <Sheet.Content {...popupProps} data-presentation="sheet" data-sheet-side="bottom">
            {children}
          </Sheet.Content>
        ) : null}
      </Sheet.Root>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
      <Popover.Trigger render={renderTrigger} />
      {open ? (
        <PopoverPortal>
          <PopoverPositioner side="bottom" align="start" sideOffset={4}>
            <PopoverPopup
              {...(popupProps as React.ComponentProps<typeof PopoverPopup>)}
              data-presentation="popover"
            >
              {children}
            </PopoverPopup>
          </PopoverPositioner>
        </PopoverPortal>
      ) : null}
    </Popover.Root>
  );
}
