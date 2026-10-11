/* REQ-QUAL-01/-02 (QUAL). Reads every ComponentMeta (S-31) from `src/**\/*.meta.ts` statically.
   A meta is an object literal passed to `defineMeta(...)`, typed `: ComponentMeta`, or
   `satisfies ComponentMeta`. Only identity fields are evaluated; the rest stays opaque. */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import ts from 'typescript';
import type { ComponentMeta } from '../../../../src/contracts/components.ts';
import { evaluate, objectProperty, parseSource, topLevelConsts, unwrap } from './staticValue.ts';

export interface MetaRecord {
  name: string;
  owner: ComponentMeta['owner'];
  entry: string;
  tier: ComponentMeta['tier'];
  flagship?: number;
  /** `ComponentMeta.states` when it is a static string array; null when the meta computes it (REQ-QUAL-73 review
      items are per subject-state, so a non-static list is reported, never guessed). */
  states?: string[] | null;
  file: string;
}

const OWNERS = new Set(['CMP', 'SURF', 'MAT']);
const TIERS = new Set(['T0', 'T1', 'T2', 'preview']);

function isMetaTyped(type: ts.TypeNode | undefined): boolean {
  return !!type && ts.isTypeReferenceNode(type) && type.typeName.getText() === 'ComponentMeta';
}

function metaLiterals(sf: ts.SourceFile): ts.ObjectLiteralExpression[] {
  const found: ts.ObjectLiteralExpression[] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'defineMeta') {
      const arg = n.arguments[0] && unwrap(n.arguments[0]);
      if (arg && ts.isObjectLiteralExpression(arg)) found.push(arg);
    } else if (ts.isVariableDeclaration(n) && isMetaTyped(n.type) && n.initializer) {
      const init = unwrap(n.initializer);
      if (ts.isObjectLiteralExpression(init)) found.push(init);
    } else if (ts.isSatisfiesExpression(n) && isMetaTyped(n.type)) {
      const inner = unwrap(n.expression);
      if (ts.isObjectLiteralExpression(inner)) found.push(inner);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return [...new Set(found)];
}

/** Parses one meta source; throws `invalid-meta` when an identity field is missing or malformed. */
export function readMetaSource(file: string, text: string): MetaRecord[] {
  const sf = parseSource(file, text);
  const consts = topLevelConsts(sf);
  return metaLiterals(sf).map((obj) => {
    const field = (k: string) => {
      const e = objectProperty(obj, k);
      return e ? evaluate(e, sf, consts) : undefined;
    };
    const name = field('name');
    const owner = field('owner');
    const entry = field('entry');
    const tier = field('tier');
    const flagship = field('flagship');
    if (typeof name !== 'string' || !name) throw new Error(`invalid-meta: ${file}: name must be a string literal`);
    if (typeof owner !== 'string' || !OWNERS.has(owner)) throw new Error(`invalid-meta: ${file}: ${name}.owner '${String(owner)}'`);
    if (typeof entry !== 'string') throw new Error(`invalid-meta: ${file}: ${name}.entry must be a string literal`);
    if (typeof tier !== 'string' || !TIERS.has(tier)) throw new Error(`invalid-meta: ${file}: ${name}.tier '${String(tier)}'`);
    const rec: MetaRecord = { name, owner: owner as MetaRecord['owner'], entry, tier: tier as MetaRecord['tier'], file };
    if (typeof flagship === 'number') rec.flagship = flagship;
    if (objectProperty(obj, 'states')) {
      let states: unknown;
      try { states = field('states'); } catch { states = null; }
      rec.states = Array.isArray(states) && states.every((s) => typeof s === 'string') ? (states as string[]) : null;
    }
    return rec;
  });
}

function walk(dir: string, out: string[]): void {
  let names: import('node:fs').Dirent[];
  try { names = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const d of names) {
    if (d.name === 'node_modules' || d.name.startsWith('.')) continue;
    const p = join(dir, d.name);
    if (d.isDirectory()) walk(p, out);
    else if (d.isFile() && d.name.endsWith('.meta.ts')) out.push(p);
  }
}

/** Every ComponentMeta under `<root>/src`, grouped by name. A name with more than one record is
    ambiguous: resolving it throws `ambiguous-subject` (resolveSubject.ts); nothing picks a winner. */
export function loadComponentMetas(root: string): Map<string, MetaRecord[]> {
  const files: string[] = [];
  walk(join(root, 'src'), files);
  files.sort();
  const out = new Map<string, MetaRecord[]>();
  for (const abs of files) {
    const file = relative(root, abs).split(sep).join('/');
    for (const rec of readMetaSource(file, readFileSync(abs, 'utf8'))) {
      const list = out.get(rec.name);
      if (list) list.push(rec);
      else out.set(rec.name, [rec]);
    }
  }
  return out;
}
