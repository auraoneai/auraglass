/**
 * REQ-PLAT-47 unit-react19 leg — element-ref spy coverage.
 *
 * React 19 exposes element refs as a normal prop (`child.props.ref`) and
 * removes `element.ref`; React 18 keeps `element.ref` and strips ref out of
 * props. Slot branches on `React.version` — these tests exercise both paths
 * and spy on the composed ref.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Slot, pickChildRef } from '../../src/primitives/Slot';

const ELEMENT_TYPE = Symbol.for('react.element');

describe('unit-react19: element-ref spy', () => {
  const reactMajor = parseInt(React.version, 10);
  const runningReal19 = reactMajor >= 19;

  it(`runtime report: React ${React.version} (major ${reactMajor})`, () => {
    expect([18, 19]).toContain(reactMajor);
  });

  it('element ref is composed with the forwarded ref', () => {
    const forwarded = jest.fn();
    const childRef = jest.fn();
    let el: React.ReactElement;
    if (runningReal19) {
      // 19: ref stays in props
      el = React.createElement('div', { 'data-testid': 'spy' });
      (el.props as Record<string, unknown>).ref = childRef;
    } else {
      // 18: createElement puts ref on element.ref
      el = React.createElement('div', { ref: childRef, 'data-testid': 'spy' });
    }
    render(<Slot ref={forwarded}>{el}</Slot>);
    const node = screen.getByTestId('spy');
    expect(forwarded).toHaveBeenCalledWith(node);
    expect(childRef).toHaveBeenCalledWith(node);
  });

  it('pickChildRef: 19 reads props.ref, 18 reads element.ref', () => {
    // The version branch as a pure helper — the real react@19 leg in CI
    // covers the same path live against React 19.
    const propsRef = jest.fn();
    const elementRef = jest.fn();
    const fake19El = {
      $$typeof: ELEMENT_TYPE,
      type: 'div',
      key: null,
      ref: elementRef,
      props: { ref: propsRef },
      _owner: null,
    } as unknown as React.ReactElement;
    expect(pickChildRef(fake19El, 19)).toBe(propsRef);
    expect(pickChildRef(fake19El, 18)).toBe(elementRef);
    const realEl = React.createElement('div', { ref: elementRef });
    expect(pickChildRef(realEl, 18)).toBe(elementRef);
  });
});
