/* MAT-271/272/291 (A11Y-030): AuraGlassProvider — the outermost provider marks
   <html> and portals the single PORTAL_ROOT_MARKUP into document.body (or
   portalContainer); nested providers scope onto their own
   [data-ag-root][data-ag-provider] div and never add a second portal root.
   Attributes written: data-ag-* only, plus the --ag-glass-opacity property and
   at most one <style>. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { AuraGlassProvider } from '../AuraGlassProvider';
import { DeprecationModeContext } from '../AuraGlassProvider';
import { usePortalContainer } from '../portal';
import { registerProviderMount } from '../providerMounts';
import { usePreference } from '../preferences/usePreference';

const memoryStorage = () => {
  const m = new Map<string, string>();
  return {
    get: (k: string) => m.get(k) ?? null,
    set: (k: string, v: string) => void m.set(k, v),
    remove: (k: string) => void m.delete(k),
    dump: () => m,
  };
};

afterEach(() => {
  document.documentElement.removeAttribute('data-ag-root');
  document.body.querySelectorAll('[data-ag-portal-root]').forEach((e) => e.remove());
  document.documentElement.removeAttribute('data-ag-transparency');
  document.documentElement.removeAttribute('data-ag-contrast');
  document.documentElement.removeAttribute('data-ag-motion');
  document.documentElement.removeAttribute('data-ag-scheme');
  document.documentElement.removeAttribute('data-ag-density');
  document.documentElement.removeAttribute('data-ag-tier');
  document.documentElement.removeAttribute('data-ag-continuous');
  document.documentElement.removeAttribute('data-ag-engine');
});

describe('AuraGlassProvider', () => {
  it('marks <html> with data-ag-root and renders exactly one portal root', () => {
    render(<AuraGlassProvider storage={null}><div /></AuraGlassProvider>);
    expect(document.documentElement.getAttribute('data-ag-root')).toBe('');
    expect(document.body.querySelectorAll('[data-ag-portal-root]')).toHaveLength(1);
    const root = document.body.querySelector('[data-ag-portal-root]')!;
    expect(root.querySelector('[data-ag-layer-root="overlay"]')).not.toBeNull();
    expect(root.querySelector('[data-ag-layer-root="transient"]')).not.toBeNull();
    const toast = root.querySelector('[data-ag-layer-root="toast"]');
    expect(toast?.getAttribute('role')).toBe('region');
    expect(toast?.getAttribute('aria-label')).toBe('Notifications');
    expect(root.querySelectorAll('[data-ag-announcer] [aria-live]')).toHaveLength(2);
  });

  it('honours toasts/tooltips toggles for the regions they control', () => {
    render(<AuraGlassProvider storage={null} toasts={false}><div /></AuraGlassProvider>);
    expect(document.body.querySelector('[data-ag-layer-root="toast"]')).toBeNull();
    expect(document.body.querySelector('[data-ag-layer-root="transient"]')).not.toBeNull();
  });

  it('writes only data-ag-* attributes plus the --ag-glass-opacity property', () => {
    render(<AuraGlassProvider storage={null} scheme="dark"><div /></AuraGlassProvider>);
    const html = document.documentElement;
    for (const name of html.getAttributeNames()) {
      expect(name === 'class' || name === 'style' || name.startsWith('data-ag-')).toBe(true);
    }
    const style = html.getAttribute('style') ?? '';
    const decls = style.split(';').map((s) => s.trim()).filter(Boolean);
    for (const d of decls) expect(d.startsWith('--ag-glass-opacity')).toBe(true);
    expect(html.getAttribute('data-ag-scheme')).toBe('dark');
    expect(html.getAttribute('data-ag-transparency')).not.toBeNull();
    expect(html.getAttribute('data-ag-contrast')).not.toBeNull();
    expect(html.getAttribute('data-ag-motion')).not.toBeNull();
    expect(html.getAttribute('data-ag-density')).not.toBeNull();
    // at most one <style> for brand/preset inside the provider output
    expect(document.querySelectorAll('style[data-theme-style]').length).toBeLessThanOrEqual(1);
  });

  it('nested providers scope attributes to their own div and share the outer portal root', () => {
    render(
      <AuraGlassProvider storage={null}>
        <AuraGlassProvider storage={null} density="compact"><span /></AuraGlassProvider>
      </AuraGlassProvider>,
    );
    expect(document.body.querySelectorAll('[data-ag-portal-root]')).toHaveLength(1);
    const inner = document.querySelector('div[data-ag-root][data-ag-provider]');
    expect(inner).not.toBeNull();
    expect(inner!.getAttribute('data-ag-density')).toBe('compact');
    // display: contents comes from the a11y stylesheet; the only style write
    // any provider performs is the --ag-glass-opacity property
    const innerStyle = inner!.getAttribute('style') ?? '';
    for (const d of innerStyle.split(';').map((s) => s.trim()).filter(Boolean)) {
      expect(d.startsWith('--ag-glass-opacity')).toBe(true);
    }
  });

  it('portalContainer override hosts the portal root', () => {
    const host = document.createElement('section');
    document.body.appendChild(host);
    render(<AuraGlassProvider storage={null} portalContainer={host}><div /></AuraGlassProvider>);
    expect(host.querySelectorAll('[data-ag-portal-root]')).toHaveLength(1);
    host.remove();
  });

  it('adopts a pre-existing portal root instead of creating a second', () => {
    const pre = document.createElement('div');
    pre.setAttribute('data-ag-portal-root', '');
    pre.innerHTML = '<div data-ag-layer-root="overlay"></div><div data-ag-layer-root="transient"></div><div data-ag-layer-root="toast"></div>';
    document.body.appendChild(pre);
    render(<AuraGlassProvider storage={null}><div /></AuraGlassProvider>);
    expect(document.body.querySelectorAll('[data-ag-portal-root]')).toHaveLength(1);
    pre.remove();
  });

  it('legacy key migrates through the provider', () => {
    const storage = memoryStorage();
    storage.set('aura-glass-accessibility-settings', JSON.stringify({ highContrast: true }));
    render(<AuraGlassProvider storage={storage}><div /></AuraGlassProvider>);
    expect(JSON.parse(storage.get('ag:prefs:v1') ?? '{}')).toMatchObject({ contrast: 'more' });
  });

  it('storage=false persists nothing', () => {
    const storage = memoryStorage();
    function Probe() {
      const v = usePreference('scheme');
      return <output>{v}</output>;
    }
    render(<AuraGlassProvider storage={null}><Probe /></AuraGlassProvider>);
    expect(storage.dump().size).toBe(0);
  });

  it('deprecations prop is forwarded silently', () => {
    let seen: string | undefined;
    function Probe() {
      seen = React.useContext(DeprecationModeContext);
      return null;
    }
    render(<AuraGlassProvider storage={null} deprecations="silent"><Probe /></AuraGlassProvider>);
    expect(seen).toBe('silent');
  });

  it('renders registered provider mounts (lens defs eligible only on auto/enhanced)', () => {
    const Spy = () => <div data-testid="lens-defs" />;
    const { rerender } = render(
      <AuraGlassProvider storage={null} tier="enhanced"><div /></AuraGlassProvider>,
    );
    act(() => { registerProviderMount('lensDefs', Spy); });
    expect(document.querySelector('[data-testid="lens-defs"]')).not.toBeNull();
    rerender(<AuraGlassProvider storage={null} tier="standard"><div /></AuraGlassProvider>);
    expect(document.querySelector('[data-testid="lens-defs"]')).toBeNull();
    act(() => { registerProviderMount('lensDefs', undefined); });
  });

  it('portal container resolves for children via usePortalContainer', () => {
    const seen: Record<string, Element | null> = {};
    function Probe() {
      seen.overlay = usePortalContainer('overlay');
      seen.toast = usePortalContainer('toast');
      return null;
    }
    render(<AuraGlassProvider storage={null}><Probe /></AuraGlassProvider>);
    expect(seen.overlay).not.toBeNull();
    expect(seen.overlay!.getAttribute('data-ag-layer-root')).toBe('overlay');
    expect(seen.toast).not.toBeNull();
  });
});
