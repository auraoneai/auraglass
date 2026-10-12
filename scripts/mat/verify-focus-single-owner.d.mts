/* Type declarations for verify-focus-single-owner.mjs (REQ-MAT-61), so TS tests can import it. */
export interface FocusFinding { rule: 'focus-indicator' | 'outline-removal' | 'tailwind-outline-none' | 'inline-outline-removal'; file: string; line: number; detail: string }
export function scanCss(css: string, rel: string): FocusFinding[];
export function scanJs(text: string, rel: string): FocusFinding[];
export function verifyFocusSingleOwner(root?: string, srcDir?: string): FocusFinding[];
