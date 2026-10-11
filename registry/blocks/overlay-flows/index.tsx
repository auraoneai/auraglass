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
/* REQ-CMP-06: overlay stack parts left the compounds; named part exports. */
import { DialogPortal, DialogBackdrop, DialogPopup } from 'aura-glass/components/dialog';
import { SheetPortal, SheetBackdrop, SheetPopup } from 'aura-glass/components/sheet';
import { PopoverPortal, PopoverPositioner, PopoverPopup } from 'aura-glass/components/popover';
import { MenuPortal, MenuPositioner, MenuPopup, ContextMenuPortal, ContextMenuPositioner, ContextMenuPopup } from 'aura-glass/components/menu';
import { TooltipPortal, TooltipPositioner, TooltipPopup } from 'aura-glass/components/tooltip';
import { rows, roles, contextMenuItems, type OverlayFlowsRow } from './fixtures';

function RowActions({ row }: { row: OverlayFlowsRow }) {
  return (
    <Menu.Root>
      <Menu.Trigger aria-label={`Actions for ${row.name}`}>
        <Button variant="clear">Actions</Button>
      </Menu.Trigger>
      <MenuPortal>
        <MenuPositioner side="bottom" align="end">
          <MenuPopup>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Share</Menu.Item>
            <Menu.Separator />
            <Menu.Item data-ag-intent="danger">Delete</Menu.Item>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
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
          <Menubar.Root aria-label="Demo">
            <Menu.Root>
              <Menu.Trigger>File</Menu.Trigger>
              <MenuPortal>
                <MenuPositioner side="bottom" align="start">
                  <MenuPopup>
                    <Menu.Item>Export</Menu.Item>
                    <Menu.Item>Import</Menu.Item>
                  </MenuPopup>
                </MenuPositioner>
              </MenuPortal>
            </Menu.Root>
          </Menubar.Root>

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
                        <TooltipPortal>
                          <TooltipPositioner side="top">
                            <TooltipPopup>Edit row</TooltipPopup>
                          </TooltipPositioner>
                        </TooltipPortal>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <IconButton label={`Delete ${r.name}`} icon={<span aria-hidden>x</span>} onClick={() => setDeleting(r)} />
                        </Tooltip.Trigger>
                        <TooltipPortal>
                          <TooltipPositioner side="top">
                            <TooltipPopup>Delete row</TooltipPopup>
                          </TooltipPositioner>
                        </TooltipPortal>
                      </Tooltip.Root>
                    </td>
                  </ContextMenu.Trigger>
                  <ContextMenuPortal>
                    <ContextMenuPositioner>
                      <ContextMenuPopup>
                        {contextMenuItems.map((i) => (
                          <ContextMenu.Item key={i.id}>{i.label}</ContextMenu.Item>
                        ))}
                      </ContextMenuPopup>
                    </ContextMenuPositioner>
                  </ContextMenuPortal>
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
            <DialogPortal>
              <DialogBackdrop />
              <DialogPopup size="md">
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
              </DialogPopup>
            </DialogPortal>
          </Dialog.Root>

          {/* bottom Sheet with detents */}
          <Sheet.Root detents={[240, 0.5, 'full']}>
            <Sheet.Trigger>Open details sheet</Sheet.Trigger>
            <SheetPortal>
              <SheetBackdrop />
              <SheetPopup side="bottom">
                <Sheet.Handle />
                <Sheet.Header><Sheet.Title>Details</Sheet.Title></Sheet.Header>
                <Sheet.Body>
                  <CheckboxGroup defaultValue={['a']} aria-label="Flags">
                    <Checkbox value="a">Flag A</Checkbox>
                    <Checkbox value="b">Flag B</Checkbox>
                  </CheckboxGroup>
                </Sheet.Body>
              </SheetPopup>
            </SheetPortal>
          </Sheet.Root>

          {/* Popover filter */}
          <Popover.Root>
            <Popover.Trigger>Filter</Popover.Trigger>
            <PopoverPortal>
              <PopoverPositioner side="bottom" align="start">
                <PopoverPopup>
                  <Popover.Title>Filter rows</Popover.Title>
                  <TextField label="Name contains" />
                  <Popover.Close>Apply</Popover.Close>
                </PopoverPopup>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover.Root>
        </div>
      </Tooltip.Provider>
    </Toast.Provider>
  );
}
export default OverlayFlows;
