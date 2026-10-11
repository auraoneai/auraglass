/* test/helpers/json-schema.ts — REQ-PLAT-84: minimal draft-2020-12 subset
   validator (type / required / properties / items / enum / const /
   additionalProperties) — enough to validate CLI --json payloads against
   schema/output/*.json without adding a dependency. */

type Schema = {
  type?: string; const?: unknown; enum?: unknown[];
  required?: string[]; properties?: Record<string, Schema>;
  items?: Schema; additionalProperties?: boolean;
};

export function validateJsonSchema(value: unknown, schema: Schema, path = '$'): string[] {
  const errors: string[] = [];
  if (schema.const !== undefined && value !== schema.const)
    errors.push(`${path}: expected const ${JSON.stringify(schema.const)}, got ${JSON.stringify(value)}`);
  if (schema.enum && !schema.enum.includes(value))
    errors.push(`${path}: ${JSON.stringify(value)} not in enum`);
  if (schema.type) {
    const t = schema.type;
    const ok =
      (t === 'object' && value !== null && typeof value === 'object' && !Array.isArray(value)) ||
      (t === 'array' && Array.isArray(value)) ||
      (t === 'string' && typeof value === 'string') ||
      (t === 'number' && typeof value === 'number') ||
      (t === 'boolean' && typeof value === 'boolean') ||
      (t === 'null' && value === null);
    if (!ok) { errors.push(`${path}: expected ${t}, got ${Array.isArray(value) ? 'array' : typeof value}`); return errors; }
  }
  if (schema.type === 'object' && value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    for (const k of schema.required ?? [])
      if (!(k in obj)) errors.push(`${path}: missing required '${k}'`);
    for (const [k, sub] of Object.entries(schema.properties ?? {}))
      if (k in obj) errors.push(...validateJsonSchema(obj[k], sub, `${path}.${k}`));
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const k of Object.keys(obj))
        if (!allowed.has(k)) errors.push(`${path}: unexpected property '${k}'`);
    }
  }
  if (schema.type === 'array' && Array.isArray(value) && schema.items)
    value.forEach((v, i) => errors.push(...validateJsonSchema(v, schema.items!, `${path}[${i}]`)));
  return errors;
}
