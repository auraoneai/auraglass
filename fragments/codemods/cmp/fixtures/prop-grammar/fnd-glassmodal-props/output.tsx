// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

<Dialog.Root open={open} onOpenChange={(o, reason) => { if (!o) close(); /* closeOnEscape: false -> ignore reason 'escape-key' */ }}>
  <Dialog.Popup size="lg" dismissible={false}>
    <Dialog.Title>T</Dialog.Title>
    …
    {/* TODO(aura-glass 5): footer -> Dialog.Actions/Dialog.Close, see #dep-c0101 */}
  </Dialog.Popup>
</Dialog.Root>
