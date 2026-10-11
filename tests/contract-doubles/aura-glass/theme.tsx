import { comp } from './_factory';
export const GlassPreferencesPanel = comp('GlassPreferencesPanel');
export function usePreferenceActions() {
  return { setTheme: () => {}, setDensity: () => {}, setMotion: () => {}, reset: () => {} };
}
export type UserSettableKey = string;
