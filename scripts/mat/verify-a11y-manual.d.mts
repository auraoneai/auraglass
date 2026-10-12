/* Type declarations for verify-a11y-manual.mjs (REQ-FIN-110), so TS tests can import it. */
export const SCHEMA_PATH: string;
/** The JSON-Schema subset validate() supports (see KEYWORDS in the .mjs). */
export interface Schema {
  readonly [keyword: string]: unknown;
}
export const L13_PROFILE: Schema;
export function validate(schema: Schema, value: unknown, at?: string): string[];
export function validateRecord(schema: Schema, rec: unknown): string[];
export function expectedName(rec: { subject: string; at: string; pass?: string }): string;
