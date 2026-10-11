// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { AppShell, Sidebar } from 'aura-glass/app-shell';

export function Mail() {
  return (
    <AppShell.Root defaultSidebar="rail">
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Main">
          <Sidebar.Item icon="inbox" href="/inbox">
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="/reports">
            Reports
          </Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>
        <p>Mail</p>
      </AppShell.Main>
    </AppShell.Root>
  );
}
