/* CMP-203 (REQ-CMP-82): zero work after the enter transition settles — 2000ms
   of fake time on an open subject produces no renders, no setInterval calls
   attributable to overlay code, and for the toast subject exactly one pending
   timeout per live toast. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../../theme';
import { MOUNTED_SUBJECTS } from './__tests__/subjects';

describe('overlay idle (CMP-203)', () => {
  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
    document.querySelectorAll('[data-ag-portal-root]').forEach((n) => n.remove());
  });
  afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s: zero renders + zero setInterval calls across 2000ms of fake time',
    async (_name, subject) => {
      let commits = 0;
      const onRender = () => { commits += 1; };
      const intervalSpy = jest.spyOn(window, 'setInterval');
      render(
        <AuraGlassProvider>
          <React.Profiler id="idle" onRender={onRender}>
            {subject.mount!()}
          </React.Profiler>
        </AuraGlassProvider>,
      );
      await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
      const settled = commits;
      const settledIntervals = intervalSpy.mock.calls.length;

      jest.useFakeTimers();
      act(() => { jest.advanceTimersByTime(2000); });
      jest.useRealTimers();

      expect(commits).toBe(settled);
      expect(intervalSpy.mock.calls.length - settledIntervals).toBe(0);
    },
  );

  it('toast: exactly one pending timeout per live toast', async () => {
    const toast = MOUNTED_SUBJECTS.find((s) => s.kind === 'toast')!;
    render(<AuraGlassProvider>{toast.mount!()}</AuraGlassProvider>);
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    const mounted = document.querySelectorAll(toast.popupSelector).length;

    jest.useFakeTimers();
    const pending = jest.getTimerCount();
    jest.useRealTimers();
    expect(pending).toBe(mounted);
  });
});
