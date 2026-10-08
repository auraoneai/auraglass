// SURF-129 — Vite + React 19 consumer canary page (B23a lane-owned page file;
// the canary app scaffolding is PLAT's). Imports only packed aura-glass CSS +
// the app-frame registry block surface; asserts AppShell geometry in-browser:
// sidebar right edge <= main left edge + 1px, top bar sits above main.
import 'aura-glass/app-shell.css';
import 'aura-glass/styles.css';
import { AppShell, Sidebar, TopBar, StatusBar } from 'aura-glass/app-shell';

const NAV = [
  { href: '#overview', label: 'Overview' },
  { href: '#reports', label: 'Reports' },
];

export default function AppShellCanaryPage() {
  return (
    <AppShell.Root data-ag-canary="surf-app-shell">
      <TopBar.Root>
        <strong>AuraGlass canary</strong>
      </TopBar.Root>
      <Sidebar.Root labels={{ navigation: 'Primary' }}>
        <Sidebar.Nav aria-label="Primary">
          {NAV.map((item) => (
            <Sidebar.Item key={item.href} href={item.href}>
              {item.label}
            </Sidebar.Item>
          ))}
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>
        <h1>AppShell canary</h1>
        <p>Sidebar geometry probe: sidebar.getBoundingClientRect().right &lt;= main.left + 1</p>
      </AppShell.Main>
      <StatusBar.Root>ok</StatusBar.Root>
    </AppShell.Root>
  );
}
