/* REQ-QUAL-02 Source-derived inventory (QUAL, S-35). Enumerates every value export of every ENTRIES
   row with the TypeScript compiler API and classifies it:
     visual    — a ComponentMeta with tier T0/T1/T2 has the export's name;
     alias     — another export resolves to the same declaration (re-export identity); the canonical
                 export is the one in its ComponentMeta's entry, else the first non-root entry;
     nonvisual — JSDoc `@nonvisual` on the export or its declaration, a hook (`use*`), a provider
                 (`*Provider`).
   Type-only exports are not value exports and are not enumerated. Anything else throws
   `unclassified-export`. No count is hard-coded anywhere: the inventory size is whatever the source says. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import type { EntrySpec } from '../../../../src/contracts/entries.ts';
import type { MetaRecord } from '../resolve/componentMetas.ts';

export type ExportClass = 'visual' | 'alias' | 'nonvisual';

export interface InventoryItem {
  entry: string;               // subpath, e.g. './data'
  name: string;                // exported name
  class: ExportClass;
  reason: 'meta' | 'alias' | 'jsdoc' | 'hook' | 'provider';
  aliasOf?: { entry: string; name: string };
  meta?: string;               // ComponentMeta file for visual exports
  declaration: string;         // file:line of the resolved declaration
}

export interface Inventory { items: InventoryItem[]; entries: string[] }

export class UnclassifiedExportError extends Error {
  readonly exports: Array<{ entry: string; name: string; declaration: string }>;
  constructor(list: Array<{ entry: string; name: string; declaration: string }>) {
    super(`unclassified-export: ${list.length} value export(s) have no visual ComponentMeta (T0/T1/T2), are not an alias, `
      + `and carry no @nonvisual / hook / provider classification:\n  - ${list.map((e) => `${e.entry} ${e.name} (${e.declaration})`).join('\n  - ')}`);
    this.name = 'UnclassifiedExportError';
    this.exports = list;
  }
}

export interface BuildInventoryOptions {
  root: string;
  entries: readonly EntrySpec[];
  metas: ReadonlyMap<string, readonly MetaRecord[]>;
  /** file to analyse for an entry; default `<root>/<entry.source>`. Return null for entries with no module (CSS/data). */
  entryFile?: (entry: EntrySpec) => string | null;
  compilerOptions?: ts.CompilerOptions;
}

const VISUAL_TIERS = new Set(['T0', 'T1', 'T2']);

function defaultEntryFile(root: string, e: EntrySpec): string | null {
  if (!/\.(ts|tsx|d\.ts)$/.test(e.source)) return null;          // build:css, build:deprecations, package.json
  return join(root, e.source);
}

function rootCompilerOptions(root: string): ts.CompilerOptions {
  const cfgPath = join(root, 'tsconfig.json');
  if (!existsSync(cfgPath)) return { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, skipLibCheck: true, noEmit: true };
  const cfg = ts.readConfigFile(cfgPath, ts.sys.readFile);
  if (cfg.error) throw new Error(`tsconfig: ${ts.flattenDiagnosticMessageText(cfg.error.messageText, '\n')}`);
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, root);
  return { ...parsed.options, noEmit: true, skipLibCheck: true };
}

function hasNonvisualTag(node: ts.Node | undefined): boolean {
  for (let n: ts.Node | undefined = node; n && !ts.isSourceFile(n); n = n.parent) {
    if (ts.getJSDocTags(n).some((t) => t.tagName.text === 'nonvisual')) return true;
    // stop at the statement that owns the declaration
    if (ts.isVariableStatement(n) || ts.isFunctionDeclaration(n) || ts.isClassDeclaration(n) || ts.isExportDeclaration(n)
      || ts.isEnumDeclaration(n) || ts.isExportAssignment(n)) break;
  }
  return false;
}

function where(decl: ts.Declaration | undefined, root: string): string {
  if (!decl) return '(unknown)';
  const sf = decl.getSourceFile();
  const { line } = sf.getLineAndCharacterOfPosition(decl.getStart(sf));
  const rel = sf.fileName.startsWith(root) ? sf.fileName.slice(root.length).replace(/^\//, '') : sf.fileName;
  return `${rel}:${line + 1}`;
}

function isTypeOnlyExport(sym: ts.Symbol): boolean {
  return (sym.declarations ?? []).some((d) =>
    (ts.isExportSpecifier(d) && (d.isTypeOnly || d.parent.parent.isTypeOnly))
    || (ts.isNamespaceExport(d) && d.parent.isTypeOnly));
}

interface RawExport { entry: EntrySpec; name: string; local: ts.Symbol; target: ts.Symbol; key: string; decl: ts.Declaration | undefined }

export interface UnclassifiedExport { entry: string; name: string; declaration: string }

/** Classifies every value export; unclassified exports are returned, not thrown (baseline-aware callers). */
export function collectInventory(opts: BuildInventoryOptions): Inventory & { unclassified: UnclassifiedExport[] } {
  const root = opts.root;
  const files = new Map<EntrySpec, string>();
  for (const e of opts.entries) {
    const f = (opts.entryFile ?? ((x) => defaultEntryFile(root, x)))(e);
    if (f === null) continue;
    if (!existsSync(f)) throw new Error(`missing-entry-source: ENTRIES ${e.subpath} source ${f} does not exist`);
    files.set(e, f);
  }
  const program = ts.createProgram([...files.values()], opts.compilerOptions ?? rootCompilerOptions(root));
  const checker = program.getTypeChecker();

  const raw: RawExport[] = [];
  for (const [entry, file] of files) {
    const sf = program.getSourceFile(file);
    const mod = sf && checker.getSymbolAtLocation(sf);
    if (!mod) continue;                                     // a module with no exports at all (e.g. './three' at 5.0)
    for (const local of checker.getExportsOfModule(mod)) {
      if (local.escapedName === 'default' || isTypeOnlyExport(local)) continue;
      const target = local.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(local) : local;
      if (!(target.flags & ts.SymbolFlags.Value)) continue;  // interfaces, type aliases
      const decl = target.valueDeclaration ?? target.declarations?.[0];
      const key = decl ? `${decl.getSourceFile().fileName}:${decl.pos}` : `${entry.subpath}:${local.name}`;
      raw.push({ entry, name: local.name, local, target, key, decl });
    }
  }

  const visualMeta = (name: string) => (opts.metas.get(name) ?? []).find((m) => VISUAL_TIERS.has(m.tier));
  const groups = new Map<string, RawExport[]>();
  for (const r of raw) {
    const g = groups.get(r.key);
    if (g) g.push(r); else groups.set(r.key, [r]);
  }
  const canonicalOf = (g: RawExport[]): RawExport => {
    if (g.length === 1) return g[0]!;
    const home = g.find((r) => visualMeta(r.name)?.entry === r.entry.subpath);
    return home ?? g.find((r) => r.entry.subpath !== '.') ?? g[0]!;
  };

  const items: InventoryItem[] = [];
  const unclassified: UnclassifiedExport[] = [];
  for (const g of groups.values()) {
    const canon = canonicalOf(g);
    for (const r of g) {
      const base = { entry: r.entry.subpath, name: r.name, declaration: where(r.decl, root) };
      if (r !== canon) {
        items.push({ ...base, class: 'alias', reason: 'alias', aliasOf: { entry: canon.entry.subpath, name: canon.name } });
        continue;
      }
      const meta = visualMeta(r.name);
      const jsdoc = (r.local.declarations ?? []).some(hasNonvisualTag) || hasNonvisualTag(r.decl);
      if (meta) items.push({ ...base, class: 'visual', reason: 'meta', meta: meta.file });
      else if (jsdoc) items.push({ ...base, class: 'nonvisual', reason: 'jsdoc' });
      else if (/^use[A-Z0-9]/.test(r.name)) items.push({ ...base, class: 'nonvisual', reason: 'hook' });
      else if (/Provider$/.test(r.name)) items.push({ ...base, class: 'nonvisual', reason: 'provider' });
      else unclassified.push(base);
    }
  }
  unclassified.sort((a, b) => a.entry.localeCompare(b.entry) || a.name.localeCompare(b.name));
  items.sort((a, b) => a.entry.localeCompare(b.entry) || a.name.localeCompare(b.name));
  return { items, unclassified, entries: [...files.keys()].map((e) => e.subpath) };
}

/** The gate form: throws `unclassified-export` when any value export is unclassified. */
export function buildInventory(opts: BuildInventoryOptions): Inventory {
  const { items, unclassified, entries } = collectInventory(opts);
  if (unclassified.length) throw new UnclassifiedExportError(unclassified);
  return { items, entries };
}
