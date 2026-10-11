/* REQ-CMP-51: pointer-driven onValueChange coalesces to one subscribeFrame
   call per frame; keyboard forwards synchronously; committed flushes first. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render } from '@testing-library/react';

let frameCb: (() => void) | null = null;
let subCalls = 0;
jest.mock('../../src/motion/ticker', () => ({
  subscribeFrame: (cb: () => void) => {
    subCalls += 1;
    frameCb = cb;
    return () => { frameCb = null; };
  },
}));

type ChangeHandler = (v: number, details: { reason?: string }) => void;
const captured: { change?: ChangeHandler; committed?: ChangeHandler } = {};
jest.mock('@base-ui/react/slider', () => {
  const R = require('react');
  return {
    Slider: {
      Root: (p: Record<string, unknown>) => {
        captured.change = p.onValueChange as ChangeHandler;
        captured.committed = p.onValueCommitted as ChangeHandler;
        return R.createElement('div', { 'data-ag-part': 'root' }, p.children);
      },
      Value: () => null,
      Control: (p: Record<string, unknown>) => R.createElement('div', {}, p.children),
      Track: (p: Record<string, unknown>) => R.createElement('div', {}, p.children),
      Indicator: () => null,
      Thumb: () => null,
    },
  };
});

import { Slider } from '../../src/components/slider';

describe('REQ-CMP-51 frame coalescing', () => {
  it('10 drag moves in one frame -> exactly 1 forwarded call', () => {
    const spy = jest.fn();
    render(<Slider.Root aria-label="x" onValueChange={spy} />);
    for (let i = 0; i < 10; i++) captured.change!(i, { reason: 'drag' });
    expect(spy).not.toHaveBeenCalled();
    expect(subCalls).toBe(1);
    frameCb!();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(9);
  });

  it('keyboard reasons forward synchronously', () => {
    const spy = jest.fn();
    render(<Slider.Root aria-label="x" onValueChange={spy} />);
    captured.change!(5, { reason: 'keyboard' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(5);
  });

  it('pointerup flushes pending before one onValueCommitted', () => {
    const changeSpy = jest.fn();
    const commitSpy = jest.fn();
    render(<Slider.Root aria-label="x" onValueChange={changeSpy} onValueCommitted={commitSpy} />);
    captured.change!(7, { reason: 'drag' });
    captured.committed!(7, { reason: 'drag' });
    expect(changeSpy).toHaveBeenCalledTimes(1); /* flushed first */
    expect(commitSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0]).toBe(7);
  });
});
