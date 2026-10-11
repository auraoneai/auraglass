import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../sampling/sampleOwnedPixels', () => {
  const actual = jest.requireActual('../sampling/sampleOwnedPixels') as object;
  return {
    ...actual,
    sampleOwnedPixels: jest.fn((el: HTMLImageElement) =>
      el.src.endsWith('/dark.png')
        ? { mean: 0.1, p10: 0.02, p90: 0.2, stdev: 0.05 }
        : { mean: 0.9, p10: 0.8, p90: 1, stdev: 0.05 }),
  };
});
import { act, fireEvent, render } from '@testing-library/react';
import { sampleOwnedPixels } from '../sampling/sampleOwnedPixels';
import { clearToneCache } from '../sampling/toneCache';
import { NowPlayingBar } from '../NowPlayingBar/NowPlayingBar';

const flush = async () => { await act(async () => { await new Promise((r) => setTimeout(r, 20)); }); };

const bar = (src: string, sampleTone = true) => (
  <NowPlayingBar.Root playing={false} artwork={src} sampleTone={sampleTone}>
    <NowPlayingBar.Artwork />
    <NowPlayingBar.Title>Track</NowPlayingBar.Title>
  </NowPlayingBar.Root>
);

describe('NowPlayingBar sampleTone (REQ-SURF-139)', () => {
  beforeEach(() => { clearToneCache(); (sampleOwnedPixels as jest.Mock).mockClear(); });

  it('samples the Artwork <img> once per src and writes data-ag-media-tone + --_ag-media-luma on the root', async () => {
    const { container, rerender } = render(bar('https://example.test/light.png'));
    const root = container.querySelector('[data-ag-part="now-playing"]') as HTMLElement;
    const img = container.querySelector('img')!;
    expect(img.getAttribute('crossorigin')).toBe('anonymous');
    expect(sampleOwnedPixels).not.toHaveBeenCalled();
    fireEvent.load(img);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(1);
    expect((sampleOwnedPixels as jest.Mock).mock.calls[0]![0]).toBe(img);
    expect(root.getAttribute('data-ag-media-tone')).toBe('light');
    expect(root.style.getPropertyValue('--_ag-media-luma')).toBe('0.900');

    // same src again (re-render + a second load event): served from the cache, never re-sampled
    rerender(bar('https://example.test/light.png'));
    fireEvent.load(img);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(1);

    // new src → sampled once more, tone follows
    rerender(bar('https://example.test/dark.png'));
    fireEvent.load(container.querySelector('img')!);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(2);
    expect(root.getAttribute('data-ag-media-tone')).toBe('dark');
    expect(root.style.getPropertyValue('--_ag-media-luma')).toBe('0.100');

    // back to the first src: cached result, no third sample
    rerender(bar('https://example.test/light.png'));
    fireEvent.load(container.querySelector('img')!);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(2);
    expect(root.getAttribute('data-ag-media-tone')).toBe('light');
  });

  it('without sampleTone nothing is sampled and no tone is written', async () => {
    const { container } = render(bar('https://example.test/light.png', false));
    fireEvent.load(container.querySelector('img')!);
    await flush();
    expect(sampleOwnedPixels).not.toHaveBeenCalled();
    const root = container.querySelector('[data-ag-part="now-playing"]')!;
    expect(root.hasAttribute('data-ag-media-tone')).toBe(false);
  });

  it('unmount before the idle sample lands writes nothing and removes the load listener', async () => {
    const { container, unmount } = render(bar('https://example.test/light.png'));
    const root = container.querySelector('[data-ag-part="now-playing"]') as HTMLElement;
    const img = container.querySelector('img')!;
    fireEvent.load(img);
    unmount();
    await flush();
    expect(root.hasAttribute('data-ag-media-tone')).toBe(false);
  });
});
