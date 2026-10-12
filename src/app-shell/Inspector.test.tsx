/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
      <AppShell.Root layout="mobile" defaultInspector="closed">
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

  it('compact sheet is CMP Sheet side=bottom, opened only by the toggle, focus returns to it (SURF-38)', async () => {
    render(
      <AppShell.Root layout="mobile" defaultInspector="closed">
        <TopBarStub />
        <AppShell.Main />
        <Inspector.Sheet aria-label="Props">
          <Inspector.Field label="Width">40</Inspector.Field>
        </Inspector.Sheet>
      </AppShell.Root>,
    );
    // closed by default and the sheet ships no trigger of its own
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.querySelector('[data-ag-part="trigger"]')).toBeNull();
    const toggle = screen.getByRole('button', { name: 'Open inspector' });
    expect(toggle).toHaveAttribute('data-toggle', 'inspector');
    toggle.focus();
    fireEvent.click(toggle);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('data-ag-part', 'inspector-sheet');
    expect(dialog).toHaveAttribute('data-side', 'bottom');
    expect(screen.getByText('40')).toBeTruthy();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.querySelector('.ag-app-shell')).toHaveAttribute('data-ag-inspector', 'closed');
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  });

  it('non-compact shells render no sheet even when the inspector is open (SURF-38)', () => {
    render(
      // layout auto resolves the unconditioned expanded base (REQ-SURF-17).
      <AppShell.Root layout="auto" defaultInspector="open">
        <TopBarStub />
        <AppShell.Main />
        <Inspector.Sheet aria-label="Props">
          <Inspector.Field label="Width">40</Inspector.Field>
        </Inspector.Sheet>
      </AppShell.Root>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it("REQ-SURF-38: mode='sheet' presents the bottom Sheet at layout='desktop'; the inline aside is the sheet-mode slot", async () => {
    render(
      <AppShell.Root layout="desktop" defaultInspector="closed">
        <TopBarStub />
        <AppShell.Main />
        <Inspector.Root aria-label="Props" mode="sheet">
          <Inspector.Field label="Width">40</Inspector.Field>
        </Inspector.Root>
      </AppShell.Root>,
    );
    const aside = document.querySelector('[data-ag-slot="inspector"]')!;
    expect(aside).toHaveAttribute('data-inspector-mode', 'sheet');
    expect(screen.queryByRole('dialog')).toBeNull();
    const toggle = screen.getByRole('button', { name: 'Open inspector' });
    toggle.focus();
    fireEvent.click(toggle);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('data-ag-part', 'inspector-sheet');
    expect(dialog).toHaveAttribute('data-side', 'bottom');
    expect(dialog.textContent).toContain('40');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  });

  it("REQ-SURF-38: mode='docked' renders the MAT content-sunken material (content layer, no chrome variant)", () => {
    render(
      <AppShell.Root layout="auto" defaultInspector="open">
        <AppShell.Main />
        <Inspector.Root aria-label="Props" mode="docked">x</Inspector.Root>
      </AppShell.Root>,
    );
    const aside = screen.getByRole('complementary', { name: 'Props' });
    expect(aside).toHaveAttribute('data-ag-surface', '');
    expect(aside).toHaveAttribute('data-ag-layer', 'content');
    expect(aside).toHaveAttribute('data-ag-content', 'content-sunken');
    expect(aside.hasAttribute('data-ag-variant')).toBe(false);
  });

  it("REQ-SURF-38: auto docks as content-sunken under a wide shell and floats as chrome regular otherwise", () => {
    const { unmount } = render(
      <AppShell.Root layout="desktop" defaultInspector="open">
        <AppShell.Main />
        <Inspector.Root aria-label="Wide">x</Inspector.Root>
      </AppShell.Root>,
    );
    const wide = screen.getByRole('complementary', { name: 'Wide' });
    expect(document.querySelector('.ag-app-shell')).toHaveAttribute('data-mode', 'wide');
    expect(wide).toHaveAttribute('data-ag-layer', 'content');
    expect(wide).toHaveAttribute('data-ag-content', 'content-sunken');
    expect(wide.hasAttribute('data-ag-variant')).toBe(false);
    unmount();
    render(
      <AppShell.Root layout="auto" defaultInspector="open">
        <AppShell.Main />
        <Inspector.Root aria-label="Float">x</Inspector.Root>
      </AppShell.Root>,
    );
    const float = screen.getByRole('complementary', { name: 'Float' });
    expect(float).toHaveAttribute('data-ag-layer', 'chrome');
    expect(float).toHaveAttribute('data-ag-variant', 'regular');
    expect(float.hasAttribute('data-ag-content')).toBe(false);
  });

  it('REQ-SURF-38: Inspector.Root auto-mounts the compact sheet with its own children', async () => {
    render(
      <AppShell.Root layout="mobile" defaultInspector="closed">
        <TopBarStub />
        <AppShell.Main />
        <Inspector.Root aria-label="Props">
          <Inspector.Field label="Width">40</Inspector.Field>
        </Inspector.Root>
      </AppShell.Root>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open inspector' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('data-ag-part', 'inspector-sheet');
    expect(dialog).toHaveAttribute('data-side', 'bottom');
    expect(dialog.textContent).toContain('40');
  });

  it('REQ-SURF-38: a hand-rendered Inspector.Sheet wins over the auto-mounted one (one dialog)', async () => {
    render(
      <AppShell.Root layout="mobile" defaultInspector="closed">
        <TopBarStub />
        <AppShell.Main />
        <Inspector.Root aria-label="Props">
          <Inspector.Field label="Width">40</Inspector.Field>
        </Inspector.Root>
        <Inspector.Sheet aria-label="Props">
          <Inspector.Field label="Height">90</Inspector.Field>
        </Inspector.Sheet>
      </AppShell.Root>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open inspector' }));
    await screen.findByRole('dialog');
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('dialog').textContent).toContain('90');
  });
});

function TopBarStub() {
  return (
    <header>
      <AppShellInspectorToggleStub />
    </header>
  );
}
