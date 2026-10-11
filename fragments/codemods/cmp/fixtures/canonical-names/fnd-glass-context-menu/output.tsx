// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { ContextMenu } from 'aura-glass';

export function X() {
  return <ContextMenu.Root><ContextMenu.Trigger><Area/></ContextMenu.Trigger><ContextMenu.Portal><ContextMenu.Positioner><ContextMenu.Popup>{items.map(i=><ContextMenu.Item key={i.label}/>)}</ContextMenu.Popup></ContextMenu.Positioner></ContextMenu.Portal></ContextMenu.Root>;
}
