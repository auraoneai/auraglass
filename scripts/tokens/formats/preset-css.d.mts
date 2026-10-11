import type { TokenRecord } from '../build.mjs';
import type { DtcgColorValue } from '../color.mjs';

export const PRESET_IDS: readonly ['aura', 'graphite', 'daylight', 'midnight'];
export const PRESET_SCOPE: '[data-ag-root]';
export const PRESET_COLOR_TOKENS: readonly ['canvas', 'accent', 'on-accent', 'border'];
export const PRESET_RADIUS_STEPS: readonly ['xs', 'sm', 'md', 'lg', 'xl'];
export interface PresetOverrides {
  id: string;
  colors: Record<typeof PRESET_COLOR_TOKENS[number], { light: DtcgColorValue; dark: DtcgColorValue }>;
  radius: Array<[string, string]>;
}
export function neutralRamp(resolved: Map<string, unknown>, neutralHue: number): Record<number, DtcgColorValue>;
export function presetOverrides(id: string, records: Map<string, TokenRecord>, resolved: Map<string, unknown>): PresetOverrides;
export function presetCssText(overrides: PresetOverrides, scope?: string): string;
