/* REQ-PLAT-67 helper: compiler-backed view of each entry's public surface.
   One TypeScript program over every manifest JS entry (tsconfig.build.json
   options, so path aliases and JSX match the real build). Used by
   root-export-count and no-duplicate-names instead of source-text regexes. */
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { ROOT } from '../build/helpers';

export interface ManifestEntry { subpath: string; source: string; types?: string; default?: string; css?: string }

export function manifestEntries(): ManifestEntry[] {
  return JSON.parse(readFileSync(join(ROOT, 'build/exports.manifest.json'), 'utf8')).entries;
}

export function jsEntries(): ManifestEntry[] {
  return manifestEntries().filter((e) => e.source.startsWith('src/'));
}

let cached: { program: ts.Program; checker: ts.TypeChecker } | null = null;

function program(): { program: ts.Program; checker: ts.TypeChecker } {
  if (cached) return cached;
  const cfgPath = join(ROOT, 'tsconfig.build.json');
  const cfg = ts.readConfigFile(cfgPath, ts.sys.readFile);
  if (cfg.error) throw new Error(ts.flattenDiagnosticMessageText(cfg.error.messageText, '\n'));
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, ROOT);
  const rootNames = jsEntries().map((e) => join(ROOT, e.source));
  const p = ts.createProgram({ rootNames, options: { ...parsed.options, noEmit: true } });
  cached = { program: p, checker: p.getTypeChecker() };
  return cached;
}

function sourceFile(rel: string): ts.SourceFile {
  const sf = program().program.getSourceFile(join(ROOT, rel));
  if (!sf) throw new Error(`entry source not in program: ${rel}`);
  return sf;
}

function resolveAlias(checker: ts.TypeChecker, s: ts.Symbol): ts.Symbol {
  return s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s;
}

/** Exported names of an entry module, split into value and type-only names. */
export function entrySurface(rel: string): { values: string[]; types: string[] } {
  const { checker } = program();
  const modSym = checker.getSymbolAtLocation(sourceFile(rel));
  if (!modSym) return { values: [], types: [] }; // a file with no exports is not a module
  const values: string[] = [];
  const types: string[] = [];
  for (const s of checker.getExportsOfModule(modSym)) {
    const target = resolveAlias(checker, s);
    (target.flags & ts.SymbolFlags.Value ? values : types).push(s.getName());
  }
  return { values: values.sort(), types: types.sort() };
}

/**
 * Walks the re-export closure of an entry (every module reached through an
 * `export … from` declaration inside src/) and reports, per module, any name
 * contributed by two different export declarations (TS2308 territory: two
 * `export *` that collide are silently dropped from the module's exports).
 */
export function duplicateNames(rel: string): string[] {
  const { checker, program: p } = program();
  const out: string[] = [];
  const seenFiles = new Set<string>();
  const queue: ts.SourceFile[] = [sourceFile(rel)];
  while (queue.length) {
    const sf = queue.shift()!;
    if (seenFiles.has(sf.fileName)) continue;
    seenFiles.add(sf.fileName);
    const origin = new Map<string, string>();
    const note = (name: string, from: string) => {
      const prev = origin.get(name);
      if (prev !== undefined) out.push(`${relative(ROOT, sf.fileName)}: '${name}' from ${prev} and ${from}`);
      else origin.set(name, from);
    };
    for (const st of sf.statements) {
      if (ts.isExportDeclaration(st)) {
        const spec = st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier) ? st.moduleSpecifier.text : null;
        const label = spec ?? '(local export list)';
        if (st.moduleSpecifier) {
          const target = checker.getSymbolAtLocation(st.moduleSpecifier);
          const decl = target?.valueDeclaration ?? target?.declarations?.[0];
          const tsf = decl?.getSourceFile();
          if (tsf && !tsf.isDeclarationFile && tsf.fileName.startsWith(join(ROOT, 'src'))) queue.push(p.getSourceFile(tsf.fileName) ?? tsf);
          if (!st.exportClause && target) {
            for (const s of checker.getExportsOfModule(target)) if (s.getName() !== 'default') note(s.getName(), label);
            continue;
          }
        }
        if (st.exportClause && ts.isNamedExports(st.exportClause)) for (const el of st.exportClause.elements) note(el.name.text, label);
        else if (st.exportClause && ts.isNamespaceExport(st.exportClause)) note(st.exportClause.name.text, label);
        continue;
      }
      const mods = ts.canHaveModifiers(st) ? ts.getModifiers(st) : undefined;
      if (!mods?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      // Several local declarations of one name (overloads, `const X` + `type X`,
      // interface merging) are one symbol that the compiler already validates;
      // only a local name that collides with a re-export is a duplicate.
      const local = (name: string) => { if (origin.get(name) !== '(local declaration)') note(name, '(local declaration)'); };
      if (ts.isVariableStatement(st)) {
        for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) local(d.name.text);
      } else if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st) || ts.isInterfaceDeclaration(st)
        || ts.isTypeAliasDeclaration(st) || ts.isEnumDeclaration(st)) && st.name
        && !mods.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) {
        local(st.name.text);
      }
    }
    // the compiler's own verdict on ambiguous `export *` (TS2308) in this module
    for (const d of p.getSemanticDiagnostics(sf)) if (d.code === 2308) out.push(`${relative(ROOT, sf.fileName)}: TS2308 ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
  }
  return out;
}

/** Node's exports-map key matching: an exact key, or a single-`*` pattern key
 *  whose prefix and suffix bracket the request (`./icons/*` ⊇ `./icons/action`). */
export function exportKeyFor(exportsMap: Record<string, unknown>, request: string): string | null {
  if (request in exportsMap) return request;
  for (const key of Object.keys(exportsMap)) {
    const star = key.indexOf('*');
    if (star < 0 || key.indexOf('*', star + 1) >= 0) continue;
    const pre = key.slice(0, star), post = key.slice(star + 1);
    if (request.length > pre.length + post.length && request.startsWith(pre) && request.endsWith(post)) return key;
  }
  return null;
}
