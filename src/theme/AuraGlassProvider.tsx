/* MAT-271/272/291: S-22 AuraGlassProvider. Hosts the preference store, portal
   root, announcer, LensDefs slot, pointer-light + dev-diagnostics mounts
   (registered via providerMounts), brand/preset style and the deprecated
   warning surface. The outermost provider marks <html> data-ag-root and renders
   the single portal root into document.body (or portalContainer); nested
   providers scope data-ag-* onto their own [data-ag-root][data-ag-provider]
   wrapper and reuse the outer root — exactly one portal root per document. */
'use client';
import * as React from 'react';
import type { AuraGlassProviderProps } from '../contracts/preferences';
import { Portal } from '../primitives/Portal';
import { createPreferenceStore } from './preferences/store';
import type { PreferenceStore } from './preferences/store';
import type { PreferenceInput } from './preferences/types';
import { PreferenceStoreContext } from './preferences/usePreference';
import { PortalRootContext } from './portal';
import type { PortalRootState } from './portal';
import { LayerStackContext } from './layers/useLayer';
import { layerStackFor } from './layers/LayerStack';
import { AnnouncerRegions } from './announcer/Announcer';
import { LensDefsSlot, useProviderMounts } from './providerMounts';

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/** Deprecation-warning mode forwarded to the compat layer (S-37 internals
   consume this context; 'warn' is the default in development). */
export const DeprecationModeContext = React.createContext<'warn' | 'silent' | undefined>(undefined);

const PORTAL_ROOT_ATTR = 'data-ag-portal-root';

const PortalRootMarkup = React.forwardRef<
  HTMLDivElement, { toasts: boolean; tooltips: boolean }
>(({ toasts, tooltips }, ref) =>
  React.createElement(
    'div',
    { [PORTAL_ROOT_ATTR]: '', ref },
    React.createElement('div', { 'data-ag-layer-root': 'overlay' }),
    tooltips ? React.createElement('div', { 'data-ag-layer-root': 'transient' }) : null,
    toasts ? React.createElement('div', {
      'data-ag-layer-root': 'toast', role: 'region', 'aria-label': 'Notifications',
    }) : null,
    React.createElement(AnnouncerRegions),
  ));
PortalRootMarkup.displayName = 'PortalRootMarkup';

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

export function AuraGlassProvider(props: AuraGlassProviderProps): React.ReactElement {
  const {
    children, storage, portalContainer, toasts = true, tooltips = true,
    tier = 'auto', preset, brand, deprecations,
  } = props;

  const parentPortal = React.useContext(PortalRootContext);
  const outermost = parentPortal === null;

  const store = React.useMemo<PreferenceStore>(() => createPreferenceStore({
    ...(storage === undefined ? {} : { storage }),
    app: appInput(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);
  const appJson = JSON.stringify(appInput(props));
  React.useEffect(() => { store.setApp(JSON.parse(appJson) as PreferenceInput); }, [store, appJson]);

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
    const el = wrapperRef.current;
    if (el) store.setTarget(el);
    return () => store.setTarget(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outermost, store, doc]);

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
    outermost && tier !== undefined ? React.createElement(LensDefsSlot, { tier }) : null,
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
          { value: deprecations },
          tree,
        ),
      ),
    ),
  );
}
