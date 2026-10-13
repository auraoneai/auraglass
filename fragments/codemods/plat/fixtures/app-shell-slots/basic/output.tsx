import { AppShell, Sidebar, TopBar } from 'aura-glass/app-shell';
export const p = <AppShell.Root>
      <TopBar.Root />
      <Sidebar.Root>
        <Sidebar.Nav aria-label="Main">
          <Sidebar.Item render={<button type="button" onClick={() => run()} />}>
            Home
          </Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>
        <h1>T</h1>
      </AppShell.Main>
    </AppShell.Root>;
