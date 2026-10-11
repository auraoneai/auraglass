/** @jest-environment jsdom */
// SURF-251 / REQ-SURF-178 (REQ-FIN-88, AC-FIN-88) — permissions-matrix,
// rendered against the REAL library sources: permission row headers
// (<th scope="row"> via the Table rowHeader column option), role column
// headers (<th scope="col">), checkboxes named '{role} {permission}' whose
// aria-describedby resolves to the rendered permission description.
//
// Resolution: the public specifiers are aliased to their
// src/contracts/entries.ts sources via jest.requireActual until the root
// mapper lands (REQ-FIN-09 / contract C-4, FIN-A).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/data', () => jest.requireActual('../../../src/data/index'), { virtual: true });

import { PermissionsMatrix } from '../../../registry/blocks/permissions-matrix/index';
import { GRANTS, PERMISSIONS, ROLES } from '../../../registry/blocks/permissions-matrix/fixtures';

// jsdom lacks PointerEvent; Base UI Checkbox dispatches it on activation.
if (typeof window.PointerEvent !== 'function') {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
}

afterEach(cleanup);

/** jest-axe result shape (the package ships no types for it here). */
type AxeResult = { violations: Array<{ id: string; nodes: Array<{ target: unknown }> }> };

describe('permissions-matrix block', () => {
  it('renders one row header per permission (<th scope="row">)', () => {
    const { container } = render(<PermissionsMatrix />);
    const rowHeaders = screen.getAllByRole('rowheader');
    expect(rowHeaders).toHaveLength(PERMISSIONS.length);
    for (const th of rowHeaders) {
      expect(th.tagName).toBe('TH');
      expect(th.getAttribute('scope')).toBe('row');
    }
    expect(container.querySelectorAll('tbody th[scope="row"]')).toHaveLength(PERMISSIONS.length);
    PERMISSIONS.forEach((p, i) => expect(rowHeaders[i]!.textContent).toContain(p.label));
  });

  it('role columns are <th scope="col">', () => {
    render(<PermissionsMatrix />);
    const colHeaders = screen.getAllByRole('columnheader');
    const roleHeaders = colHeaders.filter((th) => (ROLES as readonly string[]).includes(th.textContent!.trim()));
    expect(roleHeaders).toHaveLength(ROLES.length);
    for (const th of roleHeaders) {
      expect(th.tagName).toBe('TH');
      expect(th.getAttribute('scope')).toBe('col');
    }
  });

  it("every checkbox is named '{role} {permission}'", () => {
    render(<PermissionsMatrix />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(ROLES.length * PERMISSIONS.length);
    for (const role of ROLES) for (const p of PERMISSIONS) {
      const cb = screen.getByRole('checkbox', { name: `${role} ${p.label}` });
      expect(cb.getAttribute('aria-checked')).toBe(String(GRANTS[role]!.includes(p.id)));
    }
  });

  it('aria-describedby resolves to the rendered permission description', () => {
    render(<PermissionsMatrix />);
    for (const p of PERMISSIONS) {
      const cb = screen.getByRole('checkbox', { name: `Viewer ${p.label}` });
      const id = cb.getAttribute('aria-describedby')!;
      const target = document.getElementById(id)!;
      expect(target).not.toBeNull();
      expect(target.textContent).toBe(p.description);
      // The description is rendered inside the permission's own row header.
      expect(target.closest('th[scope="row"]')).not.toBeNull();
    }
  });

  it('toggling a cell updates its grant', async () => {
    const onGrantsChange = jest.fn();
    render(<PermissionsMatrix onGrantsChange={onGrantsChange} />);
    const cb = screen.getByRole('checkbox', { name: 'Viewer Edit project' });
    expect(cb.getAttribute('aria-checked')).toBe('false');
    await act(async () => { fireEvent.click(cb); });
    expect(screen.getByRole('checkbox', { name: 'Viewer Edit project' }).getAttribute('aria-checked')).toBe('true');
    expect(onGrantsChange).toHaveBeenLastCalledWith(expect.objectContaining({ Viewer: ['project.read', 'project.write'] }));
  });

  it('has 0 axe violations', async () => {
    const { container } = render(<PermissionsMatrix />);
    const r = (await axe(container, { rules: { region: { enabled: false } } })) as AxeResult;
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(',')}`)).toEqual([]);
  });

  it('names the table', () => {
    render(<PermissionsMatrix />);
    expect(within(screen.getByRole('table')).getByText('Role permissions')).toBeTruthy();
  });
});
