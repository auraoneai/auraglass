#!/usr/bin/env node
/* AuraGlass token schema validator (REQ-MAT-02).
   Hand-rolled JSON Schema 2020-12 subset — the frozen devDependency set has no ajv
   (contract §4.12), so schema validation lives here. Used by scripts/tokens/build.mjs
   and tests/tokens/schema.test.ts; exits 1 naming the failing token path.

   Usage: node scripts/tokens/validate.mjs [--schema <path>] <file.tokens.json>... */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// ---------- JSON Schema 2020-12 subset ----------

const TYPES = {
  object: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
  array: (v) => Array.isArray(v),
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number' && !Number.isNaN(v),
  integer: (v) => Number.isInteger(v),
  boolean: (v) => typeof v === 'boolean',
  null: (v) => v === null,
};

function resolveRef(ref, root) {
  if (!ref.startsWith('#/')) return null;
  let node = root;
  for (const seg of ref.slice(2).split('/')) {
    if (node == null || typeof node !== 'object') return null;
    node = node[seg];
  }
  return node ?? null;
}

function typeName(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

/** Validate `value` against `schema`. Returns a list of error strings (empty = valid). */
export function validateValue(value, schema, rootSchema = schema, path = '$', errors = []) {
  if (value === undefined) return errors;   // absent optional members are not checked
  if (schema === true || schema == null) return errors;
  if (schema === false) { errors.push(`${path}: rejected by schema false`); return errors; }
  if (typeof schema !== 'object') return errors;

  if (schema.$ref) {
    const target = resolveRef(schema.$ref, rootSchema);
    if (!target) { errors.push(`${path}: unresolvable $ref ${schema.$ref}`); return errors; }
    return validateValue(value, target, rootSchema, path, errors);
  }
  if (schema.allOf) for (const s of schema.allOf) validateValue(value, s, rootSchema, path, errors);
  if (schema.anyOf) {
    const ok = schema.anyOf.some((s) => validateValue(value, s, rootSchema, path, []).length === 0);
    if (!ok) errors.push(`${path}: matches none of anyOf`);
  }
  if (schema.oneOf) {
    const n = schema.oneOf.filter((s) => validateValue(value, s, rootSchema, path, []).length === 0).length;
    if (n !== 1) errors.push(`${path}: matches ${n} of oneOf (need 1)`);
  }
  if (schema.not && validateValue(value, schema.not, rootSchema, path, []).length === 0)
    errors.push(`${path}: matches 'not' schema`);
  if (schema.const !== undefined && JSON.stringify(value) !== JSON.stringify(schema.const))
    errors.push(`${path}: !== const ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(value)))
    errors.push(`${path}: ${JSON.stringify(value)} not in enum`);

  const t = schema.type;
  if (t) {
    const list = Array.isArray(t) ? t : [t];
    if (!list.some((name) => TYPES[name]?.(value))) {
      errors.push(`${path}: type ${typeName(value)} not in ${list.join('|')}`);
      return errors;
    }
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: ${value} < min ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${path}: ${value} > max ${schema.maximum}`);
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) errors.push(`${path}: ${value} <= exclusiveMin`);
    if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) errors.push(`${path}: ${value} >= exclusiveMax`);
  }
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: "${value}" fails pattern ${schema.pattern}`);
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: shorter than minLength`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}: longer than maxLength`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: fewer than minItems`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${path}: more than maxItems`);
    if (schema.prefixItems) {
      for (let i = 0; i < Math.min(value.length, schema.prefixItems.length); i++)
        validateValue(value[i], schema.prefixItems[i], rootSchema, `${path}[${i}]`, errors);
      if (schema.items === false && value.length > schema.prefixItems.length)
        errors.push(`${path}: ${value.length} items > prefixItems ${schema.prefixItems.length}`);
    } else if (schema.items && schema.items !== false) {
      for (let i = 0; i < value.length; i++) validateValue(value[i], schema.items, rootSchema, `${path}[${i}]`, errors);
    }
  }
  if (TYPES.object(value)) {
    if (schema.minProperties !== undefined && Object.keys(value).length < schema.minProperties)
      errors.push(`${path}: fewer than minProperties`);
    if (schema.required) for (const k of schema.required)
      if (!(k in value)) errors.push(`${path}: missing required '${k}'`);
    const props = schema.properties ?? {};
    const patterns = Object.entries(schema.patternProperties ?? {}).map(([p, s]) => [new RegExp(p), s]);
    for (const [k, v] of Object.entries(value)) {
      if (k in props) { validateValue(v, props[k], rootSchema, `${path}.${k}`, errors); continue; }
      const matched = patterns.filter(([re]) => re.test(k));
      if (matched.length) { for (const [, s] of matched) validateValue(v, s, rootSchema, `${path}.${k}`, errors); continue; }
      if (schema.additionalProperties === false) errors.push(`${path}: additional property '${k}'`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object')
        validateValue(v, schema.additionalProperties, rootSchema, `${path}.${k}`, errors);
    }
  }
  return errors;
}

// ---------- DTCG token-file validation ----------

const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const ALIAS_RE = /^\{[^{}]+\}$/;
export const isAlias = (v) => typeof v === 'string' && ALIAS_RE.test(v);

/** Per-$type value shapes. A bare alias string is always an acceptable $value. */
const VALUE_SHAPES = {
  color: {
    anyOf: [
      { $ref: '#/$defs/colorValue' },
      {
        // {light, dark} scheme pair — sys color leaves emit light-dark(<light>, <dark>) (REQ-MAT-05)
        type: 'object',
        properties: {
          light: { anyOf: [{ $ref: '#/$defs/colorValue' }, { type: 'string' }] },
          dark: { anyOf: [{ $ref: '#/$defs/colorValue' }, { type: 'string' }] },
        },
        required: ['light', 'dark'],
        additionalProperties: false,
      },
    ],
  },
  dimension: { $ref: '#/$defs/dimensionValue' },
  duration: { $ref: '#/$defs/durationValue' },
  cubicBezier: { $ref: '#/$defs/cubicBezierValue' },
  'motion-spring': { $ref: '#/$defs/springValue' },
  shadow: { anyOf: [{ $ref: '#/$defs/shadowValue' }, { type: 'array', items: { $ref: '#/$defs/shadowValue' }, minItems: 1 }] },
  // recipe records (blur/rim/bezel/shadow aliases per thickness cell); full recipes are
  // assembled by the ladders generator, so the value shape is an open object here
  'glass-material': { type: 'object' },
  'theme-preset': { $ref: '#/$defs/presetValue' },
  'mode-table': { $ref: '#/$defs/modeValue' },
  'ag-rendered': { type: 'string' },
  fontFamily: { type: ['string', 'array'] },
  fontWeight: { type: ['number', 'string'] },
  number: { type: 'number' },
  string: { type: ['string', 'array'] },
};

/** Validate one parsed token file. Returns errors: [{path, message}] */
export function validateTokenFile(tree, schema, file = '<inline>') {
  const errors = [];
  const push = (path, msg) => errors.push({ path, message: msg });

  const walk = (node, path, inheritedType, inheritedExt) => {
    if (!isPlain(node)) { push(path, 'group must be an object'); return; }
    const type = node.$type ?? inheritedType;
    const ext = { ...(inheritedExt ?? {}), ...(node.$extensions ?? {}) };
    const hasExt = inheritedExt !== undefined || node.$extensions !== undefined ? ext : undefined;
    const isToken = '$value' in node;

    if (isToken) {
      // token shape (has $value + $extensions.ag.tier); group-level $extensions are inherited
      const tokenErrors = validateValue({ $value: node.$value, $type: type, $description: node.$description, $extensions: hasExt },
        schema.$defs.token, schema, path);
      for (const e of tokenErrors) push(path, e.replace(`${path}.`, ''));
      // $value vs $type shape (aliases skip the check)
      const v = node.$value;
      if (type && !isAlias(v)) {
        const shape = VALUE_SHAPES[type];
        if (shape) {
          // mode-table leaves hold {axisValue: value|alias}; check each entry against its real type if the
          // group also declares one (mode-table wins when both present).
          if (type === 'mode-table') {
            for (const e of validateValue(v, shape, schema, `${path}.$value`)) push(path, e);
            for (const [axisValue, cell] of Object.entries(v ?? {})) {
              if (!isAlias(cell) && ext?.['ag.valueType']) {
                for (const e of validateValue(cell, VALUE_SHAPES[ext['ag.valueType']] ?? {}, schema, `${path}.$value.${axisValue}`)) push(path, e);
              }
            }
          } else if (ext?.['ag.fluid'] === true && isPlain(v) && 'min' in v && 'max' in v) {
            // fluid sizes: {min: dimension, max: dimension} emitted as clamp() by the compiler
            for (const e of validateValue(v.min, VALUE_SHAPES.dimension, schema, `${path}.$value.min`)) push(path, e);
            for (const e of validateValue(v.max, VALUE_SHAPES.dimension, schema, `${path}.$value.max`)) push(path, e);
          } else {
            for (const e of validateValue(v, shape, schema, `${path}.$value`)) push(path, e);
          }
        }
      }
      // blur cap (REQ-MAT-02 guard): any dimension token whose path mentions blur must be <= 32px
      if (type === 'dimension' && /blur/i.test(path) && isPlain(v) && v.unit === 'px' && v.value > 32)
        push(path, `blur token ${v.value}px exceeds the 32px cap (REQ-MAT-02)`);
      return;
    }

    // group: $-prefixed metadata may be present; non-$ keys recurse
    for (const k of Object.keys(node)) {
      if (k === '$value') { push(`${path}.${k}`, 'a group cannot carry $value'); continue; }
      if (k.startsWith('$')) continue;
      walk(node[k], `${path}.${k}`, type, ext);
    }
    if (Object.keys(node).filter((k) => !k.startsWith('$')).length === 0)
      push(path, 'empty group');
  };

  walk(tree, '$', undefined, undefined);
  return errors.map(({ path, message }) => ({ path: `${file}${path.replace(/^\$/, '') ? ` at ${path}` : ''}`, message }));
}

export function loadSchema(schemaPath = join(ROOT, 'tokens', '$schema.json')) {
  return JSON.parse(readFileSync(schemaPath, 'utf8'));
}

export function validateFile(file, schema = loadSchema()) {
  const tree = JSON.parse(readFileSync(file, 'utf8'));
  return validateTokenFile(tree, schema, file);
}

export function discoverTokenFiles(dir = join(ROOT, 'tokens')) {
  const out = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (name.endsWith('.tokens.json')) out.push(p);
      else if (!name.startsWith('.')) {
        try { if (statSync(p).isDirectory()) walk(p); } catch { /* not a dir */ }
      }
    }
  };
  walk(dir);
  return out.sort();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const schemaIdx = args.indexOf('--schema');
  const schemaPath = schemaIdx >= 0 ? args[schemaIdx + 1] : join(ROOT, 'tokens', '$schema.json');
  const files = args.filter((a, i) => !a.startsWith('--') && i !== schemaIdx + 1);
  const targets = files.length ? files : discoverTokenFiles();
  const schema = loadSchema(schemaPath);
  let failed = false;
  for (const f of targets) {
    const errs = validateFile(f, schema);
    for (const e of errs) console.error(`${e.path}: ${e.message}`);
    if (errs.length) failed = true;
  }
  if (!failed) console.log(`tokens: ${targets.length} file(s) valid`);
  process.exit(failed ? 1 : 0);
}
