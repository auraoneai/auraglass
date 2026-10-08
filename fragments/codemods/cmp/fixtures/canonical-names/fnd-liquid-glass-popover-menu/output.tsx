// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Menu } from 'aura-glass';

export function X() {
  return <Menu.Root><Menu.Trigger><Btn/></Menu.Trigger><Menu.Portal><Menu.Positioner><Menu.Popup>{items.map(i=><Menu.Item key={i.label}/>)}</Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root>;
}
