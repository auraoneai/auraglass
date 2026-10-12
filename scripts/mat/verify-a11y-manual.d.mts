/** Public helpers for the shared SrRecord schema and manual evidence verifier. */
export interface ManualRecordSchema {
  $schema?: string;
  $id?: string;
  $comment?: string;
  title?: string;
  description?: string;
  type?: string | readonly string[];
  enum?: readonly unknown[];
  const?: unknown;
  pattern?: string;
  minLength?: number;
  minimum?: number;
  minItems?: number;
  format?: string;
  required?: readonly string[];
  properties?: Record<string, ManualRecordSchema>;
  additionalProperties?: boolean;
  items?: ManualRecordSchema;
  allOf?: readonly ManualRecordSchema[];
  anyOf?: readonly ManualRecordSchema[];
  if?: ManualRecordSchema;
  then?: ManualRecordSchema;
}
export const SCHEMA_PATH: string;
export const L13_PROFILE: ManualRecordSchema;
/** Returns JSON-pointer diagnostics; unsupported schema keywords throw. */
export function validate(schema: ManualRecordSchema, value: unknown, at?: string): string[];
/** Validates both the supplied schema and the L13 evidence binding profile. */
export function validateRecord(schema: ManualRecordSchema, rec: unknown): string[];
/** File name relative to a record's stream directory. */
export function expectedName(rec: { subject: string; at: string; pass?: string }): string;
