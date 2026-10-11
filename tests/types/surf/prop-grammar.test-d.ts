// tests/types/surf/prop-grammar.test-d.ts — REQ-SURF-11 (S-30 prop grammar),
// REQ-FIN-80 / AC-FIN-80. Compile-time only: run with
//   tsc -p ci/surf/types/tsconfig.json
// The checks walk the REAL public SURF surface: every value export of every
// SURF entry (./app-shell, ./data, ./date, ./ai, ./media, ./backdrops,
// ./charts, ./three) and the SURF root slice (src/root/surf.ts), including the
// compound members (`Tabs.Root`, `Composer.Submit`, `ImageViewer.Root`, …).
// For each component the props type must:
//   1. contain no BANNED_PROPS key (material, elevation, as, tone, asChild, onChange);
//   2. if it has `onValueChange`, take exactly `(value, details: ChangeDetails)`;
//   3. if it has `open`, also have `onOpenChange`, and `onOpenChange` takes
//      exactly `(open: boolean, details: ChangeDetails)`;
//   4. if it has `variant`, accept only material variants (regular|clear|identity);
//      non-material looks use `appearance` (data-ag-appearance).
// A violation anywhere makes `Violations` non-never and `AssertNone` fails tsc
// with the offending `<entry>/<Export>[.<Member>]:<rule>` string in the error.
// The planted cases below prove the machinery fails tsc for a banned prop on
// any SURF component (each is a consumed `@ts-expect-error`).
import type * as React from 'react';
import type { BANNED_PROPS, ChangeDetails } from '../../../src/contracts/components';
import type { MaterialVariant } from '../../../src/contracts/material';
import type * as AppShellEntry from '../../../src/app-shell/index';
import type * as DataEntry from '../../../src/data/index';
import type * as DateEntry from '../../../src/date/index';
import type * as AiEntry from '../../../src/ai/index';
import type * as MediaEntry from '../../../src/media/index';
import type * as BackdropsEntry from '../../../src/backdrops/index';
import type * as ChartsEntry from '../../../src/charts/index';
import type * as ThreeEntry from '../../../src/three/index';
import type * as RootSurf from '../../../src/root/surf';
import type { SparklineProps } from '../../../src/data/index';
import type { ProviderErrorStateProps } from '../../../src/ai/index';
import type { BackdropProps, BackdropPhotoProps } from '../../../src/backdrops/index';

type Banned = (typeof BANNED_PROPS)[number];
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
/** Fails tsc unless T is never; the error message names every violation. */
type AssertNone<T extends never> = T;

// ---- rule evaluation over one props type -------------------------------------
type HandlerRule<F, First> = [NonNullable<F>] extends [(...args: infer A) => unknown]
  ? A extends [infer V, infer D]
    ? Equal<D, ChangeDetails> extends true
      ? [First] extends [never] ? never : Equal<V, First> extends true ? never : 'first-arg'
      : 'details-not-ChangeDetails'
    : 'arity-not-2'
  : 'not-a-function';
type BannedRule<P> = Extract<keyof P, Banned> extends never ? never : `banned-${Extract<keyof P, Banned> & string}`;
type ValueRule<P> = 'onValueChange' extends keyof P
  ? HandlerRule<P['onValueChange' & keyof P], never> extends never ? never : `onValueChange-${HandlerRule<P['onValueChange' & keyof P], never> & string}`
  : never;
type OpenRule<P> =
  | ('open' extends keyof P ? ('onOpenChange' extends keyof P ? never : 'open-without-onOpenChange') : never)
  | ('onOpenChange' extends keyof P
      ? HandlerRule<P['onOpenChange' & keyof P], boolean> extends never ? never : `onOpenChange-${HandlerRule<P['onOpenChange' & keyof P], boolean> & string}`
      : never);
type VariantRule<P> = 'variant' extends keyof P
  ? Exclude<NonNullable<P['variant' & keyof P]>, MaterialVariant> extends never ? never : 'variant-not-material'
  : never;
/** Distributes over union props (e.g. the Backdrop preset union). */
type Rules<P> = P extends unknown ? BannedRule<P> | ValueRule<P> | OpenRule<P> | VariantRule<P> : never;

// ---- walk entries, exports and compound members ------------------------------
type FnKeys = 'prototype' | 'length' | 'name' | 'caller' | 'arguments' | '$$typeof' | 'displayName'
  | 'propTypes' | 'defaultProps' | 'contextTypes' | 'render' | 'compare' | 'type';
type Hits<C, Path extends string> = C extends React.JSXElementConstructor<infer P>
  ? Rules<P> extends never ? never : `${Path}:${Rules<P> & string}`
  : never;
type MemberHits<C, Path extends string> = C extends object
  ? { [K in Exclude<keyof C, FnKeys> & string]: Hits<C[K], `${Path}.${K}`> }[Exclude<keyof C, FnKeys> & string]
  : never;
type EntryHits<M, E extends string> = {
  [K in keyof M & string]: Hits<M[K], `${E}/${K}`> | MemberHits<M[K], `${E}/${K}`>;
}[keyof M & string];
/** Count of components inspected per entry — guards against a vacuous walk. */
type Components<M> = {
  [K in keyof M & string]: (M[K] extends React.JSXElementConstructor<never> ? K : never)
    | (M[K] extends object ? { [J in Exclude<keyof M[K], FnKeys> & string]: M[K][J] extends React.JSXElementConstructor<never> ? `${K}.${J}` : never }[Exclude<keyof M[K], FnKeys> & string] : never);
}[keyof M & string];

export type Violations =
  | EntryHits<typeof AppShellEntry, 'app-shell'>
  | EntryHits<typeof DataEntry, 'data'>
  | EntryHits<typeof DateEntry, 'date'>
  | EntryHits<typeof AiEntry, 'ai'>
  | EntryHits<typeof MediaEntry, 'media'>
  | EntryHits<typeof BackdropsEntry, 'backdrops'>
  | EntryHits<typeof ChartsEntry, 'charts'>
  | EntryHits<typeof ThreeEntry, 'three'>
  | EntryHits<typeof RootSurf, 'root'>;

// THE assertion: the real SURF surface obeys S-30.
export type _surfClean = AssertNone<Violations>;

// Non-vacuity: the walk reaches the components the REQ names (a broken import
// or a renamed export turns these into `false` and fails tsc).
type _walk1 = Expect<Equal<'Sparkline' extends Components<typeof DataEntry> ? true : false, true>>;
type _walk2 = Expect<Equal<'ProviderErrorState' extends Components<typeof AiEntry> ? true : false, true>>;
type _walk3 = Expect<Equal<'Backdrop' extends Components<typeof BackdropsEntry> ? true : false, true>>;
type _walk4 = Expect<Equal<'AppShell.Root' extends Components<typeof AppShellEntry> ? true : false, true>>;
type _walk5 = Expect<Equal<'Tabs.Root' extends Components<typeof RootSurf> ? true : false, true>>;
type _walk6 = Expect<Equal<'Composer.Submit' extends Components<typeof AiEntry> ? true : false, true>>;
type _walk7 = Expect<Equal<'ImageViewer.Root' extends Components<typeof MediaEntry> ? true : false, true>>;
type _walk8 = Expect<Equal<'DatePicker' extends Components<typeof DateEntry> ? true : false, true>>;

// ---- planted violations: each must FAIL tsc (consumed @ts-expect-error) ------
type Planted<P> = React.FC<P>;
// @ts-expect-error planted banned prop 'tone' on a SURF component
type _plantTone = AssertNone<Hits<Planted<SparklineProps & { tone?: 'light' }>, 'planted/Sparkline'>>;
// @ts-expect-error planted banned prop 'material'
type _plantMaterial = AssertNone<Hits<Planted<ProviderErrorStateProps & { material?: 'liquid' }>, 'planted/ProviderErrorState'>>;
// @ts-expect-error planted banned prop 'elevation'
type _plantElevation = AssertNone<Hits<Planted<BackdropPhotoProps & { elevation?: number }>, 'planted/Backdrop'>>;
// @ts-expect-error planted banned prop 'as'
type _plantAs = AssertNone<Hits<Planted<SparklineProps & { as?: 'div' }>, 'planted/Sparkline'>>;
// @ts-expect-error planted banned prop 'asChild'
type _plantAsChild = AssertNone<Hits<Planted<SparklineProps & { asChild?: boolean }>, 'planted/Sparkline'>>;
// @ts-expect-error planted value callback 'onChange'
type _plantOnChange = AssertNone<Hits<Planted<SparklineProps & { onChange?: (v: number) => void }>, 'planted/Sparkline'>>;
// @ts-expect-error planted onValueChange without ChangeDetails
type _plantVc = AssertNone<Hits<Planted<{ value?: string; onValueChange?: (v: string) => void }>, 'planted/Select'>>;
// @ts-expect-error planted open without onOpenChange
type _plantOpen = AssertNone<Hits<Planted<{ open?: boolean }>, 'planted/Disclosure'>>;
// @ts-expect-error planted onOpenChange(open) without details
type _plantOc = AssertNone<Hits<Planted<{ open?: boolean; onOpenChange?: (o: boolean) => void }>, 'planted/Disclosure'>>;
// @ts-expect-error planted non-material variant (must be appearance)
type _plantVariant = AssertNone<Hits<Planted<{ variant?: 'line' | 'bar' }>, 'planted/Chart'>>;
// Positive control: a grammar-conforming component passes.
type _plantOk = AssertNone<Hits<Planted<{
  value?: string; defaultValue?: string; onValueChange?: (v: string, d: ChangeDetails) => void;
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (o: boolean, d: ChangeDetails) => void;
  variant?: MaterialVariant; appearance?: 'pill' | 'underline';
}>, 'planted/Ok'>>;

// ---- the specific REQ-SURF-11 renames, at the props level --------------------
// Sparkline / ProviderErrorState: `appearance`, never `variant`.
const spark: SparklineProps = { data: [1, 2], appearance: 'bar' };
// @ts-expect-error Sparkline 'variant' was renamed to 'appearance'
const sparkVariant: SparklineProps = { data: [1, 2], variant: 'bar' };
const perr: ProviderErrorStateProps = { kind: 'network', appearance: 'compact' };
// @ts-expect-error ProviderErrorState 'variant' was renamed to 'appearance'
const perrVariant: ProviderErrorStateProps = { kind: 'network', variant: 'compact' };
// Backdrop: `tone` is banned (OD-17 fallback / C-13: renamed to `mediaTone`).
const bd: BackdropProps = { preset: 'photo', src: '/x.jpg', mediaTone: 'dark' };
// @ts-expect-error Backdrop 'tone' is a BANNED_PROPS key (use mediaTone)
const bdTone: BackdropProps = { preset: 'photo', src: '/x.jpg', tone: 'dark' };

export type {
  _walk1, _walk2, _walk3, _walk4, _walk5, _walk6, _walk7, _walk8,
  _plantTone, _plantMaterial, _plantElevation, _plantAs, _plantAsChild, _plantOnChange,
  _plantVc, _plantOpen, _plantOc, _plantVariant, _plantOk,
};
export { spark, sparkVariant, perr, perrVariant, bd, bdTone };
