import { AppShell, Inspector } from 'aura-glass/app-shell';

export default function InspectorMinimal() {
  return (
    <AppShell.Root defaultInspector="open">
      <AppShell.Main>Selected file: report.pdf</AppShell.Main>
      <Inspector.Root aria-label="Details">
        <Inspector.Content>Size 2.4 MB · Modified today</Inspector.Content>
      </Inspector.Root>
    </AppShell.Root>
  );
}
