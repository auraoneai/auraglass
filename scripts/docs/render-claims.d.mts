/* Types for render-claims.mjs. */
import type { Claims } from './claims.js';
export function render(text: string, claims: Claims): string;
export function renderFile(path: string, claims: Claims): number;
export function main(): void;
