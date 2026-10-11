/* CMP-222: AlertDialog scenes — Confirm (neutral) and Danger (intent). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AlertDialog } from '../../../src/components/alert-dialog';
import { Button } from '../../../src/components/button';
import { AuraGlassProvider } from '../../../src/theme';
import { OverlayStage } from '../overlays/OverlayStage';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/AlertDialog',
  component: AlertDialog.Root,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'AlertDialog', kind: 'component' } },
} satisfies Meta<typeof AlertDialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Confirm: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--confirm' } },
  render: () => (
    <AuraGlassProvider>
      <OverlayStage title="Untitled draft" subtitle="Edited just now" />
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Title>Discard draft?</AlertDialog.Title>
            <AlertDialog.Description>Your unsaved changes will be lost.</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Discard</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </AuraGlassProvider>
  ),
};

export const Danger: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--danger' } },
  render: () => (
    <AuraGlassProvider>
      <OverlayStage title="Acme workspace" subtitle="12 members · 48 projects" />
      <AlertDialog.Root defaultOpen intent="danger">
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Title>Delete workspace?</AlertDialog.Title>
            <AlertDialog.Description>This permanently removes the workspace and its data.</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action>Delete workspace</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </AuraGlassProvider>
  ),
};

/* Every AlertDialog part: Trigger plus the Header / Body / Footer layout. */
export const Anatomy: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--anatomy' } },
  render: () => (
    <AuraGlassProvider>
      <AlertDialog.Root defaultOpen>
        <OverlayStage title="Members" subtitle="Acme workspace">
          <AlertDialog.Trigger render={<Button intent="danger" />}>Remove member</AlertDialog.Trigger>
        </OverlayStage>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
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
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </AuraGlassProvider>
  ),
};
