/* CMP-026: Slot under React 19 — ref-as-prop on both sides. Logs no console.error
   matching /element\.ref/; class merge order is slot-then-child; handlers child-first. */
import * as React from 'react';
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import { Slot } from './Slot';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Slot ref-as-prop (React 19)', () => {
  it('passes the element to the slot ref and the child ref', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const slotSeen: Array<HTMLElement | null> = [];
    const childSeen: Array<HTMLButtonElement | null> = [];
    const slotRef = (n: HTMLElement | null) => { slotSeen.push(n); };
    const childRef = (n: HTMLButtonElement | null) => { childSeen.push(n); };
    render(
      <Slot ref={slotRef}>
        <button ref={childRef}>x</button>
      </Slot>,
    );
    const el = document.querySelector('button');
    expect(el).toBeInstanceOf(HTMLButtonElement);
    expect(slotSeen).toContain(el);
    expect(childSeen).toContain(el);
    for (const call of errSpy.mock.calls) {
      expect(String(call[0])).not.toMatch(/element\.ref/);
    }
  });

  it('passes the element to the slot ref when the child has no ref', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const slotSeen: Array<HTMLElement | null> = [];
    const slotRef = (n: HTMLElement | null) => { slotSeen.push(n); };
    render(
      <Slot ref={slotRef}>
        <button>y</button>
      </Slot>,
    );
    const el = document.querySelector('button');
    expect(slotSeen).toContain(el);
    for (const call of errSpy.mock.calls) {
      expect(String(call[0])).not.toMatch(/element\.ref/);
    }
  });
});

describe('Slot prop merging', () => {
  it('merges className slot-first child-last', () => {
    render(
      <Slot className="from-slot">
        <button className="from-child">z</button>
      </Slot>,
    );
    expect(document.querySelector('button')!.className).toBe('from-slot from-child');
  });

  it('merges style shallowly with the child winning', () => {
    render(
      <Slot style={{ color: 'red', margin: '1px' }}>
        <button style={{ color: 'blue' }}>z</button>
      </Slot>,
    );
    const style = (document.querySelector('button') as HTMLElement).style;
    expect(style.color).toBe('blue');
    expect(style.margin).toBe('1px');
  });

  it('calls the child handler before the slot handler', () => {
    const order: string[] = [];
    render(
      <Slot onClick={() => order.push('slot')}>
        <button onClick={() => order.push('child')}>z</button>
      </Slot>,
    );
    document.querySelector('button')!.click();
    expect(order).toEqual(['child', 'slot']);
  });
});
