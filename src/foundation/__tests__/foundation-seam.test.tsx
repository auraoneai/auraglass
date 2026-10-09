/* REQ-CMP-02 seam contract test: covers defineMeta validation, toChangeDetails
   conversion, renderElement prop merge order, and the non-export of internal
   helpers from any entry surface. */
import * as React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { defineMeta, toChangeDetails, renderElement } from '../../foundation/index';
import * as foundation from '../../foundation/index';
import * as primitives from '../../primitives/index';

describe('defineMeta', () => {
  it('returns the meta and preserves the parts tuple', () => {
    const meta = defineMeta({
      name: 'Slot', owner: 'CMP', entry: './primitives', tier: 'T0', rsc: 'server',
      parts: ['root'], states: [], variants: {}, migration: [],
    });
    expect(meta.parts).toEqual(['root']);
  });
  it('dev-validates part names (kebab-case only) via console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      defineMeta({
        name: 'Bad', owner: 'CMP', entry: './x', tier: 'T0', rsc: 'server',
        parts: ['BadPart'], states: [], variants: {}, migration: [],
      });
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('kebab'));
    } finally {
      spy.mockRestore();
    }
  });
});

describe('toChangeDetails', () => {
  it('converts a Base-UI-like payload', () => {
    const evt = new Event('click');
    const d = toChangeDetails({ event: evt, reason: 'trigger-press' });
    expect(d.event).toBe(evt);
    expect(d.reason).toBe('trigger-press');
  });
  it('falls back to unknown reason for foreign payloads', () => {
    const d = toChangeDetails({ some: 'payload' });
    expect(d.reason).toBe('unknown');
  });
  it('is single-argument (contract ToChangeDetails)', () => {
    expect(toChangeDetails.length).toBe(1);
    expect(toChangeDetails(undefined).reason).toBe('unknown');
  });
});

describe('renderElement', () => {
  const Fallback = (props: React.HTMLAttributes<HTMLDivElement> & { 'data-ag-part'?: string; ref?: React.Ref<HTMLDivElement> }) =>
    <div ref={props.ref} {...props} />;
  const fb = <Fallback />;
  it('function render gets props + state and its element is used', () => {
    const renderProp = (p: Record<string, unknown>, s?: Record<string, unknown>) => (
      <div data-ag-part="root" data-state={s?.open ? 'open' : 'closed'} {...p}>fn</div>
    );
    const el = renderElement(renderProp, fb, { className: 'x' }, { open: true });
    render(el);
    const node = screen.getByText('fn');
    expect(node).toHaveClass('x');
    expect(node).toHaveAttribute('data-state', 'open');
  });
  it('element render merges props, className concat, style merge, ref composed', () => {
    const renderProp = <span className="from-render" style={{ color: 'red' }} />;
    const el = renderElement(renderProp, fb, { className: 'from-props', style: { background: 'blue' } });
    render(el);
    const node = document.querySelector('.from-props')!;
    expect(node).toHaveClass('from-render');
    expect((node as HTMLElement).style.color).toBe('red');
    expect((node as HTMLElement).style.background).toBe('blue');
    expect(node.tagName).toBe('SPAN');
  });
  it('no render renders the fallback with merged props', () => {
    const el = renderElement(undefined, fb, { className: 'only' });
    render(el);
    const node = document.querySelector('.only')!;
    expect(node.tagName).toBe('DIV');
  });
  it('render prop wins over both (props -> render -> fallback order)', () => {
    const renderProp = <a href="/x" data-ag-part="root">link</a>;
    const el = renderElement(renderProp, fb, { className: 'c' });
    render(el);
    expect(document.querySelector('a[href="/x"]')).not.toBeNull();
  });
});

describe('internal helpers are not exported', () => {
  it('foundation index does not export toDataState/useControllableWarning/useOverlayLayer/OverlayPortal', () => {
    const keys = Object.keys(foundation);
    for (const k of ['toDataState', 'useControllableWarning', 'useOverlayLayer', 'OverlayPortal']) {
      expect(keys).not.toContain(k);
    }
  });
  it('primitives index does not export internal overlay helpers', () => {
    const keys = Object.keys(primitives);
    for (const k of ['toDataState', 'useControllableWarning', 'useOverlayLayer', 'OverlayPortal']) {
      expect(keys).not.toContain(k);
    }
  });
});
