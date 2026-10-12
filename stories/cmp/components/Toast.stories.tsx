/* CMP-293 (REQ-CMP-01/22): Toast scenes — Intents, ActionToast,
   PromiseToast, Positions — ids overlays-toast--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Toast, useToast } from '../../../src/components/toast';
import { AuraGlassProvider } from '../../../src/theme';
import { OverlayStage } from '../overlays/OverlayStage';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import type { ToastPosition } from '../../../src/components/toast';

const sbMeta = {
  title: 'Flagships/Overlays/Toast',
  component: Toast.Viewport,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Toast', kind: 'component' } },
} satisfies Meta<typeof Toast.Viewport>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

type ToastApi = ReturnType<typeof useToast>;

function ToastList({ t, position = 'bottom-right', action = false }: { t: ToastApi; position?: ToastPosition; action?: boolean }) {
  return (
    <Toast.Viewport position={position}>
      {t.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Title>{toast.title}</Toast.Title>
          {toast.description ? <Toast.Description>{toast.description}</Toast.Description> : null}
          {action ? <Toast.Action>Undo</Toast.Action> : null}
          <Toast.Close>×</Toast.Close>
          <Toast.Progress />
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

/* Playground: real triggers in the app window; each press adds a toast. */
function Toasts({ position }: { position?: ToastPosition }) {
  const t = useToast();
  return (
    <>
      <OverlayStage title="Inbox" subtitle="3 unread">
        {/* native triggers: S-33 requires the story's rendered parts to be Toast's own */}
        <button type="button" onClick={() => t.info({ title: 'Saved', description: 'Your changes were saved.' })}>Info</button>
        <button type="button" onClick={() => t.success({ title: 'Done' })}>Success</button>
        <button type="button" onClick={() => t.error({ title: 'Failed', description: 'Try again.' })}>Error</button>
      </OverlayStage>
      <ToastList t={t} {...(position ? { position } : {})} />
    </>
  );
}

/* Seeded scenes render their toasts on first paint (persistent: timeout 0),
   so the story is never an empty stage waiting for a click. */
function Seeded({ position, seeds }: { position?: ToastPosition; seeds: (t: ToastApi) => void }) {
  const t = useToast();
  const seeded = React.useRef(false);
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    seeds(t);
  }, [t, seeds]);
  return (
    <>
      <OverlayStage title="Inbox" subtitle="3 unread" />
      <ToastList t={t} {...(position ? { position } : {})} />
    </>
  );
}

const seedIntents = (t: ToastApi) => {
  t.info({ title: 'Sync paused', description: 'Reconnect to resume syncing.', timeout: 0 });
  t.success({ title: 'Invite sent', description: 'name@auraone.ai will get an email.', timeout: 0 });
  t.error({ title: 'Upload failed', description: 'The file is larger than 25 MB.', timeout: 0 });
};
const seedOne = (t: ToastApi) => {
  t.info({ title: 'Message archived', description: 'Moved to Archive.', timeout: 0 });
};

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Toast', id: 'overlays-toast--playground' } },
  render: () => (
    <AuraGlassProvider>
      <Toast.Provider>
        <Toasts />
      </Toast.Provider>
    </AuraGlassProvider>
  ),
};
export const Intents: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Toast', id: 'overlays-toast--intents' } },
  render: () => (
    <AuraGlassProvider>
      <Toast.Provider>
        <Seeded seeds={seedIntents} />
      </Toast.Provider>
    </AuraGlassProvider>
  ),
};
export const TopLeft: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Toast', id: 'overlays-toast--top-left' } },
  render: () => (
    <AuraGlassProvider>
      <Toast.Provider>
        <Seeded position="top-left" seeds={seedOne} />
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
    <>
      <OverlayStage title="Inbox" subtitle="3 unread" />
      <ToastList t={t} action />
    </>
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
