// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
// Same shape as tests/fixtures/consumer-4x/cases/surf/app-shell/: the 4.x
// handler-only navigation pattern the app-shell-slots transform rewrites.
import { AppShell, Sidebar, TopBar } from 'aura-glass/app-shell';

export function ConsolePage() {
  return (
    <AppShell.Root>
      <TopBar.Root />
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Main">
          <Sidebar.Item icon="home" render={<button type="button" onClick={() => console.log('go /')} />}>
            Home
          </Sidebar.Item>
          <Sidebar.Item render={<button type="button" onClick={() => console.log('go /projects')} />}>
            Projects
          </Sidebar.Item>
          <Sidebar.Collapsible label="Settings">
            <Sidebar.Item render={<button type="button" onClick={() => console.log('go /billing')} />}>
              Billing
            </Sidebar.Item>
          </Sidebar.Collapsible>
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>
        <h1>Console</h1>
      </AppShell.Main>
    </AppShell.Root>
  );
}
