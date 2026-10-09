// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassDropdownMenu, GlassDropdownMenuTrigger, GlassDropdownMenuContent, GlassDropdownMenuItem } from 'aura-glass';

export function X() {
  return (
    <GlassDropdownMenu>
      <GlassDropdownMenuTrigger>Open</GlassDropdownMenuTrigger>
      <GlassDropdownMenuContent>
        <GlassDropdownMenuItem>Edit</GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
  );
}
