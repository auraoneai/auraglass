/* CMP-222: AlertDialog scenes — Confirm (neutral) and Danger (intent). */
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AlertDialog } from '../../../src/components/alert-dialog';
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
    <AuraGlassProvider><OverlayStage>
      <AlertDialog.Root defaultOpen onOpenChange={(_o, d) => {
        (window as unknown as { __agLastReason?: unknown }).__agLastReason = d?.reason;
      }}>
          <AlertDialog.Content>
            <AlertDialog.Title>Discard draft?</AlertDialog.Title>
            <AlertDialog.Description>Your unsaved changes will be lost.</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Discard</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
      </AlertDialog.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};

export const Danger: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--danger' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <AlertDialog.Root defaultOpen>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete workspace?</AlertDialog.Title>
            <AlertDialog.Description>This permanently removes the workspace and its data.</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action intent="danger">Delete workspace</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
      </AlertDialog.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};

/* Every AlertDialog part: Trigger plus the Header / Body / Footer layout. */
export const Anatomy: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--anatomy' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger>Remove member</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Remove member?</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <AlertDialog.Description>They lose access to every project in this workspace.</AlertDialog.Description>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Remove</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};
