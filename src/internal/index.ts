/* S-37. PLAT-owned internals barrel. `cn` and `warnDeprecated` are final;
   `deprecations`/`DEPRECATIONS` come from the generated table
   (scripts/release/gen-deprecations.mjs — never hand-edit). `cn` lives in
   ./cn (REQ-PLAT-26); nothing else in src/ imports clsx. */
export { cn } from './cn';
export { warnDeprecated, setDeprecationMode, type DeprecationMode } from './warnDeprecated';
export { DEPRECATIONS } from './deprecations.generated';
