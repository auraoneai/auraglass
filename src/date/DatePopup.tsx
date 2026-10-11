'use client';
/* DatePopup (REQ-SURF-98/101/102/104): the one popup presentation for the date
   pickers — a CMP Popover (registered in the LayerStack as kind 'popover', so
   Escape closes only the topmost layer and focus returns to the trigger) with a
   CMP Button trigger.

   At or above SHEET_BELOW_PX of container width the popup is anchored below
   the trigger. Below it the same popover is presented as a bottom sheet: it is
   anchored to a virtual element spanning the viewport's bottom edge (side top,
   fixed positioning, no collision flipping), full width, flush with the
   viewport bottom. CMP Sheet is not used for this: importing it puts the
   DatePicker entry at ~10.3 KB gzip against its 8 KB SB-SURF-W2-DATEPICKER
   budget (measured with the verify-size-budgets esbuild settings); a budget
   raise is an owner decision.

   Open state is owned by the caller (the RAC picker state), so a date
   selection that closes the RAC picker closes the popup too. */
import * as React from 'react';
import { Button } from '../components/button';
import { Popover } from '../components/popover';

export interface DatePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** true → bottom-sheet presentation; false → anchored below the trigger. */
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

/** Virtual anchor: the viewport's bottom edge, full width (bottom-sheet mode). */
const viewportBottom = {
  getBoundingClientRect(): DOMRect {
    const w = document.documentElement.clientWidth;
    const h = window.innerHeight;
    return { x: 0, y: h, top: h, left: 0, right: w, bottom: h, width: w, height: 0, toJSON: () => ({}) } as DOMRect;
  },
};

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

  return (
    <Popover.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
      <Popover.Trigger render={renderTrigger} />
      {open ? (
        <Popover.Portal>
          <Popover.Positioner
            {...((compact
              ? {
                  anchor: viewportBottom,
                  side: 'top',
                  align: 'start',
                  sideOffset: 0,
                  collisionPadding: 0,
                  positionMethod: 'fixed',
                  collisionAvoidance: { side: 'none', align: 'none' },
                  'data-ag-presentation': 'sheet',
                }
              : { side: 'bottom', align: 'start', sideOffset: 4 }) as React.ComponentProps<typeof Popover.Positioner>)}
          >
            <Popover.Popup
              {...(popupProps as React.ComponentProps<typeof Popover.Popup>)}
              data-ag-presentation={compact ? 'sheet' : 'popover'}
              {...(compact ? { 'data-ag-side': 'bottom' } : {})}
            >
              {children}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      ) : null}
    </Popover.Root>
  );
}
