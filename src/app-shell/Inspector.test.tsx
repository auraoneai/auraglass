/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { Inspector } from './Inspector';
import { AppShellInspectorToggle as AppShellInspectorToggleStub } from './AppShell.InspectorToggle';

describe('Inspector (SURF-058)', () => {
  it('renders a labelled aside in the inspector slot', () => {
    render(
      <AppShell.Root defaultInspector="open">
        <Inspector.Root aria-label="Properties">
          <Inspector.Header title="Props" />
          <Inspector.Content>
            <Inspector.Field label="Name">Alpha</Inspector.Field>
          </Inspector.Content>
        </Inspector.Root>
        <AppShell.Main />
      </AppShell.Root>,
    );
    const aside = screen.getByRole('complementary', { name: 'Properties' });
    expect(aside).toHaveAttribute('data-ag-slot', 'inspector');
    expect(screen.getByText('Alpha')).toBeTruthy();
  });

  it('dev-warns when aria-label is missing', () => {
    const prevEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const RootAny = Inspector.Root as unknown as React.FC<Record<string, unknown>>;
    render(
      <AppShell.Root>
        <RootAny />
        <AppShell.Main />
      </AppShell.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('aria-label'));
    warn.mockRestore();
    process.env['NODE_ENV'] = prevEnv;
  });

  it('Section collapses its content region', () => {
    render(
      <Inspector.Root aria-label="P">
        <Inspector.Section title="Details" defaultOpen={false}>
          <Inspector.Field label="K">v</Inspector.Field>
        </Inspector.Section>
      </Inspector.Root>,
    );
    const section = document.querySelector('[data-ag-part="inspector-section"]')!;
    expect(section).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
  });

  it('Section hides field when closed, opens on trigger click (SURF-37)', () => {
    render(
      <Inspector.Root aria-label="I">
        <Inspector.Section title="Fields" defaultOpen={false}>
          <Inspector.Field label="W">40</Inspector.Field>
        </Inspector.Section>
      </Inspector.Root>,
    );
    const trigger = screen.getByRole('button', { name: 'Fields' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('40')).toBeNull();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('40')).toBeTruthy();
  });

  it('compact: closed inspector renders no dialog; toggle opens Sheet (SURF-38)', async () => {
    render(
      <AppShell.Root layout="compact" defaultInspector="closed">
        <TopBarStub />
        <AppShell.Main />
        <Inspector.Sheet aria-label="Props">
          <Inspector.Header title="Props" />
        </Inspector.Sheet>
      </AppShell.Root>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    const toggle = screen.getByRole('button', { name: /inspector/i });
    fireEvent.click(toggle);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeTruthy();
  });
});

function TopBarStub() {
  return (
    <header>
      <AppShellInspectorToggleStub />
    </header>
  );
}
