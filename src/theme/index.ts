/* @ag-contract-seed: S-21..S-26. Owner MAT replaces internals; exports frozen.
   createGlassTheme/createBrandGlassTheme are the kept 4.x files, re-exported. */
import * as React from 'react';
import {
  SERVER_SNAPSHOT, PORTAL_ROOT_MARKUP,
} from '../contracts/preferences';
import type {
  PreferenceKey, PreferenceValues, ResolvedPreferences, UserSettableKey,
  AuraGlassProviderProps, AuraGlassScriptProps, PortalLayerRoot, LayerEntry,
  AnnounceOptions, GlassPreferencesPanelProps,
} from '../contracts/preferences';

export { createGlassTheme, createBrandGlassTheme } from './createGlassTheme';

/* S-21. Server snapshot: subscribers never fire in the seed, so the hook returns
   SERVER_SNAPSHOT[key] on both server and client (seeds carry no live store). */
const noopSubscribe = () => () => {};
export function usePreference<K extends PreferenceKey>(key: K): PreferenceValues[K] {
  return React.useSyncExternalStore(noopSubscribe, () => SERVER_SNAPSHOT[key], () => SERVER_SNAPSHOT[key]);
}

const RESOLVED_DEFAULTS: ResolvedPreferences = {
  transparency: 'glass', contrast: 'standard', motion: 'full', scheme: 'light', density: 'regular',
  glassOpacity: 0, tier: 'standard', allowContinuous: false,
  floors: { transparency: 'glass', motion: 'full' },
};
export function useResolvedPreferences(): ResolvedPreferences {
  return RESOLVED_DEFAULTS;
}

export function usePreferenceActions(): {
  set<K extends UserSettableKey>(key: K, value: PreferenceValues[K]): void;
  reset(): void;
} {
  return React.useMemo(() => ({ set: () => {}, reset: () => {} }), []);
}

/* S-22. The provider renders children and portals PORTAL_ROOT_MARKUP into document.body. */
export function AuraGlassProvider({ children }: AuraGlassProviderProps) {
  React.useLayoutEffect(() => {
    if (typeof document === 'undefined' || document.querySelector('[data-ag-portal-root]')) return;
    const tpl = document.createElement('template');
    tpl.innerHTML = PORTAL_ROOT_MARKUP;
    document.body.appendChild(tpl.content.firstElementChild as HTMLElement);
  }, []);
  return React.createElement(React.Fragment, null, children);
}

export function AuraGlassScript({ nonce }: AuraGlassScriptProps) {
  return React.createElement('script', { nonce, 'data-ag-seed': '' });
}
export const auraGlassPrepaintScript = '';

/* S-23. Resolves the matching layer-root element inside the provider's portal root. */
export function usePortalContainer(root: PortalLayerRoot = 'overlay'): HTMLElement | null {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    setEl(typeof document === 'undefined'
      ? null
      : document.querySelector<HTMLElement>(`[data-ag-portal-root] [data-ag-layer-root="${root}"]`));
  }, [root]);
  return el;
}

/* S-25. Module-level stack; Escape reaches only the top entry's onEscape. */
const layerStack: { id: string; entry: LayerEntry }[] = [];
let layerSeq = 0;
const escKey = '__agLayerEscBound';
if (typeof document !== 'undefined' && !(globalThis as Record<string, unknown>)[escKey]) {
  (globalThis as Record<string, unknown>)[escKey] = true;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const top = [...layerStack].reverse().find((l) => l.entry.open);
      top?.entry.onEscape();
    }
  });
}
export function useLayer(entry: LayerEntry): { id: string; depth: number; isTop: boolean } {
  const idRef = React.useRef<string | undefined>(undefined);
  if (idRef.current === undefined) idRef.current = `ag-layer-${++layerSeq}`;
  const id = idRef.current;
  React.useLayoutEffect(() => {
    const item = { id, entry };
    layerStack.push(item);
    return () => { const i = layerStack.indexOf(item); if (i >= 0) layerStack.splice(i, 1); };
  });
  const idx = layerStack.findIndex((l) => l.id === id);
  const topIdx = [...layerStack.keys()].reverse().find((i) => layerStack[i]?.entry.open) ?? -1;
  return { id, depth: Math.max(0, idx), isTop: topIdx === idx };
}

/* S-26. Writes into the announcer regions of the portal root; clear() empties them. */
function announcer(politeness: 'polite' | 'assertive'): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector(
    `[data-ag-portal-root] [data-ag-announcer] [aria-live="${politeness}"]`,
  );
}
export function useAnnouncer(): { announce(message: string, opts?: AnnounceOptions): void; clear(): void } {
  return React.useMemo(() => ({
    announce(message: string, opts?: AnnounceOptions) {
      const el = announcer(opts?.politeness ?? 'polite');
      if (el) el.textContent = message;
    },
    clear() {
      for (const p of ['polite', 'assertive'] as const) {
        const el = announcer(p);
        if (el) el.textContent = '';
      }
    },
  }), []);
}

/* S-24. Native controls bound to usePreferenceActions. */
const PANEL_KEYS: Record<UserSettableKey, readonly string[]> = {
  transparency: ['glass', 'flat', 'system'],
  glassOpacity: [],
  contrast: ['standard', 'more', 'system'],
  motion: ['full', 'reduced', 'system'],
  scheme: ['light', 'dark', 'system'],
  density: ['regular', 'compact'],
  allowContinuous: [],
};
export function GlassPreferencesPanel({ keys, className }: GlassPreferencesPanelProps) {
  const actions = usePreferenceActions();
  const shown = keys ?? (Object.keys(PANEL_KEYS) as UserSettableKey[]);
  return React.createElement(
    'fieldset',
    { 'data-ag-seed': '', 'data-ag-preferences-panel': '', className },
    React.createElement('legend', null, 'Preferences'),
    ...shown.map((key) => React.createElement(PreferenceControl, { key, prefKey: key, actions })),
    React.createElement('button', { type: 'button', onClick: actions.reset }, 'Reset'),
  );
}
function PreferenceControl({
  prefKey, actions,
}: { prefKey: UserSettableKey; actions: ReturnType<typeof usePreferenceActions> }) {
  const value = usePreference(prefKey) as string | number | boolean;
  if (prefKey === 'allowContinuous') {
    return React.createElement('label', null,
      React.createElement('input', {
        type: 'checkbox', checked: Boolean(value),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => actions.set(prefKey, e.target.checked),
      }),
      'Allow continuous animation');
  }
  if (prefKey === 'glassOpacity') {
    return React.createElement('label', null,
      'Glass opacity',
      React.createElement('input', {
        type: 'range', min: 0, max: 100, value: Number(value) || 0,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => actions.set(prefKey, Number(e.target.value)),
      }));
  }
  return React.createElement('label', null,
    prefKey,
    React.createElement('select', {
      value: String(value),
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => actions.set(prefKey, e.target.value as never),
    }, PANEL_KEYS[prefKey].map((v) => React.createElement('option', { key: v, value: v }, v))));
}
