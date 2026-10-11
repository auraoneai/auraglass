// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Sheet } from 'aura-glass';

export function X() {
  return <Sheet.Root open={open} preset="action"><Sheet.Popup side="bottom">{actions.map(a=><Sheet.Action key={a.label}/>)}<Sheet.Close>Cancel</Sheet.Close></Sheet.Popup></Sheet.Root>;
}
