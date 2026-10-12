'use client';
/* Command (SURF-083/084, REQ-SURF-60): Base UI Combobox in inline-list mode
   (`<Combobox.Root inline open>`): the input is Base UI's role="combobox"
   with aria-activedescendant, the list Base UI's role="listbox", items Base
   UI options — keyboard (Up/Down with the input in the loop, Home/End, Enter)
   and pointer highlight are Base UI's. Command keeps its own model on top:
   - children-declared items register a spec; Command.score (or `filter`)
     ranks them and the ranked values are Base UI's `filteredItems` (Base UI
     filtering off), so keyboard order and the visual flex `order` follow the
     score while the DOM keeps the declared order;
   - pressing an item fires the item's onSelect and Root onValueChange
     (value, { event, reason: 'item-press' }); the query is never replaced by
     the item label and no selection is remembered (a command list);
   - Escape clears a non-empty query (preventDefault) and otherwise
     propagates to the layer stack; Enter/arrows are ignored while an IME
     composition is active;
   - the result count is announced (polite, 500 ms debounce);
   - above VIRTUALIZE_THRESHOLD visible items the list renders through the
     SURF VirtualList; the highlighted option is pinned in the window and
     scrolled into view. Items always carry their index (Base UI
     `virtualized`, index-addressed list) in both renderings. */

import * as React from 'react';
import { Combobox as BaseCombobox } from '../../foundation/base-ui/combobox';
import { useAnnouncer } from '../../theme';
import { commandScore } from './score';
import { VirtualList } from '../../data/virtual-list/VirtualList';
import type { VirtualListHandle } from '../../data/virtual-list/VirtualList';
import { partElement } from '../../app-shell/_internal/partElement';
/* S-30 ChangeDetails from the public contract module, so the emitted d.ts never
   names the private foundation seam (REQ-CMP-01). */
import type { ChangeDetails, PartProps } from '../../contracts/components';

export type CommandFilter = (query: string, value: string, keywords?: readonly string[]) => number;

type ItemSpec = {
  value: string;
  keywords?: readonly string[] | undefined;
  disabled?: boolean | undefined;
  onSelect?: (() => void) | undefined;
  /** Item children captured at registration — rendered by virtual rows. */
  label?: React.ReactNode;
  shortcut?: React.ReactNode;
};

const VIRTUALIZE_THRESHOLD = 100;

type CommandCtx = {
  query: string;
  setQuery: (q: string) => void;
  /** The visible set in score order (Base UI filteredItems). */
  items: ItemSpec[];
  register: (spec: ItemSpec) => () => void;
  /** Value of the Base UI highlighted item. */
  active: string | undefined;
  composing: React.MutableRefObject<boolean>;
  /** SURF-063: true once the visible set exceeded the virtualization
      threshold (sticky — scroll unmounts must not collapse the registry). */
  virtualizing: boolean;
  /** Set by a virtualized List: scrolls a visible-set index into the window. */
  scrollTo: React.MutableRefObject<((index: number) => void) | undefined>;
  /** True while a non-empty query is narrowing the visible set. */
  filtering: boolean;
};

const Ctx = /*#__PURE__*/ React.createContext<CommandCtx | null>(null);

export type CommandRootProps = Omit<PartProps<'div'>, 'onChange'> & {
  filter?: CommandFilter | undefined;
  shouldFilter?: boolean | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string, details: ChangeDetails) => void) | undefined;
  onQueryChange?: ((query: string) => void) | undefined;
  loop?: boolean | undefined;
};

const NAV_KEYS = new Set(['Enter', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp', 'Escape']);

function CommandRoot({
  filter,
  shouldFilter = true,
  value: _value,
  defaultValue: _defaultValue,
  onValueChange,
  onQueryChange,
  loop = true,
  children,
  render,
  ...rest
}: CommandRootProps) {
  void _value;
  void _defaultValue;
  const [query, setQueryState] = React.useState('');
  const [items, setItems] = React.useState<ItemSpec[]>([]);
  const [active, setActive] = React.useState<string | undefined>(undefined);
  const composing = React.useRef(false);
  const virtualizingRef = React.useRef(false);
  const scrollRef = React.useRef<((index: number) => void) | undefined>(undefined);
  const { announce } = useAnnouncer();

  const setQuery = React.useCallback(
    (q: string) => {
      setQueryState(q);
      onQueryChange?.(q);
    },
    [onQueryChange],
  );

  const register = React.useCallback((spec: ItemSpec) => {
    setItems((prev) =>
      prev.some((p) => p.value === spec.value)
        ? prev.map((p) => (p.value === spec.value ? spec : p))
        : [...prev, spec],
    );
    return () => {
      // SURF-063: in virtual mode item children unmounted on the flip —
      // keep their specs so the visible set never collapses under scroll.
      if (virtualizingRef.current) return;
      setItems((prev) => prev.filter((p) => p.value !== spec.value));
    };
  }, []);

  const score = filter ?? commandScore;
  const visible = React.useMemo(() => {
    if (!shouldFilter || query === '') return items;
    return items
      .map((i) => ({ i, s: score(query, i.value, i.keywords ?? undefined) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.i);
  }, [items, query, score, shouldFilter]);
  if (visible.length > VIRTUALIZE_THRESHOLD) virtualizingRef.current = true;
  const allValues = React.useMemo(() => items.map((i) => i.value), [items]);
  const visibleValues = React.useMemo(() => visible.map((i) => i.value), [visible]);

  // Announce the result count (polite, 500 ms debounce).
  const countRef = React.useRef(visible.length);
  React.useEffect(() => {
    if (visible.length === countRef.current) return;
    countRef.current = visible.length;
    const n = visible.length;
    const t = setTimeout(() => announce(`${n} result${n === 1 ? '' : 's'}`), 500);
    return () => clearTimeout(t);
  }, [visible.length, announce]);

  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const onValueChangeRef = React.useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const press = React.useCallback((v: unknown, details: { event?: Event | undefined }) => {
    if (typeof v !== 'string') return;
    const spec = itemsRef.current.find((i) => i.value === v);
    if (!spec || spec.disabled) return;
    spec.onSelect?.();
    onValueChangeRef.current?.(v, { event: details.event, reason: 'item-press' });
  }, []);

  const ctx = React.useMemo<CommandCtx>(
    () => ({
      query,
      setQuery,
      items: visible,
      register,
      active,
      composing,
      virtualizing: virtualizingRef.current,
      scrollTo: scrollRef,
      filtering: shouldFilter && query !== '',
    }),
    [query, setQuery, visible, register, active, shouldFilter],
  );

  // IME (SURF-62): while composing, navigation/commit keys belong to the IME —
  // stop them before Base UI's input handler sees them.
  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    if (!NAV_KEYS.has(e.key)) return;
    if (composing.current || (e.nativeEvent as { isComposing?: boolean }).isComposing === true) e.stopPropagation();
  };
  // Escape clears a non-empty query first (consumed); an empty query lets it
  // propagate to the layer stack (CommandPalette closes).
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && query !== '') {
      e.preventDefault();
      setQuery('');
    }
  };

  return (
    <Ctx.Provider value={ctx}>
      <BaseCombobox.Root
        inline
        open
        items={allValues}
        filteredItems={visibleValues}
        filter={null}
        value={null}
        onValueChange={(v, details) => press(v, details)}
        inputValue={query}
        onInputValueChange={(q, details) => {
          // A pressed item would fill the input with its label: a command list
          // keeps the query instead.
          if (details.reason === 'item-press') return;
          setQuery(q);
        }}
        onItemHighlighted={(v, details) => {
          setActive(typeof v === 'string' ? v : undefined);
          if (v !== undefined && virtualizingRef.current && details.reason !== 'pointer') {
            const index = details.index;
            queueMicrotask(() => scrollRef.current?.(index));
          }
        }}
        loopFocus={loop}
        // Every item carries its index in the visible set (score order), so
        // Base UI's index-addressed ("virtualized") list mode is used in both
        // renderings: keyboard order follows the score, not the DOM, and the
        // VirtualList flip never re-registers a DOM-order composite list.
        virtualized
      >
        {partElement('div', {
          render: render as React.ReactElement | undefined,
          'data-ag-part': 'command',
          className: 'ag-command',
          ...rest,
          onKeyDownCapture,
          onKeyDown,
          children,
        })}
      </BaseCombobox.Root>
    </Ctx.Provider>
  );
}
CommandRoot.displayName = 'Command.Root';

export type CommandInputProps = PartProps<'input'> & {
  placeholder?: string | undefined;
};

function CommandInput({ placeholder, render, ...rest }: CommandInputProps) {
  const ctx = React.useContext(Ctx)!;
  return (
    <BaseCombobox.Input
      data-ag-part="input"
      // REQ-MAT-61: keep the MAT ring inside the clipped palette popup.
      data-ag-focus-inset=""
      className="ag-command__input"
      placeholder={placeholder}
      autoComplete="off"
      onCompositionStart={() => {
        ctx.composing.current = true;
      }}
      onCompositionEnd={() => {
        ctx.composing.current = false;
      }}
      {...(rest as Record<string, unknown>)}
      {...(render ? { render: render as React.ReactElement } : {})}
    />
  );
}
CommandInput.displayName = 'Command.Input';

export function CommandList({ children, render, ...rest }: PartProps<'div'>) {
  const ctx = React.useContext(Ctx)!;
  const vlRef = React.useRef<VirtualListHandle | null>(null);
  // SURF-063: expose scrollTo so keyboard nav keeps the active option mounted.
  React.useEffect(() => {
    if (!ctx.virtualizing) return;
    const h = vlRef.current;
    ctx.scrollTo.current = h ? (i) => h.scrollToIndex(i, { align: 'auto' }) : undefined;
  });
  if (ctx.virtualizing) {
    // SURF-063: the aria-activedescendant target is always rendered.
    const activeIndex = ctx.items.findIndex((i) => i.value === ctx.active);
    return (
      <BaseCombobox.List data-ag-part="list" data-empty={undefined} className="ag-command__list ag-command__list--virtual" {...(rest as Record<string, unknown>)}>
        <VirtualList
          ref={vlRef}
          role="none"
          items={ctx.items}
          getItemKey={(i) => i.value}
          estimateSize={() => 32}
          pinnedIndexes={activeIndex >= 0 ? [activeIndex] : undefined}
          className="ag-command__scroller"
          renderItem={(spec, index) => <VirtualCommandRow ctx={ctx} spec={spec} index={index} />}
        />
      </BaseCombobox.List>
    );
  }
  return (
    <BaseCombobox.List
      data-ag-part="list"
      // Items register after mount, so Base UI's data-empty would differ
      // between the server markup and the hydrated list; Command.Empty owns
      // the empty state.
      data-empty={undefined}
      className="ag-command__list"
      {...(rest as Record<string, unknown>)}
      {...(render ? { render: render as React.ReactElement } : {})}
    >
      {children}
    </BaseCombobox.List>
  );
}
CommandList.displayName = 'Command.List';

/** Virtualized option row — a Base UI item carrying its index in the visible
    set, rendered from the registered spec (SURF-063). */
function VirtualCommandRow({ ctx, spec, index }: { ctx: CommandCtx; spec: ItemSpec; index: number }) {
  const active = ctx.active === spec.value;
  return (
    <BaseCombobox.Item
      value={spec.value}
      index={index}
      disabled={spec.disabled}
      aria-selected={active}
      aria-posinset={index + 1}
      aria-setsize={ctx.items.length}
      aria-disabled={spec.disabled || undefined}
      data-ag-part="item"
      data-value={spec.value}
      data-state={active ? 'active' : 'inactive'}
      className="ag-command__item"
    >
      {spec.label ?? spec.value}
      {spec.shortcut !== undefined ? <kbd data-ag-part="shortcut">{spec.shortcut}</kbd> : null}
    </BaseCombobox.Item>
  );
}

export type CommandGroupProps = PartProps<'div'> & { heading?: React.ReactNode };

function CommandGroup({ heading, children, render, ...rest }: CommandGroupProps) {
  const id = React.useId();
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    role: 'group',
    'aria-labelledby': heading !== undefined ? `${id}-h` : undefined,
    'data-ag-part': 'group',
    ...rest,
    children: (
      <>
        {heading !== undefined ? (
          <div id={`${id}-h`} data-ag-part="group-heading">
            {heading}
          </div>
        ) : null}
        {children}
      </>
    ),
  });
}
CommandGroup.displayName = 'Command.Group';

export type CommandItemProps = Omit<PartProps<'div'>, 'value' | 'onSelect'> & {
  value: string;
  keywords?: readonly string[] | undefined;
  onSelect?: (() => void) | undefined;
  disabled?: boolean | undefined;
  shortcut?: React.ReactNode;
};

function CommandItem({ value, keywords, onSelect, disabled, shortcut, children, render, ...rest }: CommandItemProps) {
  const ctx = React.useContext(Ctx)!;
  const { register } = ctx;
  // deps on the stable register fn + spec fields only — ctx identity changes
  // every render and would churn registrations into a render loop.
  // Label/shortcut captured via refs — ReactNode props are new objects each
  // render; putting them in deps would re-register (and reorder) the spec.
  const labelRef = React.useRef(children);
  const shortcutRef = React.useRef(shortcut);
  labelRef.current = children;
  shortcutRef.current = shortcut;
  React.useEffect(
    () =>
      register({
        value,
        keywords,
        disabled,
        onSelect,
        label: labelRef.current,
        shortcut: shortcutRef.current,
      }),
    [register, value, keywords, disabled, onSelect],
  );
  // Virtual mode renders rows from the registry (VirtualCommandRow).
  if (ctx.virtualizing) return null;
  // SURF-060: rank in the visible (score-ordered) set is the Base UI item
  // index (keyboard order) and the flex `order` (visual order). Items outside
  // the visible set are not options while filtering (Command.Empty shows on
  // zero matches).
  const rank = ctx.items.findIndex((i) => i.value === value);
  if (rank < 0 && ctx.filtering) return null;
  const active = ctx.active === value;
  return (
    <BaseCombobox.Item
      value={value}
      {...(rank >= 0 ? { index: rank } : {})}
      disabled={disabled}
      aria-selected={active}
      aria-disabled={disabled || undefined}
      data-ag-part="item"
      data-value={value}
      data-state={active ? 'active' : 'inactive'}
      className="ag-command__item"
      {...(rest as Record<string, unknown>)}
      style={{ ...(rest as { style?: React.CSSProperties }).style, order: rank < 0 ? 0 : rank }}
      {...(render ? { render: render as React.ReactElement } : {})}
    >
      {children}
      {shortcut !== undefined ? <kbd data-ag-part="shortcut">{shortcut}</kbd> : null}
    </BaseCombobox.Item>
  );
}
CommandItem.displayName = 'Command.Item';

export function CommandEmpty({ children, render, ...rest }: PartProps<'div'>) {
  const ctx = React.useContext(Ctx)!;
  if (ctx.items.length > 0) return null;
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'empty',
    ...rest,
    children: children ?? 'No results.',
  });
}
CommandEmpty.displayName = 'Command.Empty';

export function CommandLoading({ children, render, ...rest }: PartProps<'div'>) {
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'loading',
    role: 'status',
    ...rest,
    children: children ?? 'Loading…',
  });
}
CommandLoading.displayName = 'Command.Loading';

export function CommandSeparator({ render, ...rest }: PartProps<'div'>) {
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'separator',
    role: 'separator',
    'aria-hidden': true,
    ...rest,
  });
}
CommandSeparator.displayName = 'Command.Separator';

export const Command = {
  score: commandScore,
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Group: CommandGroup,
  Item: CommandItem,
  Empty: CommandEmpty,
  Loading: CommandLoading,
  Separator: CommandSeparator,
};
