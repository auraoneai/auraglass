// SURF-130 — Next 16 + React 19.3 server page (no 'use client'): renders the
// server shell frame and parses the persisted rail cookie server-side via
// AppShell's cookie helper (REQ-SURF-07/14: shell state survives SSR).
// REQ-SURF-08: the cookie is the one the toggles write (`ag-shell-<persistKey>`),
// so a persisted 'sidebar:rail' paints as rail and hydrates without a
// mismatch (tests/ssr/surf/hydration.spec.ts).
import { cookies } from 'next/headers';
import { AppShell, AppShellSidebarToggle, Sidebar, TopBar, StatusBar, parseAppShellCookie } from 'aura-glass/app-shell';

const PERSIST_KEY = 'canary';

export default async function AppShellCanaryPage() {
  const store = await cookies();
  const shell = parseAppShellCookie(store.get(`ag-shell-${PERSIST_KEY}`)?.value);
  return (
    <AppShell.Root persistKey={PERSIST_KEY} defaultSidebar={shell.sidebar} defaultInspector={shell.inspector}>
      <TopBar.Root>
        <AppShellSidebarToggle />
        <strong>AuraGlass Next canary</strong>
      </TopBar.Root>
      <Sidebar.Root labels={{ navigation: 'Primary' }}>
        <Sidebar.Nav aria-label="Primary">
          <Sidebar.Item href="/surf/app-shell#a">A</Sidebar.Item>
          <Sidebar.Item href="/surf/app-shell#b">B</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>
        <h1>Server-rendered shell</h1>
      </AppShell.Main>
      <StatusBar.Root>ok</StatusBar.Root>
    </AppShell.Root>
  );
}
