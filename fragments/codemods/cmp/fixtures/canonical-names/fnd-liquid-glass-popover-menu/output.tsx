// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Menu } from 'aura-glass';

export function X() {
  return <Menu.Root><Menu.Trigger><Btn/></Menu.Trigger><Menu.Content>{items.map(i=><Menu.Item key={i.label}/>)}</Menu.Content></Menu.Root>;
}
