// SURF-130 — Next 16 + React 19.3 server page (no 'use client'): renders the
// server shell frame and parses the persisted rail cookie server-side via
// AppShell.parseCookie (REQ-SURF-07/14: shell state survives SSR; the codec
// lives on the namespace, not the 7-name ./app-shell barrel — REQ-SURF-01).
import { cookies } from 'next/headers';
import { AppShell, Sidebar, TopBar, StatusBar } from 'aura-glass/app-shell';

export default async function AppShellCanaryPage() {
  const store = await cookies();
  const shell = AppShell.parseCookie(store.get('ag-app-shell')?.value);
  return (
    <AppShell.Root defaultSidebar={shell.sidebar} defaultInspector={shell.inspector}>
      <TopBar.Root>
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
