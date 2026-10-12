'use client';

import * as React from 'react';
import type { BaseUIEvent } from '@base-ui/react/types';
import { Autocomplete } from '@base-ui/react/autocomplete';
import { Combobox as Base } from '@base-ui/react/combobox';
import { defaultPositionerProps } from '../overlays/_shared/positioning';
import { overlayMaterial } from '../overlays/_shared/overlaySurface';
import { materialProps } from '../../material';
import { useCmpPortalContainer as usePortalContainer } from '../overlays/_shared/portalContainer';
import { useOverlayLayer, useRoutedRootActions } from '../overlays/_shared/useOverlayLayer';
import { useOverlayAnimating } from '../overlays/_shared/useOverlayAnimating';
import { useAnnouncer } from '../../theme';
import { toChangeDetails } from '../../foundation';
import { cn } from '../../internal';
import { sizeAttrs, DEFAULT_CONTROL_SIZE } from '../control-shared/size';
import type { ControlSize } from '../control-shared/size';
import { controlMessage } from '../control-shared/messages';
import type { ControlMessages } from '../control-shared/messages';
import { useControllableWarning } from '../../foundation/controllable';
import type {
  ComboboxRootProps,
  ComboboxInputProps,
  ComboboxContentProps,
  ComboboxItemProps,
  ComboboxEmptyProps,
  ComboboxGroupProps,
  ComboboxGroupLabelProps,
  ComboboxChipsProps,
  ComboboxChipProps,
  ComboboxChipRemoveProps,
  ComboboxLoadingProps,
  ComboboxMode,
  ComboboxCreatable,
  ComboboxLoadContext,
} from './Combobox.types';
import { stateRender, toDataState } from '../../foundation/state';

/* ------------------------------------------------------------------ */
/* Internal context: size, mode, async loader, creatable, messages     */
/* ------------------------------------------------------------------ */

interface ComboboxInternal {
  size: ControlSize;
  items: readonly unknown[] | undefined;
  virtual: boolean;
  mode: ComboboxMode;
  loading: boolean;
  loadError: boolean;
  query: string;
  setQuery: (q: string) => void;
  creatable?: ComboboxCreatable | undefined;
  onCreate?: ((query: string) => void) | undefined;
  /** REQ-CMP-74: the create-item's option value when the query is creatable
      (no case-insensitive exact match, not blank), else null. It is appended
      to Base UI's items, so the create-item is keyboard-navigable. */
  createValue: string | null;
  createQuery: string;
  messages?: ControlMessages | undefined;
  highlightSuppressed: boolean;
  setHighlightSuppressed: (v: boolean) => void;
  /** This instance's Combobox.Chips element: chip roving stays inside it
      (Combobox.Root renders no DOM element of its own to scope by). */
  chipsRef: React.RefObject<HTMLDivElement | null>;
  /** Index (into BU's filtered items) of the highlighted option, -1 for none;
      the virtual list keeps it inside its render window (REQ-CMP-72). */
  highlightIndex: number;
}

const InternalCtx = React.createContext<ComboboxInternal | null>(null);
/* REQ-CMP-12: the popup registers with the LayerStack through
   useOverlayLayer — the positioner element is published here for the entry. */
const ComboboxLayerContext = React.createContext<{ setPopupElement: (el: HTMLElement | null) => void }>({ setPopupElement: () => {} });
const useInternal = () => {
  const c = React.useContext(InternalCtx);
  if (!c) throw new Error('aura-glass Combobox.* must be used inside <Combobox.Root>');
  return c;
};

const CREATE_PREFIX = '__ag-create__:';
const isCreateValue = (v: unknown): v is string => typeof v === 'string' && v.startsWith(CREATE_PREFIX);

/** Lazy so the owned windowed list stays out of the base chunk (CMP-185). */
const LazyVirtualList = React.lazy(async () => {
  const m = await import('./ComboboxVirtualList.client');
  return { default: m.ComboboxVirtualList };
});
const ANNOUNCE_MIN_MS = 500;
export const VIRTUAL_THRESHOLD = 200;

function ChevronGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" width="1em" height="1em">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" width="0.7em" height="0.7em">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
function SpinnerGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" width="1em" height="1em" className="ag-combobox-spin">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  );
}
function ClearGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" width="0.9em" height="0.9em">
      <path d="m5 5 6 6M11 5l-6 6" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

function ComboboxRoot<Value = string>({
  items,
  onValueChange,
  onInputValueChange,
  onOpenChange,
  itemToString,
  itemToValue,
  size = DEFAULT_CONTROL_SIZE,
  loading: loadingProp,
  mode = 'select',
  loadOptions,
  loadDebounceMs = 250,
  creatable,
  onCreate,
  messages,
  children,
  filter: filterProp,
  isItemEqualToValue,
  value: valueProp,
  defaultValue,
  ...rest
}: ComboboxRootProps<Value>) {
  useControllableWarning('Combobox', 'value', valueProp);
  /* The selection is always controlled toward Base UI: the create-item's
     sentinel value must never land in BU's own (uncontrolled) state. */
  const isValueControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<Value | Value[] | null>(
    () => defaultValue ?? (rest.multiple ? [] : null),
  );
  const currentValue = isValueControlled ? valueProp : uncontrolledValue;
  const [highlightSuppressed, setHighlightSuppressed] = React.useState(false);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  const restOnItemHighlighted = (rest as { onItemHighlighted?: (v: unknown, d: unknown) => void }).onItemHighlighted;
  const handleItemHighlighted = React.useCallback(
    (v: unknown, d: { index: number }) => {
      setHighlightIndex(d.index);
      restOnItemHighlighted?.(v, d);
    },
    [restOnItemHighlighted],
  );
  const chipsRef = React.useRef<HTMLDivElement | null>(null);
  /* The create-item / filter query starts from the input's initial text
     (controlled inputValue or defaultInputValue), not always ''. */
  const [query, setQuery] = React.useState(() => rest.inputValue ?? rest.defaultInputValue ?? '');
  React.useEffect(() => {
    if (rest.inputValue !== undefined) setQuery(rest.inputValue);
  }, [rest.inputValue]);
  const [asyncItems, setAsyncItems] = React.useState<Value[] | null>(null);
  const [loadError, setLoadError] = React.useState(false);
  const [asyncLoading, setAsyncLoading] = React.useState(false);
  const loadSeq = React.useRef(0);
  const abortRef = React.useRef<AbortController | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const announce = useAnnouncer();
  const lastAnnounce = React.useRef(0);

  const loading = loadingProp === true || asyncLoading;
  const effectiveItems = (asyncItems ?? items) as Value[] | undefined;

  const restRec = rest as Record<string, unknown>;
  const [internalOpen, setInternalOpen] = React.useState(restRec.defaultOpen === true);
  const effectiveOpen = restRec.open !== undefined ? restRec.open === true : internalOpen;
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  /* REQ-CMP-12: Base UI Combobox has no imperative close, so the root drives
     BU's open state and the LayerStack's Escape closes through it. */
  const routed = useRoutedRootActions(() => {
    setHighlightSuppressed(false);
    setInternalOpen(false);
    emit(false, { reason: 'escape-key' });
  });
  const { emit } = useOverlayLayer({
    kind: 'combobox',
    modal: false,
    open: effectiveOpen,
    onOpenChange,
    element: popupElement,
    actions: routed.actions,
  });
  const { open: _open, defaultOpen: _defaultOpen, ...baseRest } = restRec;
  const layerCtx = React.useMemo(() => ({ setPopupElement }), []);

  /* Announce loading at most once per ANNOUNCE_MIN_MS (polite). */
  React.useEffect(() => {
    if (!loading) return;
    const now = Date.now();
    if (now - lastAnnounce.current < ANNOUNCE_MIN_MS) return;
    lastAnnounce.current = now;
    announce.announce(controlMessage('loadingResults', messages));
  }, [loading, announce, messages]);

  const runLoad = React.useCallback(
    (q: string) => {
      if (!loadOptions) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const seq = ++loadSeq.current;
      setAsyncLoading(true);
      setLoadError(false);
      const ctx: ComboboxLoadContext = { signal: controller.signal };
      loadOptions(q, ctx).then(
        (results) => {
          if (controller.signal.aborted || seq !== loadSeq.current) return;
          setAsyncItems(results);
          setAsyncLoading(false);
        },
        () => {
          if (controller.signal.aborted || seq !== loadSeq.current) return;
          setAsyncItems([]);
          setLoadError(true);
          setAsyncLoading(false);
        },
      );
    },
    [loadOptions],
  );

  const handleInputValueChange = React.useCallback(
    (v: string, d: unknown) => {
      setQuery(v);
      onInputValueChange?.(v, toChangeDetails(d));
      if (loadOptions) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runLoad(v), loadDebounceMs);
      }
    },
    [loadOptions, loadDebounceMs, onInputValueChange, runLoad],
  );

  React.useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    [],
  );

  const toStringLabel = React.useCallback(
    (v: unknown) => {
      if (isCreateValue(v)) return v.slice(CREATE_PREFIX.length);
      if (itemToString) return itemToString(v as Value);
      if (v != null && typeof v === 'object' && 'label' in (v as Record<string, unknown>)) {
        return String((v as { label: unknown }).label);
      }
      return String(v);
    },
    [itemToString],
  );

  const hasExactMatch = React.useCallback(
    (q: string) => {
      const list = effectiveItems ?? [];
      const needle = q.trim().toLowerCase();
      return list.some((it) => toStringLabel(it).toLowerCase() === needle);
    },
    [effectiveItems, toStringLabel],
  );

  const commitValue = React.useCallback(
    (next: Value | Value[] | null, d: unknown) => {
      if (!isValueControlled) setUncontrolledValue(next);
      onValueChange?.(next, toChangeDetails(d));
    },
    [isValueControlled, onValueChange],
  );

  const handleValueChange = React.useCallback(
    (v: unknown, d: unknown) => {
      /* single: v is the sentinel; multiple: BU appended it to the array */
      const created = Array.isArray(v) ? v.find(isCreateValue) : isCreateValue(v) ? v : undefined;
      if (created !== undefined) {
        const q = created.slice(CREATE_PREFIX.length);
        if (onCreate) {
          onCreate(q);
          return;
        }
        if (Array.isArray(v)) {
          const kept = v.filter((x) => !isCreateValue(x)) as Value[];
          commitValue([...kept, q as unknown as Value], d);
        } else {
          commitValue(q as unknown as Value, d);
        }
        return;
      }
      commitValue(v as Value | Value[] | null, d);
    },
    [onCreate, commitValue],
  );

  /* REQ-CMP-74: creatable when the trimmed query matches no item exactly
     (case-insensitive, after itemToString) and is not blank. */
  const createQuery = query.trim();
  const createValue =
    mode === 'select' && creatable !== undefined && creatable !== false && createQuery.length > 0 && !hasExactMatch(createQuery)
      ? `${CREATE_PREFIX}${createQuery}`
      : null;
  const baseItems = React.useMemo(
    () => (effectiveItems !== undefined && createValue !== null ? [...effectiveItems, createValue] : effectiveItems),
    [effectiveItems, createValue],
  );
  /* The sentinel always survives filtering (its label is the query itself,
     so BU's default contains-filter keeps it; custom filters are wrapped). */
  const baseFilter = React.useMemo(() => {
    if (loadOptions) return null;
    if (filterProp === undefined || filterProp === null) return filterProp;
    return (item: unknown, q: string) => isCreateValue(item) || filterProp(item as Value, q);
  }, [loadOptions, filterProp]);
  const baseIsItemEqualToValue = React.useMemo(
    () =>
      isItemEqualToValue
        ? (a: unknown, b: unknown) => (isCreateValue(a) || isCreateValue(b) ? a === b : isItemEqualToValue(a as Value, b as Value))
        : undefined,
    [isItemEqualToValue],
  );

  const virtual = (effectiveItems?.length ?? 0) > VIRTUAL_THRESHOLD;
  const internal = React.useMemo<ComboboxInternal>(
    () => ({
      size,
      items: effectiveItems,
      virtual,
      mode,
      loading,
      loadError,
      query,
      setQuery,
      creatable,
      onCreate,
      messages,
      highlightSuppressed,
      setHighlightSuppressed,
      chipsRef,
      highlightIndex,
      createValue,
      createQuery,
    }),
    [size, effectiveItems, virtual, mode, loading, loadError, query, creatable, onCreate, messages, highlightSuppressed, highlightIndex, createValue, createQuery],
  );

  return (
    <InternalCtx.Provider value={internal}>
      <ComboboxLayerContext.Provider value={layerCtx}>
      {mode === 'autocomplete' ? (
      <Autocomplete.Root
        {...baseRest}
        open={effectiveOpen}
        {...(isItemEqualToValue ? { isItemEqualToValue } : {})}
        {...(effectiveItems !== undefined ? { items: effectiveItems } : {})}
        {...(loadOptions ? { filter: null } : filterProp !== undefined ? { filter: filterProp } : {})}
        {...(itemToString ? { itemToStringLabel: toStringLabel } : {})}
        {...(itemToValue ? { itemToStringValue: itemToValue as (v: unknown) => string } : {})}
        autoHighlight={rest.autoHighlight ?? true}
        {...(virtual ? { virtualized: true } : {})}
        onItemHighlighted={handleItemHighlighted}
        value={query}
        onValueChange={(v, d) => {
          handleInputValueChange(v, d);
          onValueChange?.(v as unknown as Value, toChangeDetails(d));
        }}
        onOpenChange={(o, d) => {
          if (!o) setHighlightSuppressed(false);
          setInternalOpen(o);
          emit(o, { event: d?.event, reason: d?.reason });
        }}
        {...(loadError ? { 'data-load-error': '' } : {})}
      >
        {children}
      </Autocomplete.Root>
      ) : (
      <Base.Root
        {...baseRest}
        open={effectiveOpen}
        {...({ value: currentValue } as Record<string, unknown>)}
        {...(baseIsItemEqualToValue ? { isItemEqualToValue: baseIsItemEqualToValue } : {})}
        {...(baseItems !== undefined ? { items: baseItems } : {})}
        {...(baseFilter !== undefined ? { filter: baseFilter } : {})}
        {...(itemToString ? { itemToStringLabel: toStringLabel } : {})}
        {...(itemToValue ? { itemToStringValue: (v: unknown) => (isCreateValue(v) ? v : itemToValue(v as Value)) } : {})}
        autoHighlight={rest.autoHighlight ?? true}
        {...(virtual ? { virtualized: true } : {})}
        onItemHighlighted={handleItemHighlighted}
        onValueChange={handleValueChange}
        onInputValueChange={handleInputValueChange}
        onOpenChange={(o, d) => {
          if (!o) setHighlightSuppressed(false);
          setInternalOpen(o);
          emit(o, { event: d?.event, reason: d?.reason });
        }}
        {...(loadError ? { 'data-load-error': '' } : {})}
      >
        {children}
      </Base.Root>
      )}
      </ComboboxLayerContext.Provider>
    </InternalCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Input shell (chips + input + clear + trigger)                       */
/* ------------------------------------------------------------------ */

/* REQ-CMP-70: chip roving — Backspace on empty input focuses the last chip;
   ArrowLeft/Right move chip focus; Backspace/Delete removes the focused chip
   via its chip-remove control (fires BU's value change). */
function allChips(scope: ParentNode | null | undefined): HTMLElement[] {
  return scope ? [...scope.querySelectorAll<HTMLElement>("[data-ag-part='chip']")] : [];
}
const MODIFIER_KEYS = new Set(['Alt', 'Shift', 'Control', 'Meta']);

/* REQ-CMP-70 (APG combobox): Alt+ArrowDown opens the list without moving
   virtual focus. Base UI highlights the first (or selected) item on that
   open and keeps it as its internal activeIndex, so a following Enter would
   select/toggle an item the user never navigated to. We keep BU's open but
   suppress that highlight until the user actually navigates. */
function handleInputKeyDown(
  e: BaseUIEvent<React.KeyboardEvent<HTMLInputElement>>,
  suppressed: boolean,
  setSuppressed: (v: boolean) => void,
  chipsEl: HTMLElement | null,
) {
  const input = e.currentTarget;
  if (e.key === 'ArrowDown' && e.altKey) {
    if (input.getAttribute('aria-expanded') === 'true') {
      /* Already open: Alt+ArrowDown is a no-op; never let BU move the highlight. */
      e.preventDefault();
      e.preventBaseUIHandler();
      return;
    }
    setSuppressed(true);
    return;
  }
  if (suppressed) {
    if (e.key === 'Enter') {
      /* Nothing is highlighted from the user's point of view: select nothing. */
      e.preventDefault();
      e.preventBaseUIHandler();
      return;
    }
    if (e.key === 'ArrowDown') {
      /* First ArrowDown reveals BU's open anchor (first item, or the selected
         item) instead of stepping past it. */
      e.preventDefault();
      e.preventBaseUIHandler();
      setSuppressed(false);
      return;
    }
    if (!MODIFIER_KEYS.has(e.key)) setSuppressed(false);
  }
  if (e.key !== 'Backspace' || input.value !== '') return;
  const chips = allChips(chipsEl);
  const last = chips[chips.length - 1];
  if (last) {
    e.preventDefault();
    last.focus();
  }
}
export function comboboxChipsKeyDown(e: React.KeyboardEvent<HTMLElement>) {
  const chip = (e.target as HTMLElement).closest?.("[data-ag-part='chip']") as HTMLElement | null;
  if (!chip) return;
  const chips = allChips(chip.closest("[data-ag-part='chips']"));
  const i = chips.indexOf(chip);
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    (chips[i - 1] ?? chips[0])?.focus();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    (chips[i + 1] ?? chips[chips.length - 1])?.focus();
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault();
    const next = chips[e.key === 'Backspace' ? i - 1 : i + 1] ?? chips[0];
    chip.querySelector<HTMLElement>("[data-ag-part='chip-remove']")?.click();
    next?.focus();
  }
}

function ComboboxInput({ placeholder, className, ref, ...rest }: ComboboxInputProps) {
  const { size, mode, loading, messages, highlightSuppressed, setHighlightSuppressed, chipsRef } = useInternal();
  const onKeyDown = (e: BaseUIEvent<React.KeyboardEvent<HTMLInputElement>>) => {
    rest.onKeyDown?.(e);
    if (!e.defaultPrevented) handleInputKeyDown(e, highlightSuppressed, setHighlightSuppressed, chipsRef.current);
  };
  return (
    <Base.InputGroup
      data-ag-part="input-shell"
      {...sizeAttrs(size)}
      {...materialProps({ layer: 'content', content: 'content-sunken', interactive: true })}
      className={cn('ag-combobox', className)}
    >
      <Base.Input
        data-ag-part="input"
        data-state={toDataState({ loading })}
        placeholder={placeholder}
        {...(mode === 'autocomplete' ? { 'aria-autocomplete': 'list' as const } : {})}
        ref={ref}
        {...rest}
        onKeyDown={onKeyDown}
        {...(highlightSuppressed ? { 'aria-activedescendant': undefined } : {})}
      />
      <Base.Clear data-ag-part="clear" aria-label={controlMessage('clearSearch', messages)} keepMounted>
        <ClearGlyph />
      </Base.Clear>
      <Base.Trigger render={stateRender<{ open: boolean }>((s) => toDataState({ open: s.open }), undefined, 'button')} data-ag-part="trigger" tabIndex={-1}>
        <span data-ag-part="hit-area" aria-hidden="true" />
        <ChevronGlyph />
      </Base.Trigger>
      {loading ? (
        <span data-ag-part="loading" aria-hidden="true">
          <SpinnerGlyph />
        </span>
      ) : null}
    </Base.InputGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

function ComboboxContent({ children, className }: ComboboxContentProps) {
  const container = usePortalContainer('overlay');
  const animatingRef = useOverlayAnimating();
  const { setPopupElement } = React.useContext(ComboboxLayerContext);
  const { size, loading, creatable, messages, virtual, highlightIndex, createValue, createQuery } = useInternal();
  /* REQ-CMP-72: virtual mode windows Base UI's filtered items, so typing
     filters the rows and aria-setsize is the filtered count. */
  const filtered = Base.useFilteredItems<unknown>();
  /* the create sentinel is BU's last filtered item; it renders as the
     create-item below, never through the caller's item renderer */
  const createIndex = createValue !== null ? filtered.indexOf(createValue) : -1;
  const rowItems = createIndex >= 0 ? filtered.filter((_, i) => i !== createIndex) : filtered;
  const createLabel =
    typeof creatable === 'object' && creatable?.label
      ? creatable.label(createQuery)
      : controlMessage('createItem', messages, { query: createQuery });
  return (
    <Base.Portal container={container}>
      <Base.Positioner
        render={stateRender<{ open: boolean }>((s) => toDataState({ open: s.open }), undefined, 'div')}
        data-ag-part="positioner"
        ref={setPopupElement}
        side="bottom"
        align="start"
        {...defaultPositionerProps}
        {...sizeAttrs(size)}
      >
        <Base.Popup
          /* REQ-CMP-83: data-ag-animating only across the starting/ending-style transition */
          ref={animatingRef}
          data-ag-part="popup"
          {...overlayMaterial('combobox')}
          className={cn('ag-combobox-popup', className)}
          /* CMP-205: popup open state mirrored as data-state like every overlay popup. */
          render={(props, state) => <div {...props} data-state={state.open ? 'open' : 'closed'} />}
        >
          <Base.List data-ag-part="list" aria-busy={loading || undefined}>
            {virtual ? (
              <React.Suspense fallback={null}>
                <LazyVirtualList items={rowItems as readonly unknown[]} activeIndex={highlightIndex}>
                  {(item: unknown, index: number) =>
                    typeof children === 'function'
                      ? (children as (i: unknown, ix: number) => React.ReactNode)(item, index)
                      : children
                  }
                </LazyVirtualList>
              </React.Suspense>
            ) : typeof children === 'function' ? (
              /* render-fn children map Base UI's filtered items (minus the
                 create sentinel), so DOM order matches BU's option indices */
              rowItems.map((item, index) => (
                <React.Fragment key={index}>
                  {(children as (i: unknown, ix: number) => React.ReactNode)(item, index)}
                </React.Fragment>
              ))
            ) : (
              children as React.ReactNode
            )}
            {createValue !== null ? (
              <Base.Item
                data-ag-part="create-item"
                value={createValue}
                {...(virtual && createIndex >= 0 ? { index: createIndex } : {})}
                className="ag-combobox-item ag-combobox-create"
              >
                {createLabel}
              </Base.Item>
            ) : null}
          </Base.List>
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

/* ------------------------------------------------------------------ */
/** Plain text of a React subtree (strings and numbers, recursively). */
function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement(node)) {
    if (node.type === ComboboxChipRemove) return ''; // the remove control is not part of the label
    return textOf((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

function chipLabel(children: React.ReactNode, label?: string): string {
  if (label !== undefined && label !== null && label !== '') return label;
  return textOf(children).trim();
}

/* REQ-CMP-69/74: the enclosing chip's label, so a standalone
   <Combobox.ChipRemove/> composed inside a Chip reads "Remove <label>". */
const ChipLabelContext = React.createContext<string>('');

/* Item / Empty / Group / Chips / Chip / Loading                       */
/* ------------------------------------------------------------------ */

function ComboboxItem<Value = string>({ value, disabled, children, className, ref, ...rest }: ComboboxItemProps<Value>) {
  const { highlightSuppressed, setHighlightSuppressed } = useInternal();
  return (
    <Base.Item
      data-ag-part="item"
      value={value}
      disabled={disabled}
      {...(highlightSuppressed ? { 'data-highlighted': undefined, onMouseMove: () => setHighlightSuppressed(false) } : {})}
      className={cn('ag-combobox-item', className)}
      ref={ref}
      {...rest}
    >
      <Base.ItemIndicator data-ag-part="item-indicator" keepMounted>
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" width="1em" height="1em">
          <path d="m3 8.5 3.5 3.5L13 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Base.ItemIndicator>
      {children}
    </Base.Item>
  );
}

function ComboboxEmpty({ children, className }: ComboboxEmptyProps) {
  const { messages, loadError } = useInternal();
  const text = children ?? (loadError ? controlMessage('loadFailed', messages) : controlMessage('noResults', messages));
  /* Own element: BU Empty snapshots its live-region text and never re-renders
   * the children swap in jsdom. Visibility is gated by the list's `data-empty`
   * attribute (set by Base.List when filteredItems is empty) via CSS. */
  return (
    <div
      data-ag-part="empty"
      role="status"
      className={cn('ag-combobox-empty', className)}
      {...(loadError ? { 'data-load-error': '' } : {})}
    >
      {text}
    </div>
  );
}

function ComboboxGroup({ children, className }: ComboboxGroupProps) {
  return (
    <Base.Group data-ag-part="group" className={className}>
      {children}
    </Base.Group>
  );
}

function ComboboxGroupLabel({ children, className }: ComboboxGroupLabelProps) {
  return (
    <Base.GroupLabel data-ag-part="group-label" className={className}>
      {children}
    </Base.GroupLabel>
  );
}

function ComboboxChips({ children, className }: ComboboxChipsProps) {
  const { chipsRef, size } = useInternal();
  return (
    <Base.Chips ref={chipsRef} data-ag-part="chips" {...sizeAttrs(size)} className={cn('ag-combobox-chips', className)} onKeyDown={comboboxChipsKeyDown}>
      {children}
    </Base.Chips>
  );
}

function ComboboxChip({ children, className, label }: ComboboxChipProps) {
  const { messages } = useInternal();
  const resolved = chipLabel(children, label);
  /* A composed <Combobox.ChipRemove/> child replaces the built-in one. */
  const composedRemove = React.Children.toArray(children).some(
    (c) => React.isValidElement(c) && c.type === ComboboxChipRemove,
  );
  return (
    <ChipLabelContext.Provider value={resolved}>
      <Base.Chip data-ag-part="chip" {...materialProps({ layer: 'content', content: 'content-raised', shape: 'capsule' })} className={cn('ag-combobox-chip', className)}>
        {children}
        {composedRemove ? null : (
          <Base.ChipRemove data-ag-part="chip-remove" aria-label={controlMessage('removeItem', messages, { label: resolved })}>
            <span data-ag-part="hit-area" aria-hidden="true" />
            <XGlyph />
          </Base.ChipRemove>
        )}
      </Base.Chip>
    </ChipLabelContext.Provider>
  );
}

function ComboboxLoading({ children, className }: ComboboxLoadingProps) {
  const { messages } = useInternal();
  return (
    <span data-ag-part="loading" role="status" className={className}>
      {children ?? (
        <>
          <SpinnerGlyph /> {controlMessage('loadingResults', messages)}
        </>
      )}
    </span>
  );
}

function ComboboxTrigger({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <Base.Trigger render={stateRender<{ open: boolean }>((s) => toDataState({ open: s.open }), undefined, 'button')} data-ag-part="trigger" tabIndex={-1} className={className}>
      <span data-ag-part="hit-area" aria-hidden="true" />
      {children ?? <ChevronGlyph />}
    </Base.Trigger>
  );
}

function ComboboxClear({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { messages } = useInternal();
  return (
    <Base.Clear data-ag-part="clear" aria-label={controlMessage('clearSearch', messages)} keepMounted className={className}>
      {children ?? <ClearGlyph />}
    </Base.Clear>
  );
}

function ComboboxChipRemove({ children, className, label }: ComboboxChipRemoveProps) {
  const { messages } = useInternal();
  const chipText = React.useContext(ChipLabelContext);
  const resolved = label !== undefined && label !== '' ? label : chipText;
  return (
    <Base.ChipRemove data-ag-part="chip-remove" aria-label={controlMessage('removeItem', messages, { label: resolved })} className={className}>
      <span data-ag-part="hit-area" aria-hidden="true" />
      {children ?? <XGlyph />}
    </Base.ChipRemove>
  );
}

/** Combobox — BU Combobox leaf (REQ-CMP-69/71/74). */
export const Combobox = {
  Root: ComboboxRoot,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Clear: ComboboxClear,
  Content: ComboboxContent,
  Item: ComboboxItem,
  Empty: ComboboxEmpty,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
};

/** Not contract surface (REQ-CMP-06): in-repo composition only. */
export { ComboboxLoading };
