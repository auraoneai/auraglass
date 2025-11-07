/**
 * AuraGlass Contrast Utilities
 * WCAG contrast calculation and color selection
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x: any) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Parse CSS color string to RGB
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Handle hex colors
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  
  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }
  
  // Handle CSS color names (simplified - in production, use a full map)
  const colorMap: Record<string, string> = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#008000',
    blue: '#0000ff',
  };
  
  if (colorMap[color]) {
    return hexToRgb(colorMap[color]);
  }
  
  return null;
}

/**
 * Calculate relative luminance (WCAG formula)
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c: any) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG requirements
 */
export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

export function meetsWCAG(
  ratio: number,
  level: WCAGLevel = 'AA',
  textSize: TextSize = 'normal'
): boolean {
  const requirements = {
    AA: {
      normal: 4.5,
      large: 3,
    },
    AAA: {
      normal: 7,
      large: 4.5,
    },
  };
  
  return ratio >= requirements[level][textSize];
}

/**
 * Get appropriate text color for a background
 */
export function getTextColorForBackground(
  background: string,
  lightOption = 'rgba(255, 255, 255, 0.95)',
  darkOption = 'rgba(0, 0, 0, 0.90)'
): string {
  const bgColor = parseColor(background);
  if (!bgColor) return darkOption;
  
  const lightColor = parseColor(lightOption) || { r: 255, g: 255, b: 255 };
  const darkColor = parseColor(darkOption) || { r: 0, g: 0, b: 0 };
  
  const lightContrast = getContrastRatio(bgColor, lightColor);
  const darkContrast = getContrastRatio(bgColor, darkColor);
  
  // Choose the color with better contrast
  return lightContrast > darkContrast ? lightOption : darkOption;
}

/**
 * Adjust color to meet contrast requirements
 */
export function adjustColorForContrast(
  foreground: string,
  background: string,
  targetRatio = 4.5
): string {
  const fgColor = parseColor(foreground);
  const bgColor = parseColor(background);
  
  if (!fgColor || !bgColor) return foreground;
  
  let currentRatio = getContrastRatio(fgColor, bgColor);
  
  if (currentRatio >= targetRatio) {
    return foreground;
  }
  
  // Determine if we should lighten or darken
  const bgLuminance = getLuminance(bgColor.r, bgColor.g, bgColor.b);
  const shouldLighten = bgLuminance < 0.5;
  
  let adjustedColor = { ...fgColor };
  let step = 10;
  
  while (currentRatio < targetRatio && step <= 255) {
    if (shouldLighten) {
      adjustedColor.r = Math.min(255, fgColor.r + step);
      adjustedColor.g = Math.min(255, fgColor.g + step);
      adjustedColor.b = Math.min(255, fgColor.b + step);
    } else {
      adjustedColor.r = Math.max(0, fgColor.r - step);
      adjustedColor.g = Math.max(0, fgColor.g - step);
      adjustedColor.b = Math.max(0, fgColor.b - step);
    }
    
    currentRatio = getContrastRatio(adjustedColor, bgColor);
    step += 10;
  }
  
  return rgbToHex(adjustedColor.r, adjustedColor.g, adjustedColor.b);
}

/**
 * Generate a color palette with proper contrast
 */
export function generateAccessiblePalette(
  baseColor: string,
  backgroundColor: string
): {
  primary: string;
  secondary: string;
  tertiary: string;
  disabled: string;
} {
  const base = parseColor(baseColor) || { r: 59, g: 130, b: 246 };
  
  return {
    primary: adjustColorForContrast(
      rgbToHex(base.r, base.g, base.b),
      backgroundColor,
      4.5
    ),
    secondary: adjustColorForContrast(
      rgbToHex(
        Math.min(255, base.r + 30),
        Math.min(255, base.g + 30),
        Math.min(255, base.b + 30)
      ),
      backgroundColor,
      4.5
    ),
    tertiary: adjustColorForContrast(
      rgbToHex(
        Math.min(255, base.r + 60),
        Math.min(255, base.g + 60),
        Math.min(255, base.b + 60)
      ),
      backgroundColor,
      3
    ),
    disabled: adjustColorForContrast(
      rgbToHex(
        Math.min(255, base.r + 100),
        Math.min(255, base.g + 100),
        Math.min(255, base.b + 100)
      ),
      backgroundColor,
      3
    ),
  };
}

/**
 * Check contrast for all text elements in a container
 */
export function auditContrast(container: HTMLElement): {
  passed: number;
  failed: number;
  warnings: Array<{
    element: HTMLElement;
    ratio: number;
    required: number;
  }>;
} {
  const result = {
    passed: 0,
    failed: 0,
    warnings: [] as Array<{
      element: HTMLElement;
      ratio: number;
      required: number;
    }>,
  };
  
  const textElements = container.querySelectorAll<HTMLElement>('*');
  
  textElements.forEach((element: any) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    if (color === 'rgba(0, 0, 0, 0)' || backgroundColor === 'rgba(0, 0, 0, 0)') {
      return; // Skip transparent elements
    }
    
    const fgColor = parseColor(color);
    const bgColor = parseColor(backgroundColor);
    
    if (!fgColor || !bgColor) return;
    
    const ratio = getContrastRatio(fgColor, bgColor);
    const fontSize = parseFloat(styles.fontSize);
    const fontWeight = styles.fontWeight;
    
    // Determine if text is "large" (14pt bold or 18pt regular)
    const isLarge = (fontSize >= 18) || (fontSize >= 14 && parseInt(fontWeight) >= 700);
    const required = isLarge ? 3 : 4.5;
    
    if (ratio >= required) {
      result.passed++;
    } else {
      result.failed++;
      result.warnings.push({
        element,
        ratio: Math.round(ratio * 100) / 100,
        required,
      });
    }
  });
  
  return result;
}

/**
 * Apply contrast guard to element
 */
export function applyContrastGuard(element: HTMLElement) {
  const styles = window.getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  
  const textColor = getTextColorForBackground(backgroundColor);
  element.style.color = textColor;
}

/**
 * Get WCAG compliance badge info
 */
export function getWCAGBadge(ratio: number): {
  level: 'Fail' | 'AA' | 'AAA';
  color: string;
  description: string;
} {
  if (ratio >= 7) {
    return {
      level: 'AAA',
      color: '#10b981', // green
      description: 'Exceeds WCAG AAA standards',
    };
  } else if (ratio >= 4.5) {
    return {
      level: 'AA',
      color: '#3b82f6', // blue
      description: 'Meets WCAG AA standards',
    };
  } else {
    return {
      level: 'Fail',
      color: '#ef4444', // red
      description: 'Does not meet WCAG standards',
    };
  }
}