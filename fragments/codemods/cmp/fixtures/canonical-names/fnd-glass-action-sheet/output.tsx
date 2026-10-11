// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Button, Sheet } from 'aura-glass';

export function X() {
  return <Sheet.Root open={open} preset="action"><Sheet.Content side="bottom">{actions.map(a=><Button key={a.label}/>)}<Sheet.Close>Cancel</Sheet.Close></Sheet.Content></Sheet.Root>;
}
