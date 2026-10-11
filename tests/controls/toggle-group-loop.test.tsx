/* REQ-CMP-38: `loop` (default true) maps to Base UI's loopFocus on the group;
   `focusableWhenDisabled` keeps a disabled item focusable (aria-disabled, press
   vetoed) since Base UI's Toggle has no such prop. Base UI roving focus needs
   real layout — the behavioral legs live in
   tests/a11y/apg/cmp/toggle-group.apg.spec.ts. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render } from '@testing-library/react';

const captured: Record<string, Record<string, unknown>> = {};

jest.mock('@base-ui/react/toggle-group', () => {
  const R = require('react');
  return {
    ToggleGroup: (p: Record<string, unknown>) => {
      captured.root = p;
      return R.createElement('div', { 'data-ag-part': 'root' }, p.children);
    },
  };
});
jest.mock('@base-ui/react/toggle', () => {
  const R = require('react');
  return {
    Toggle: (p: Record<string, unknown>) => {
      captured.item = p;
      return R.createElement('button', {}, p.children);
    },
  };
});

import { ToggleGroup } from '../../src/components/toggle-group';

describe('ToggleGroup prop pass-through (REQ-CMP-38)', () => {
  it('loop defaults to true -> loopFocus true on Base', () => {
    render(<ToggleGroup.Root><ToggleGroup.Item value="a">A</ToggleGroup.Item></ToggleGroup.Root>);
    expect(captured.root?.loopFocus).toBe(true);
  });

  it('loop={false} -> loopFocus false on Base', () => {
    render(<ToggleGroup.Root loop={false}><ToggleGroup.Item value="a">A</ToggleGroup.Item></ToggleGroup.Root>);
    expect(captured.root?.loopFocus).toBe(false);
  });

  it('disabled alone natively disables the item Toggle', () => {
    render(
      <ToggleGroup.Root>
        <ToggleGroup.Item value="a" disabled>A</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(captured.item?.disabled).toBe(true);
    expect(captured.item?.['aria-disabled']).toBeUndefined();
  });

  it('focusableWhenDisabled keeps the item focusable (aria-disabled) and vetoes presses', () => {
    render(
      <ToggleGroup.Root>
        <ToggleGroup.Item value="a" disabled focusableWhenDisabled>A</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    /* Base UI Toggle has no focusableWhenDisabled prop: it must not leak. */
    expect(captured.item?.focusableWhenDisabled).toBeUndefined();
    expect(captured.item?.disabled).toBe(false);
    expect(captured.item?.['aria-disabled']).toBe(true);
    expect(captured.item?.['data-disabled']).toBe('');
    const cancel = jest.fn();
    (captured.item?.onPressedChange as (p: boolean, d: { cancel: () => void }) => void)(true, { cancel });
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
