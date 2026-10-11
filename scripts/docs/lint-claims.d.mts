/* Types for lint-claims.mjs. */
export interface ClaimViolation { file: string; line: number; text: string; key: string }
export function lint(root?: string): ClaimViolation[];
export function main(): void;
