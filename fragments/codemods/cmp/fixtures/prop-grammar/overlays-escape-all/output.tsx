// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

// closeOnEscape={false} -> ignore the 'escape-key' reason; N presses still produce N attempts
<Dialog.Root open={o} onOpenChange={(open, details) => { if (!open && details.reason !== 'escape-key') c(); }}>
  <Dialog.Content>…</Dialog.Content>
</Dialog.Root>
