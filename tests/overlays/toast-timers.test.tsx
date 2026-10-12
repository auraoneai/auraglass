/* REQ-CMP-108: toast timer semantics — action toasts never auto-dismiss,
   progress derives duration from --_ag-toast-timeout, hover/focus/hidden
   pauses bars, progress is decorative (no progressbar role). The toast
   surface part is 'toast' (Toast.meta parts, S-30/S-33). */
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { Toast, useToast } from '../../src/components/toast';

function Sink({ options }: { options: Parameters<ReturnType<typeof useToast>['add']>[0] }) {
  const t = useToast();
  const fired = React.useRef(false);
  React.useEffect(() => { if (!fired.current) { fired.current = true; t.add(options); } }, [t, options]);
  return null;
}

const Toasts = () => {
  const t = useToast();
  return (
    <Toast.Viewport>
      {t.toasts.map((toast: any) => (
        <Toast.Root key={toast.id} toast={toast}><span>x</span></Toast.Root>
      ))}
    </Toast.Viewport>
  );
};

const ProgressToasts = () => {
  const t = useToast();
  return (
    <Toast.Viewport>
      {t.toasts.map((toast: any) => (
        <Toast.Root key={toast.id} toast={toast}><span>x</span><Toast.Progress /></Toast.Root>
      ))}
    </Toast.Viewport>
  );
};

const Host = ({ options }: { options: Parameters<ReturnType<typeof useToast>['add']>[0] }) => (
  <Toast.Provider>
    <Sink options={options} />
    <Toasts />
  </Toast.Provider>
);

describe('toast timers (REQ-CMP-108)', () => {
  afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

  it('toast with actionLabel + no timeout stays open past provider timeout', async () => {
    jest.useFakeTimers();
    render(<Host options={{ title: 'Undo?', actionLabel: 'Undo', onAction: () => {} }} />);
    await act(async () => {});
    act(() => { jest.advanceTimersByTime(6000); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="toast"]')).not.toBeNull();
  });

  it('toast without action auto-dismisses on the provider timeout', async () => {
    jest.useFakeTimers();
    render(<Host options={{ title: 'Plain' }} />);
    await act(async () => {});
    act(() => { jest.advanceTimersByTime(6000); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="toast"]')).toBeNull();
  });

  it('root carries --_ag-toast-timeout for the progress animation', async () => {
    render(<Host options={{ title: 'Timed', timeout: 2500 }} />);
    await act(async () => {});
    const root = document.querySelector('[data-ag-part="toast"]');
    expect(root?.getAttribute('style') ?? '').toContain('--_ag-toast-timeout');
  });

  it('viewport-level pause selectors exist in Toast.css', () => {
    const css = require('fs').readFileSync(require('path').join(__dirname, '../../src/components/toast/Toast.css'), 'utf8');
    expect(css).toContain('.ag-toast-viewport:hover .ag-toast-progress-bar');
    expect(css).toContain('[data-paused] .ag-toast-progress-bar');
    expect(css).toContain('animation-play-state: paused');
  });

  it('document.hidden sets data-paused on the viewport', async () => {
    render(<Host options={{ title: 'x' }} />);
    await act(async () => {});
    const viewport = document.querySelector('.ag-toast-viewport');
    expect(viewport?.hasAttribute('data-paused')).toBe(false);
    const spy = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await act(async () => {});
    expect(viewport?.hasAttribute('data-paused')).toBe(true);
  });

  /* The legs below drive Base UI's real timer (fake timers, 3000 ms toast)
     rather than the CSS: each pause source must keep the toast mounted past
     its timeout, and releasing it must let the remaining time run out. */
  const TIMED = { title: 'Timed', timeout: 3000 } as const;
  const toastEl = () => document.querySelector('[data-ag-part="toast"]');
  const viewportEl = () => document.querySelector('[data-ag-part="viewport"]') as HTMLElement;
  async function advance(ms: number) {
    act(() => { jest.advanceTimersByTime(ms); });
    await act(async () => {});
  }

  it('hovering the viewport pauses the timer; leaving resumes it', async () => {
    jest.useFakeTimers();
    render(<Host options={TIMED} />);
    await act(async () => {});
    fireEvent.mouseEnter(viewportEl());
    await advance(6000);
    expect(toastEl()).not.toBeNull();
    fireEvent.mouseLeave(viewportEl());
    await advance(6000);
    expect(toastEl()).toBeNull();
  });

  it('focus within the viewport pauses the timer', async () => {
    jest.useFakeTimers();
    render(<Host options={TIMED} />);
    await act(async () => {});
    // Base UI pauses on focus only when it is focus-visible (keyboard): F6 is
    // its documented keyboard route into the viewport.
    act(() => { fireEvent.keyDown(window, { key: 'F6' }); });
    expect(document.activeElement).toBe(viewportEl());
    await advance(6000);
    expect(toastEl()).not.toBeNull();
  });

  it('document hidden pauses the timer; visible again resumes it', async () => {
    jest.useFakeTimers();
    render(<><button type="button">page</button><Host options={TIMED} /></>);
    await act(async () => {});
    // The page has focus (jsdom: document.hasFocus() needs a focused element)
    // but no window blur arrives — hidden-while-focused is the case Base UI misses.
    act(() => { (document.querySelector('button') as HTMLElement).focus(); });
    expect(document.hasFocus()).toBe(true);
    const hidden = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await advance(6000);
    expect(toastEl()).not.toBeNull();
    hidden.mockReturnValue(false);
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await advance(6000);
    expect(toastEl()).toBeNull();
  });

  it('countdown makes 0 React commits (progress is a CSS animation)', async () => {
    jest.useFakeTimers();
    const onRender = jest.fn();
    render(
      <React.Profiler id="toasts" onRender={onRender}>
        <Host options={{ title: 'Counting', timeout: 5000 }} />
      </React.Profiler>,
    );
    await act(async () => {});
    await advance(50); // let Base UI settle the 'starting' transition status
    onRender.mockClear();
    await advance(4000);
    expect(toastEl()).not.toBeNull();
    expect(onRender).toHaveBeenCalledTimes(0);
  });

  it('Toast.Progress renders decorative (aria-hidden, no progressbar role)', async () => {
    render(
      <Toast.Provider>
        <Sink options={{ title: 'With bar', timeout: 4000 }} />
        <ProgressToasts />
      </Toast.Provider>,
    );
    await act(async () => {});
    const bar = document.querySelector('[data-ag-part="progress"]');
    expect(bar).not.toBeNull();
    expect(bar!.getAttribute('aria-hidden')).toBe('true');
    expect(document.querySelector('[role="progressbar"]')).toBeNull();
  });
});
