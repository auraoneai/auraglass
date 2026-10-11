// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Dialog } from 'aura-glass';

<Dialog.Root open={o} onOpenChange={(open) => { if (!open) c(); }}>
  <Dialog.Content dismissible={false}>…</Dialog.Content>
</Dialog.Root>
// TODO(aura-glass 5): tests clicking role=dialog backdrop must target the popup's outside-press layer instead, see docs/migration
