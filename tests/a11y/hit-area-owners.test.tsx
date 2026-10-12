/** @jest-environment jsdom */
/* REQ-MAT-62: every interactive part of these owners renders the MAT hit area
   ([data-ag-part="hit-area"], aria-hidden, sized by src/a11y/css/targets.css)
   as a direct child, and declares it in its meta. The rendered >= 24 / >= 44
   boxes are measured by tests/e2e/mat/target-size{,-coarse}.spec.ts. */
import { describe, expect, it } from '@jest/globals';
import { act, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Tabs } from '../../src/components/tabs/Tabs';
import tabsMeta from '../../src/components/tabs/Tabs.meta';
import { TabBar } from '../../src/components/tab-bar/TabBar';
import tabBarMeta from '../../src/components/tab-bar/TabBar.meta';
import { Pagination } from '../../src/components/pagination/Pagination';
import paginationMeta from '../../src/components/pagination/Pagination.meta';
import { Toast, useToast } from '../../src/components/toast';
import toastMeta from '../../src/components/toast/Toast.meta';
import { IconButton } from '../../src/components/icon-button';
import iconButtonMeta from '../../src/components/icon-button/IconButton.meta';
import { MediaControls } from '../../src/media';
import mediaControlsMeta from '../../src/media/MediaControls/MediaControls.meta';
import { AuraGlassProvider } from '../../src/theme';

const hitAreas = (el: Element) => [...el.children].filter((c) => c.getAttribute('data-ag-part') === 'hit-area');
function expectOneHitArea(el: Element | null) {
  expect(el).not.toBeNull();
  const h = hitAreas(el!);
  expect(h).toHaveLength(1);
  expect(h[0]!.getAttribute('aria-hidden')).toBe('true');
  expect(h[0]!.textContent).toBe('');
}
const parts = (m: unknown) => (m as { parts: readonly string[] }).parts;

describe('MAT hit area on every interactive part (REQ-MAT-62)', () => {
  it('Tabs.Tab', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Alpha</Tabs.Tab>
          <Tabs.Tab value="b">Beta</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );
    for (const tab of screen.getAllByRole('tab')) expectOneHitArea(tab);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toBeTruthy();
    expect(parts(tabsMeta)).toContain('hit-area');
  });

  it('TabBar.Item', () => {
    render(
      <TabBar.Root aria-label="Primary">
        <TabBar.Item href="/a" current>Home</TabBar.Item>
        <TabBar.Item href="/b">Search</TabBar.Item>
      </TabBar.Root>,
    );
    for (const link of screen.getAllByRole('link')) expectOneHitArea(link);
    expect(parts(tabBarMeta)).toContain('hit-area');
  });

  it('Pagination: link mode, button mode and manual parts', () => {
    const { unmount } = render(<Pagination.Root page={2} pageCount={5} getHref={(p) => `?p=${p}`} aria-label="P" />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(2);
    for (const l of links) expectOneHitArea(l);
    expect(screen.getByRole('link', { name: 'Page 2' }).textContent).toBe('2');
    unmount();
    const r2 = render(<Pagination.Root page={2} pageCount={5} onPageChange={() => {}} aria-label="P" />);
    for (const b of screen.getAllByRole('button')) expectOneHitArea(b);
    r2.unmount();
    render(
      <ol>
        <Pagination.Previous href="?p=1" />
        <Pagination.Item page={3} href="?p=3" />
        <Pagination.Next href="?p=4" />
      </ol>,
    );
    for (const l of screen.getAllByRole('link')) expectOneHitArea(l);
    expect(parts(paginationMeta)).toContain('hit-area');
  });

  it('Toast.Action and Toast.Close', async () => {
    let add: (() => void) | undefined;
    function Host() {
      const t = useToast();
      add = () => t.add({ title: 'Saved', timeout: 0 });
      return (
        <Toast.Viewport>
          {t.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Title>{toast.title}</Toast.Title>
              <Toast.Action>Undo</Toast.Action>
              <Toast.Close>×</Toast.Close>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      );
    }
    render(<AuraGlassProvider><Toast.Provider><Host /></Toast.Provider></AuraGlassProvider>);
    await act(async () => { add!(); });
    expectOneHitArea(document.querySelector('[data-ag-part="action"]'));
    expectOneHitArea(document.querySelector('[data-ag-part="close"]'));
    expect(document.querySelector('[data-ag-part="action"]')!.textContent).toBe('Undo');
    expect(parts(toastMeta)).toContain('hit-area');
  });

  it('IconButton (through Button internals)', () => {
    render(<IconButton label="Close" icon={<svg />} />);
    expectOneHitArea(screen.getByRole('button', { name: 'Close' }));
    expect(parts(iconButtonMeta)).toContain('hit-area');
  });

  it('MediaControls toolbar buttons', () => {
    const { container } = render(<MediaControls.Root playing={false} onPlayingChange={() => {}} />);
    const buttons = [...container.querySelectorAll('[role="toolbar"] button')];
    expect(buttons.length).toBeGreaterThan(0);
    for (const b of buttons) expectOneHitArea(b);
    expect(parts(mediaControlsMeta)).toEqual(expect.arrayContaining(['hit-area', 'icon']));
  });
});
