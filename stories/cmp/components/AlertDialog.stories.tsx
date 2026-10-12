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
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'AlertDialog', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof AlertDialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

/* Records the last close reason on window for the APG spec (Escape -> 'escape-key'). */
function DiscardDraft() {
  return (
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
  );
}

/* Usage: a trigger that opens a confirmation. */
export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--playground' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger>Archive project</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Archive this project?</AlertDialog.Title>
          <AlertDialog.Description>It becomes read-only; you can restore it from Settings.</AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Archive</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};

/* The action while a request is in flight: disabled until the server answers. */
export const States: Story = {
  parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--states' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title>Revoke API key?</AlertDialog.Title>
          <AlertDialog.Description>Requests signed with this key start failing immediately.</AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action intent="danger" disabled>Revoking…</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};

export const Confirm: Story = { parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--confirm' } }, render: () => <DiscardDraft /> };

/* The story tests/a11y/apg/cmp/alert-dialog.apg.spec.ts drives: initial focus on Cancel, outside press ignored,
   Escape closes with reason 'escape-key' and returns focus. */
export const Keyboard: Story = { tags: ['apg'], parameters: { ag: { tier: 'standard', subject: 'AlertDialog', id: 'overlays-alert-dialog--keyboard' } }, render: () => <DiscardDraft /> };

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
