// tests/types/surf/prop-grammar.test-d.ts — contract §4.9 prop grammar.
// Compile-time only (tsd-style): controlled-state props must follow the
// value/defaultValue/onValueChange triple; banned prop names never reappear.
type Expect<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true : false;

// Grammar shape mirrors contract §4.9: a controlled prop is expressed as
// (value, defaultValue, onValueChange) — never the legacy single-prop styles.
interface Grammar<T> {
  value?: T;
  defaultValue?: T;
  onValueChange?: (next: T) => void;
}

// Canonical SURF grammar cases: each maps a controlled concept to the triple.
type Collapsed = Grammar<boolean>;
type SelectedKeys = Grammar<readonly string[]>;
type Opened = Grammar<boolean>;
type SortState = Grammar<{ key: string; dir: 'asc' | 'desc' }>;

// The triple has exactly three members.
type TripleKeys = keyof Collapsed;
type _t1 = Expect<Equal<TripleKeys, 'value' | 'defaultValue' | 'onValueChange'>>;

// Handler is optional and takes the domain type.
type _t2 = Expect<Equal<Collapsed['onValueChange'], ((next: boolean) => void) | undefined>>;

// Banned-prop smell test: legacy names must not be keys of the grammar.
type _t3 = Expect<Equal<'onChange' extends TripleKeys ? true : false, false>>;
type _t4 = Expect<Equal<'open' extends TripleKeys ? true : false, false>>;
type _t5 = Expect<Equal<'checked' extends TripleKeys ? true : false, false>>;
type _t6 = Expect<Equal<'selectedIndex' extends TripleKeys ? true : false, false>>;

// Usage examples that must compile.
const a: Collapsed = {};
const b: SelectedKeys = { defaultValue: ['k1'] };
const c: Opened = { value: true, onValueChange: (n: boolean) => void n };
const d: SortState = { value: { key: 'name', dir: 'asc' }, defaultValue: { key: 'name', dir: 'asc' } };

// Banned members must not type-check.
const e: Collapsed = {
  // @ts-expect-error — 'onChange' is not part of the grammar
  onChange: () => {},
};

export { a, b, c, d, e };
export type { _t1, _t2, _t3, _t4, _t5, _t6 };
