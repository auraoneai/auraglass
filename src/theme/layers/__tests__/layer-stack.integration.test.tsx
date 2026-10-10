/* REQ-FIN-07 (AC-FIN-07; REQ-MAT-56 portal-root attribute clause, FIN-A.3 #5):
   the single [data-ag-portal-root] carries the resolved scheme and
   transparency of the provider whose overlays it hosts, so portaled overlays
   under a nested provider resolve like that provider's subtree rather than
   like <html>. */
import { afterEach, describe, expect, it } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../AuraGlassProvider';

const ROOT_ATTRS = [
  'data-ag-root', 'data-ag-transparency', 'data-ag-contrast', 'data-ag-motion',
  'data-ag-scheme', 'data-ag-density', 'data-ag-tier', 'data-ag-continuous', 'data-ag-engine',
];

afterEach(() => {
  document.body.querySelectorAll('[data-ag-portal-root]').forEach((e) => e.remove());
  for (const name of ROOT_ATTRS) document.documentElement.removeAttribute(name);
});

const portalRoot = (): HTMLElement => {
  const roots = document.body.querySelectorAll<HTMLElement>('[data-ag-portal-root]');
  expect(roots).toHaveLength(1);
  return roots[0]!;
};

describe('portal root scheme/transparency mirroring (REQ-MAT-56)', () => {
  it('a nested provider with scheme="dark" gives [data-ag-portal-root][data-ag-scheme=dark]', () => {
    render(
      <AuraGlassProvider storage={null} scheme="light">
        <AuraGlassProvider storage={null} scheme="dark" transparency="solid"><span /></AuraGlassProvider>
      </AuraGlassProvider>,
    );
    expect(document.documentElement.getAttribute('data-ag-scheme')).toBe('light');
    expect(document.querySelector('[data-ag-portal-root][data-ag-scheme="dark"]')).toBe(portalRoot());
    expect(portalRoot().getAttribute('data-ag-transparency')).toBe('solid');
    const inner = document.querySelector('div[data-ag-root][data-ag-provider]')!;
    expect(inner.getAttribute('data-ag-scheme')).toBe('dark');
    // only scheme and transparency are mirrored; the rest stays on the wrapper
    expect(portalRoot().hasAttribute('data-ag-density')).toBe(false);
    expect(portalRoot().hasAttribute('data-ag-contrast')).toBe(false);
  });

  it('follows the nested provider when its scheme changes', () => {
    const tree = (scheme: 'light' | 'dark') => (
      <AuraGlassProvider storage={null} scheme="light">
        <AuraGlassProvider storage={null} scheme={scheme}><span /></AuraGlassProvider>
      </AuraGlassProvider>
    );
    const { rerender } = render(tree('dark'));
    expect(portalRoot().getAttribute('data-ag-scheme')).toBe('dark');
    act(() => { rerender(tree('light')); });
    expect(portalRoot().getAttribute('data-ag-scheme')).toBe('light');
  });

  it('unmounting the nested provider removes its mirrored attributes (falls back to <html>)', () => {
    const tree = (nested: boolean) => (
      <AuraGlassProvider storage={null} scheme="light">
        {nested ? <AuraGlassProvider storage={null} scheme="dark"><span /></AuraGlassProvider> : null}
      </AuraGlassProvider>
    );
    const { rerender } = render(tree(true));
    expect(portalRoot().getAttribute('data-ag-scheme')).toBe('dark');
    act(() => { rerender(tree(false)); });
    expect(portalRoot().hasAttribute('data-ag-scheme')).toBe(false);
    expect(portalRoot().hasAttribute('data-ag-transparency')).toBe(false);
    expect(document.documentElement.getAttribute('data-ag-scheme')).toBe('light');
  });

  it('a lone provider leaves the portal root to inherit from <html>', () => {
    render(<AuraGlassProvider storage={null} scheme="dark"><span /></AuraGlassProvider>);
    expect(document.documentElement.getAttribute('data-ag-scheme')).toBe('dark');
    expect(portalRoot().hasAttribute('data-ag-scheme')).toBe(false);
  });
});
