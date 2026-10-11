/**
 * REQ-PLAT-47 unit-react19 leg — element-ref spy coverage.
 *
 * React 19 exposes element refs as a normal prop (`child.props.ref`) and
 * removes `element.ref` (reading it logs "Accessing element.ref was removed");
 * React 18 keeps `element.ref` and strips ref out of props. Slot branches on
 * `React.version`. `./element-ref-spy` fails any test that logs an
 * /element\.ref/ console.error, so a `child.ref` read on React 19 turns this
 * leg red.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Slot, pickChildRef } from '../../src/primitives/Slot';
import { capturedElementRefErrors, ELEMENT_REF_PATTERN } from './element-ref-spy';
import { expectedReactMajor } from './runtime';

const ELEMENT_TYPE = Symbol.for('react.element');

describe('unit-react19: element-ref spy', () => {
  const reactMajor = parseInt(React.version, 10);

  it(`runs on the React major this leg installed (React ${React.version})`, () => {
    expect(reactMajor).toBe(expectedReactMajor());
  });

  it('composes the child element ref with the forwarded ref', () => {
    const forwarded = jest.fn();
    const childRef = jest.fn();
    render(
      <Slot ref={forwarded}>
        <div ref={childRef} data-testid="spy" />
      </Slot>
    );
    const node = screen.getByTestId('spy');
    expect(forwarded).toHaveBeenCalledWith(node);
    expect(childRef).toHaveBeenCalledWith(node);
  });

  it('composes the child ref when Slot has no forwarded ref', () => {
    const childRef = jest.fn();
    render(
      <Slot>
        <div ref={childRef} data-testid="spy-only-child" />
      </Slot>
    );
    expect(childRef).toHaveBeenCalledWith(screen.getByTestId('spy-only-child'));
  });

  it('pickChildRef on a real element of the running major returns the child ref', () => {
    const elementRef = jest.fn();
    const realEl = React.createElement('div', { ref: elementRef });
    expect(pickChildRef(realEl, reactMajor)).toBe(elementRef);
  });

  it('pickChildRef: 19 reads props.ref, 18 reads element.ref', () => {
    // Pure version-branch check on a plain element-shaped object (no React
    // getters involved), so both branches are covered on either runtime.
    const propsRef = jest.fn();
    const elementRef = jest.fn();
    const shaped = {
      $$typeof: ELEMENT_TYPE,
      type: 'div',
      key: null,
      ref: elementRef,
      props: { ref: propsRef },
      _owner: null,
    } as unknown as Parameters<typeof pickChildRef>[0];
    expect(pickChildRef(shaped, 19)).toBe(propsRef);
    expect(pickChildRef(shaped, 18)).toBe(elementRef);
  });

  it('the spy detects a direct element.ref read exactly when React warns (19 only)', () => {
    const el = React.createElement('div', { ref: jest.fn() });
    // A regression like the pre-PLAT-46 `child.ref` read:
    void (el as unknown as { ref?: unknown }).ref;
    const caught = capturedElementRefErrors.splice(0);
    expect(caught).toHaveLength(reactMajor >= 19 ? 1 : 0);
    caught.forEach((m) => expect(m).toMatch(ELEMENT_REF_PATTERN));
  });
});
