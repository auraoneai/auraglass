/* permissions-matrix (REQ-SURF-178, 5.2): roles × permissions Table. The
   permission column is the row header (<th scope="row"> via the Table
   `meta.rowHeader` column option) and renders the permission's description;
   role columns are <th scope="col">. Each Checkbox is named
   "{role} {permission}" and aria-describedby points at that rendered
   description element. */
'use client';
import * as React from 'react';
import { Table, type TableColumnDef } from 'aura-glass/data';
import { Checkbox } from 'aura-glass';
import { GRANTS, PERMISSIONS, ROLES } from './fixtures';

type Permission = (typeof PERMISSIONS)[number];
type Row = { id: string; permission: Permission };

const ROWS: Row[] = PERMISSIONS.map((p) => ({ permission: p, id: p.id }));

export const descriptionId = (permissionId: string) => `ag-permissions-desc-${permissionId.replace(/[^a-z0-9-]/gi, '-')}`;

export interface PermissionsMatrixProps {
  /** Initial grants per role (uncontrolled). */
  defaultGrants?: Record<string, string[]>;
  onGrantsChange?: (grants: Record<string, string[]>) => void;
}

export function PermissionsMatrix({ defaultGrants = GRANTS, onGrantsChange }: PermissionsMatrixProps = {}) {
  const [grants, setGrants] = React.useState(defaultGrants);
  const toggle = React.useCallback((role: string, id: string, on: boolean) => {
    setGrants((g) => {
      const next = { ...g, [role]: on ? [...new Set([...(g[role] ?? []), id])] : (g[role] ?? []).filter((x) => x !== id) };
      onGrantsChange?.(next);
      return next;
    });
  }, [onGrantsChange]);
  const columns = React.useMemo<TableColumnDef<Row>[]>(() => [
    {
      id: 'permission',
      header: 'Permission',
      meta: { rowHeader: true, headerLabel: 'Permission' },
      accessorFn: (r: Row) => r.permission.label,
      cell: (info: { row: { original: Row } }) => {
        const p = info.row.original.permission;
        return (
          <span className="ag-permissions-matrix__permission">
            <span data-ag-part="permission-label">{p.label}</span>
            <span id={descriptionId(p.id)} data-ag-part="permission-description" className="ag-permissions-matrix__description">{p.description}</span>
          </span>
        );
      },
    },
    ...ROLES.map((role): TableColumnDef<Row> => ({
      id: role,
      header: role,
      meta: { headerLabel: role, align: 'center' },
      cell: (info: { row: { original: Row } }) => {
        const p = info.row.original.permission;
        const checked = grants[role]?.includes(p.id) ?? false;
        return (
          <Checkbox
            aria-label={`${role} ${p.label}`}
            aria-describedby={descriptionId(p.id)}
            checked={checked}
            onCheckedChange={(on: boolean) => toggle(role, p.id, on)}
          />
        );
      },
    })),
  ], [grants, toggle]);
  return (
    <div data-ag-part="permissions-matrix" className="ag-permissions-matrix">
      <Table<Row> data={ROWS} columns={columns} getRowId={(r: Row) => r.id} caption="Role permissions" />
    </div>
  );
}
