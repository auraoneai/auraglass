/* MAT-263/264 (A11Y-022): pure resolver tests — no DOM access. The cartesian
   product over every OS-signal combination × app × user transparency is 1024
   cases; each resolved transparency must never sit below its floor. */
import { describe, expect, it } from '@jest/globals';
import {
  resolveTransparency, resolveContrast, resolveMotion, resolveScheme, resolvePreferences,
} from '../preferences/resolve';
import type { OsSignals, CapabilitySignals } from '../preferences/types';
import type { Transparency } from '../../contracts/material';

const RANK = { glass: 0, tinted: 1, solid: 2 } as const;

const noOs: OsSignals = {
  forcedColors: false, contrastMore: false, reducedTransparency: false,
  reducedMotion: false, schemeDark: false, coarsePointer: false,
};
const capYes: CapabilitySignals = { backdropFilter: true, saveData: false, deviceMemory: null };
const capNo: CapabilitySignals = { backdropFilter: false, saveData: false, deviceMemory: null };

describe('resolveTransparency', () => {
  it('is the max of OS floor, capability floor, app and user floors', () => {
    expect(resolveTransparency(noOs, true, 'glass', 'glass')).toBe('glass');
    expect(resolveTransparency({ ...noOs, reducedTransparency: true }, true, 'glass', 'glass')).toBe('tinted');
    expect(resolveTransparency({ ...noOs, contrastMore: true }, true, 'glass', 'glass')).toBe('tinted');
    expect(resolveTransparency(noOs, false, 'glass', 'glass')).toBe('solid');
    expect(resolveTransparency(noOs, true, 'solid', 'glass')).toBe('solid');
    expect(resolveTransparency(noOs, true, 'glass', 'tinted')).toBe('tinted');
  });

  it('glassOpacity 0.69 stays glass, 0.7 tinted', () => {
    expect(resolveTransparency(noOs, true, 'glass', 'glass', 0.69)).toBe('glass');
    expect(resolveTransparency(noOs, true, 'glass', 'glass', 0.7)).toBe('tinted');
    expect(resolveTransparency(noOs, true, 'glass', 'glass', 1)).toBe('tinted');
  });

  it('treats system as glass', () => {
    expect(resolveTransparency(noOs, true, 'system', 'system')).toBe('glass');
  });
});

describe('resolveContrast', () => {
  it('less and custom map to standard; never returns a non-contract value', () => {
    expect(resolveContrast(noOs, 'less')).toBe('standard');
    expect(resolveContrast(noOs, 'custom')).toBe('standard');
    expect(resolveContrast(noOs, 'more')).toBe('more');
    expect(resolveContrast(noOs, 'system')).toBe('standard');
    for (const v of ['less', 'custom', 'more', 'standard', 'system'] as const) {
      expect(['standard', 'more']).toContain(resolveContrast(noOs, v));
    }
  });

  it('OS contrast signals force more', () => {
    expect(resolveContrast({ ...noOs, contrastMore: true }, 'standard')).toBe('more');
    expect(resolveContrast({ ...noOs, forcedColors: true }, 'standard')).toBe('more');
    expect(resolveContrast({ ...noOs, contrastMore: true }, 'less')).toBe('more');
  });
});

describe('resolveMotion', () => {
  it('reduced-motion allows at most calm (REQ-MOT-20)', () => {
    const rm: OsSignals = { ...noOs, reducedMotion: true };
    expect(resolveMotion(rm, 'full')).toBe('calm');
    expect(resolveMotion(rm, 'none')).toBe('none');
    expect(resolveMotion(rm, 'calm')).toBe('calm');
  });

  it('takes the most restrictive of app and user', () => {
    expect(resolveMotion(noOs, 'none', 'full')).toBe('none');
    expect(resolveMotion(noOs, 'full', 'calm')).toBe('calm');
    expect(resolveMotion(noOs, 'system', 'system')).toBe('full');
  });
});

describe('resolveScheme', () => {
  it('user > app > OS', () => {
    expect(resolveScheme(noOs, 'light', 'dark')).toBe('dark');
    expect(resolveScheme({ ...noOs, schemeDark: true }, 'system', 'system')).toBe('dark');
    expect(resolveScheme(noOs, 'system', 'system')).toBe('light');
  });
});

describe('resolvePreferences', () => {
  it('forced colors is absolute: solid + more, whatever was requested', () => {
    const os: OsSignals = { ...noOs, forcedColors: true };
    const r = resolvePreferences({
      os, cap: capYes,
      app: { transparency: 'glass', contrast: 'less', motion: 'full' },
      user: { transparency: 'glass', contrast: 'standard' },
    });
    expect(r.transparency).toBe('solid');
    expect(r.contrast).toBe('more');
    expect(r.reasons).toContain('forced-colors');
  });

  it('clamps glassOpacity into 0..1', () => {
    expect(resolvePreferences({
      os: noOs, cap: capYes, user: { glassOpacity: 1.4 },
    }).glassOpacity).toBe(1);
    expect(resolvePreferences({
      os: noOs, cap: capYes, user: { glassOpacity: -0.5 },
    }).glassOpacity).toBe(0);
  });

  it('persists the user value while resolved stays at the floor', () => {
    const os: OsSignals = { ...noOs, contrastMore: true };
    const r = resolvePreferences({ os, cap: capYes, user: { transparency: 'glass' } });
    expect(r.transparency).toBe('tinted');
    expect(r.floors.transparency).toBe('tinted');
    expect(r.reasons).toContain('prefers-contrast-more');
  });

  it('resolved allowContinuous is never true without motion=full', () => {
    const r = resolvePreferences({
      os: { ...noOs, reducedMotion: true }, cap: capYes,
      app: { allowContinuous: true, motion: 'full' },
    });
    expect(r.allowContinuous).toBe(false);
    expect(resolvePreferences({
      os: noOs, cap: capYes, app: { allowContinuous: true },
    }).allowContinuous).toBe(true);
  });

  it('tier: saveData, or deviceMemory<=2 with coarse pointer, or a persisted/app value', () => {
    expect(resolvePreferences({
      os: noOs, cap: { ...capYes, saveData: true },
    }).tier).toBe('lightweight');
    expect(resolvePreferences({
      os: { ...noOs, coarsePointer: true }, cap: { ...capYes, deviceMemory: 2 },
    }).tier).toBe('lightweight');
    expect(resolvePreferences({
      os: noOs, cap: { ...capYes, deviceMemory: 2 },
    }).tier).toBe('standard');
    expect(resolvePreferences({
      os: noOs, cap: capYes, user: { tier: 'enhanced' },
    }).tier).toBe('enhanced');
  });

  it('app contrast more is not lowered by user standard (max, not override)', () => {
    const r = resolvePreferences({
      os: noOs, cap: capYes, app: { contrast: 'more' }, user: { contrast: 'standard' },
    });
    expect(r.contrast).toBe('more');
    expect(resolveContrast(noOs, 'more', 'standard')).toBe('more');
    expect(resolveContrast(noOs, 'standard', 'more')).toBe('more');
    expect(resolveContrast(noOs, 'more', 'less')).toBe('more');
    expect(resolveContrast(noOs, 'standard', 'standard')).toBe('standard');
  });

  it('app contrast more with no OS signals gives transparency tinted and reports the floor', () => {
    const r = resolvePreferences({ os: noOs, cap: capYes, app: { contrast: 'more' } });
    expect(r.transparency).toBe('tinted');
    expect(r.floors.transparency).toBe('tinted');
    expect(r.reasons).toContain('contrast-more');
    // contrast more never lowers an explicit solid
    expect(resolvePreferences({
      os: noOs, cap: capYes, user: { contrast: 'more', transparency: 'solid' },
    }).transparency).toBe('solid');
  });

  it('density spacious round-trips from user and app', () => {
    expect(resolvePreferences({ os: noOs, cap: capYes, user: { density: 'spacious' } }).density).toBe('spacious');
    expect(resolvePreferences({ os: noOs, cap: capYes, app: { density: 'spacious' } }).density).toBe('spacious');
    expect(resolvePreferences({
      os: noOs, cap: capYes, app: { density: 'spacious' }, user: { density: 'compact' },
    }).density).toBe('compact');
  });

  it('floors report the glass-opacity floor', () => {
    const r = resolvePreferences({ os: noOs, cap: capYes, user: { glassOpacity: 0.7 } });
    expect(r.floors.transparency).toBe('tinted');
    expect(r.reasons).toContain('glass-opacity');
  });

  it('NaN and non-number glassOpacity are treated as unset, never written as NaN', () => {
    const nan = resolvePreferences({ os: noOs, cap: capYes, user: { glassOpacity: Number.NaN } });
    expect(nan.glassOpacity).toBe(0);
    expect(nan.transparency).toBe('glass');
    // a NaN user value falls through to the app value
    expect(resolvePreferences({
      os: noOs, cap: capYes, app: { glassOpacity: 0.8 }, user: { glassOpacity: Number.NaN },
    }).glassOpacity).toBe(0.8);
    // persisted JSON may carry a string; it must not reach the clamp
    expect(resolvePreferences({
      os: noOs, cap: capYes, user: { glassOpacity: 'x' as unknown as number },
    }).glassOpacity).toBe(0);
    expect(resolvePreferences({
      os: noOs, cap: capYes, user: { glassOpacity: Number.POSITIVE_INFINITY },
    }).glassOpacity).toBe(1);
  });

  it('1,024-case exhaustive resolvePreferences loop never resolves below any floor', () => {
    // Dimensions (REQ-MAT-52): forcedColors(2) x contrastMore(2) x
    // reducedTransparency(2) x capability backdropFilter(2) x app(4) x user(4)
    // x glassOpacity {0, 0.69, 0.7, 1}(4) = 1,024.
    // app(i) carries transparency TS[i] + motion MOTIONS[i] + allowContinuous;
    // user(j) carries transparency TS[j] + contrast CONTRASTS[j] + glassOpacity.
    const bits = [false, true];
    const TS = ['system', 'glass', 'tinted', 'solid'] as const;
    const MOTIONS = ['system', 'none', 'calm', 'full'] as const;
    const CONTRASTS = ['system', 'standard', 'less', 'more'] as const;
    const OPACITIES = [0, 0.69, 0.7, 1] as const;
    const M_RANK = { none: 0, calm: 1, full: 2 } as const;
    const T_NAME = ['glass', 'tinted', 'solid'] as const;
    let n = 0;
    for (const fc of bits) for (const cm of bits) for (const rt of bits)
      for (const bf of bits) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
        for (const g of OPACITIES) {
          n++;
          const os: OsSignals = { ...noOs, forcedColors: fc, contrastMore: cm, reducedTransparency: rt };
          const cap: CapabilitySignals = bf ? capYes : capNo;
          const appT = TS[i]!; const userT = TS[j]!;
          const app = { transparency: appT, motion: MOTIONS[i]!, allowContinuous: true };
          const user = { transparency: userT, contrast: CONTRASTS[j]!, glassOpacity: g };
          const r = resolvePreferences({ os, cap, app, user });
          const label = JSON.stringify({ fc, cm, rt, bf, app, user });

          // independent oracle for §4.5
          const contrastMore = fc || cm || user.contrast === 'more';
          const floor = Math.max(
            fc ? 2 : cm || rt ? 1 : 0,
            bf ? 0 : 2,
            g >= 0.7 ? 1 : 0,
            contrastMore ? 1 : 0,
          );
          const requested = Math.max(
            RANK[appT === 'system' ? 'glass' : appT],
            RANK[userT === 'system' ? 'glass' : userT],
          );
          const expectedT = fc ? 'solid' : T_NAME[Math.max(floor, requested)]!;
          const expectedMotion = app.motion === 'system' ? 'full' : app.motion;

          expect([label, r.transparency]).toEqual([label, expectedT]);
          expect([label, r.contrast]).toEqual([label, contrastMore ? 'more' : 'standard']);
          expect([label, r.floors.transparency]).toEqual([label, T_NAME[floor]]);
          // no result below any floor
          expect(RANK[r.transparency]).toBeGreaterThanOrEqual(RANK[r.floors.transparency]);
          expect(M_RANK[r.motion]).toBeLessThanOrEqual(M_RANK[r.floors.motion]);
          // forced colours is absolute
          if (fc) {
            expect([label, r.transparency, r.contrast]).toEqual([label, 'solid', 'more']);
          }
          // allowContinuous is false unless motion is full
          expect([label, r.motion, r.allowContinuous]).toEqual(
            [label, expectedMotion, expectedMotion === 'full'],
          );
          // glassOpacity is clamped into [0, 1] and passed through unchanged here
          expect(r.glassOpacity).toBe(g);
          // reasons are non-empty whenever a floor is active
          if (r.floors.transparency !== 'glass' || r.floors.motion !== 'full') {
            expect([label, r.reasons.length > 0]).toEqual([label, true]);
          }
        }
    expect(n).toBe(1024);
  });
});
