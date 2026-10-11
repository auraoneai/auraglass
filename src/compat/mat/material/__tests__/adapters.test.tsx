/* src/compat/mat/material/__tests__/adapters.test.tsx — MAT-356 (REQ-MAT-24).
   For each of the 10 adapters: rendered attributes equal materialProps(expected
   role); dropped props never reach the DOM and fire exactly one warnDeprecated
   whose text carries the adapter's DEP-M id; no inline style anywhere unless the
   consumer passed style (token-valued props travel as data-ag-* attributes).

   warnDeprecated warns once per id per module instance, so every test loads a
   fresh module registry (adapters + react + react-dom/server) through
   jest.isolateModules — each case observes its own first warning. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import * as React from 'react';
import type { MaterialRole } from '../../../../contracts/material';

type OptimizedGlassModule = typeof import('../OptimizedGlass');
type LiquidGlassModule = typeof import('../LiquidGlassMaterial');
type SharedModule = typeof import('../shared');
type MaterialModule = typeof import('../../../../material/index');
type CompatModule = typeof import('../../index');

interface Loaded {
  og: OptimizedGlassModule;
  lg: LiquidGlassModule;
  shared: SharedModule;
  material: MaterialModule;
  compat: CompatModule;
  render: (el: React.ReactElement) => HTMLElement;
}

function load(): Loaded {
  let loaded: Loaded | undefined;
  jest.isolateModules(() => {
    const { renderToStaticMarkup } = require('react-dom/server') as typeof import('react-dom/server');
    loaded = {
        og: require('../OptimizedGlass') as OptimizedGlassModule,
        lg: require('../LiquidGlassMaterial') as LiquidGlassModule,
        shared: require('../shared') as SharedModule,
        material: require('../../../../material/index') as MaterialModule,
        compat: require('../../index') as CompatModule,
      render(el) {
        const container = document.createElement('div');
        container.innerHTML = renderToStaticMarkup(el);
        return container.firstElementChild as HTMLElement;
      },
    };
  });
  return loaded!;
}

let warnSpy: jest.SpiedFunction<typeof console.warn>;
beforeEach(() => {
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  warnSpy.mockRestore();
});

/** The rendered element's attrs must equal materialProps(role) plus className. */
function expectRoleAttrs(m: Loaded, el: HTMLElement, role: MaterialRole): void {
  const expected = m.material.materialProps(role);
  const actual: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) actual[attr.name] = attr.value;
  for (const [k, v] of Object.entries(expected)) {
    const name = k === 'className' ? 'class' : k;
    expect(actual[name]).toBe(v === '' ? '' : v);
  }
}

/** Exactly one warning, and its text names the adapter's DEP-M id. */
function expectSingleDepWarning(depId: string): void {
  expect(depId).toMatch(/^DEP-M\d{4}$/);
  expect(warnSpy).toHaveBeenCalledTimes(1);
  const msg = String(warnSpy.mock.calls[0]![0]);
  expect(msg).toContain(depId);
  expect(msg).not.toContain('compat.mat.');
}

/** No element in the rendered tree carries an inline style attribute. */
function expectNoInlineStyle(el: HTMLElement): void {
  expect(el.hasAttribute('style')).toBe(false);
  expect(el.querySelectorAll('[style]')).toHaveLength(0);
}

const SURFACE_ADAPTERS = [
  ['OptimizedGlass', 'DEP-M0805'],
  ['GlassCore', 'DEP-M0810'],
  ['GlassPrimitive', 'DEP-M0811'],
  ['OptimizedGlassAdvanced', 'DEP-M0808'],
  ['GlassAdvanced', 'DEP-M0807'],
] as const;

describe('compat material adapters (REQ-MAT-24)', () => {
  it('maps each adapter to its own DEP-M id from fragments/deprecations/mat.ts', () => {
    const m = load();
    expect(m.shared.ADAPTER_DEPRECATION_IDS).toEqual({
      OptimizedGlass: 'DEP-M0805',
      GlassAdvanced: 'DEP-M0807',
      OptimizedGlassAdvanced: 'DEP-M0808',
      LiquidGlassMaterial: 'DEP-M0809',
      GlassCore: 'DEP-M0810',
      GlassPrimitive: 'DEP-M0811',
      LiquidGlassEffectGroup: 'DEP-M0812',
      LiquidGlassScrollEdge: 'DEP-M0813',
      LiquidGlassConcentricFrame: 'DEP-M0814',
      LiquidGlassLayerProvider: 'DEP-M0815',
    });
    const ids = Object.values(m.shared.ADAPTER_DEPRECATION_IDS);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('src/compat/mat exports GlassPrimitive and GlassAdvanced alongside the other adapters', () => {
    const { compat } = load();
    for (const name of [
      'OptimizedGlass', 'GlassCore', 'GlassPrimitive', 'OptimizedGlassAdvanced', 'GlassAdvanced',
      'LiquidGlassMaterial', 'LiquidGlassEffectGroup', 'LiquidGlassLayerProvider',
      'LiquidGlassScrollEdge', 'LiquidGlassConcentricFrame',
    ] as const) {
      expect(typeof compat[name]).toBe('function');
    }
  });

  describe.each(SURFACE_ADAPTERS)('%s', (name, depId) => {
    it('maps elevation 2 -> thickness regular, level4 -> thick, level1 -> thin', () => {
      const m = load();
      const Adapter = m.og[name];
      expectRoleAttrs(m, m.render(<Adapter elevation={2} />), { thickness: 'regular' });
      expectRoleAttrs(m, m.render(<Adapter elevation="level4" />), { thickness: 'thick' });
      expectRoleAttrs(m, m.render(<Adapter elevation="level1" />), { thickness: 'thin' });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('maps intent="primary" -> prominent; drops other intents with the DEP-M warning', () => {
      const m = load();
      const Adapter = m.og[name];
      expectRoleAttrs(m, m.render(<Adapter intent="primary" />), { prominent: true });
      expect(warnSpy).not.toHaveBeenCalled();
      const el = m.render(<Adapter intent="danger" />);
      expect(el.hasAttribute('intent')).toBe(false);
      expectSingleDepWarning(depId);
    });

    it('variant="solid" wraps with data-ag-transparency="solid"; adaptive wraps with data-ag-backdrop="auto"', () => {
      const m = load();
      const Adapter = m.og[name];
      const wrapped = m.render(<Adapter variant="solid" adaptive />);
      expect(wrapped.tagName).toBe('DIV');
      expect(wrapped.getAttribute('data-ag-transparency')).toBe('solid');
      expect(wrapped.getAttribute('data-ag-backdrop')).toBe('auto');
      expectRoleAttrs(m, wrapped.firstElementChild as HTMLElement, {});
    });

    it('adaptive does not rewrite the variant: adaptive + clear stays clear', () => {
      const m = load();
      const Adapter = m.og[name];
      const wrapped = m.render(<Adapter variant="clear" adaptive />);
      expect(wrapped.getAttribute('data-ag-backdrop')).toBe('auto');
      const inner = wrapped.firstElementChild as HTMLElement;
      // equals materialProps({ variant: 'clear' }) — not the old 'regular' rewrite
      expectRoleAttrs(m, inner, { variant: 'clear' });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('unmapped 4.x variants drop (never reach Surface) with the DEP-M warning', () => {
      const m = load();
      const Adapter = m.og[name];
      const el = m.render(<Adapter variant="frosted" />);
      expectRoleAttrs(m, el, {});
      expect(el.getAttribute('data-ag-variant')).not.toBe('frosted');
      expectSingleDepWarning(depId);
    });

    it('interactive passthrough; className/style/children passthrough', () => {
      const m = load();
      const Adapter = m.og[name];
      const el = m.render(
        <Adapter interactive className="extra" style={{ color: 'red' }}>
          <span>hi</span>
        </Adapter>,
      );
      expectRoleAttrs(m, el, { interactive: true });
      expect(el.className).toContain('extra');
      expect(el.getAttribute('style')).toContain('color');
      expect(el.textContent).toBe('hi');
    });

    it('emits no style attribute when the consumer passed none', () => {
      const m = load();
      const Adapter = m.og[name];
      expectNoInlineStyle(m.render(<Adapter />));
      expectNoInlineStyle(m.render(<Adapter variant="solid" adaptive elevation={3} />));
    });

    it('drops optical no-op props from the DOM with exactly one DEP-M warning', () => {
      const m = load();
      const Adapter = m.og[name];
      const el = m.render(<Adapter {...({ caustics: true, glowColor: 'accent', ior: 1.4 } as object)} />);
      for (const attr of ['caustics', 'glowcolor', 'ior']) expect(el.hasAttribute(attr)).toBe(false);
      m.render(<Adapter {...({ blur: 'md' } as object)} />);
      expectSingleDepWarning(depId);
    });
  });

  it('LiquidGlassMaterial: variant kept, thickness 6px -> thick, adaptToContent/ior/material dropped (DEP-M0809)', () => {
    const m = load();
    const el = m.render(
      <m.lg.LiquidGlassMaterial
        variant="clear"
        thickness={6}
        {...({ adaptToContent: true, ior: 1.5, material: 'liquid' } as object)}
      />,
    );
    expectRoleAttrs(m, el, { variant: 'clear', thickness: 'thick' });
    for (const attr of ['adapttocontent', 'ior', 'material']) expect(el.hasAttribute(attr)).toBe(false);
    expectNoInlineStyle(el);
    expectSingleDepWarning('DEP-M0809');
  });

  it('LiquidGlassEffectGroup -> SurfaceGroup with the spacing token as data-ag-spacing, no inline style (DEP-M0812)', () => {
    const m = load();
    const el = m.render(
      <m.lg.LiquidGlassEffectGroup spacing={12} {...({ morph: true } as object)}>x</m.lg.LiquidGlassEffectGroup>,
    );
    expect(el.getAttribute('data-ag-group')).toBe('');
    expect(el.getAttribute('data-ag-spacing')).toBe('3');
    expectNoInlineStyle(el);
    expectSingleDepWarning('DEP-M0812');
  });

  it('LiquidGlassLayerProvider renders a fragment and warns on dropped props (DEP-M0815)', () => {
    const m = load();
    const el = m.render(
      <m.lg.LiquidGlassLayerProvider {...({ contrastPolicy: 'AAA' } as object)}>
        <span data-testid="inner">x</span>
      </m.lg.LiquidGlassLayerProvider>,
    );
    expect(el.tagName).toBe('SPAN');
    expectSingleDepWarning('DEP-M0815');
  });

  it('LiquidGlassScrollEdge -> ScrollEdge; 4.x edgeStyle (css object) drops with warning (DEP-M0813)', () => {
    const m = load();
    const el = m.render(
      <m.lg.LiquidGlassScrollEdge edge="bottom" styleMode="hard" {...({ edgeStyle: { height: 20 } } as object)} />,
    );
    expect(el.getAttribute('data-ag-edge')).toBe('bottom');
    expect(el.getAttribute('data-ag-edge-style')).toBe('hard');
    expectNoInlineStyle(el);
    expectSingleDepWarning('DEP-M0813');
  });

  it('LiquidGlassConcentricFrame -> ConcentricFrame with token-mapped radius/inset as data-ag-* (no inline style)', () => {
    const m = load();
    const el = m.render(
      <m.lg.LiquidGlassConcentricFrame radius="lg" inset={8}>x</m.lg.LiquidGlassConcentricFrame>,
    );
    expect(el.getAttribute('data-ag-radius')).toBe('lg');
    expect(el.getAttribute('data-ag-inset')).toBe('2');
    expectNoInlineStyle(el);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('LiquidGlassConcentricFrame: a numeric 4.x radius drops with the DEP-M0814 warning', () => {
    const m = load();
    const el = m.render(<m.lg.LiquidGlassConcentricFrame radius={24}>x</m.lg.LiquidGlassConcentricFrame>);
    expect(el.getAttribute('data-ag-radius')).toBe('md');
    expectSingleDepWarning('DEP-M0814');
  });
});
