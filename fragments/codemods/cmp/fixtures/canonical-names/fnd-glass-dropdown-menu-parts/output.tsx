// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassDropdownMenuRoot, GlassDropdownMenuTrigger, GlassDropdownMenuContent, GlassDropdownMenuItem } from 'aura-glass/compat';

export function X() {
  return (
    <GlassDropdownMenuRoot>
      <GlassDropdownMenuTrigger>Open</GlassDropdownMenuTrigger>
      <GlassDropdownMenuContent>
        <GlassDropdownMenuItem>Edit</GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenuRoot>
  );
}
