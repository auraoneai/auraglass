/* CMP-293 (REQ-CMP-01/22): Toast scenes — Intents, ActionToast,
   PromiseToast, Positions — ids overlays-toast--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Toast, useToast } from '../../../src/components/toast';
import { Button } from '../../../src/components/button';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import type { ToastPosition } from '../../../src/components/toast';

const sbMeta = {
  title: 'Flagships/Overlays/Toast',
  component: Toast.Viewport,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Toast', kind: 'component' } },
} satisfies Meta<typeof Toast.Viewport>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

function Toasts() {
  const t = useToast();
  return (
    <>
      <Button onClick={() => t.info({ title: 'Saved', description: 'Your changes were saved.' })}>Info</Button>{' '}
      <Button onClick={() => t.success({ title: 'Done' })}>Success</Button>{' '}
      <Button onClick={() => t.error({ title: 'Failed', description: 'Try again.' })}>Error</Button>
      <Toast.Viewport>
        {t.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            <Toast.Close>×</Toast.Close>
            <Toast.Progress />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </>
  );
}

const Host = ({ position = 'bottom-right' }: { position?: ToastPosition }) => (
  <AuraGlassProvider>
    <Toast.Provider>
      <Toasts />
    </Toast.Provider>
  </AuraGlassProvider>
);

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Toast', id: 'overlays-toast--playground' } },
  render: () => <Host />,
};
export const Intents: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Toast', id: 'overlays-toast--intents' } },
  render: () => <Host />,
};
export const PartsCoverage: Story = {
  render: () => (
    <Toast.Provider>
      <Toast.Viewport>
        <Toast.Root toast={{ id: 't1', title: 'Saved', description: 'Done' } as never}>
          <Toast.Title>Saved</Toast.Title>
          <Toast.Description>Your changes were saved.</Toast.Description>
          <Toast.Action altText="Undo">Undo</Toast.Action>
          <Toast.Close>×</Toast.Close>
          <Toast.Progress />
        </Toast.Root>
      </Toast.Viewport>
    </Toast.Provider>
  ),
};

export const TopLeft: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Toast', id: 'overlays-toast--top-left' } },
  render: () => (
    <AuraGlassProvider>
      <Toast.Provider>
        <Toasts />
      </Toast.Provider>
    </AuraGlassProvider>
  ),
};
