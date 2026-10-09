'use client';

import * as React from 'react';
import { Combobox as Base } from '@base-ui/react/combobox';
import { materialProps } from '../../material';
import { usePortalContainer } from '../../foundation/portal';
import { useOverlayLayer } from '../overlays/_shared/useOverlayLayer';
import { useAnnouncer } from '../../theme';
import { toChangeDetails } from '../../foundation';
import { cn } from '../../internal';
import { sizeAttrs, DEFAULT_CONTROL_SIZE } from '../control-shared/size';
import type { ControlSize } from '../control-shared/size';
import { controlMessage } from '../control-shared/messages';
import type { ControlMessages } from '../control-shared/messages';
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
  ComboboxLoadingProps,
  ComboboxMode,
  ComboboxCreatable,
  ComboboxLoadContext,
} from './Combobox.types';

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
  /** Exact-match check for creatable (case-insensitive via itemToString). */
  hasExactMatch: (query: string) => boolean;
  /** Current create-candidate marker value sentinel (per-query unique object). */
  messages?: ControlMessages | undefined;
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

/** Lazy so @tanstack/react-virtual stays out of the base chunk (CMP-185). */
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
  ...rest
}: ComboboxRootProps<Value>) {
  const [query, setQuery] = React.useState('');
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
  const [internalOpen, setInternalOpen] = React.useState(false);
  const effectiveOpen = restRec.open !== undefined ? restRec.open === true : internalOpen;
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const { emit } = useOverlayLayer({
    kind: 'combobox',
    modal: false,
    open: effectiveOpen,
    onOpenChange,
    element: popupElement,
  });
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

  const handleValueChange = React.useCallback(
    (v: unknown, d: unknown) => {
      if (typeof v === 'string' && v.startsWith(CREATE_PREFIX)) {
        const q = v.slice(CREATE_PREFIX.length);
        if (onCreate) {
          onCreate(q);
          return;
        }
        const details = toChangeDetails(d);
        if (rest.multiple) {
          const prev = (rest.value ?? []) as unknown[];
          onValueChange?.([...prev, q as unknown as Value] as Value | Value[] | null, details);
        } else {
          onValueChange?.(q as unknown as Value | Value[] | null, details);
        }
        return;
      }
      onValueChange?.(v as Value | Value[] | null, toChangeDetails(d));
    },
    [onCreate, onValueChange, rest.multiple, rest.value],
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
      hasExactMatch,
      messages,
    }),
    [size, effectiveItems, virtual, mode, loading, loadError, query, creatable, onCreate, hasExactMatch, messages],
  );

  return (
    <InternalCtx.Provider value={internal}>
      <ComboboxLayerContext.Provider value={layerCtx}>
      <Base.Root
        {...(rest as Record<string, unknown>)}
        {...(effectiveItems !== undefined ? { items: effectiveItems } : {})}
        {...(loadOptions ? { filter: null } : rest.filter !== undefined ? { filter: rest.filter } : {})}
        {...(itemToString ? { itemToStringLabel: toStringLabel } : {})}
        {...(itemToValue ? { itemToStringValue: itemToValue as (v: unknown) => string } : {})}
        autoHighlight={rest.autoHighlight ?? true}
        onValueChange={handleValueChange}
        onInputValueChange={handleInputValueChange}
        onOpenChange={(o, d) => {
          setInternalOpen(o);
          emit(o, { event: d?.event, reason: d?.reason });
        }}
        {...(loadError ? { 'data-load-error': '' } : {})}
      >
        {children}
      </Base.Root>
      </ComboboxLayerContext.Provider>
    </InternalCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Input shell (chips + input + clear + trigger)                       */
/* ------------------------------------------------------------------ */

function ComboboxInput({ placeholder, className, ref, ...rest }: ComboboxInputProps) {
  const { size, mode, loading } = useInternal();
  return (
    <Base.InputGroup
      data-ag-part="input-shell"
      {...sizeAttrs(size)}
      {...materialProps({ layer: 'content', content: 'content-sunken', interactive: true })}
      className={cn('ag-combobox', className)}
    >
      <Base.Input
        data-ag-part="input"
        placeholder={placeholder}
        {...(mode === 'autocomplete' ? { 'aria-autocomplete': 'list' as const } : {})}
        ref={ref}
        {...rest}
      />
      <Base.Clear data-ag-part="clear" aria-label="Clear" keepMounted>
        <ClearGlyph />
      </Base.Clear>
      <Base.Trigger data-ag-part="trigger" tabIndex={-1}>
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
  const { setPopupElement } = React.useContext(ComboboxLayerContext);
  const { size, loading, query, creatable, onCreate, hasExactMatch, messages, items, virtual } = useInternal();
  const trimmed = query.trim();
  const offerCreate =
    creatable !== undefined && creatable !== false && trimmed.length > 0 && !hasExactMatch(trimmed);
  const createLabel =
    typeof creatable === 'object' && creatable?.label
      ? creatable.label(trimmed)
      : controlMessage('createItem', messages, { query: trimmed });
  return (
    <Base.Portal container={container}>
      <Base.Positioner
        data-ag-part="positioner"
        ref={setPopupElement}
        side="bottom"
        align="start"
        sideOffset={6}
        {...sizeAttrs(size)}
      >
        <Base.Popup
          data-ag-part="popup"
          {...materialProps({ layer: 'overlay', thickness: 'regular' })}
          className={cn('ag-combobox-popup', className)}
        >
          <Base.List data-ag-part="list" aria-busy={loading || undefined}>
            {virtual ? (
              <React.Suspense fallback={null}>
                <LazyVirtualList items={items ?? []}>
                  {(item: unknown, index: number) =>
                    typeof children === 'function'
                      ? (children as (i: unknown, ix: number) => React.ReactNode)(item, index)
                      : children
                  }
                </LazyVirtualList>
              </React.Suspense>
            ) : (
              children as React.ReactNode
            )}
            {offerCreate ? (
              <Base.Item
                data-ag-part="create-item"
                value={`${CREATE_PREFIX}${trimmed}`}
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
/* Item / Empty / Group / Chips / Chip / Loading                       */
/* ------------------------------------------------------------------ */

function ComboboxItem<Value = string>({ value, disabled, children, className, ref, ...rest }: ComboboxItemProps<Value>) {
  return (
    <Base.Item
      data-ag-part="item"
      value={value}
      disabled={disabled}
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
  return (
    <Base.Chips data-ag-part="chips" className={className}>
      {children}
    </Base.Chips>
  );
}

function ComboboxChip({ children, className }: ComboboxChipProps) {
  const { messages } = useInternal();
  return (
    <Base.Chip data-ag-part="chip" className={className}>
      {children}
      <Base.ChipRemove data-ag-part="chip-remove" aria-label={controlMessage('removeItem', messages, { label: '' })}>
        <XGlyph />
      </Base.ChipRemove>
    </Base.Chip>
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
    <Base.Trigger data-ag-part="trigger" tabIndex={-1} className={className}>
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

function ComboboxChipRemove({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { messages } = useInternal();
  return (
    <Base.ChipRemove data-ag-part="chip-remove" aria-label={controlMessage('removeItem', messages, { label: '' })} className={className}>
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
  Loading: ComboboxLoading,
};
