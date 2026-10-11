/* src/compat/mat/material/__tests__/adapters.test.tsx — MAT-356 (REQ-MAT-24).
   For each of the 8 adapters: rendered attributes equal materialProps(expected
   role); a dropped-prop warning fires once listing the props; no style
   attribute unless the consumer passed style. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { materialProps } from '../../../../material/index';
import type { MaterialRole } from '../../../../contracts/material';
import {
  OptimizedGlass,
  GlassCore,
  OptimizedGlassAdvanced,
} from '../OptimizedGlass';
import {
  LiquidGlassMaterial,
  LiquidGlassEffectGroup,
  LiquidGlassLayerProvider,
  LiquidGlassScrollEdge,
  LiquidGlassConcentricFrame,
} from '../LiquidGlassMaterial';

let warnSpy: jest.SpiedFunction<typeof console.warn>;
beforeEach(() => {
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  warnSpy.mockRestore();
});

function render(el: React.ReactElement): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(el);
  return container.firstElementChild as HTMLElement;
}

/** The rendered element's attrs must equal materialProps(role) plus className. */
function expectRoleAttrs(el: HTMLElement, role: MaterialRole): void {
  const expected = materialProps(role);
  const actual: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) actual[attr.name] = attr.value;
  for (const [k, v] of Object.entries(expected)) {
    const name = k === 'className' ? 'class' : k;
    expect(actual[name]).toBe(v === '' ? '' : v);
  }
}

function expectSingleWarnWithProps(adapterId: string, props: string[]): void {
  expect(warnSpy).toHaveBeenCalledTimes(1);
  const msg = String(warnSpy.mock.calls[0]![0]);
  expect(msg).toContain(adapterId);
  for (const p of props) expect(msg).toContain(p);
}

describe('compat material adapters (REQ-MAT-24)', () => {
  describe.each([
    ['OptimizedGlass', OptimizedGlass],
    ['GlassCore', GlassCore],
    ['OptimizedGlassAdvanced', OptimizedGlassAdvanced],
  ] as const)('%s', (id, Adapter) => {
    it('maps elevation 2 -> thickness regular, level4 -> thick', () => {
      expectRoleAttrs(render(<Adapter elevation={2} />), { thickness: 'regular' });
      expectRoleAttrs(render(<Adapter elevation="level4" />), { thickness: 'thick' });
      expectRoleAttrs(render(<Adapter elevation="level1" />), { thickness: 'thin' });
    });

    it('maps intent="primary" -> prominent; drops other intents with warning', () => {
      expectRoleAttrs(render(<Adapter intent="primary" />), { prominent: true });
      render(<Adapter intent="danger" />);
      expectSingleWarnWithProps(`compat.mat.${id}`, ['intent']);
    });

    it('variant="solid" wraps with data-ag-transparency="solid"; adaptive wraps with data-ag-backdrop="auto"', () => {
      const wrapped = render(<Adapter variant="solid" adaptive />);
      expect(wrapped.tagName).toBe('DIV');
      expect(wrapped.getAttribute('data-ag-transparency')).toBe('solid');
      expect(wrapped.getAttribute('data-ag-backdrop')).toBe('auto');
      expectRoleAttrs(wrapped.firstElementChild as HTMLElement, {});
    });

    it('interactive passthrough; className/style/children passthrough', () => {
      const el = render(
        <Adapter interactive className="extra" style={{ color: 'red' }}>
          <span>hi</span>
        </Adapter>,
      );
      expectRoleAttrs(el, { interactive: true });
      expect(el.className).toContain('extra');
      expect(el.getAttribute('style')).toContain('color');
      expect(el.textContent).toBe('hi');
    });

    it('emits no style attribute when the consumer passed none', () => {
      expect(render(<Adapter />).hasAttribute('style')).toBe(false);
    });

    it('drops optical no-op props with one warnDeprecated listing them', () => {
      render(<Adapter {...({ caustics: true, glowColor: '#fff', ior: 1.4 } as object)} />);
      expectSingleWarnWithProps(`compat.mat.${id}`, ['caustics', 'glowColor', 'ior']);
    });
  });

  it('LiquidGlassMaterial: variant kept, thickness 6px -> thick, adaptToContent/ior warned', () => {
    const el = render(
      <LiquidGlassMaterial
        variant="clear"
        thickness={6}
        {...({ adaptToContent: true, ior: 1.5, material: 'liquid' } as object)}
      />,
    );
    expectRoleAttrs(el, { variant: 'clear', thickness: 'thick' });
    expectSingleWarnWithProps('compat.mat.LiquidGlassMaterial', ['adaptToContent', 'ior', 'material']);
  });

  it('LiquidGlassEffectGroup -> SurfaceGroup with mapped spacing', () => {
    const el = render(<LiquidGlassEffectGroup spacing={12} {...({ morph: true } as object)}>x</LiquidGlassEffectGroup>);
    expect(el.getAttribute('data-ag-group')).toBe('');
    expect(el.getAttribute('style')).toContain('--ag-space-3');
    expectSingleWarnWithProps('compat.mat.LiquidGlassEffectGroup', ['morph']);
  });

  it('LiquidGlassLayerProvider renders a fragment and warns on dropped props', () => {
    const el = render(
      <LiquidGlassLayerProvider {...({ contrastPolicy: 'AAA' } as object)}>
        <span data-testid="inner">x</span>
      </LiquidGlassLayerProvider>,
    );
    expect(el.tagName).toBe('SPAN');
    expectSingleWarnWithProps('compat.mat.LiquidGlassLayerProvider', ['contrastPolicy']);
  });

  it('LiquidGlassScrollEdge -> ScrollEdge; 4.x edgeStyle (css object) drops with warning', () => {
    const el = render(
      <LiquidGlassScrollEdge edge="bottom" styleMode="hard" {...({ edgeStyle: { height: 20 } } as object)} />,
    );
    expect(el.getAttribute('data-ag-edge')).toBe('bottom');
    expect(el.getAttribute('data-ag-edge-style')).toBe('hard');
    expectSingleWarnWithProps('compat.mat.LiquidGlassScrollEdge', ['edgeStyle']);
  });

  it('LiquidGlassConcentricFrame -> ConcentricFrame with token-mapped radius/inset', () => {
    const el = render(<LiquidGlassConcentricFrame radius="lg" inset={8}>x</LiquidGlassConcentricFrame>);
    expect(el.getAttribute('style')).toContain('--ag-radius-lg');
    expect(el.getAttribute('style')).toContain('--ag-space-2');
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
