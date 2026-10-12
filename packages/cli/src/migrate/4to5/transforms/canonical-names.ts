/**
 * canonical-names (B5): merged renames map — specifier renames within the
 * same entry, moves to a new entry (incl. 'aura-glass/compat'), aliased
 * imports keep their `as` name for local usage, namespace member expressions,
 * JSX tag renames, re-exports. compatOnly targets get a TODO.
 */
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import { todoLine } from '../todo.js';

const DOC = 'docs/auraglass-5/migrate/5.md#b-5';

type Spec = {
  type?: string;
  imported?: { name?: string; value?: unknown };
  local?: { name?: string };
  importedName?: () => string | undefined;
};

function specName(s: Spec): string | undefined {
  return (s.imported?.name ?? (s.imported?.value as string | undefined));
}

export function applyCode(source: string, ctx: TransformCtx): TransformResult {
  const map = ctx.mappings.components;
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  /** local name -> { tag: rename JSX/value refs to this } */
  const jsxRenames = new Map<string, string>();
  const moves = new Map<string, Array<{ imported: string; local: string }>>();

  const declarations = root.find(j.ImportDeclaration);

  /** A row that leaves the specifier exactly where it is (identity rename in
   * the same entry) is not a change — e.g. the root `Button`, which is both a
   * 4.x and a 5.0 export. Treating it as a rename would make a second run
   * rewrite already-migrated code. */
  const isNoop = (imp: string, src: string): boolean => {
    const row = map[imp];
    return !row?.to || (row.to === imp && !row.compatOnly && (row.toEntry ?? src) === src);
  };
  /** Post-rename identity of a named specifier: `<entry>|<imported head>|<local>`. */
  const finalKey = (s: Spec, src: string): string | undefined => {
    const imp = specName(s);
    if (s.type !== 'ImportSpecifier' || !imp) return undefined;
    const local = s.local?.name ?? imp;
    if (src.endsWith('/compat') || isNoop(imp, src)) return `${src}|${imp}|${local}`;
    const row = map[imp]!;
    const entry = row.compatOnly ? 'aura-glass/compat' : (row.toEntry ?? src);
    const head = row.to!.split('.')[0]!;
    return `${entry}|${head}|${local === imp ? head : local}`;
  };
  // Several 4.x names can collapse onto one 5.0 export (GlassCard and
  // GlassWorkspacePanel -> Card), possibly from different declarations once
  // imports-subpaths has normalised their entries. Only the first specifier per
  // final binding survives; the rest are dropped and their JSX refs resolve
  // through the survivor (a duplicate binding would not parse).
  const firstSpecFor = new Map<string, Spec>();
  declarations.forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    for (const s of (p.node.specifiers ?? []) as Spec[]) {
      const k = finalKey(s, src);
      if (k && !firstSpecFor.has(k)) firstSpecFor.set(k, s);
    }
  });

  declarations.forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    const isCompat = src.endsWith('/compat');
    const kept: Spec[] = [];
    for (const s of (p.node.specifiers ?? []) as Spec[]) {
      if (s.type === 'ImportNamespaceSpecifier' || s.type === 'ImportDefaultSpecifier') {
        kept.push(s);
        continue;
      }
      const imp = specName(s);
      if (!imp) { kept.push(s); continue; }
      const local: string = s.local?.name ?? imp;
      const row = map[imp];
      if (!row?.to || isCompat || isNoop(imp, src)) {
        kept.push(s);
        continue;
      }
      const entry = row.compatOnly ? 'aura-glass/compat' : (row.toEntry ?? src);
      const newImported = row.to;
      // Dotted targets (Toast.Provider, Field.Error) are member expressions off
      // a root export: import the head name; JSX/bare refs get head.rest (or
      // alias.rest when the specifier is aliased).
      const head: string = newImported.split('.')[0]!;
      const rest = newImported.slice(head.length);
      // Provenance for prop-grammar: the JSX name this element carries after
      // the rename was the 4.x `imp`. Compat routes keep the 4.x prop surface,
      // so they get none.
      if (!row.compatOnly && ctx.renamedFrom) {
        const jsxName = `${local === imp ? head : local}${rest}`;
        (ctx.renamedFrom.get(jsxName) ?? ctx.renamedFrom.set(jsxName, new Set()).get(jsxName)!).add(imp);
      }
      const key = finalKey(s, src);
      if (key && firstSpecFor.get(key) !== s) {
        // Same final binding already provided by another specifier — drop
        // this one; JSX/bare refs resolve to `<head>.<rest>` through it.
        if (local === imp) jsxRenames.set(imp, `${head}${rest}`);
        else if (rest) jsxRenames.set(local, `${local}${rest}`);
        changes.push({ transform: 'canonical-names', description: `${imp} -> ${newImported} (shared import)` });
        if (row.compatOnly && !isCompat) {
          todos.push({ transform: 'canonical-names', reason: `'${imp}' is compat-only in 5.0 — imported from 'aura-glass/compat'`, doc: DOC });
        }
        continue;
      }
      if (entry === src) {
        (s.imported as { name?: string }).name = head!;
        if (!s.local?.name || s.local.name === imp) {
          (s.local as { name?: string } | undefined) ??= undefined;
        }
        kept.push(s);
        if (local === imp) {
          jsxRenames.set(imp, `${head}${rest}`);
        } else if (rest) {
          jsxRenames.set(local, `${local}${rest}`);
        }
        changes.push({ transform: 'canonical-names', description: `${imp} -> ${newImported}` });
      } else {
        // Move to a different entry, preserving any `as` local name.
        const m = moves.get(entry) ?? [];
        const newLocal = (local === imp ? head : local) ?? head!;
        m.push({ imported: head, local: newLocal });
        moves.set(entry, m);
        if (local === imp) jsxRenames.set(imp, `${newLocal}${rest}`);
        else if (rest) jsxRenames.set(local, `${newLocal}${rest}`);
        changes.push({ transform: 'canonical-names', description: `${imp} -> ${entry} ${newImported}` });
      }
      if (row.compatOnly && !isCompat) {
        todos.push({ transform: 'canonical-names', reason: `'${imp}' is compat-only in 5.0 — imported from 'aura-glass/compat'`, doc: DOC });
      }
    }
    // Side-effect imports (`import 'aura-glass/styles.css'`) have no
    // specifiers to begin with and must survive.
    const hadSpecifiers = (p.node.specifiers ?? []).length > 0;
    p.node.specifiers = kept as never;
    if (hadSpecifiers && kept.length === 0) j(p).remove();
  });

  // Fix double-renames: when we renamed a specifier in place but kept local
  // alias, JSX refs still use the local alias — no tag rename needed. Only
  // unaliased specifiers renamed to a different name need tag rewrites.
  let out = root.toSource({ quote: 'single', reuseWhitespace: true });

  // Add/move import declarations for moved specifiers (dedup imported+local).
  for (const [entry, rawSpecs] of moves) {
    const seen = new Set<string>();
    const specs = rawSpecs.filter((s) => {
      const k = `${s.imported}|${s.local}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const declText = `import { ${specs.map((s: any) => (s.local === s.imported ? s.imported : `${s.imported} as ${s.local}`)).join(', ')} } from '${entry}';`;
    if (!out.includes(`from '${entry}'`)) {
      // Insert after the last import.
      const lines = out.split('\n');
      let lastImport = -1;
      for (let i = 0; i < lines.length; i += 1) {
        if (/^import[\s{*]/.test(lines[i]!) || /^import\s/.test(lines[i]!)) lastImport = i;
      }
      lines.splice(lastImport + 1, 0, declText);
      out = lines.join('\n');
    } else {
      out = out.replace(new RegExp(`(import\\s*\\{[^}]*\\}\\s*from\\s*'${entry.replace(/[/.]/g, '\\$&')}')`), (m: any) => {
        const inner = m.match(/\{([^}]*)\}/)?.[1] ?? '';
        const merged = `${inner.trim()}${inner.trim() ? ', ' : ''}${specs.map((s: any) => (s.local === s.imported ? s.imported : `${s.imported} as ${s.local}`)).join(', ')}`;
        return m.replace(/\{[^}]*\}/, `{ ${merged} }`);
      });
    }
  }

  // JSX tags + bare refs for unaliased renames.
  for (const [from, to] of jsxRenames) {
    if (from === to) continue;
    const tagRe = new RegExp(`<${from}([\\s/>])|</${from}>`, 'g');
    const before = out;
    out = out.replace(tagRe, (m: any, tail: string | undefined) => (tail !== undefined ? `<${to}${tail}` : `</${to}>`));
    if (out !== before) changes.push({ transform: 'canonical-names', description: `JSX <${from}> -> <${to}>` });
  }

  // Namespace member expressions: Ns.GlassX -> Ns.X (renames in place).
  const r2 = j(out);
  let nsChanged = false;
  r2.find(j.MemberExpression).forEach((p: any) => {
    const prop = p.node.property as { type?: string; name?: string };
    if (prop.type === 'Identifier' && prop.name && map[prop.name]?.to) {
      prop.name = map[prop.name]!.to!;
      nsChanged = true;
    }
  });
  if (nsChanged) {
    out = r2.toSource({ quote: 'single', reuseWhitespace: true });
    changes.push({ transform: 'canonical-names', description: 'namespace member renames' });
  }

  for (const t of todos) {
    const marker = todoLine(t.reason, t.doc);
    if (!out.includes(marker)) out = `${marker}\n${out}`;
  }
  return { source: out, changes, todos };
}

export const canonicalNames: Transform = {
  id: 'canonical-names',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    if (!/aura-glass|@auraglass|Glass[A-Z]/.test(unit.source)) return { source: unit.source, changes: [], todos: [] };
    return applyCode(unit.source, ctx);
  },
};
