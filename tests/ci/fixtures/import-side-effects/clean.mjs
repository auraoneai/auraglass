// REQ-PLAT-41 fixture: a module with no global side effects on import.
export const value = 1;
export function noop() {
  return value;
}
