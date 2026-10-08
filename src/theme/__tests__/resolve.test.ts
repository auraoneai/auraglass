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

  it('1024-case cartesian product never resolves below any floor', () => {
    const bits = [false, true];
    const opts = ['system', 'glass', 'tinted', 'solid'] as const;
    const cases: Array<{
      os: OsSignals; app: Transparency | 'system'; user: Transparency | 'system';
      floor: number;
    }> = [];
    for (const fc of bits) for (const cm of bits) for (const rt of bits)
      for (const rm of bits) for (const dk of bits) for (const co of bits)
        for (const app of opts) for (const user of opts) {
          const os: OsSignals = {
            forcedColors: fc, contrastMore: cm, reducedTransparency: rt,
            reducedMotion: rm, schemeDark: dk, coarsePointer: co,
          };
          cases.push({
            os, app, user,
            floor: Math.max(
              fc ? 2 : cm || rt ? 1 : 0,
              RANK[app === 'system' ? 'glass' : app],
              RANK[user === 'system' ? 'glass' : user],
            ),
          });
        }
    expect(cases).toHaveLength(1024);
    for (const c of cases) {
      const resolved = resolveTransparency(c.os, true, c.app, c.user);
      expect(RANK[resolved]).toBeGreaterThanOrEqual(c.floor);
      // forced colors is absolute
      if (c.os.forcedColors) expect(resolved).toBe('solid');
      // without capability the floor is solid regardless of requests
      if (!c.os.forcedColors) expect(resolveTransparency(c.os, false, c.app, c.user)).toBe('solid');
    }
  });
});
