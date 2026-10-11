import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { MediaControls } from '../MediaControls/MediaControls';
import { sizeForWidth } from '../MediaControls/MediaControls';

beforeAll(() => {
  (window as { PointerEvent?: unknown }).PointerEvent = window.MouseEvent;
});

/* ResizeObserver stub: resize(width) delivers one entry to every observer. */
const observers: { cb: ResizeObserverCallback; el: Element | null }[] = [];
function installResizeObserver() {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    private rec: { cb: ResizeObserverCallback; el: Element | null };
    constructor(cb: ResizeObserverCallback) { this.rec = { cb, el: null }; observers.push(this.rec); }
    observe(el: Element) { this.rec.el = el; }
    unobserve() {}
    disconnect() { this.rec.el = null; }
  };
}
function resize(width: number) {
  act(() => {
    for (const o of observers) {
      if (!o.el) continue;
      o.cb([{ target: o.el, contentRect: { width } as DOMRectReadOnly, contentBoxSize: [{ inlineSize: width, blockSize: 44 }] } as unknown as ResizeObserverEntry], {} as ResizeObserver);
    }
  });
}
afterEach(() => {
  observers.length = 0;
  delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
});

const parts = (c: HTMLElement) => [...c.querySelectorAll('[role="toolbar"] [data-ag-part^="media-"]')]
  .map((e) => e.getAttribute('data-ag-part'))
  .filter((p) => /^media-(play|scrubber|time|volume|mute|rate|captions|pip|fullscreen|spacer|more)$/.test(p!));

function Full() {
  return (
    <MediaControls.Root playing={false} onPlayingChange={() => {}} duration={372} currentTime={92}
      textTracks={[{ id: 'en', label: 'English', language: 'en', kind: 'captions', mode: 'disabled' }]}>
      <MediaControls.PlayButton />
      <MediaControls.Scrubber />
      <MediaControls.Time />
      <MediaControls.Volume />
      <MediaControls.Rate />
      <MediaControls.Captions />
      <MediaControls.PictureInPicture />
      <MediaControls.Fullscreen />
    </MediaControls.Root>
  );
}

describe('MediaControls parts (REQ-SURF-134/135)', () => {
  it('Root is a toolbar with aria-label, data-state and the variant/refraction material attributes', () => {
    const { container } = render(<MediaControls.Root playing={false} onPlayingChange={() => {}} refraction />);
    const root = container.querySelector('[role="toolbar"]')!;
    expect(root.getAttribute('aria-label')).toBe('Media controls');
    expect(root.getAttribute('data-ag-part')).toBe('media-controls');
    expect(root.getAttribute('data-state')).toBe('paused');
    expect(root.getAttribute('data-ag-variant')).toBe('clear');
    expect(root.hasAttribute('data-ag-refraction')).toBe(true);
    const plain = render(<MediaControls.Root playing={false} variant="regular" />).container.querySelector('[role="toolbar"]')!;
    expect(plain.getAttribute('data-ag-variant')).toBe('regular');
    expect(plain.hasAttribute('data-ag-refraction')).toBe(false);
  });
  it('the toolbar sits in a container wrapper (ag-media-controls-frame)', () => {
    const { container } = render(<MediaControls.Root playing />);
    const frame = container.querySelector('.ag-media-controls-frame') as HTMLElement;
    expect(frame.contains(container.querySelector('[role="toolbar"]'))).toBe(true);
    expect(frame.getAttribute('data-ag-media-size')).toBe('full');
  });
  it('every part renders its data-ag-part marker', () => {
    const { container } = render(
      <MediaControls.Root playing={false} onPlayingChange={() => {}}>
        <MediaControls.PlayButton />
        <MediaControls.Scrubber />
        <MediaControls.Time />
        <MediaControls.Volume />
        <MediaControls.Mute />
        <MediaControls.Rate />
        <MediaControls.Captions />
        <MediaControls.PictureInPicture />
        <MediaControls.Fullscreen />
        <MediaControls.Spacer />
      </MediaControls.Root>,
    );
    for (const part of ['media-play', 'media-scrubber', 'media-time', 'media-volume', 'media-mute',
      'media-rate', 'media-pip', 'media-fullscreen', 'media-spacer']) {
      expect(container.querySelector(`[data-ag-part="${part}"]`)).toBeTruthy();
    }
    // Captions renders nothing with 0 tracks; More only exists below 480 px
    expect(container.querySelector('[data-ag-part="media-captions"]')).toBeNull();
    expect(container.querySelector('[data-ag-part="media-more"]')).toBeNull();
  });
  it('media + playing together → dev error', () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(
      <MediaControls.Root media={{} as never} playing={false} />,
    )).toThrow(/either `media` or controlled/);
    err.mockRestore();
  });
  it('default children = PlayButton, Scrubber, Time, Volume', () => {
    const { container } = render(<MediaControls.Root playing />);
    expect(parts(container)).toEqual(['media-play', 'media-scrubber', 'media-time', 'media-volume']);
  });
  it('roving tabindex: exactly one tabindex=0; ArrowRight/End/Home move focus among items', async () => {
    const { container } = render(<Full />);
    const toolbar = container.querySelector('[role="toolbar"]') as HTMLElement;
    // Base UI moves focus on a microtask after the key
    const press = async (key: string) => {
      fireEvent.keyDown(document.activeElement!, { key });
      await act(async () => {});
    };
    expect(toolbar.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    const play = toolbar.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    const fullscreen = toolbar.querySelector('[data-ag-part="media-fullscreen"]') as HTMLElement;
    expect(play.getAttribute('tabindex')).toBe('0');
    act(() => { play.focus(); });
    await press('ArrowRight');
    const scrubThumb = toolbar.querySelector('[data-ag-part="media-scrubber"] [data-ag-part="thumb"] input');
    expect(document.activeElement).toBe(scrubThumb);
    expect(toolbar.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    await press('End'); // the slider owns End while focused
    expect(document.activeElement).toBe(scrubThumb);
    act(() => { play.focus(); });
    await press('End');
    expect(document.activeElement).toBe(fullscreen);
    await press('Home');
    expect(document.activeElement).toBe(play);
    await press('ArrowLeft'); // loop
    expect(document.activeElement).toBe(fullscreen);
    expect(toolbar.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
  });
  it('a focused scrubber keeps ArrowRight for seeking (focus stays, value steps)', () => {
    const onSeek = jest.fn();
    const { container } = render(
      <MediaControls.Root playing={false} onSeek={onSeek} currentTime={10} duration={100}>
        <MediaControls.PlayButton /><MediaControls.Scrubber /><MediaControls.Mute />
      </MediaControls.Root>,
    );
    const thumb = container.querySelector('[data-ag-part="media-scrubber"] [data-ag-part="thumb"] input') as HTMLElement;
    act(() => { thumb.focus(); });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(thumb);
    expect(onSeek).toHaveBeenCalledWith(11);
  });
  it('size classes: ≥480 full, 320–479 compact, <320 minimal', () => {
    expect(sizeForWidth(480)).toBe('full');
    expect(sizeForWidth(479)).toBe('compact');
    expect(sizeForWidth(320)).toBe('compact');
    expect(sizeForWidth(319)).toBe('minimal');
  });
  it('<480 px: Volume → Mute, Rate/PiP move into a "More" menu, Time shows elapsed only', () => {
    installResizeObserver();
    const { container } = render(<Full />);
    resize(1000);
    expect(parts(container)).toEqual(['media-play', 'media-scrubber', 'media-time', 'media-volume', 'media-rate',
      'media-captions', 'media-pip', 'media-fullscreen']);
    expect(container.querySelector('[data-ag-part="media-time"]')!.textContent).toBe('1:32 / 6:12');
    resize(400);
    expect(container.querySelector('.ag-media-controls-frame')!.getAttribute('data-ag-media-size')).toBe('compact');
    expect(parts(container)).toEqual(['media-play', 'media-scrubber', 'media-time', 'media-mute',
      'media-captions', 'media-fullscreen', 'media-more']);
    expect(container.querySelector('[data-ag-part="media-time"]')!.textContent).toBe('1:32');
    const more = container.querySelector('[data-ag-part="media-more"]') as HTMLElement;
    expect(more.getAttribute('aria-label')).toBe('More');
    expect(more.getAttribute('aria-haspopup')).toBe('menu');
    expect(container.querySelector('[role="toolbar"]')!.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
  });
  it('<320 px: Play + Scrubber only', () => {
    installResizeObserver();
    const { container } = render(<Full />);
    resize(300);
    expect(parts(container)).toEqual(['media-play', 'media-scrubber']);
  });
  it('"More" offers the rates and PiP and drives them', async () => {
    installResizeObserver();
    const onRate = jest.fn();
    const { container } = render(
      <MediaControls.Root playing={false} onRateChange={onRate} playbackRate={1}>
        <MediaControls.PlayButton /><MediaControls.Rate /><MediaControls.PictureInPicture />
      </MediaControls.Root>,
    );
    resize(400);
    fireEvent.click(container.querySelector('[data-ag-part="media-more"]')!);
    await act(async () => {});
    const items = [...document.querySelectorAll('[role="menuitemradio"]')].map((e) => e.textContent);
    expect(items).toEqual(['Speed 0.5×', 'Speed 0.75×', 'Speed 1×', 'Speed 1.25×', 'Speed 1.5×', 'Speed 2×']);
    expect([...document.querySelectorAll('[role="menuitem"]')].map((e) => e.textContent)).toEqual(['Picture in picture']);
    fireEvent.click([...document.querySelectorAll('[role="menuitemradio"]')][4]!);
    expect(onRate).toHaveBeenCalledWith(1.5);
  });
  it('Time is aria-hidden only when a Scrubber is in the same Root', () => {
    const withScrubber = render(
      <MediaControls.Root playing={false} duration={100}><MediaControls.Scrubber /><MediaControls.Time /></MediaControls.Root>,
    ).container.querySelector('[data-ag-part="media-time"]')!;
    expect(withScrubber.getAttribute('aria-hidden')).toBe('true');
    const alone = render(
      <MediaControls.Root playing={false} duration={92}><MediaControls.Time /></MediaControls.Root>,
    ).container.querySelector('[data-ag-part="media-time"]')!;
    expect(alone.hasAttribute('aria-hidden')).toBe(false);
    expect(alone.getAttribute('datetime')).toBe('PT0S');
  });
});
