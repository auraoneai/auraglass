/**
 * Minimal JSON Schema 2020-12 validator for the CLI's own shipped schemas
 * (REQ-PLAT-89). The CLI ships no ajv; this covers exactly the keywords the
 * committed `schema/*.json` files use and throws on any other keyword so a
 * schema edit can never be silently ignored.
 */

type Schema = Record<string, unknown>;

const SUPPORTED = new Set([
  '$schema', '$id', '$defs', '$ref', 'title', 'description',
  'type', 'enum', 'const', 'required', 'properties', 'additionalProperties',
  'items', 'minItems', 'minimum', 'maximum', 'minLength', 'pattern',
]);

function typeOf(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v;
}

function typeMatches(want: string, got: string): boolean {
  return want === got || (want === 'number' && got === 'integer');
}

function resolveRef(root: Schema, ref: string): Schema {
  if (!ref.startsWith('#/')) throw new Error(`unsupported $ref: ${ref}`);
  let node: unknown = root;
  for (const part of ref.slice(2).split('/')) {
    node = (node as Record<string, unknown> | undefined)?.[part];
  }
  if (!node || typeof node !== 'object') throw new Error(`unresolved $ref: ${ref}`);
  return node as Schema;
}

function check(root: Schema, schema: Schema, value: unknown, at: string, errors: string[]): void {
  for (const key of Object.keys(schema)) {
    if (!SUPPORTED.has(key)) throw new Error(`unsupported schema keyword "${key}" at ${at}`);
  }
  if (typeof schema.$ref === 'string') {
    check(root, resolveRef(root, schema.$ref), value, at, errors);
    return;
  }
  const got = typeOf(value);
  if (schema.type !== undefined) {
    const wants = Array.isArray(schema.type) ? (schema.type as string[]) : [schema.type as string];
    if (!wants.some((w) => typeMatches(w, got))) {
      errors.push(`${at}: expected ${wants.join('|')}, got ${got}`);
      return;
    }
  }
  if ('const' in schema && value !== schema.const) errors.push(`${at}: expected const ${JSON.stringify(schema.const)}`);
  if (Array.isArray(schema.enum) && !(schema.enum as unknown[]).includes(value)) {
    errors.push(`${at}: ${JSON.stringify(value)} not in ${JSON.stringify(schema.enum)}`);
  }
  if (got === 'number' || got === 'integer') {
    const n = value as number;
    if (!Number.isFinite(n)) errors.push(`${at}: not a finite number`);
    if (typeof schema.minimum === 'number' && n < schema.minimum) errors.push(`${at}: ${n} < minimum ${schema.minimum}`);
    if (typeof schema.maximum === 'number' && n > schema.maximum) errors.push(`${at}: ${n} > maximum ${schema.maximum}`);
  }
  if (got === 'string') {
    const s = value as string;
    if (typeof schema.minLength === 'number' && s.length < schema.minLength) errors.push(`${at}: shorter than ${schema.minLength}`);
    if (typeof schema.pattern === 'string' && !new RegExp(schema.pattern, 'u').test(s)) {
      errors.push(`${at}: does not match ${schema.pattern}`);
    }
  }
  if (got === 'array') {
    const arr = value as unknown[];
    if (typeof schema.minItems === 'number' && arr.length < schema.minItems) errors.push(`${at}: fewer than ${schema.minItems} items`);
    if (schema.items && typeof schema.items === 'object') {
      arr.forEach((item, i) => check(root, schema.items as Schema, item, `${at}[${i}]`, errors));
    }
  }
  if (got === 'object') {
    const obj = value as Record<string, unknown>;
    const props = (schema.properties ?? {}) as Record<string, Schema>;
    for (const req of (schema.required ?? []) as string[]) {
      if (!(req in obj)) errors.push(`${at}: missing required "${req}"`);
    }
    for (const [k, v] of Object.entries(obj)) {
      if (props[k]) check(root, props[k], v, `${at}.${k}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${at}: unexpected property "${k}"`);
    }
  }
}

/** Validate `value` against `root.$defs[def]`; returns the list of errors (empty = valid). */
export function validateDef(root: Schema, def: string, value: unknown): string[] {
  const errors: string[] = [];
  check(root, resolveRef(root, `#/$defs/${def}`), value, '$', errors);
  return errors;
}
