// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

<Dialog.Root open={o} onOpenChange={(open) => { if (!open) handleClose(); }}>…</Dialog.Root>
// onClose wraps onOpenChange: the callback fires for every close reason; programmatic close() is unchanged.
