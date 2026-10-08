// @ts-nocheck
// Golden for handler-only-items: GlassAppShell prop slots become children,
// the items array becomes Sidebar.Item children, handler-only items keep
// their handlers (no href fabricated). Layout-only props drop to TODO-free
// css defaults.
import { AppShell } from 'aura-glass';
import { Sidebar } from 'aura-glass';
import { TopBar } from 'aura-glass';

export function ConsolePage() {
  return (
    <AppShell.Root>
      <TopBar />
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item value="home" icon="home" onSelect={() => console.log('go /')}>
            Home
          </Sidebar.Item>
          <Sidebar.Item value="projects" onSelect={() => console.log('go /projects')}>
            Projects
          </Sidebar.Item>
          <Sidebar.Collapsible value="settings" title="Settings">
            <Sidebar.Item value="billing" onSelect={() => console.log('go /billing')}>
              Billing
            </Sidebar.Item>
          </Sidebar.Collapsible>
        </Sidebar.Nav>
      </Sidebar>
      <AppShell.Main>
        <h1>Console</h1>
      </AppShell.Main>
    </AppShell.Root>
  );
}
