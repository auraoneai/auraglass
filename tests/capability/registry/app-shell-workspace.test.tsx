/** @jest-environment jsdom */
// REQ-SURF-41 (SURF-060, REQ-FIN-81) — app-shell-workspace registry item:
// renders through the public 'aura-glass' entries (jest maps them to the
// ENTRIES sources, C-4) and composes AppShell + PageHeader `tabs` slot + Tabs
// with panels + ResizablePanels + Timeline + CMP Card + an open Inspector.
// No pending path: a missing subject fails the test.
import { describe, expect, it, jest } from '@jest/globals';
import { render, within } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AppShellWorkspace } from '../../../registry/items/app-shell-workspace/index';
import {
  WORKSPACE_ACTIVITY,
  WORKSPACE_CARDS,
  WORKSPACE_TABS,
} from '../../../registry/items/app-shell-workspace/fixtures';
import item from '../../../registry/items/app-shell-workspace/registry-item.json';

describe('app-shell-workspace registry item', () => {
  it('puts a tablist in the PageHeader tabs slot with exactly one tabpanel', () => {
    const { container } = render(createElement(AppShellWorkspace));
    const header = container.querySelector('[data-ag-part="page-header"]');
    expect(header).not.toBeNull();
    const slot = header!.querySelector(':scope > [data-ag-part="tabs"]');
    expect(slot).not.toBeNull();
    const tablist = within(slot as HTMLElement).getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(WORKSPACE_TABS.map((t) => t.label));
    // Tabs are no longer stuffed into the header actions.
    expect(header!.querySelector('[data-ag-part="actions"] [role="tablist"]')).toBeNull();

    const panels = within(container).getAllByRole('tabpanel');
    expect(panels).toHaveLength(1);
    const selected = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    expect(selected?.textContent).toBe('Editor');
    expect(panels[0]!.getAttribute('aria-labelledby')).toBe(selected!.id);
  });

  it('renders a Timeline root with every fixture event', () => {
    const { container } = render(createElement(AppShellWorkspace));
    const timeline = container.querySelector('ol[data-ag-part="timeline"]');
    expect(timeline).not.toBeNull();
    expect(timeline!.getAttribute('aria-label')).toBe('Document activity');
    const events = timeline!.querySelectorAll('[data-ag-part="timeline-item"]');
    expect(events).toHaveLength(WORKSPACE_ACTIVITY.length);
    for (const [i, ev] of WORKSPACE_ACTIVITY.entries()) {
      expect(events[i]!.querySelector('time')?.getAttribute('dateTime')).toBe(ev.timestamp);
    }
  });

  it('wraps auto-grid cells in CMP Cards', () => {
    const { container } = render(createElement(AppShellWorkspace));
    const grid = container.querySelector('.ag-app-shell__auto-grid');
    expect(grid).not.toBeNull();
    const cells = Array.from(grid!.children);
    expect(cells.length).toBeGreaterThanOrEqual(1);
    expect(cells).toHaveLength(WORKSPACE_CARDS.length);
    for (const cell of cells) expect(cell.classList.contains('ag-card')).toBe(true);
  });

  it('opens the Inspector complementary by default and shows ResizablePanels separators', () => {
    const { container } = render(createElement(AppShellWorkspace));
    const root = container.querySelector('.ag-app-shell');
    expect(root?.getAttribute('data-ag-inspector')).toBe('open');
    const inspector = within(container).getByRole('complementary', { name: 'Inspector' });
    expect(inspector.getAttribute('data-ag-slot')).toBe('inspector');
    const separators = within(container).getAllByRole('separator');
    expect(separators.length).toBeGreaterThanOrEqual(1);
    expect(separators.some((s) => s.getAttribute('aria-label') === 'Resize document and activity')).toBe(true);
  });

  it('server-renders the same composition', () => {
    const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const html = renderToString(createElement(AppShellWorkspace));
      expect(html).toContain('data-ag-part="tabs"');
      expect(html).toContain('role="tablist"');
      expect(html).toContain('data-ag-part="timeline"');
      expect(html).toContain('ag-app-shell__auto-grid');
      expect(html).toContain('data-ag-inspector="open"');
      expect(errors).not.toHaveBeenCalled();
    } finally {
      errors.mockRestore();
    }
  });

  it('declares its library dependency, composed components, and only its own files', () => {
    expect(item.name).toBe('app-shell-workspace');
    expect(item.type).toBe('registry:item');
    expect(item.registryDependencies).toEqual(['auraglass']);
    expect(item.meta.auraglass.components).toEqual(expect.arrayContaining(['Tabs', 'Card', 'Timeline']));
    expect(item.files.map((f) => f.path).sort()).toEqual(['fixtures.ts', 'index.tsx']);
  });
});
