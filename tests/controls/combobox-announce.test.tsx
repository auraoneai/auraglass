/* REQ-CMP-71: loading announcement is rate-limited to one per 500 ms
   (fake timers), and Combobox.css keeps every rule inside @layer. */
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Combobox } from '../../src/components/combobox';

const mockAnnounceSpy = jest.fn();
jest.mock('../../src/theme', () => {
  const actual = jest.requireActual('../../src/theme');
  return { ...actual, useAnnouncer: () => ({ announce: mockAnnounceSpy }) };
});

const FRUITS = ['Apple', 'Banana', 'Cherry'];

function Tree({ loading }: { loading: boolean }) {
  return (
    <Combobox.Root items={FRUITS} loading={loading}>
      <Combobox.Input />
      <Combobox.Content>
        <Combobox.Empty />
        {FRUITS.map((f) => (
          <Combobox.Item key={f} value={f}>
            {f}
          </Combobox.Item>
        ))}
      </Combobox.Content>
    </Combobox.Root>
  );
}

describe('combobox loading announcement (REQ-CMP-71)', () => {
  afterEach(() => {
    jest.useRealTimers();
    mockAnnounceSpy.mockClear();
  });

  it('true/false/true within 500 ms announces once; after 500 ms announces again', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Tree loading={false} />);
    expect(mockAnnounceSpy).not.toHaveBeenCalled();

    rerender(<Tree loading={true} />);
    expect(mockAnnounceSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(200));
    rerender(<Tree loading={false} />);
    act(() => jest.advanceTimersByTime(100));
    rerender(<Tree loading={true} />);
    /* second toggle inside the 500 ms window — no new announcement */
    expect(mockAnnounceSpy).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(600));
    rerender(<Tree loading={false} />);
    rerender(<Tree loading={true} />);
    expect(mockAnnounceSpy).toHaveBeenCalledTimes(2);
    expect(mockAnnounceSpy).toHaveBeenLastCalledWith('Loading results');
  });
});

describe('Combobox.css layering (REQ-CMP-71)', () => {
  it('contains no rules outside @layer blocks', () => {
    const css = readFileSync(join(__dirname, '../../src/components/combobox/Combobox.css'), 'utf8');
    /* strip comments, then walk braces tracking layer depth */
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    let depth = 0;
    let inLayer = 0;
    const lines = clean.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const layerAt = /^\s*@layer/.test(line);
      const isAt = trimmed.startsWith('@');
      const opens = (line.match(/\{/g) || []).length;
      const closes = (line.match(/\}/g) || []).length;
      /* a selector line that opens a rule while depth-0 unlayered = violation */
      if (!isAt && opens > closes && inLayer === 0 && depth === 0) {
        throw new Error(`unlayered rule: ${trimmed}`);
      }
      if (layerAt) inLayer++;
      depth += opens - closes;
      if (layerAt && depth === 0) inLayer--;
    }
    expect(depth).toBe(0);
  });
});
