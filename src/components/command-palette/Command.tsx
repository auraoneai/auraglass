'use client';
/* Command (SURF-083/084): inline combobox + listbox with roving
   aria-activedescendant. Up/Down wrap, Home/End, Enter selects, Escape clears
   then propagates. IME composition guarded. Result count announced via the
   provider announcer (polite, 500 ms debounce). Virtualization lands with the
   W2 VirtualList (I-1); until then >100 items render non-virtualized. */

import * as React from 'react';
import { useAnnouncer } from '../../theme';
import { commandScore } from './score';
import { VirtualList } from '../../data/virtual-list/VirtualList';
import type { VirtualListHandle } from '../../data/virtual-list/VirtualList';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';
import type { toChangeDetails } from '../../foundation';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

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

const Ctx = React.createContext<{
  query: string;
  setQuery: (q: string) => void;
  items: ItemSpec[];
  register: (spec: ItemSpec) => () => void;
  activeId: string | undefined;
  setActiveId: (id: string | undefined) => void;
  idBase: string;
  listId: string;
  composing: React.MutableRefObject<boolean>;
  /** SURF-063: true once the visible set exceeded the virtualization
      threshold (sticky — scroll unmounts must not collapse the registry). */
  virtualizing: boolean;
  scrollTo: ((index: number) => void) | undefined;
  onValueChange: ((v: string, details: ChangeDetails) => void) | undefined;
} | null>(null);

export type CommandRootProps = Omit<PartProps<'div'>, 'onChange'> & {
  filter?: CommandFilter | undefined;
  shouldFilter?: boolean | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string, details: ChangeDetails) => void) | undefined;
  onQueryChange?: ((query: string) => void) | undefined;
  loop?: boolean | undefined;
};

function CommandRoot({
  filter,
  shouldFilter = true,
  value,
  defaultValue,
  onValueChange,
  onQueryChange,
  loop = true,
  children,
  render,
  ...rest
}: CommandRootProps) {
  const idBase = React.useId();
  const [query, setQueryState] = React.useState('');
  const [items, setItems] = React.useState<ItemSpec[]>([]);
  const [activeId, setActiveId] = React.useState<string | undefined>(undefined);
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
  const enabled = visible.filter((i) => !i.disabled);
  if (visible.length > VIRTUALIZE_THRESHOLD) virtualizingRef.current = true;

  // Announce the result count (polite, 500 ms debounce).
  const countRef = React.useRef(visible.length);
  React.useEffect(() => {
    if (visible.length === countRef.current) return;
    countRef.current = visible.length;
    const n = visible.length;
    const t = setTimeout(() => announce(`${n} result${n === 1 ? '' : 's'}`), 500);
    return () => clearTimeout(t);
  }, [visible.length, announce]);

  const ctx = React.useMemo(
    () => ({
      query,
      setQuery,
      items: visible,
      register,
      activeId,
      setActiveId,
      idBase,
      listId: `${idBase}-list`,
      composing,
      loop,
      enabledValues: enabled.map((e) => e.value),
      virtualizing: virtualizingRef.current,
      scrollTo: scrollRef.current,
      onValueChange,
    }),
    [query, setQuery, visible, register, activeId, idBase, enabled, loop],
  );

  return (
    <Ctx.Provider value={ctx as never}>
      {partElement('div', {
        render: render as React.ReactElement | undefined,
        'data-ag-part': 'command',
        className: 'ag-command',
        ...rest,
        children: (
          <CommandInner
            loop={loop}
            enabled={enabled}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
          >
            {children}
          </CommandInner>
        ),
      })}
    </Ctx.Provider>
  );
}
CommandRoot.displayName = 'Command.Root';

function CommandInner({
  loop,
  enabled,
  onValueChange,
  children,
}: {
  loop: boolean;
  enabled: ItemSpec[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((v: string, details: ChangeDetails) => void) | undefined;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(Ctx)!;

  const move = (dir: 1 | -1) => {
    const list = enabled;
    if (list.length === 0) return;
    const cur = list.findIndex((i) => `${ctx.idBase}-item-${i.value}` === ctx.activeId);
    let next = cur + dir;
    if (next < 0) next = loop ? list.length - 1 : 0;
    if (next >= list.length) next = loop ? 0 : list.length - 1;
    const spec = list[next];
    if (spec) {
      ctx.setActiveId(`${ctx.idBase}-item-${spec.value}`);
      ctx.scrollTo?.(next); // SURF-063: keep the active option in the window
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (composingRefGuard(e, ctx.composing)) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = enabled[0];
      if (first) ctx.setActiveId(`${ctx.idBase}-item-${first.value}`);
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = enabled[enabled.length - 1];
      if (last) ctx.setActiveId(`${ctx.idBase}-item-${last.value}`);
    } else if (e.key === 'Enter') {
      const spec = enabled.find(
        (i) => `${ctx.idBase}-item-${i.value}` === ctx.activeId,
      );
      if (spec) {
        e.preventDefault();
        spec.onSelect?.();
        onValueChange?.(spec.value, { event: e.nativeEvent, reason: 'item-press' });
      }
    } else if (e.key === 'Escape') {
      if (ctx.query !== '') {
        e.preventDefault();
        ctx.setQuery('');
      }
      // empty query → let the event propagate (MAT layer stack owns it)
    }
  };

  return <div onKeyDown={onKeyDown} role="presentation">{children}</div>;
}

function composingRefGuard(
  e: React.KeyboardEvent,
  ref: React.MutableRefObject<boolean>,
): boolean {
  return ref.current || (e.nativeEvent as { isComposing?: boolean }).isComposing === true;
}

export type CommandInputProps = PartProps<'input'> & {
  placeholder?: string | undefined;
};

function CommandInput({ placeholder, render, ...rest }: CommandInputProps) {
  const ctx = React.useContext(Ctx)!;
  return partElement('input', {
    render: render as React.ReactElement | undefined,
    role: 'combobox',
    'aria-expanded': true,
    'aria-controls': ctx.listId,
    'aria-autocomplete': 'list',
    'aria-activedescendant': ctx.activeId,
    'data-ag-part': 'input',
    className: 'ag-command__input',
    placeholder,
    value: ctx.query,
    autoComplete: 'off',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      ctx.setQuery(e.target.value);
      ctx.setActiveId(undefined);
    },
    onCompositionStart: () => {
      ctx.composing.current = true;
    },
    onCompositionEnd: () => {
      ctx.composing.current = false;
    },
    ...rest,
  });
}
CommandInput.displayName = 'Command.Input';

export function CommandList({ children, render, ...rest }: PartProps<'div'>) {
  const ctx = React.useContext(Ctx)!;
  const vlRef = React.useRef<VirtualListHandle | null>(null);
  // SURF-063: expose scrollTo so keyboard nav keeps the active option mounted.
  React.useEffect(() => {
    if (!ctx.virtualizing) return;
    const h = vlRef.current;
    ctx.scrollTo = h ? (i) => h.scrollToIndex(i, { align: 'auto' }) : undefined;
  });
  if (ctx.virtualizing) {
    const { ref: _domRef, role: _role, ...restSafe } = rest as PartProps<'div'>;
    void _domRef;
    void _role;
    return (
      <VirtualList
        ref={vlRef}
        items={ctx.items}
        getItemKey={(i) => i.value}
        estimateSize={() => 32}
        role="listbox"
        itemRole="option"
        className="ag-command__list"
        renderItem={(spec) => (
          <VirtualCommandRow ctx={ctx} spec={spec} />
        )}
        {...restSafe}
      />
    );
  }
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    id: ctx.listId,
    role: 'listbox',
    'data-ag-part': 'list',
    className: 'ag-command__list',
    ...rest,
    children,
  });
}
CommandList.displayName = 'Command.List';

/** Virtualized option row — always renderable from the spec so
    aria-activedescendant always has a live target (SURF-063). */
function VirtualCommandRow({ ctx, spec }: { ctx: NonNullable<React.ContextType<typeof Ctx>>; spec: ItemSpec }) {
  const id = `${ctx.idBase}-item-${spec.value}`;
  const active = ctx.activeId === id;
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      aria-disabled={spec.disabled || undefined}
      data-ag-part="item"
      data-state={active ? 'active' : 'inactive'}
      className="ag-command__item"
      onMouseMove={() => !spec.disabled && ctx.setActiveId(id)}
      onClick={(e) => {
        if (!spec.disabled) {
          spec.onSelect?.();
          ctx.onValueChange?.(spec.value, { event: e.nativeEvent, reason: 'item-press' });
        }
      }}
    >
      {spec.label ?? spec.value}
      {spec.shortcut !== undefined ? <kbd data-ag-part="shortcut">{spec.shortcut}</kbd> : null}
    </div>
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
  const id = `${ctx.idBase}-item-${value}`;
  const active = ctx.activeId === id;
  const hidden = ctx.items.length > 0 && !ctx.items.some((i) => i.value === value);
  // SURF-060: render in score order — rank within the visible set drives the
  // flex `order` (no DOM reorder; keyboard nav already follows `enabled`).
  const rank = ctx.items.findIndex((i) => i.value === value);
  return partElement('div', {
    render: render as React.ReactElement | undefined,
    id,
    role: 'option',
    'aria-selected': active,
    'aria-disabled': disabled || undefined,
    'data-ag-part': 'item',
    'data-state': active ? 'active' : 'inactive',
    hidden,
    style: { ...(rest as { style?: React.CSSProperties }).style, order: rank < 0 ? 0 : rank },
    className: 'ag-command__item',
    onMouseMove: () => !disabled && ctx.setActiveId(id),
    onClick: () => {
      if (!disabled) onSelect?.();
    },
    ...rest,
    children: (
      <>
        {children}
        {shortcut !== undefined ? (
          <kbd data-ag-part="shortcut">{shortcut}</kbd>
        ) : null}
      </>
    ),
  });
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
