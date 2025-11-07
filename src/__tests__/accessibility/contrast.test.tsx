/**
 * Accessibility - Contrast Tests
 * Week 5: WCAG 2.1 Compliance Validation
 */

import { describe, it, expect } from '@jest/globals';
import {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsWCAG,
  getTextColorForBackground,
  adjustColorForContrast,
} from '../../utils/contrast';

describe('Contrast Utilities - WCAG 2.1 Compliance', () => {
  describe('Color Conversion', () => {
    it('converts hex to RGB correctly', () => {
      const white = hexToRgb('#ffffff');
      expect(white).toEqual({ r: 255, g: 255, b: 255 });

      const black = hexToRgb('#000000');
      expect(black).toEqual({ r: 0, g: 0, b: 0 });

      const blue = hexToRgb('#3b82f6');
      expect(blue).toEqual({ r: 59, g: 130, b: 246 });
    });

    it('handles hex colors without #', () => {
      const red = hexToRgb('ff0000');
      expect(red).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('returns null for invalid hex', () => {
      const invalid = hexToRgb('invalid');
      expect(invalid).toBeNull();
    });
  });

  describe('Luminance Calculation', () => {
    it('calculates luminance for white correctly', () => {
      const luminance = getLuminance(255, 255, 255);
      expect(luminance).toBeCloseTo(1, 2);
    });

    it('calculates luminance for black correctly', () => {
      const luminance = getLuminance(0, 0, 0);
      expect(luminance).toBeCloseTo(0, 2);
    });

    it('calculates luminance for mid-gray correctly', () => {
      const luminance = getLuminance(128, 128, 128);
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });
  });

  describe('Contrast Ratio - WCAG Standards', () => {
    it('calculates 21:1 ratio for black on white', () => {
      const black = { r: 0, g: 0, b: 0 };
      const white = { r: 255, g: 255, b: 255 };
      const ratio = getContrastRatio(black, white);

      expect(ratio).toBeCloseTo(21, 0);
    });

    it('calculates 1:1 ratio for identical colors', () => {
      const color = { r: 128, g: 128, b: 128 };
      const ratio = getContrastRatio(color, color);

      expect(ratio).toBeCloseTo(1, 2);
    });

    it('calculates correct ratio for blue on white', () => {
      const blue = { r: 59, g: 130, b: 246 };
      const white = { r: 255, g: 255, b: 255 };
      const ratio = getContrastRatio(blue, white);

      expect(ratio).toBeGreaterThan(3);
    });
  });

  describe('WCAG Compliance - AA Level', () => {
    it('passes AA for 4.5:1 ratio on normal text', () => {
      const passes = meetsWCAG(4.5, 'AA', 'normal');
      expect(passes).toBe(true);
    });

    it('fails AA for 4.4:1 ratio on normal text', () => {
      const passes = meetsWCAG(4.4, 'AA', 'normal');
      expect(passes).toBe(false);
    });

    it('passes AA for 3:1 ratio on large text', () => {
      const passes = meetsWCAG(3, 'AA', 'large');
      expect(passes).toBe(true);
    });

    it('fails AA for 2.9:1 ratio on large text', () => {
      const passes = meetsWCAG(2.9, 'AA', 'large');
      expect(passes).toBe(false);
    });
  });

  describe('WCAG Compliance - AAA Level', () => {
    it('passes AAA for 7:1 ratio on normal text', () => {
      const passes = meetsWCAG(7, 'AAA', 'normal');
      expect(passes).toBe(true);
    });

    it('fails AAA for 6.9:1 ratio on normal text', () => {
      const passes = meetsWCAG(6.9, 'AAA', 'normal');
      expect(passes).toBe(false);
    });

    it('passes AAA for 4.5:1 ratio on large text', () => {
      const passes = meetsWCAG(4.5, 'AAA', 'large');
      expect(passes).toBe(true);
    });

    it('fails AAA for 4.4:1 ratio on large text', () => {
      const passes = meetsWCAG(4.4, 'AAA', 'large');
      expect(passes).toBe(false);
    });
  });

  describe('Text Color Selection', () => {
    it('selects white text for dark background', () => {
      const textColor = getTextColorForBackground('#000000');
      expect(textColor).toContain('255'); // white or close to white
    });

    it('selects dark text for light background', () => {
      const textColor = getTextColorForBackground('#ffffff');
      expect(textColor).toContain('0'); // black or close to black
    });

    it('selects appropriate text for mid-tone background', () => {
      const textColor = getTextColorForBackground('#808080');
      expect(textColor).toBeTruthy();
    });
  });

  describe('Color Adjustment for Contrast', () => {
    it('adjusts color to meet 4.5:1 ratio', () => {
      const adjusted = adjustColorForContrast('#888888', '#ffffff', 4.5);
      const adjustedRgb = hexToRgb(adjusted);
      const whiteRgb = { r: 255, g: 255, b: 255 };

      if (adjustedRgb) {
        const ratio = getContrastRatio(adjustedRgb, whiteRgb);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('does not modify color that already meets ratio', () => {
      const original = '#000000';
      const adjusted = adjustColorForContrast(original, '#ffffff', 4.5);

      // Black already has 21:1 with white, should not change
      expect(adjusted).toBe(original);
    });

    it('returns original for invalid colors', () => {
      const adjusted = adjustColorForContrast('invalid', '#ffffff', 4.5);
      expect(adjusted).toBe('invalid');
    });
  });

  describe('Real-World Color Combinations', () => {
    const testCases = [
      {
        name: 'Primary blue on white',
        fg: '#3b82f6',
        bg: '#ffffff',
        expectedAA: false, // Usually fails for normal text
        expectedAALarge: true,
      },
      {
        name: 'Dark gray on white',
        fg: '#374151',
        bg: '#ffffff',
        expectedAA: true,
        expectedAALarge: true,
      },
      {
        name: 'Light gray on white',
        fg: '#d1d5db',
        bg: '#ffffff',
        expectedAA: false,
        expectedAALarge: false,
      },
    ];

    testCases.forEach(({ name, fg, bg, expectedAA, expectedAALarge }) => {
      it(`validates ${name} for WCAG AA`, () => {
        const fgRgb = hexToRgb(fg);
        const bgRgb = hexToRgb(bg);

        if (fgRgb && bgRgb) {
          const ratio = getContrastRatio(fgRgb, bgRgb);
          const passesNormal = meetsWCAG(ratio, 'AA', 'normal');
          const passesLarge = meetsWCAG(ratio, 'AA', 'large');

          expect(passesNormal).toBe(expectedAA);
          expect(passesLarge).toBe(expectedAALarge);
        }
      });
    });
  });

  describe('ContrastGuard Integration', () => {
    it('maintains sufficient contrast for all theme colors', () => {
      // Test that theme colors meet minimum requirements
      const themeColors = [
        { name: 'Primary', color: '#3b82f6' },
        { name: 'Secondary', color: '#10b981' },
        { name: 'Accent', color: '#f59e0b' },
      ];

      themeColors.forEach(({ name, color }) => {
        const adjusted = adjustColorForContrast(color, '#ffffff', 4.5);
        const adjustedRgb = hexToRgb(adjusted);
        const whiteRgb = { r: 255, g: 255, b: 255 };

        if (adjustedRgb) {
          const ratio = getContrastRatio(adjustedRgb, whiteRgb);
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        }
      });
    });
  });
});
