import * as React from 'react';
/* CMP foundation states (CMP-009): the 13 shared data-state values (S-33).
   Components emit these on data-state (space-joined when several hold). */
export const AG_STATES = [
  'open', 'closed', 'checked', 'unchecked', 'indeterminate', 'active', 'inactive',
  'on', 'off', 'expanded', 'collapsed', 'loading', 'idle',
] as const;
export type AgState = (typeof AG_STATES)[number];

export interface DataStateFlags {
  open?: boolean;
  checked?: boolean | 'mixed';
  active?: boolean;
  /** toggle/button pressed — emits 'on' | 'off' */
  pressed?: boolean;
  expanded?: boolean;
  loading?: boolean;
}

/**
 * Maps component state flags to the shared vocabulary. Each flag contributes its
 * pair member (open->'open'|'closed', checked->'checked'|'unchecked'|('mixed'->
 * 'indeterminate'), active->'active'|'inactive', pressed->'on'|'off',
 * expanded->'expanded'|'collapsed', loading->'loading'|'idle').
 * Returns undefined when no flag is set so the attribute is omitted entirely.
 */
export function toDataState(flags: DataStateFlags): string | undefined {
  const out: AgState[] = [];
  if (flags.open !== undefined) out.push(flags.open ? 'open' : 'closed');
  if (flags.checked !== undefined) out.push(flags.checked === 'mixed' ? 'indeterminate' : flags.checked ? 'checked' : 'unchecked');
  if (flags.active !== undefined) out.push(flags.active ? 'active' : 'inactive');
  if (flags.pressed !== undefined) out.push(flags.pressed ? 'on' : 'off');
  if (flags.expanded !== undefined) out.push(flags.expanded ? 'expanded' : 'collapsed');
  if (flags.loading !== undefined) out.push(flags.loading ? 'loading' : 'idle');
  return out.length ? out.join(' ') : undefined;
}

/**
 * BU render-state adapter (REQ-CMP-07): BU parts receive their state as the
 * second arg of a `render` callback — this wraps a part's render so the
 * normalised single-value `data-state` lands on the rendered element without
 * extra local state. `toState` must return exactly one AG_STATES value.
 */
type BURender = any;

export function stateRender<S extends object>(
  toState: (state: S) => string | undefined,
  render: BURender,
  tag: keyof React.JSX.IntrinsicElements = 'span',
): any {
  return (props: Record<string, unknown>, state: S) => {
    const dataState = toState(state);
    const el =
      typeof render === 'function'
        ? (render as (p: Record<string, unknown>, s: S) => React.ReactElement)(props, state)
        : React.isValidElement(render)
          ? React.cloneElement(render, props)
          : React.createElement(tag, props);
    return dataState
      ? React.cloneElement(el as React.ReactElement<Record<string, unknown>>, { 'data-state': dataState })
      : el;
  };
}
