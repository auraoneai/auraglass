/* REQ-CMP-12: useGlobalHotkey is the sanctioned seam for document-wide
   hotkeys. It must deliver keydown to every enabled caller, stop on disable
   or unmount, and never add a document listener of its own: all callers share
   the LayerStack's single per-document keydown dispatcher. */
import * as React from 'react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, render } from '@testing-library/react';
import { useGlobalHotkey } from '../useGlobalHotkey';
import { layerInputFor } from '../../theme/layers/layerInput';

function Hotkey({ onKey, enabled }: { onKey: (e: KeyboardEvent) => void; enabled?: boolean }) {
  useGlobalHotkey(onKey, enabled);
  return null;
}

const press = (key: string, init: KeyboardEventInit = {}) =>
  act(() => {
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
  });

afterEach(() => cleanup());

describe('useGlobalHotkey', () => {
  it('delivers document keydown to the latest handler', () => {
    const first = jest.fn<(e: KeyboardEvent) => void>();
    const second = jest.fn<(e: KeyboardEvent) => void>();
    const { rerender } = render(<Hotkey onKey={first} />);
    press('k', { metaKey: true });
    expect(first).toHaveBeenCalledTimes(1);
    expect(first.mock.calls[0]![0].key).toBe('k');
    expect(first.mock.calls[0]![0].metaKey).toBe(true);

    rerender(<Hotkey onKey={second} />);
    press('k');
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('enabled=false and unmount stop delivery', () => {
    const onKey = jest.fn<(e: KeyboardEvent) => void>();
    const { rerender, unmount } = render(<Hotkey onKey={onKey} enabled={false} />);
    press('k');
    expect(onKey).not.toHaveBeenCalled();

    rerender(<Hotkey onKey={onKey} enabled />);
    press('k');
    expect(onKey).toHaveBeenCalledTimes(1);

    unmount();
    press('k');
    expect(onKey).toHaveBeenCalledTimes(1);
  });

  it('shares the one LayerStack keydown dispatcher: no document listener per caller', () => {
    const add = jest.spyOn(document, 'addEventListener');
    const input = layerInputFor(document);
    try {
      const a = jest.fn<(e: KeyboardEvent) => void>();
      const b = jest.fn<(e: KeyboardEvent) => void>();
      const { unmount } = render(
        <>
          <Hotkey onKey={a} />
          <Hotkey onKey={b} />
        </>,
      );
      const keydownAdds = add.mock.calls.filter(([type]) => type === 'keydown');
      // earlier cases unmounted, so the dispatcher starts detached: two callers
      // attach exactly one capture-phase keydown forwarder between them
      expect(keydownAdds).toHaveLength(1);
      expect(keydownAdds[0]![2]).toBe(true);
      expect(input.attachedCount()).toBe(1);
      press('Escape');
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);

      unmount();
      // last subscriber gone: the shared dispatcher detaches its keydown forwarder
      expect(input.attachedCount()).toBe(0);
    } finally {
      add.mockRestore();
    }
  });
});
