import { AppShell, Sidebar, TopBar } from 'aura-glass/app-shell';

export default function AppShellMinimal() {
  return (
    <AppShell.Root>
      <AppShell.SkipLink />
      <TopBar.Root><TopBar.Title>Northwind</TopBar.Title></TopBar.Root>
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Main">
          <Sidebar.Item href="/home">Home</Sidebar.Item>
          <Sidebar.Item href="/reports">Reports</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main><h1>Home</h1></AppShell.Main>
    </AppShell.Root>
  );
}
