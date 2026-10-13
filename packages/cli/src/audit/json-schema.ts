/**
 * Minimal JSON Schema 2020-12 validator for the CLI's own shipped schemas
 * (REQ-PLAT-89). The CLI ships no ajv; this covers exactly the keywords the
 * committed `schema/*.json` files use and throws on any other keyword so a
 * schema edit can never be silently ignored.
 */

type Schema = Record<string, unknown>;

const SUPPORTED = new Set([
  '$schema', '$id', '$defs', 'definitions', '$ref', 'title', 'description',
  'type', 'enum', 'const', 'required', 'properties', 'additionalProperties',
  'items', 'minItems', 'minimum', 'maximum', 'minLength', 'pattern',
  /* REQ-PLAT-87: the vendored shadcn registry-item schema (draft-07) uses
     composition + conditionals (font/base rules, file type/target rule). */
  'allOf', 'anyOf', 'oneOf', 'not', 'if', 'then', 'else',
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

function check(root: Schema, schema: Schema | boolean, value: unknown, at: string, errors: string[]): void {
  /* boolean schemas (draft-07): true accepts anything, false rejects. */
  if (schema === true) return;
  if (schema === false) { errors.push(`${at}: value not allowed here`); return; }
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
      if (k in props) check(root, props[k] as Schema | boolean, v, `${at}.${k}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${at}: unexpected property "${k}"`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        check(root, schema.additionalProperties as Schema, v, `${at}.${k}`, errors);
      }
    }
  }
  /* Composition + conditionals (REQ-PLAT-87, draft-07 semantics): a branch
     matches when checking it into a trial error list leaves that list empty. */
  const trial = (sub: Schema | boolean): string[] => {
    const errs: string[] = [];
    check(root, sub, value, at, errs);
    return errs;
  };
  if (Array.isArray(schema.allOf)) for (const sub of schema.allOf as Schema[]) check(root, sub, value, at, errors);
  if (Array.isArray(schema.anyOf) && !(schema.anyOf as Schema[]).some((s) => trial(s).length === 0)) {
    errors.push(`${at}: matches none of anyOf`);
  }
  if (Array.isArray(schema.oneOf)) {
    const n = (schema.oneOf as Schema[]).filter((s) => trial(s).length === 0).length;
    if (n !== 1) errors.push(`${at}: matches ${n} of oneOf (expected exactly 1)`);
  }
  if (schema.not !== undefined && trial(schema.not as Schema).length === 0) {
    errors.push(`${at}: matches the "not" schema`);
  }
  if (schema.if !== undefined) {
    const branch = trial(schema.if as Schema).length === 0 ? schema.then : schema.else;
    if (branch !== undefined) check(root, branch as Schema | boolean, value, at, errors);
  }
}

/** Validate `value` against the root schema itself (REQ-PLAT-87: the vendored
 *  registry-item schema has no $defs entry point). Empty result = valid. */
export function validateSchema(root: Schema, value: unknown): string[] {
  const errors: string[] = [];
  check(root, root, value, '$', errors);
  return errors;
}

/** Validate `value` against `root.$defs[def]`; returns the list of errors (empty = valid). */
export function validateDef(root: Schema, def: string, value: unknown): string[] {
  const errors: string[] = [];
  check(root, resolveRef(root, `#/$defs/${def}`), value, '$', errors);
  return errors;
}
