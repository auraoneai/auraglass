/* REQ-QUAL-17 labels from pixels (QUAL, FIN-430): requested vs read-back values; any difference is label-mismatch. */
import { describe, expect, it } from '@jest/globals';
import { compareLabels, engineFromUa, labelsFrom, type Readback, type RequestedLabels } from '../src/evidence/readback';

const UA = {
  chromium: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.7339.16 Safari/537.36',
  webkit: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
  firefox: 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
};

const req: RequestedLabels = { scheme: 'dark', preference: 'default', engine: 'chromium', tier: 'standard', transparency: 'glass' };
const rb = (over: Partial<Readback['dataset']> = {}, media: Partial<Readback['media']> = {}, ua = UA.chromium): Readback => ({
  dataset: { scheme: 'dark', contrast: 'standard', transparency: 'glass', motion: 'full', tier: 'standard', engine: 'chromium', ...over },
  media: { dark: true, contrastMore: false, forcedColors: false, reducedMotion: false, ...media },
  userAgent: ua,
});

describe('engineFromUa', () => {
  it('recognises the three Playwright engines', () => {
    expect(engineFromUa(UA.chromium)).toBe('chromium');
    expect(engineFromUa(UA.webkit)).toBe('webkit');
    expect(engineFromUa(UA.firefox)).toBe('firefox');
    expect(engineFromUa('curl/8.0')).toBeNull();
  });
});

describe('compareLabels', () => {
  it('passes when every requested label reads back', () => {
    expect(compareLabels(req, rb()).status).toBe('pass');
    expect(compareLabels({ ...req, engine: 'firefox' }, rb({ engine: 'gecko' }, {}, UA.firefox)).status).toBe('pass');
  });
  it('fails on a scheme the page does not show', () => {
    const r = compareLabels(req, rb({ scheme: 'light' }, { dark: false }));
    expect(r.status).toBe('fail');
    expect(r.mismatches.join('\n')).toMatch(/scheme: requested dark/);
  });
  it('fails when forced-colors emulation silently did nothing', () => {
    const r = compareLabels({ ...req, preference: 'forced-colors', transparency: 'solid', tier: 'lightweight' },
      rb({ transparency: 'solid', tier: 'lightweight' }, { forcedColors: false }, UA.webkit));
    expect(r.detail).toMatch(/forced-colors emulation requested but \(forced-colors: active\) reads false/);
  });
  it('fails on contrast-more requested but only one of media/attribute reads it', () => {
    const r = compareLabels({ ...req, preference: 'contrast-more' }, rb({ contrast: 'more' }, { contrastMore: false }));
    expect(r.mismatches).toEqual(['preference: requested contrast-more, prefers-contrast: more reads false']);
  });
  it('fails when the browser is not the requested engine', () => {
    expect(compareLabels({ ...req, engine: 'webkit' }, rb()).detail).toMatch(/engine: requested webkit, user agent reads chromium/);
  });
  it('fails on tier and transparency differences', () => {
    const r = compareLabels(req, rb({ tier: 'lightweight', transparency: 'solid' }));
    expect(r.mismatches).toHaveLength(2);
  });
});

describe('labelsFrom (recorded labels are read back, never copied)', () => {
  it('derives preference from media and dataset', () => {
    expect(labelsFrom(rb()).preference).toBe('default');
    expect(labelsFrom(rb({ motion: 'none' }, { reducedMotion: true })).preference).toBe('reduced-motion');
    expect(labelsFrom(rb({}, { forcedColors: true, contrastMore: true })).preference).toBe('mixed');
    expect(labelsFrom(rb({}, {}, UA.webkit)).engine).toBe('webkit');
  });
});
