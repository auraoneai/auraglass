// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassModal } from 'aura-glass';

<GlassModal open={o} onClose={c} closeOnBackdropClick={false}>…</GlassModal>
// in test: fireEvent.click(screen.getByRole('dialog').parentElement)
