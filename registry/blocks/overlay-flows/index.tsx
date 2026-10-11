'use client';
/* CMP-346: registry block overlay-flows — the GA overlay block (SC-32). Covers:
   confirm-delete AlertDialog, edit Dialog with form, bottom Sheet with detents,
   Popover filter, Menu + ContextMenu row actions, Tooltip on IconButtons and a
   Toast with undo — all on 5.0 flagships only. */
import * as React from 'react';
import { AlertDialog } from 'aura-glass';
import { Dialog } from 'aura-glass';
import { Sheet } from 'aura-glass';
import { Popover } from 'aura-glass';
import { Menu, Menubar, ContextMenu } from 'aura-glass';
import { Tooltip } from 'aura-glass';
import { Toast, useToast } from 'aura-glass';
import { Button } from 'aura-glass';
import { IconButton } from 'aura-glass';
import { Field } from 'aura-glass';
import { Select } from 'aura-glass';
import { TextField } from 'aura-glass';
import { CheckboxGroup, Checkbox } from 'aura-glass';
import { rows, roles, contextMenuItems, type OverlayFlowsRow } from './fixtures';

function RowActions({ row }: { row: OverlayFlowsRow }) {
  return (
    <Menu.Root>
      <Menu.Trigger aria-label={`Actions for ${row.name}`}>
        <Button variant="clear">Actions</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end">
          <Menu.Popup>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Share</Menu.Item>
            <Menu.Separator />
            <Menu.Item data-ag-intent="danger">Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function UndoToast() {
  const t = useToast();
  return (
    <Button
      onClick={() =>
        t.add({
          title: 'Row archived',
          intent: 'info',
          data: { undo: true },
        })
      }
    >
      Archive row (toast)
    </Button>
  );
}

export function OverlayFlows() {
  const [deleting, setDeleting] = React.useState<OverlayFlowsRow | null>(null);
  const [editing, setEditing] = React.useState<OverlayFlowsRow | null>(null);
  return (
    <Toast.Provider>
      <Toast.Viewport position="bottom-right" />
      <Tooltip.Provider>
        <div data-ag-part="overlay-flows" style={{ display: 'grid', gap: 16 }}>
          <Menubar aria-label="Demo">
            <Menu.Root>
              <Menu.Trigger>File</Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner side="bottom" align="start">
                  <Menu.Popup>
                    <Menu.Item>Export</Menu.Item>
                    <Menu.Item>Import</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Menubar>

          <table>
            <thead>
              <tr><th>Name</th><th>Role</th><th>Last seen</th><th aria-label="Actions" /></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <ContextMenu.Root key={r.id}>
                  <ContextMenu.Trigger render={<tr />}>
                    <td>{r.name}</td>
                    <td>{r.role}</td>
                    <td>{r.lastSeen}</td>
                    <td>
                      <RowActions row={r} />
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <IconButton label={`Edit ${r.name}`} icon={<span aria-hidden>*</span>} onClick={() => setEditing(r)} />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Positioner side="top">
                            <Tooltip.Popup>Edit row</Tooltip.Popup>
                          </Tooltip.Positioner>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <IconButton label={`Delete ${r.name}`} icon={<span aria-hidden>x</span>} onClick={() => setDeleting(r)} />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Positioner side="top">
                            <Tooltip.Popup>Delete row</Tooltip.Popup>
                          </Tooltip.Positioner>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </td>
                  </ContextMenu.Trigger>
                  <ContextMenu.Portal>
                    <ContextMenu.Positioner>
                      <ContextMenu.Popup>
                        {contextMenuItems.map((i) => (
                          <ContextMenu.Item key={i.id}>{i.label}</ContextMenu.Item>
                        ))}
                      </ContextMenu.Popup>
                    </ContextMenu.Positioner>
                  </ContextMenu.Portal>
                </ContextMenu.Root>
              ))}
            </tbody>
          </table>

          <UndoToast />

          {/* confirm-delete AlertDialog */}
          <AlertDialog.Root
            intent="danger"
            open={deleting !== null}
            onOpenChange={(o) => { if (!o) setDeleting(null); }}
          >
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Delete {deleting?.name}?</AlertDialog.Title>
                <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action onClick={() => setDeleting(null)}>Delete</AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>

          {/* edit Dialog with form */}
          <Dialog.Root
            open={editing !== null}
            onOpenChange={(o) => { if (!o) setEditing(null); }}
          >
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Popup size="md">
                <Dialog.Header>
                  <Dialog.Title>Edit {editing?.name}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Field.Control render={<input defaultValue={editing?.name} />} />
                  </Field.Root>
                  <Select.Root defaultValue={editing?.role}>
                    <Select.Trigger placeholder="Role" />
                    <Select.Content>
                      {roles.map((r) => <Select.Item key={r} value={r} label={r} />)}
                    </Select.Content>
                  </Select.Root>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close>Cancel</Dialog.Close>
                  <Dialog.Close data-ag-intent="primary">Save</Dialog.Close>
                </Dialog.Footer>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>

          {/* bottom Sheet with detents */}
          <Sheet.Root detents={[240, 0.5, 'full']}>
            <Sheet.Trigger>Open details sheet</Sheet.Trigger>
            <Sheet.Portal>
              <Sheet.Backdrop />
              <Sheet.Popup side="bottom">
                <Sheet.Handle />
                <Sheet.Header><Sheet.Title>Details</Sheet.Title></Sheet.Header>
                <Sheet.Body>
                  <CheckboxGroup defaultValue={['a']} aria-label="Flags">
                    <Checkbox value="a">Flag A</Checkbox>
                    <Checkbox value="b">Flag B</Checkbox>
                  </CheckboxGroup>
                </Sheet.Body>
              </Sheet.Popup>
            </Sheet.Portal>
          </Sheet.Root>

          {/* Popover filter */}
          <Popover.Root>
            <Popover.Trigger>Filter</Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner side="bottom" align="start">
                <Popover.Popup>
                  <Popover.Title>Filter rows</Popover.Title>
                  <TextField label="Name contains" />
                  <Popover.Close>Apply</Popover.Close>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </Tooltip.Provider>
    </Toast.Provider>
  );
}
export default OverlayFlows;
