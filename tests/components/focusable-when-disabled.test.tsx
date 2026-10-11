/* REQ-CMP-13: focusableWhenDisabled — disabled items stay focusable (APG
   aria-disabled) by default, and leave the tab/roving order when
   focusableWhenDisabled === false. */
import { describe, expect, it, beforeAll } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { Menu } from '../../src/components/menu';
import { Select } from '../../src/components/select';
import { IconButton } from '../../src/components/icon-button';

beforeAll(() => {
  if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
    (window as { PointerEvent?: unknown }).PointerEvent = window.MouseEvent;
  }
});

const getIcon = () => <svg data-testid="icon" />;

describe('focusableWhenDisabled (REQ-CMP-13)', () => {
  it('Menu.Item: default keeps focus (tabIndex 0-ish, aria-disabled); false drops to -1', async () => {
    const { container, rerender } = render(
      <Menu.Root open>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item disabled data-testid="it">one</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    await act(async () => {}); // portal container resolves on a microtask
    const item = document.querySelector('[data-ag-part="item"]') as HTMLElement;
    expect(item).not.toBeNull();
    expect(item).toHaveAttribute('aria-disabled', 'true');
    rerender(
      <Menu.Root open>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item disabled focusableWhenDisabled={false} data-testid="it">one</Menu.Item>
              <Menu.Item disabled focusableWhenDisabled data-testid="it2">two</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    await act(async () => {});
    expect(item).toHaveAttribute('tabindex', '-1');
    const item2 = document.querySelectorAll('[data-ag-part="item"]')[1] as HTMLElement;
    expect(item2).toHaveAttribute('tabindex', '0');
    expect(item2).toHaveAttribute('aria-disabled', 'true');
  });

  it('Menu.CheckboxItem + RadioItem: focusableWhenDisabled=false → tabIndex -1', async () => {
    render(
      <Menu.Root open>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.CheckboxItem checked disabled focusableWhenDisabled={false}>c</Menu.CheckboxItem>
              <Menu.RadioGroup value="a">
                <Menu.RadioItem value="a" disabled focusableWhenDisabled={false}>r</Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    await act(async () => {});
    const items = document.querySelectorAll('[data-ag-part="item"][aria-disabled="true"]');
    expect(items.length).toBe(2);
    items.forEach((i) => expect(i).toHaveAttribute('tabindex', '-1'));
  });

  it('Select.Trigger: disabled + focusableWhenDisabled=false → tabIndex -1 + aria-disabled', () => {
    const { container, rerender } = render(
      <Select.Root><Select.Trigger disabled placeholder="pick" /></Select.Root>,
    );
    const trig = container.querySelector('[data-ag-part="trigger"]') as HTMLElement;
    expect(trig).not.toBeNull();
    const disabledish = trig.hasAttribute('disabled') || trig.getAttribute('aria-disabled') === 'true';
    expect(disabledish).toBe(true);
    rerender(<Select.Root><Select.Trigger disabled focusableWhenDisabled={false} placeholder="pick" /></Select.Root>);
    expect(trig).toHaveAttribute('tabindex', '-1');
  });

  it('IconButton: focusableWhenDisabled=false → tabIndex -1 (or native disabled) + aria-disabled/disabled', () => {
    const { container, rerender } = render(
      <IconButton label="x" icon={getIcon()} disabled focusableWhenDisabled={false} />,
    );
    const btn = container.querySelector('button') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    const disabledish = btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true';
    expect(disabledish).toBe(true);
    rerender(<IconButton label="x" icon={getIcon()} disabled />);
    expect(btn.tabIndex).not.toBe(-1);
  });
});

/* disabled-no-opacity static guard (jsdom can't compute css): no selector may
   put opacity on a bare .ag-*[data-disabled] root — alpha belongs on inner
   parts only (the remote spec asserts computed opacity === '1'). */
describe('disabled opacity seam', () => {
  it('no opacity declaration on a bare .ag-*[data-disabled] root selector', () => {
    const { readdirSync, statSync, readFileSync } = require('node:fs') as typeof import('node:fs');
    const { join } = require('node:path') as typeof import('node:path');
    const files: string[] = [];
    const walk = (d: string) => {
      for (const e of readdirSync(d)) {
        const p = join(d, e);
        if (statSync(p).isDirectory()) walk(p);
        else if (e.endsWith('.css')) files.push(p);
      }
    };
    walk('src/components');
    const bad: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      for (const m of text.matchAll(/([^{}]+)\{([^{}]*\bopacity\s*:[^{}]*)\}/g)) {
        const sel = m[1];
        // a root selector: .ag-x[data-disabled] with NO descendant part
        const sels = sel.split(',');
        for (const s of sels) {
          const ss = s.trim();
          if (/\.ag-[\w-]+\[data-disabled\]\s*$/.test(ss)) bad.push(`${f}: ${ss}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
