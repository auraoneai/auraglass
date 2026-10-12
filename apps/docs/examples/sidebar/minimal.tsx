import { AppShell, Sidebar } from 'aura-glass/app-shell';

export default function SidebarMinimal() {
  return (
    <AppShell.Root>
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Main">
          <Sidebar.Item href="/inbox">Inbox</Sidebar.Item>
          <Sidebar.Item href="/archive">Archive</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>Inbox</AppShell.Main>
    </AppShell.Root>
  );
}
