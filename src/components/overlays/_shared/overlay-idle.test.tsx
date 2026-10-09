/* CMP-203 (REQ-CMP-82): zero commits after the enter transition settles —
   2000ms of fake time on an open subject produces no renders and no pending
   timer we registered (BU may keep its own; we count renders). */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { MOUNTED_SUBJECTS, SEAM_SUBJECTS } from './__tests__/subjects';

describe('overlay idle (CMP-203)', () => {
  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });
  afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s: zero renders after settle across 2000ms of fake time',
    async (_name, subject) => {
      let commits = 0;
      const onRender = () => { commits += 1; };
      render(
        <React.Profiler id="idle" onRender={onRender}>
          {subject.mount!()}
        </React.Profiler>,
      );
      await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
      const settled = commits;
      jest.useFakeTimers();
      act(() => { jest.advanceTimersByTime(2000); });
      jest.useRealTimers();
      expect(commits).toBe(settled);
    }
  );

  it('PENDING: seam subjects covered once 3f/3i components land', () => {
    if (SEAM_SUBJECTS.length > 0) {
      throw new Error(`PENDING: idle rows for ${SEAM_SUBJECTS.map((s) => s.name).join(', ')} — components land in lanes 3f/3i`);
    }
  });
});
