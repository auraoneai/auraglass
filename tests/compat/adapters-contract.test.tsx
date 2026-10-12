/* tests/compat/adapters-contract.test.tsx — REQ-PLAT-30 + S-30 (PLAT-199).
   Generic contract for every aura-glass/compat value export:
   - importing the barrel (fresh module registry, jest.isolateModules) writes
     nothing to the console (no module-scope warning);
   - per export, with warnDeprecated's once-per-load Set reset first
     (resetDeprecationWarnings: a new "page load"), the first render — hooks
     through a harness component, create* factories through one call — never
     throws and logs no React error, with generic props plus an unmappable
     prop. Exports that need required props or a parent part get them from
     FIXTURES below: an explicit allowlist, never a silent skip;
   - it emits exactly one table-format warning
     `[aura-glass] DEP-<stream><nnnn> (since …` whose id is a deprecation
     entry for this symbol with `compat != null` (verify-compat-coverage's rule) (ALIAS_IDS: 4.x aliases that warn
     with their target's id);
   - other `[aura-glass] DEP-` warnings are once-only prop/part drops (`[aura-glass] DEP-….<x>
     is deprecated; see deprecations.json`);
   - a second render adds no table-format warning (once per symbol per load). */
import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as Compat from '../../src/compat/index';
import { deprecations as entries } from '../../src/internal/deprecations.generated';
import { resetDeprecationWarnings } from '../../src/internal/warnDeprecated';
import { AuraGlassProvider } from '../../src/theme/AuraGlassProvider';
import { Menu } from '../../src/components/menu';
import { Popover } from '../../src/components/popover';
import { PopoverPortal } from '../../src/components/popover/Popover.client';
import { Select } from '../../src/components/select';
import { Toast } from '../../src/components/toast';

type Bag = Record<string, unknown>;
type Fixture = {
  /** props merged over the generic bag */
  props?: Bag;
  /** create* factories: the call argument */
  args?: unknown;
  /** wraps the element (e.g. a parent part providing context) */
  wrap?: (el: React.ReactElement) => React.ReactElement;
};

const compat = Compat as unknown as Bag;
// `unmappableprop`: lowercase, so a passthrough adapter that forwards it to
// the DOM yields a plain attribute rather than React's unknown-prop error.
const GENERIC: Bag = { children: 'body', className: 'x', 'aria-label': 'Confirm action', unmappableprop: 'ignored' };
// The symbol warning: the table format for active entries, or the generic
// fallback for an id the runtime table does not carry (planned entries).
const TABLE_RE = /^\[aura-glass\] (DEP-[PMCSQ]\d{4})(?: \(since \d+\.\d+\.\d+, removed in \d+\.\d+\.\d+\): | is deprecated; see deprecations\.json$)/;
const DROP_RE = /^\[aura-glass\] DEP-[PMCSQ]\d{4}[.:][^\s]+ is deprecated; see deprecations\.json$/;

/* Required props / parent parts, per export. Each row is the minimum the 5.0
   target needs to render; keep it explicit (REQ-PLAT-30: no silent skips). */
const inMenu = (el: React.ReactElement) => <Menu.Root open>{el}</Menu.Root>;
const inMenuPopup = (el: React.ReactElement) => <Menu.Root open><Menu.Content>{el}</Menu.Content></Menu.Root>;
const inMenuGroup = (el: React.ReactElement) => <Menu.Root open><Menu.Group>{el}</Menu.Group></Menu.Root>;
const inSubmenu = (el: React.ReactElement) => <Menu.Root open><Menu.Content><Menu.Submenu>{el}</Menu.Submenu></Menu.Content></Menu.Root>;
const inSelect = (el: React.ReactElement) => <Select.Root>{el}</Select.Root>;
const inSelectGroup = (el: React.ReactElement) => <Select.Root><Select.Group>{el}</Select.Group></Select.Root>;
const inPopover = (el: React.ReactElement) => <Popover.Root open><PopoverPortal>{el}</PopoverPortal></Popover.Root>;
const inToasts = (el: React.ReactElement) => <Toast.Provider>{el}</Toast.Provider>;
// REQ-MAT-24: the material adapters warn when they drop a deleted 4.x optical
// prop, so their first render passes one (caustics is in OPTICAL_NOOP).
const MAT_DROP: Fixture = { props: { caustics: true } };
const THEME = { tokens: { color: { canvas: { light: 'ivory', dark: 'black' }, accent: 'mediumblue', onAccent: 'whitesmoke' }, density: { scale: 1 } } };
const FIXTURES: Record<string, Fixture> = {
  ...Object.fromEntries(['GlassDropdownMenuTrigger', 'GlassDropdownMenuPortal', 'GlassDropdownMenuContent', 'GlassDropdownMenuItem',
    'GlassDropdownMenuCheckboxItem', 'GlassDropdownMenuRadioGroup', 'GlassDropdownMenuGroup', 'GlassDropdownMenuSeparator',
    'GlassDropdownMenuSub'].map((n) => [n, { wrap: inMenu }])),
  GlassDropdownMenuRadioItem: { props: { value: 'a' }, wrap: (el) => inMenu(<Menu.RadioGroup>{el}</Menu.RadioGroup>) },
  GlassDropdownMenuArrow: { wrap: inMenuPopup },
  GlassDropdownMenuLabel: { wrap: inMenuGroup },
  GlassDropdownMenuSubTrigger: { wrap: inSubmenu },
  ...Object.fromEntries(['GlassSelectTrigger', 'GlassSelectValue', 'GlassSelectContent', 'GlassSelectGroup', 'GlassSelectSeparator']
    .map((n) => [n, { wrap: inSelect }])),
  GlassSelectItem: { props: { value: 'a' }, wrap: inSelect },
  GlassSelectLabel: { wrap: inSelectGroup },
  Positioner: { wrap: inPopover },
  GlassPositioner: { wrap: inPopover },
  GlassToast: { wrap: inToasts },
  GlassToastViewport: { wrap: inToasts },
  useNotifications: { wrap: inToasts },
  useToast: { wrap: inToasts },
  GlassSlot: { props: { children: <span>body</span> } },
  GlassMasonryGrid: { props: { items: [{ id: 'a', content: 'A' }, { id: 'b', content: 'B' }] } },
  LiquidGlassBadgeCluster: { props: { items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] } },
  LiquidGlassSource: { props: { id: 'hero' } },
  LiquidGlassDestination: { props: { id: 'hero' } },
  GlassMediaControls: { props: { duration: 120, currentTime: 10 } },
  LiquidGlassMediaControls: { props: { duration: 120, currentTime: 10 } },
  ...Object.fromEntries(['OptimizedGlass', 'GlassCore', 'GlassPrimitive', 'OptimizedGlassAdvanced', 'GlassAdvanced',
    'LiquidGlassMaterial', 'LiquidGlassEffectGroup', 'LiquidGlassScrollEdge', 'LiquidGlassConcentricFrame', 'LiquidGlassLayerProvider']
    .map((n) => [n, MAT_DROP])),
  createBrandGlassTheme: { args: '#3366ff' },
  createGlassThemeCssVars: { args: THEME },
  // the compat createGlassTheme warns only when the 4.x option is used (DEP-M0902)
  createGlassTheme: { args: { motionPolicy: 'reduced' } },
};

/* 4.x aliases that warn with the id of the adapter they alias. */
const ALIAS_IDS: Record<string, string> = { Button: 'DEP-C0001', createGlassTheme: 'DEP-M0902' };

const idsForCompat = (name: string): string[] =>
  (entries as ReadonlyArray<{ id: string; symbol: string; compat?: string | null }>).filter((e) => e.symbol === name && e.compat != null).map((e) => e.id);

const names = Object.keys(compat).filter((k) => typeof compat[k] === 'function').sort();

function run(name: string): void {
  const fn = compat[name] as (...a: unknown[]) => unknown;
  const fx = FIXTURES[name] ?? {};
  if (/^create[A-Z]/.test(name)) { fn(fx.args ?? {}); return; }
  let el: React.ReactElement;
  if (/^use[A-Z]/.test(name)) {
    const Harness = () => { fn(); return null; };
    el = React.createElement(Harness);
  } else {
    el = React.createElement(fn as React.ComponentType<Bag>, { ...GENERIC, ...fx.props });
  }
  // every app mounts the provider at the root (portal roots, S-23)
  render(<AuraGlassProvider>{fx.wrap ? fx.wrap(el) : el}</AuraGlassProvider>).unmount();
}

afterEach(() => { cleanup(); jest.restoreAllMocks(); });

describe('aura-glass/compat adapters contract (REQ-PLAT-30)', () => {
  it('importing the barrel in a fresh registry writes nothing to the console', () => {
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) => jest.spyOn(console, m).mockImplementation(() => {}));
    let fresh: Bag = {};
    jest.isolateModules(() => { fresh = require('../../src/compat/index') as Bag; });
    expect(Object.keys(fresh).length).toBeGreaterThan(100);
    for (const s of spies) expect(s).not.toHaveBeenCalled();
  });

  it('the public surface is adapters only (functions, or compound part objects)', () => {
    const other = Object.entries(compat).filter(([, v]) => typeof v !== 'function' && (typeof v !== 'object' || v === null)).map(([k]) => k);
    expect(other).toEqual([]);
    expect(names.length).toBeGreaterThan(100);
  });

  it.each(names)('%s: first render never throws and warns exactly once with its own id', (name) => {
    resetDeprecationWarnings();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => run(name)).not.toThrow();
    expect([name, error.mock.calls.map((c) => String(c[0]).split('\n')[0])]).toEqual([name, []]);
    const msgs = warn.mock.calls.map((c) => String(c[0]));
    const table = msgs.filter((m) => TABLE_RE.test(m));
    expect([name, table]).toEqual([name, [expect.any(String)]]);
    const id = TABLE_RE.exec(table[0]!)![1]!;
    expect(entries.some((e) => e.id === id)).toBe(true);
    const want = ALIAS_IDS[name] ? [ALIAS_IDS[name]] : idsForCompat(name);
    expect([name, want]).toEqual([name, expect.arrayContaining([id])]);
    // other [aura-glass] DEP- lines are once-only prop/part drops; non-deprecation
    // diagnostics (e.g. a theme contrast note) are not this contract's concern
    const drops = msgs.filter((m) => m.startsWith('[aura-glass] DEP-') && !TABLE_RE.test(m));
    for (const m of drops) expect([name, m]).toEqual([name, expect.stringMatching(DROP_RE)]);
    expect(new Set(drops).size).toBe(drops.length);
    warn.mockClear();
    run(name);
    expect(warn.mock.calls.map((c) => String(c[0])).filter((m) => TABLE_RE.test(m))).toEqual([]);
  });
});
