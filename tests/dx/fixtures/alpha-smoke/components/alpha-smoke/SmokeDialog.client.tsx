'use client';
/* AlphaSmoke dialog island — interactive compounds (Dialog.*) are client
   components: a namespace member (Dialog.Root) cannot be accessed from a
   Server Component, so the dialog lives behind this client leaf while the
   page itself stays a Server Component. This is the consumer pattern the
   quickstart documents for interactive overlays. */
import { Dialog } from 'aura-glass';

export function SmokeDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Alpha smoke</Dialog.Title>
        <Dialog.Description>Surface, Button and Dialog from the packed aura-glass.</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}
