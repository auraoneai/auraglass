/* CMP-293 (REQ-CMP-01/22): Toast scenes — Intents, ActionToast,
   PromiseToast, Positions — ids overlays-toast--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Toast, useToast } from '../../../src/components/toast';
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
      <button type="button" onClick={() => t.info({ title: 'Saved', description: 'Your changes were saved.' })}>Info</button>{' '}
      <button type="button" onClick={() => t.success({ title: 'Done' })}>Success</button>{' '}
      <button type="button" onClick={() => t.error({ title: 'Failed', description: 'Try again.' })}>Error</button>
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

/* Every Toast part on first paint: one toast with an action, added on mount. */
function SeededToast() {
  const t = useToast();
  const seeded = React.useRef(false);
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    t.info({ title: 'Message archived', description: 'Moved to Archive.', actionLabel: 'Undo', onAction: () => undefined, timeout: 0 });
  }, [t]);
  return (
    <Toast.Viewport>
      {t.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.Action>Undo</Toast.Action>
          <Toast.Close>×</Toast.Close>
          <Toast.Progress />
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

export const Anatomy: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Toast', id: 'overlays-toast--anatomy' } },
  render: () => (
    <AuraGlassProvider>
      <Toast.Provider>
        <SeededToast />
      </Toast.Provider>
    </AuraGlassProvider>
  ),
};
