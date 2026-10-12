import { AppShell, StatusBar } from 'aura-glass/app-shell';

export default function StatusBarMinimal() {
  return (
    <AppShell.Root>
      <AppShell.Main>Editor</AppShell.Main>
      <StatusBar.Root><StatusBar.Item>Saved</StatusBar.Item></StatusBar.Root>
    </AppShell.Root>
  );
}
