/* CMP-222: AlertDialog scenes — Confirm (neutral) and Danger (intent). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AlertDialogPortal, AlertDialogBackdrop, AlertDialogPopup, AlertDialog } from '../../../src/components/alert-dialog';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/AlertDialog',
  component: AlertDialog.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', kind: 'component' } },
} satisfies Meta<typeof AlertDialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Confirm: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--confirm' } },
  render: () => (
    <AuraGlassProvider>
      <AlertDialog.Root defaultOpen>
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialog.Title>Discard draft?</AlertDialog.Title>
            <AlertDialog.Description>Your unsaved changes will be lost.</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Discard</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog.Root>
    </AuraGlassProvider>
  ),
};

export const Danger: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--danger' } },
  render: () => (
    <AuraGlassProvider>
      <AlertDialog.Root defaultOpen intent="danger">
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogPopup>
            <AlertDialog.Title>Delete workspace?</AlertDialog.Title>
            <AlertDialog.Description>This permanently removes the workspace and its data.</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete workspace</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog.Root>
    </AuraGlassProvider>
  ),
};
