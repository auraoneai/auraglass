/* CMP foundation types (CMP-007): the S-30 prop grammar and S-32 helper types every
   CMP component shares. Type names come from src/contracts/components.ts (frozen);
   runtime helpers live here. */
import type * as React from 'react';
import type {
  ChangeDetails,
  ComponentMeta,
  RenderProp,
} from '../contracts/components';
import {
  BANNED_PROPS,
  PART_NAME_RE,
} from '../contracts/components';

export type {
  ChangeDetails,
  CheckedProps,
  CmpExportName,
  ComponentMeta,
  DefineMeta,
  Intent,
  IntentProps,
  MaterialBearingProps,
  MigrationRow,
  OpenProps,
  PartProps,
  RenderProp,
  RenderProps,
  Size,
  SizeProps,
  ValueProps,
} from '../contracts/components';
export { BANNED_PROPS, COMPOUND_PARTS, FLAT_CMP_COMPONENTS, PART_NAME_RE } from '../contracts/components';

/** (value, details) callback signature used by every 5.0 component — never onChange. */
export type ValueChangeHandler<V> = (value: V, details: ChangeDetails) => void;

interface BaseEventDetailsLike {
  event?: unknown;
  reason?: unknown;
}

/* REQ-CMP-02: explicit map from every Base UI 1.8 reason literal (internals/
   reason-parts) to the 10-value contract enum. BU reasons never leak into the
   public ChangeDetails surface — unrecognised strings become 'unknown'. */
export const BU_REASON_MAP = {
  'none': 'imperative',
  'trigger-press': 'trigger-press',
  'trigger-hover': 'pointer',
  'trigger-focus': 'keyboard',
  'outside-press': 'outside-press',
  'item-press': 'item-press',
  'close-press': 'close-press',
  'link-press': 'item-press',
  'clear-press': 'input',
  'chip-remove-press': 'item-press',
  'track-press': 'pointer',
  'increment-press': 'item-press',
  'decrement-press': 'item-press',
  'input-change': 'input',
  'input-clear': 'input',
  'input-blur': 'input',
  'input-paste': 'input',
  'input-press': 'input',
  'focus-out': 'keyboard',
  'escape-key': 'escape-key',
  'close-watcher': 'escape-key',
  'list-navigation': 'keyboard',
  'keyboard': 'keyboard',
  'pointer': 'pointer',
  'drag': 'pointer',
  'wheel': 'pointer',
  'scrub': 'pointer',
  'cancel-open': 'imperative',
  'sibling-open': 'item-press',
  'disabled': 'imperative',
  'missing': 'imperative',
  'initial': 'imperative',
  'imperative-action': 'imperative',
  'swipe': 'pointer',
  'window-resize': 'imperative',
} as const;

export type ChangeReasonEnum = typeof BU_REASON_MAP[keyof typeof BU_REASON_MAP];

/**
 * Normalises a Base UI event-details argument ({ event, reason }) or a raw Event
 * into the contract's ChangeDetails. `fallbackReason` wins when the details carry
 * no string reason (e.g. programmatic changes with no user cause); known Base UI
 * reasons are translated through BU_REASON_MAP; anything else is 'unknown'.
 */
export function toChangeDetails(baseDetails: unknown, fallbackReason: string): ChangeDetails {
  const d = (baseDetails ?? undefined) as BaseEventDetailsLike | undefined;
  const event = d?.event instanceof Event ? d.event : baseDetails instanceof Event ? baseDetails : undefined;
  const raw = typeof d?.reason === 'string' && d.reason.length > 0 ? d.reason : undefined;
  const reason = raw === undefined
    ? fallbackReason
    : (BU_REASON_MAP as Record<string, string>)[raw] ?? 'unknown';
  return { event, reason };
}

/** A JSX member element owned by a component (compound part or member export). */
export type PartElement = keyof React.JSX.IntrinsicElements;

/** Dev-time guard for meta authors: part names must satisfy the kebab grammar. */
export function assertNoBannedProps(props: Record<string, unknown>, componentName: string): void {
  if (process.env.NODE_ENV === 'production') return;
  for (const banned of BANNED_PROPS) {
    if (banned in props) {
      // eslint-disable-next-line no-console
      console.error(`aura-glass: <${componentName}> received banned prop '${banned}' (contract S-30 grammar)`);
    }
  }
}

/** Narrowed alias kept for call sites that construct metas. */
export type { ComponentMeta as Meta };
export { PART_NAME_RE as AG_PART_NAME_RE };
