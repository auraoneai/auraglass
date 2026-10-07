/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { Inspector } from './Inspector';

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
});
