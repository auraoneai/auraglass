import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../sampleOwnedPixels', () => {
  const actual = jest.requireActual('../sampleOwnedPixels') as object;
  return { ...actual, sampleOwnedPixels: jest.fn(() => ({ mean: 0.9, p10: 0.8, p90: 1, stdev: 0.05 })) };
});
import { sampleOwnedPixels } from '../sampleOwnedPixels';
import { clearToneCache, getOrSampleTone } from '../toneCache';

const img = (src: string) => ({ currentSrc: src, src }) as unknown as HTMLImageElement;
const flush = async () => { await new Promise((r) => setTimeout(r, 20)); };

describe('toneCache (REQ-SURF-153)', () => {
  beforeEach(() => { (sampleOwnedPixels as jest.Mock).mockClear(); });
  it('100 calls same key → sampleOwnedPixels once', async () => {
    clearToneCache();
    const apply = jest.fn();
    const el = img('https://x/a.png');
    for (let i = 0; i < 100; i++) getOrSampleTone(el, undefined, apply);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith('light', 0.9);
  });
  it('evicts the oldest entry at the 65th insert', async () => {
    clearToneCache();
    const apply = jest.fn();
    for (let i = 0; i < 65; i++) getOrSampleTone(img(`https://x/${i}.png`), undefined, apply);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(65);
    // 0.png was evicted → sampling it again calls the sampler a 66th time
    getOrSampleTone(img('https://x/0.png'), undefined, apply);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(66);
    // 64.png still cached → no new sample
    getOrSampleTone(img('https://x/64.png'), undefined, apply);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(66);
  });
  it('region participates in the cache key', async () => {
    clearToneCache();
    const apply = jest.fn();
    const el = img('https://x/r.png');
    getOrSampleTone(el, undefined, apply);
    getOrSampleTone(el, { x: 0, y: 0, width: 50, height: 50 }, apply);
    await flush();
    expect(sampleOwnedPixels).toHaveBeenCalledTimes(2);
  });
});
