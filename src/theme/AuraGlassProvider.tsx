/* MAT-271/272/291: S-22 AuraGlassProvider. Hosts the preference store, portal
   root, announcer, LensDefs slot, pointer-light + dev-diagnostics mounts
   (registered via providerMounts), brand/preset style and the deprecated
   warning surface. The outermost provider marks <html> data-ag-root and renders
   the single portal root into document.body (or portalContainer); nested
   providers scope data-ag-* onto their own [data-ag-root][data-ag-provider]
   wrapper and reuse the outer root — exactly one portal root per document.
   REQ-FIN-04: production mounts register at render (./mounts), the outermost
   provider drives warnDeprecated's mode, and nested providers reuse the one
   document preference store (REQ-MAT-53): an inner provider only scopes its
   app overrides and the resolved data-ag-* attributes onto its wrapper. */
'use client';
import * as React from 'react';
import type { AuraGlassProviderProps } from '../contracts/preferences';
import { Portal } from '../primitives/Portal';
import { createPreferenceStore } from './preferences/store';
import type { PreferenceStore } from './preferences/store';
import { createLocalStorageAdapter } from './preferences/storage';
import { STORAGE_KEY } from './preferences/types';
import type { PreferenceInput, PreferenceStorage } from './preferences/types';
import { PreferenceStoreContext } from './preferences/usePreference';
import { PortalRootContext } from './portal';
import type { PortalRootState } from './portal';
import { LayerStackContext } from './layers/useLayer';
import { layerStackFor } from './layers/LayerStack';
import { AnnouncerRegions } from './announcer/Announcer';
import { LensDefsSlot, useProviderMounts } from './providerMounts';
import { ensureProviderMounts } from './mounts';
import { setDeprecationMode } from '../internal/warnDeprecated';

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/** Deprecation-warning mode forwarded to the compat layer (S-37 internals
   consume this context; 'warn' is the default in development). */
export const DeprecationModeContext = React.createContext<'warn' | 'silent' | undefined>(undefined);

const PORTAL_ROOT_ATTR = 'data-ag-portal-root';

/* React 19 ref-as-prop function component (REQ-PLAT-72). */
const PortalRootMarkup = (
  { toasts, tooltips, ref }: {
    toasts: boolean; tooltips: boolean; ref?: React.Ref<HTMLDivElement>;
  },
): React.ReactElement =>
  React.createElement(
    'div',
    { [PORTAL_ROOT_ATTR]: '', ref },
    React.createElement('div', { 'data-ag-layer-root': 'overlay' }),
    tooltips ? React.createElement('div', { 'data-ag-layer-root': 'transient' }) : null,
    toasts ? React.createElement('div', {
      'data-ag-layer-root': 'toast', role: 'region', 'aria-label': 'Notifications',
    }) : null,
    React.createElement(AnnouncerRegions),
  );

const appInput = (p: AuraGlassProviderProps): PreferenceInput => {
  const out: PreferenceInput = { tier: p.tier ?? 'auto' };
  if (p.transparency !== undefined) out.transparency = p.transparency;
  if (p.glassOpacity !== undefined) out.glassOpacity = p.glassOpacity;
  if (p.contrast !== undefined) out.contrast = p.contrast;
  if (p.motion !== undefined) out.motion = p.motion;
  if (p.scheme !== undefined) out.scheme = p.scheme;
  if (p.density !== undefined) out.density = p.density;
  if (p.allowContinuous !== undefined) out.allowContinuous = p.allowContinuous;
  return out;
};

type PersistedUser = Record<string, unknown>;

/** The one preference store per document plus the user values it holds, so
   nested providers can resolve their scope without a second store. */
interface DocumentPreferences {
  store: PreferenceStore;
  user(): PersistedUser;
}

const DocumentPreferencesContext = React.createContext<DocumentPreferences | null>(null);

const readUser = (storage: PreferenceStorage | null): PersistedUser => {
  if (!storage) return {};
  try {
    const v = JSON.parse(storage.get(STORAGE_KEY) ?? '') as unknown;
    return v !== null && typeof v === 'object' && !Array.isArray(v) ? { ...(v as PersistedUser) } : {};
  } catch {
    return {};
  }
};

const createDocumentPreferences = (
  storageProp: PreferenceStorage | null | undefined, app: PreferenceInput,
): DocumentPreferences => {
  const storage = storageProp === undefined
    ? createLocalStorageAdapter(typeof window === 'undefined' ? null : window)
    : storageProp;
  const base = createPreferenceStore({ storage, app });
  // read after creation: the store has already written any legacy migration
  let user = readUser(storage);
  const store: PreferenceStore = {
    ...base,
    set(key, value) { user = { ...user, [key]: value }; base.set(key, value); },
    reset() { user = {}; base.reset(); },
  };
  return { store, user: () => user };
};

/** Read-only view of the document user values for a nested provider's scope. */
const scopedStorage = (docPrefs: DocumentPreferences): PreferenceStorage => ({
  get: (key) => (key === STORAGE_KEY ? JSON.stringify(docPrefs.user()) : null),
  set: () => {},
  remove: () => {},
});

export function AuraGlassProvider(props: AuraGlassProviderProps): React.ReactElement {
  const {
    children, storage, portalContainer, toasts = true, tooltips = true,
    tier = 'auto', preset, brand, deprecations,
  } = props;

  ensureProviderMounts();

  const parentPortal = React.useContext(PortalRootContext);
  const outermost = parentPortal === null;
  const parentRoot = parentPortal?.root ?? null;
  const parentDocPrefs = React.useContext(DocumentPreferencesContext);
  const parentDeprecations = React.useContext(DeprecationModeContext);
  const deprecationMode = deprecations ?? parentDeprecations;

  // one store per document: the outermost provider creates it, nested
  // providers reuse it (REQ-MAT-53 identity)
  const docPrefs = React.useMemo<DocumentPreferences>(
    () => (outermost || parentDocPrefs === null
      ? createDocumentPreferences(storage, appInput(props))
      : parentDocPrefs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const store = docPrefs.store;
  const appJson = JSON.stringify(appInput(props));
  React.useEffect(() => {
    if (docPrefs === parentDocPrefs) return;
    store.setApp(JSON.parse(appJson) as PreferenceInput);
  }, [store, appJson, docPrefs, parentDocPrefs]);

  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);
  const ownRootRef = React.useRef<HTMLElement | null>(null);
  const [adoptedRoot, setAdoptedRoot] = React.useState<HTMLElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const doc = (typeof document === 'undefined' ? null : document);
  const layerStack = React.useMemo(() => (doc ? layerStackFor(doc) : null), [doc]);

  useIsoLayoutEffect(() => {
    if (!doc) return undefined;
    if (outermost) {
      const html = doc.documentElement;
      html.setAttribute('data-ag-root', '');
      store.setTarget(html);
      const existing = doc.querySelector<HTMLElement>(`[${PORTAL_ROOT_ATTR}]`);
      /* Adopt only a FOREIGN root — the effect's `portalRoot` closure is stale
         (the own-root ref callback fires during commit, after render), so
         compare against ownRootRef instead. Adopting our own root would flip
         needsOwnRoot off and unmount it. */
      if (existing && existing !== ownRootRef.current) setAdoptedRoot(existing);
      return () => {
        html.removeAttribute('data-ag-root');
        store.setTarget(null);
      };
    }
    return undefined;
  }, [outermost, store, doc]);

  // nested scope: resolve the document user values + this provider's app
  // overrides onto the wrapper; re-resolve whenever the document store changes.
  // The scope store never persists and is never handed to descendants.
  useIsoLayoutEffect(() => {
    if (!doc || outermost) return undefined;
    const el = wrapperRef.current;
    if (!el) return undefined;
    /* REQ-MAT-56: portaled overlays render under the shared portal root, not
       under this wrapper, so the scope store mirrors its resolved scheme and
       transparency onto that root (the outer root inherits from <html>). */
    let scope: PreferenceStore | null = null;
    const write = (): void => {
      el.removeAttribute('data-ag-continuous');
      scope?.setTarget(null); // release the previous scope's mirror values
      scope = createPreferenceStore({
        storage: scopedStorage(docPrefs),
        app: JSON.parse(appJson) as PreferenceInput,
      });
      scope.setTarget(parentRoot ? [el, parentRoot] : el);
    };
    write();
    const unsubscribe = store.subscribe(write);
    return () => {
      unsubscribe();
      scope?.setTarget(null);
    };
  }, [outermost, store, doc, docPrefs, appJson, parentRoot]);

  // REQ-PLAT-26 provider half: warnDeprecated's mode is module-wide, so the
  // outermost provider owns it; nested providers forward theirs via context.
  useIsoLayoutEffect(() => {
    if (!outermost) return undefined;
    setDeprecationMode(deprecationMode ?? 'warn');
    return () => setDeprecationMode('warn');
  }, [outermost, deprecationMode]);

  const mounts = useProviderMounts();

  // dev diagnostics + pointer light mounts (registered by sibling lanes)
  React.useEffect(() => {
    if (!doc || !outermost) return undefined;
    const cleanups: Array<(() => void) | void> = [];
    if (process.env.NODE_ENV !== 'production' && mounts.devDiagnostics) {
      cleanups.push(mounts.devDiagnostics(doc));
    }
    if (mounts.pointerLight) cleanups.push(mounts.pointerLight(doc));
    return () => cleanups.forEach((c) => { if (typeof c === 'function') c(); });
  }, [doc, outermost, mounts]);

  // single <style> for brand/preset (at most one)
  const themeCss = React.useMemo(() => {
    if (brand && mounts.brandCss) return mounts.brandCss(brand) ?? null;
    if (preset && mounts.presetCss) return mounts.presetCss(preset) ?? null;
    return null;
  }, [brand, preset, mounts]);

  const rootState = React.useMemo<PortalRootState>(
    () => ({ root: adoptedRoot ?? portalRoot }),
    [adoptedRoot, portalRoot],
  );

  const needsOwnRoot = outermost && adoptedRoot === null;
  const container = portalContainer ?? (doc ? doc.body : null);
  const content = React.createElement(
    React.Fragment,
    null,
    themeCss ? React.createElement('style', { 'data-ag-theme-style': '' }, themeCss) : null,
    children,
    outermost ? React.createElement(LensDefsSlot, { tier }) : null,
    needsOwnRoot && container
      ? React.createElement(
        Portal,
        { container },
        React.createElement(PortalRootMarkup, {
          toasts, tooltips,
          ref: (el: HTMLDivElement | null) => { ownRootRef.current = el; setPortalRoot(el); },
        }),
      )
      : null,
  );

  const tree = outermost
    ? content
    : React.createElement('div', {
      'data-ag-root': '', 'data-ag-provider': '', ref: wrapperRef,
    }, content);

  return React.createElement(
    DocumentPreferencesContext.Provider,
    { value: docPrefs },
    React.createElement(
      PreferenceStoreContext.Provider,
      { value: store },
      React.createElement(
        PortalRootContext.Provider,
        { value: rootState },
        React.createElement(
          LayerStackContext.Provider,
          { value: layerStack },
          React.createElement(
            DeprecationModeContext.Provider,
            { value: deprecationMode },
            tree,
          ),
        ),
      ),
    ),
  );
}
