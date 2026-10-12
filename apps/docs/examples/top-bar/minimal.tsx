import { AppShell, TopBar } from 'aura-glass/app-shell';

export default function TopBarMinimal() {
  return (
    <AppShell.Root>
      <TopBar.Root><TopBar.Title>Northwind</TopBar.Title></TopBar.Root>
      <AppShell.Main>Dashboard</AppShell.Main>
    </AppShell.Root>
  );
}
