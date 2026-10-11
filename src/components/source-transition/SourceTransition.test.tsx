/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { SourceTransition } from './SourceTransition';
import * as motion from '../../motion';

// Real MAT startMorph is a frozen ESM export — spyOn can't redefine it, so
// wrap it with a transparent jest.fn at the module seam instead.
jest.mock('../../motion', () => {
  const actual = jest.requireActual<typeof import('../../motion')>('../../motion');
  return { ...actual, startMorph: jest.fn(actual.startMorph) };
});

describe('SourceTransition (SURF-091)', () => {
  it('moves the view-transition-name to the destination on activate', async () => {
    render(
      <SourceTransition.Root>
        <SourceTransition.Source id="s1">src</SourceTransition.Source>
        <SourceTransition.Destination id="s1">dest</SourceTransition.Destination>
      </SourceTransition.Root>,
    );
    const src = document.querySelector('[data-ag-part="source"]') as HTMLElement;
    expect(src.style.viewTransitionName).toBe('');
    await act(async () => {
      fireEvent.click(src);
    });
    // transition ran through startMorph: name cleared again post-update
    expect(src.style.viewTransitionName).toBe('');
    const dest = document.querySelector('[data-ag-part="destination"]') as HTMLElement;
    expect(dest.style.opacity).toBe('1');
  });

  it('focus follows the morph to the destination', async () => {
    render(
      <SourceTransition.Root>
        <SourceTransition.Source id="s1">
          <button type="button">go</button>
        </SourceTransition.Source>
        <SourceTransition.Destination id="s1">
          <a href="/x">land</a>
        </SourceTransition.Destination>
      </SourceTransition.Root>,
    );
    const btn = screen.getByRole('button', { name: 'go' });
    btn.focus();
    await act(async () => {
      fireEvent.click(btn.parentElement!);
    });
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'land' }));
  });

  it('routes through the MAT startMorph seam', async () => {
    const spy = motion.startMorph as unknown as jest.Mock;
    spy.mockClear();
    render(
      <SourceTransition.Root>
        <SourceTransition.Source id="s1">src</SourceTransition.Source>
        <SourceTransition.Destination id="s1">dest</SourceTransition.Destination>
      </SourceTransition.Root>,
    );
    await act(async () => {
      fireEvent.click(document.querySelector('[data-ag-part="source"]')!);
    });
    expect(spy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// REQ-FIN-82 follow-ups on merged #362 (SURF-64/65) + FIN-D D.3-29 startMorph
// consumer transfer.
// ---------------------------------------------------------------------------
type VTInit = { update: () => void | Promise<void>; types?: string[] } | (() => void | Promise<void>);

function mockViewTransitions() {
  const seen: Array<{ phase: 'old' | 'update' | 'after'; source: string; dest: string }> = [];
  let resolveFinished!: () => void;
  const finished = new Promise<void>((r) => {
    resolveFinished = r;
  });
  const snap = (phase: 'old' | 'update' | 'after') => {
    const source = document.querySelector<HTMLElement>('[data-ag-part="source"]')!;
    const dest = document.querySelector<HTMLElement>('[data-ag-part="destination"]')!;
    seen.push({ phase, source: source.style.viewTransitionName, dest: dest.style.viewTransitionName });
  };
  const start = jest.fn((init: VTInit) => {
    snap('old'); // the browser captures the old snapshot before the update
    const update = typeof init === 'function' ? init : init.update;
    const done = Promise.resolve().then(update).then(() => snap('update'));
    void done.then(() => resolveFinished());
    return { finished, updateCallbackDone: done, ready: done, skipTransition: () => {} };
  });
  (document as unknown as { startViewTransition?: unknown }).startViewTransition = start;
  return {
    seen,
    start,
    restore: () => {
      delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
    },
  };
}

const Pair = ({ id = 's1', withFocusables = false }: { id?: string; withFocusables?: boolean }) => (
  <SourceTransition.Root>
    <SourceTransition.Source id={id}>{withFocusables ? <button type="button">go</button> : 'src'}</SourceTransition.Source>
    <SourceTransition.Destination id={id}>{withFocusables ? <a href="/x">land</a> : 'dest'}</SourceTransition.Destination>
  </SourceTransition.Root>
);

describe('SourceTransition SURF-64: name allocation and cleanup (mocked startViewTransition)', () => {
  it('source named for the old snapshot, destination inside the update, both cleared after finished', async () => {
    const vt = mockViewTransitions();
    try {
      render(<Pair />);
      await act(async () => {
        fireEvent.click(document.querySelector('[data-ag-part="source"]')!);
      });
      await act(async () => {
        await Promise.resolve();
      });
      expect(vt.start).toHaveBeenCalledTimes(1);
      const old = vt.seen.find((s) => s.phase === 'old')!;
      const upd = vt.seen.find((s) => s.phase === 'update')!;
      expect(old).toEqual({ phase: 'old', source: 'ag-src-s1', dest: '' });
      expect(upd).toEqual({ phase: 'update', source: '', dest: 'ag-src-s1' });
      const source = document.querySelector<HTMLElement>('[data-ag-part="source"]')!;
      const dest = document.querySelector<HTMLElement>('[data-ag-part="destination"]')!;
      expect(source.style.viewTransitionName).toBe('');
      expect(dest.style.viewTransitionName).toBe('');
    } finally {
      vt.restore();
    }
  });

  it('two Sources with the same id log a dev error', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(
        <SourceTransition.Root>
          <SourceTransition.Source id="dup">a</SourceTransition.Source>
          <SourceTransition.Source id="dup">b</SourceTransition.Source>
        </SourceTransition.Root>,
      );
      const dupErrors = err.mock.calls.filter((c) => String(c[0]).includes('duplicate Source id "dup"'));
      expect(dupErrors).toHaveLength(1);
    } finally {
      err.mockRestore();
    }
  });

  it('distinct ids log nothing', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(
        <SourceTransition.Root>
          <SourceTransition.Source id="a">a</SourceTransition.Source>
          <SourceTransition.Source id="b">b</SourceTransition.Source>
        </SourceTransition.Root>,
      );
      expect(err.mock.calls.filter((c) => String(c[0]).includes('SourceTransition'))).toEqual([]);
    } finally {
      err.mockRestore();
    }
  });

  it("composes the consumer's onClick (and preventDefault opts out)", async () => {
    const spy = motion.startMorph as unknown as jest.Mock;
    const consumer = jest.fn();
    render(
      <SourceTransition.Root>
        <SourceTransition.Source id="s1" onClick={consumer}>src</SourceTransition.Source>
        <SourceTransition.Source id="s2" onClick={(e: React.MouseEvent) => e.preventDefault()}>skip</SourceTransition.Source>
        <SourceTransition.Destination id="s1">dest</SourceTransition.Destination>
      </SourceTransition.Root>,
    );
    spy.mockClear();
    await act(async () => {
      fireEvent.click(screen.getByText('src'));
    });
    expect(consumer).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    await act(async () => {
      fireEvent.click(screen.getByText('skip'));
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('SourceTransition SURF-65: surfaces + focus', () => {
  it('startMorph receives surfaces [source, destination] and the ag-src name', async () => {
    const spy = motion.startMorph as unknown as jest.Mock;
    render(<Pair />);
    spy.mockClear();
    await act(async () => {
      fireEvent.click(document.querySelector('[data-ag-part="source"]')!);
    });
    expect(spy).toHaveBeenCalledTimes(1);
    const opts = spy.mock.calls[0]![1] as { surfaces: Element[]; name: string };
    expect(opts.surfaces).toEqual([
      document.querySelector('[data-ag-part="source"]'),
      document.querySelector('[data-ag-part="destination"]'),
    ]);
    expect(opts.name).toBe('ag-src-s1');
  });

  it('focus follows morph only when the source had focus', async () => {
    render(
      <>
        <button type="button">elsewhere</button>
        <Pair withFocusables />
      </>,
    );
    const elsewhere = screen.getByRole('button', { name: 'elsewhere' });
    elsewhere.focus();
    await act(async () => {
      fireEvent.click(document.querySelector('[data-ag-part="source"]')!);
    });
    expect(document.activeElement).toBe(elsewhere);
  });
});
