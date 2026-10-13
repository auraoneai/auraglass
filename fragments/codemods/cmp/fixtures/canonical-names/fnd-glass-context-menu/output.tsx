// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ContextMenu } from 'aura-glass';

export function X() {
  return <ContextMenu.Root><ContextMenu.Trigger><Area/></ContextMenu.Trigger><ContextMenu.Content>{items.map((i: any)=><ContextMenu.Item key={i.label}/>)}</ContextMenu.Content></ContextMenu.Root>;
}
