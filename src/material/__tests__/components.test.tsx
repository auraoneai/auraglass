/* MAT-149 — component attribute emission: SurfaceGroup, Environment,
   ScrollEdge, ConcentricFrame. */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { SurfaceGroup } from '../SurfaceGroup';
import { Environment } from '../Environment';
import { ScrollEdge } from '../ScrollEdge';
import { ConcentricFrame } from '../ConcentricFrame';

describe('SurfaceGroup', () => {
  it('emits chrome surface + data-ag-group + data-ag-spacing (default 2)', () => {
    const { container } = render(<SurfaceGroup>x</SurfaceGroup>);
    const el = container.firstElementChild!;
    expect(el.classList.contains('ag-surface')).toBe(true);
    expect(el.getAttribute('data-ag-layer')).toBe('chrome');
    expect(el.getAttribute('data-ag-group')).toBe('');
    expect(el.getAttribute('data-ag-spacing')).toBe('2');
    expect(el.getAttribute('style')).toBeNull();
  });
  it('spacing is a token, never a px', () => {
    const { container } = render(<SurfaceGroup spacing="4">x</SurfaceGroup>);
    expect(container.firstElementChild!.getAttribute('data-ag-spacing')).toBe('4');
  });
});

describe('Environment', () => {
  it('emits data-ag-backdrop', () => {
    const { container } = render(<Environment backdrop="dark">x</Environment>);
    expect(container.firstElementChild!.getAttribute('data-ag-backdrop')).toBe('dark');
  });
  it('auto + image resolves to media and renders an aria-hidden img', () => {
    const { container } = render(<Environment backdrop="auto" image="/bg.png">x</Environment>);
    expect(container.firstElementChild!.getAttribute('data-ag-backdrop')).toBe('media');
    const img = container.querySelector('img')!;
    expect(img.getAttribute('aria-hidden')).toBe('true');
    expect(img.getAttribute('alt')).toBe('');
  });
  it('auto + video resolves to media with muted playsInline video', () => {
    const { container } = render(<Environment backdrop="auto" video="/bg.mp4">x</Environment>);
    expect(container.firstElementChild!.getAttribute('data-ag-backdrop')).toBe('media');
    const v = container.querySelector('video')!;
    expect(v.muted).toBe(true);
    expect(v.hasAttribute('playsInline')).toBe(true);
    expect(v.getAttribute('aria-hidden')).toBe('true');
  });
  it('auto without media stays auto', () => {
    const { container } = render(<Environment backdrop="auto">x</Environment>);
    expect(container.firstElementChild!.getAttribute('data-ag-backdrop')).toBe('auto');
  });
});

describe('ScrollEdge', () => {
  it('emits aria-hidden scroll-edge part with edge + edgeStyle defaults', () => {
    const { container } = render(<ScrollEdge edge="top" />);
    const el = container.firstElementChild!;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.getAttribute('data-ag-part')).toBe('scroll-edge');
    expect(el.getAttribute('data-ag-edge')).toBe('top');
    expect(el.getAttribute('data-ag-edge-style')).toBe('soft');
  });
  it('edgeStyle prop (not style)', () => {
    const { container } = render(<ScrollEdge edge="bottom" edgeStyle="hard" />);
    const el = container.firstElementChild!;
    expect(el.getAttribute('data-ag-edge')).toBe('bottom');
    expect(el.getAttribute('data-ag-edge-style')).toBe('hard');
    expect(el.getAttribute('style')).toBeNull();
  });
});

describe('ConcentricFrame', () => {
  it('emits data-ag-radius + data-ag-inset with no inline style', () => {
    const { container } = render(
      <ConcentricFrame radius="lg" inset="3">x</ConcentricFrame>,
    );
    const el = container.firstElementChild!;
    expect(el.getAttribute('data-ag-radius')).toBe('lg');
    expect(el.getAttribute('data-ag-inset')).toBe('3');
    expect(el.getAttribute('style')).toBeNull();
  });
});
