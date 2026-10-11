import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Switch } from './index';
import { SWITCH_KEYS } from './Switch.keys';

beforeAll(() => {
  if (typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

describe('Switch (CMP-134)', () => {
  it('has role=switch and toggles on Space', async () => {
    const spy = jest.fn();
    render(<Switch onCheckedChange={spy} aria-label="airplane" />);
    const sw = screen.getByRole('switch', { name: 'airplane' });
    sw.focus();
    await userEvent.keyboard(' ');
    expect(spy).toHaveBeenCalledWith(true, expect.objectContaining({ reason: expect.any(String) }));
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('records the pin Enter behaviour (SWITCH_KEYS)', async () => {
    const spy = jest.fn();
    render(<Switch onCheckedChange={spy} aria-label="x" />);
    screen.getByRole('switch', { name: 'x' }).focus();
    await userEvent.keyboard('{Enter}');
    if (SWITCH_KEYS.enter === 'toggles') {
      expect(spy).toHaveBeenCalled();
    } else {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it('emits parts root/thumb/hit-area', () => {
    const { container } = render(<Switch aria-label="x" />);
    for (const p of ['root', 'thumb', 'hit-area']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });
});

describe('REQ-CMP-46', () => {
  it('thumb gets data-ag-animating on toggle then it clears', async () => {
    const { container } = render(
      <Switch defaultChecked={false} aria-label="sw" />,
    );
    const root = container.querySelector('[data-ag-part="root"]') as HTMLElement;
    expect(root).not.toBeNull();
    /* track + thumb material attrs present */
    expect(root.getAttribute('data-ag-content')).toBe('content-sunken');
    const thumb = root.querySelector('[data-ag-part="thumb"]') as HTMLElement;
    expect(thumb.getAttribute('data-ag-layer')).toBe('transient');
    (screen.getByRole('switch', { name: 'sw' }) as HTMLElement).focus();
    await userEvent.keyboard(' ');
    expect(thumb.getAttribute('data-ag-animating')).not.toBeNull();
    await new Promise((r) => setTimeout(r, 450));
    expect(thumb.getAttribute('data-ag-animating')).toBeNull();
  });
});
