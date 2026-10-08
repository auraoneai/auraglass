// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

// closeOnEscape={false} -> ignore the 'escape-key' reason; N presses still produce N attempts
<Dialog.Root open={o} onOpenChange={(open, reason) => { if (!open && reason !== 'escape-key') c(); }}>
  <Dialog.Popup>…</Dialog.Popup>
</Dialog.Root>
