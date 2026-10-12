import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
/* CMP foundation states (CMP-009): the 13 shared data-state values (S-33).
   A part emits exactly ONE of these on data-state (REQ-CMP-07). */
export const AG_STATES = [
  'open', 'closed', 'checked', 'unchecked', 'indeterminate', 'active', 'inactive',
  'on', 'off', 'expanded', 'collapsed', 'loading', 'idle',
] as const;
export type AgState = (typeof AG_STATES)[number];

interface StateFlagValues {
  open: boolean;
  checked: boolean | 'mixed';
  active: boolean;
  /** toggle/button pressed — emits 'on' | 'off' */
  pressed: boolean;
  expanded: boolean;
  loading: boolean;
}
type FlagKey = keyof StateFlagValues;

/** Exactly one state flag per call (REQ-CMP-07: one normalised value per part).
    Passing two flags is a type error; `undefined` omits the attribute. */
export type DataStateFlags = {
  [K in FlagKey]: { [P in K]?: StateFlagValues[P] | undefined } & { [P in Exclude<FlagKey, K>]?: never };
}[FlagKey];

const FLAG_ORDER: readonly FlagKey[] = ['open', 'checked', 'active', 'pressed', 'expanded', 'loading'];

/**
 * Maps one component state flag to the shared vocabulary: open->'open'|'closed',
 * checked->'checked'|'unchecked'|('mixed'->'indeterminate'), active->'active'|'inactive',
 * pressed->'on'|'off', expanded->'expanded'|'collapsed', loading->'loading'|'idle'.
 * Always a single AG_STATES value (never space-joined); undefined when the flag is
 * unset so the attribute is omitted entirely. A caller that bypasses the type and
 * passes several flags gets a dev error and the first flag's value.
 */
export function toDataState(flags: DataStateFlags): AgState | undefined {
  const f = flags as Partial<StateFlagValues>;
  const set = FLAG_ORDER.filter((k) => f[k] !== undefined);
  if (set.length > 1 && process.env.NODE_ENV !== 'production') {
    console.error(`[aura-glass] toDataState takes one state flag, got ${set.join(', ')} — data-state carries a single value (REQ-CMP-07).`);
  }
  const key = set[0];
  if (key === undefined) return undefined;
  switch (key) {
    case 'open': return f.open ? 'open' : 'closed';
    case 'checked': return f.checked === 'mixed' ? 'indeterminate' : f.checked ? 'checked' : 'unchecked';
    case 'active': return f.active ? 'active' : 'inactive';
    case 'pressed': return f.pressed ? 'on' : 'off';
    case 'expanded': return f.expanded ? 'expanded' : 'collapsed';
    case 'loading': return f.loading ? 'loading' : 'idle';
  }
}

/**
 * BU render-state adapter (REQ-CMP-07): BU parts receive their state as the
 * second arg of a `render` callback — this wraps a part's render so the
 * normalised single-value `data-state` lands on the rendered element without
 * extra local state. `toState` must return exactly one AG_STATES value.
 */
type BURender = unknown;

export function stateRender<S extends object>(
  toState: (state: S) => string | undefined,
  render: BURender,
  tag: keyof React.JSX.IntrinsicElements = 'span',
): (props: object, state: S) => React.ReactElement {
  return (props: object, state: S) => {
    const dataState = toState(state);
    const el =
      typeof render === 'function'
        ? (render as (p: object, s: S) => React.ReactElement)(props, state)
        : React.isValidElement(render)
          ? /* same merge as Base UI's own element render: the render element's
               props (children, data-ag-part, handlers) merge over the part's
               props, and the part's ref wins — e.g. RadioGroup.Item
               render={<Card>Label</Card>} keeps the Card's content. */
            React.cloneElement(render, {
              ...mergeProps(props as Record<string, unknown>, render.props as Record<string, unknown>),
              ref: (props as { ref?: unknown }).ref,
            } as Record<string, unknown>)
          : React.createElement(tag, props);
    return dataState
      ? React.cloneElement(el as React.ReactElement<Record<string, unknown>>, { 'data-state': dataState })
      : el;
  };
}
