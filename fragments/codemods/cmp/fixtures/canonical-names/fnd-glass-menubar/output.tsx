// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Menubar } from 'aura-glass';

export function X() {
  return <Menubar>{menus.map(m=><Menu.Root key={m.label}/>)}</Menubar>;
}
