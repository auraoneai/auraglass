// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Button } from 'aura-glass';

export function X() {
  return (
    <>
      {/* TODO(aura-glass 5): variant 'gradient' has no 5.0 mapping — pick variant/intent, see #dep-c0001 */}
      <Button>Go</Button>
      <Button variant="prominent" startIcon={<I/>}>Save</Button>
    </>
  );
}
