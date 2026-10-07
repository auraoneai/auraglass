/* MAT-146 — Surface rendering: 36 roles, no inline style, single DOM node for
   render props, consumer-wins non-data-ag attrs, data-ag-* wins, ref reaches
   the element, deleted props are type errors. */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { Surface } from '../Surface';
import type { MaterialRole, SurfaceProps } from '../types';

const VARIANTS = ['regular', 'clear', 'identity'] as const;
const THICKNESSES = ['thin', 'regular', 'thick'] as const;
const LAYERS = ['chrome', 'overlay', 'transient', 'content'] as const;

describe('Surface', () => {
  it.each(
    VARIANTS.flatMap((variant) =>
      THICKNESSES.flatMap((thickness) =>
        LAYERS.map((layer) => ({ variant, thickness, layer }))),
    ),
  )('36 roles emit only attributes, never a style tag: %j', (role: MaterialRole) => {
    const { container } = render(<Surface {...role} />);
    const el = container.querySelector('.ag-surface');
    expect(el).not.toBeNull();
    expect(el!.getAttribute('style')).toBeNull();
    expect(el!.getAttribute('data-ag-layer')).toBe(role.layer);
  });

  it('render prop keeps exactly one DOM node and merges class names', () => {
    const { container } = render(
      <Surface layer="chrome" render={<a href="/x" className="consumer" />}>x</Surface>,
    );
    const el = container.querySelector('a.ag-surface.consumer');
    expect(container.querySelectorAll('.ag-surface').length).toBe(1);
    expect(el).not.toBeNull();
    expect(el!.getAttribute('href')).toBe('/x');
  });

  it('consumer style object passes by reference (never merged)', () => {
    const style = { padding: '1px' } as React.CSSProperties;
    const { container } = render(<Surface layer="chrome" style={style} />);
    const el = container.querySelector('.ag-surface')!;
    expect((el as HTMLElement).style.padding).toBe('1px');
  });

  it('consumer wins non-data-ag-* attributes; data-ag-* stays authoritative', () => {
    const { container } = render(
      <Surface layer="chrome" {...({ 'data-ag-layer': 'overlay', 'aria-label': 'x' } as object)} />,
    );
    const el = container.querySelector('.ag-surface')!;
    // role wins for data-ag-*; consumer wins for everything else
    expect(el.getAttribute('data-ag-layer')).toBe('chrome');
    expect(el.getAttribute('aria-label')).toBe('x');
  });

  it('ref reaches the element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Surface layer="chrome" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current!.classList.contains('ag-surface')).toBe(true);
  });

  it('type-level: as and the 17 deleted optical props are type errors', () => {
    const base: SurfaceProps = { layer: 'chrome', interactive: true };
    void base;
    // @ts-expect-error `as` is never a prop
    const asProp: SurfaceProps = { as: 'div' }; void asProp;
    // @ts-expect-error deleted optical prop
    const p1: SurfaceProps = { caustics: 1 }; void p1;
    // @ts-expect-error deleted optical prop
    const p2: SurfaceProps = { chromatic: true }; void p2;
    // @ts-expect-error deleted optical prop
    const p3: SurfaceProps = { lighting: 'x' }; void p3;
    // @ts-expect-error deleted optical prop
    const p4: SurfaceProps = { ior: 1.5 }; void p4;
    // @ts-expect-error deleted optical prop
    const p5: SurfaceProps = { depth: 1 }; void p5;
    // @ts-expect-error deleted optical prop
    const p6: SurfaceProps = { tint: 'red' }; void p6;
    // @ts-expect-error deleted optical prop
    const p7: SurfaceProps = { glowIntensity: 1 }; void p7;
    // @ts-expect-error deleted optical prop
    const p8: SurfaceProps = { glowColor: 'red' }; void p8;
    // @ts-expect-error deleted optical prop
    const p9: SurfaceProps = { optimization: 'x' }; void p9;
    // @ts-expect-error deleted optical prop
    const p10: SurfaceProps = { hardwareAcceleration: true }; void p10;
    // @ts-expect-error deleted optical prop
    const p11: SurfaceProps = { intensity: 1 }; void p11;
    // @ts-expect-error deleted optical prop
    const p12: SurfaceProps = { blur: 10 }; void p12;
    // @ts-expect-error deleted optical prop
    const p13: SurfaceProps = { parallax: true }; void p13;
    // @ts-expect-error deleted optical prop
    const p14: SurfaceProps = { adaptive: true }; void p14;
    // @ts-expect-error deleted optical prop
    const p15: SurfaceProps = { magnet: true }; void p15;
    // @ts-expect-error deleted optical prop
    const p16: SurfaceProps = { cursorHighlight: true }; void p16;
    // @ts-expect-error deleted optical prop (tier is a value type, not a prop)
    const p17: SurfaceProps = { tier: 'enhanced' }; void p17;
  });
});
