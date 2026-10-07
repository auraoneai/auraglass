/* permissions-matrix (REQ-SURF-178, 5.2): roles × permissions Table with
   Checkbox cells named "{role} {permission}", row and column headers, and
   aria-describedby wiring to each permission description. */
'use client';
import * as React from 'react';
import { Table, type TableColumnDef } from 'aura-glass/data';
import { Checkbox } from 'aura-glass';
import { GRANTS, PERMISSIONS, ROLES } from './fixtures';

type Row = { permission: (typeof PERMISSIONS)[number] } & Record<string, unknown>;

const ROWS: Row[] = PERMISSIONS.map((p) => ({ permission: p, id: p.id }));

export function PermissionsMatrix() {
  const [grants, setGrants] = React.useState(GRANTS);
  const columns = React.useMemo<TableColumnDef<Row>[]>(() => [
    { id: 'permission', header: 'Permission', accessorFn: (r: Row) => r.permission.label },
    ...ROLES.map((role) => ({
      id: role,
      header: role,
      cell: (info: { row: { original: Row } }) => {
        const p = info.row.original.permission;
        const checked = grants[role]?.includes(p.id) ?? false;
        return (
          <Checkbox
            aria-label={`${role} ${p.label}`}
            aria-describedby={`desc-${p.id}`}
            checked={checked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGrants((g) => ({
                ...g,
                [role]: (e.target as HTMLInputElement).checked
                  ? [...(g[role] ?? []), p.id]
                  : (g[role] ?? []).filter((x) => x !== p.id),
              }))
            }
          />
        );
      },
    })),
  ], [grants]);
  return (
    <div data-ag-part="permissions-matrix" className="ag-permissions-matrix">
      <ul className="ag-visually-hidden">
        {PERMISSIONS.map((p) => (
          <li key={p.id} id={`desc-${p.id}`}>{p.description}</li>
        ))}
      </ul>
      <Table<Row> data={ROWS} columns={columns} getRowId={(r: Row) => r.id as string} />
    </div>
  );
}
