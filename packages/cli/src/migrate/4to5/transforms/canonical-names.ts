/**
 * canonical-names (B5): merged renames map — specifier renames within the
 * same entry, moves to a new entry (incl. 'aura-glass/compat'), aliased
 * imports keep their `as` name for local usage, namespace member expressions,
 * JSX tag renames, re-exports. compatOnly targets get a TODO.
 */
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import { todoLine } from '../todo.js';

const DOC = 'docs/auraglass-5/migrate/5.md#b-5';
/** Source of the placeholder that keeps an emptied declaration's comments (see applyCode). */
const MOVED_PLACEHOLDER = '__aura-glass-moved-import__';

type Spec = {
  type?: string;
  imported?: { name?: string; value?: unknown };
  local?: { name?: string };
  importKind?: string;
  importedName?: () => string | undefined;
};

function specName(s: Spec): string | undefined {
  return (s.imported?.name ?? (s.imported?.value as string | undefined));
}

interface ColumnRow { from: string; to: string | null; values?: Record<string, unknown> | undefined; todo?: string | undefined }

/**
 * ColumnDefinition column literals -> TableColumnDef shape (REQ-SURF-14),
 * driven by the `<Base>.Column` prop rows. Textual span edits (not recast
 * node grafts) so the golden byte shape — inline `meta: { align: 'start' }`,
 * the `cell` wrapper around the untouched 4.x render fn — is preserved.
 */
function convertColumnDefinitions(
  source: string,
  rows: ColumnRow[],
  changes: TransformResult['changes'],
  todos: TransformResult['todos'],
): string {
  const scratch = j(source);
  const columnLocals = new Map<string, string>();
  scratch.find(j.ImportDeclaration).forEach((p: any) => {
    if (!/^aura-glass(?:\/|$)/.test(String(p.node.source.value))) return;
    for (const spec of p.node.specifiers ?? []) {
      const imp = spec.imported?.name ?? spec.imported?.value;
      if (imp === 'ColumnDefinition') {
        const local = spec.local?.name ?? 'ColumnDefinition';
        columnLocals.set(local, local === 'ColumnDefinition' ? 'TableColumnDef' : local);
      }
    }
  });
  if (!columnLocals.size) return source;
  const rowByFrom = new Map(rows.map((r) => [r.from, r]));
  const splices: Array<{ start: number; end: number; text: string }> = [];
  const span = (n: unknown): { start: number; end: number } | null => {
    const s = n as { start?: unknown; end?: unknown };
    return typeof s?.start === 'number' && typeof s?.end === 'number' ? { start: s.start, end: s.end } : null;
  };
  const convertArray = (arr: { elements?: unknown[] }): void => {
    for (const el of arr.elements ?? []) {
      const obj = el as { type?: string; properties?: Array<{ type?: string; computed?: boolean; key?: any; value?: any }> };
      if (obj?.type !== 'ObjectExpression') continue;
      const props = (obj.properties ?? []).filter((pr: any) => pr.type === 'ObjectProperty' || pr.type === 'Property');
      const hasMeta = props.some((pr: any) => (pr.key?.name ?? pr.key?.value) === 'meta');
      for (const pr of props) {
        const keyName = (pr.key?.name ?? pr.key?.value) as string | undefined;
        if (!keyName || pr.computed) continue;
        const row = rowByFrom.get(keyName);
        if (!row || row.to === null) continue;
        const ks = span(pr.key);
        const ps = span(pr);
        const vs = span(pr.value);
        if (!ks || !ps || !vs) continue;
        if (row.to.includes('.')) {
          const [head, leaf] = row.to.split('.') as [string, string];
          const lit = pr.value?.type === 'Literal' || pr.value?.type === 'StringLiteral' ? String(pr.value.value) : undefined;
          const mapped = lit !== undefined ? row.values?.[lit] : undefined;
          if (typeof mapped !== 'string' || hasMeta) {
            todos.push({ transform: 'canonical-names', reason: `column ${keyName} needs a manual ${row.to} value`, doc: DOC });
            continue;
          }
          splices.push({ ...ps, text: `${head}: { ${leaf}: '${mapped}' }` });
          changes.push({ transform: 'canonical-names', description: `column ${keyName} -> ${row.to}` });
          continue;
        }
        if (row.to === 'cell' && keyName !== 'cell') {
          const orig = source.slice(vs.start, vs.end);
          splices.push({ ...ps, text: `cell: ({ getValue, row }) => (${orig})(getValue(), row.original)` });
          changes.push({ transform: 'canonical-names', description: `column ${keyName} -> cell wrapper` });
          continue;
        }
        splices.push({ ...ks, text: row.to });
        if (row.from === 'width' && typeof pr.value?.value === 'string' && row.todo) {
          todos.push({ transform: 'canonical-names', reason: `column width: ${row.todo}`, doc: DOC });
        }
        changes.push({ transform: 'canonical-names', description: `column ${keyName} -> ${row.to}` });
      }
    }
  };
  const referencesType = (node: unknown): boolean => {
    let hit = false;
    j.types.visit(node as never, {
      visitTSTypeReference(p: any) {
        if (columnLocals.has((p.node.typeName as { name?: string } | undefined)?.name ?? '')) hit = true;
        this.traverse(p);
        return undefined;
      },
    });
    return hit;
  };
  scratch.find(j.VariableDeclarator).forEach((p: any) => {
    const ann = (p.node.id as { typeAnnotation?: unknown })?.typeAnnotation;
    const init = p.node.init as { type?: string } | undefined;
    if (ann && init?.type === 'ArrayExpression' && referencesType(ann)) convertArray(init as never);
  });
  scratch.find(j.JSXAttribute).forEach((p: any) => {
    if ((p.node.name as { name?: string })?.name !== 'columns') return;
    const expr = (p.node.value as { expression?: { type?: string } } | undefined)?.expression;
    if (expr?.type === 'ArrayExpression') convertArray(expr as never);
  });
  scratch.find(j.TSTypeReference).forEach((p: any) => {
    const tn = p.node.typeName as { type?: string; name?: string };
    const ts = span(tn);
    const target = tn?.name ? columnLocals.get(tn.name) : undefined;
    if (tn?.type === 'Identifier' && target && target !== tn.name && ts) {
      splices.push({ ...ts, text: target });
    }
  });
  let out = source;
  for (const s of splices.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, s.start) + s.text + out.slice(s.end);
  }
  return out;
}

export function applyCode(source: string, ctx: TransformCtx): TransformResult {
  const map = ctx.mappings.components;
  let root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  /** local name -> { tag: rename JSX/value refs to this } */
  const jsxRenames = new Map<string, string>();
  const moves = new Map<string, Array<{ imported: string; local: string; isType?: boolean }>>();
  // ColumnDefinition -> TableColumnDef is folded into canonical-names (SURF
  // fragment, REQ-SURF-14): the key conversions come from the `<Base>.Column`
  // prop rows in the compiled mappings; only the type name is a 5.0 literal.
  const columnKey = Object.keys(map).find((k) => k.endsWith('.Column') && (map[k]?.props?.length ?? 0) > 0);
  const columnRows = columnKey ? (map[columnKey]?.props ?? []) : [];
  const columnBase = columnKey?.slice(0, -'.Column'.length);
  const columnEntry = columnBase
    ? Object.values(map).find((c) => c.to === columnBase)?.toEntry
    : undefined;
  if (columnRows.length && source.includes('ColumnDefinition')) {
    // Textual span conversion first (byte-faithful), then reparse so the
    // import-move pass below sees the TableColumnDef annotations.
    source = convertColumnDefinitions(source, columnRows, changes, todos);
    root = j(source);
  }

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
      if (imp === 'ColumnDefinition' && columnRows.length && columnEntry && !isCompat) {
        const m = moves.get(columnEntry) ?? [];
        m.push({ imported: 'TableColumnDef', local: local === imp ? 'TableColumnDef' : local, isType: s.importKind === 'type' || p.node.importKind === 'type' });
        moves.set(columnEntry, m);
        changes.push({ transform: 'canonical-names', description: `ColumnDefinition -> ${columnEntry} TableColumnDef` });
        continue;
      }
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
        m.push({ imported: head, local: newLocal, isType: s.importKind === 'type' || p.node.importKind === 'type' });
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
    if (hadSpecifiers && kept.length === 0) {
      // Removing the declaration would drop the comments attached to it (a
      // file's leading `// @ts-nocheck` or licence header). Keep it as a
      // placeholder side-effect import so recast prints the comments in place;
      // the moved import is inserted after it and the placeholder is deleted.
      if (((p.node as { comments?: unknown[] }).comments ?? []).length) p.node.source = j.stringLiteral(MOVED_PLACEHOLDER) as never;
      else j(p).remove();
    }
  });

  // Fix double-renames: when we renamed a specifier in place but kept local
  // alias, JSX refs still use the local alias — no tag rename needed. Only
  // unaliased specifiers renamed to a different name need tag rewrites.
  let out: string = root.toSource({ quote: 'single', reuseWhitespace: true });

  // Add/move import declarations for moved specifiers (dedup imported+local).
  for (const [entry, rawSpecs] of moves) {
    const seen = new Set<string>();
    const specs = rawSpecs.filter((s) => {
      const k = `${s.imported}|${s.local}|${s.isType ? 'type' : ''}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const specText = (s: { imported: string; local: string; isType?: boolean }): string =>
      `${s.isType ? 'type ' : ''}${s.local === s.imported ? s.imported : `${s.imported} as ${s.local}`}`;
    const declText = `import { ${specs.map((s: any) => specText(s)).join(', ')} } from '${entry}';`;
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
        const merged = `${inner.trim()}${inner.trim() ? ', ' : ''}${specs.map((s: any) => specText(s)).join(', ')}`;
        return m.replace(/\{[^}]*\}/, `{ ${merged} }`);
      });
    }
  }
  if (out.includes(MOVED_PLACEHOLDER)) {
    out = out.split('\n').filter((l: string) => l.trim() !== `import '${MOVED_PLACEHOLDER}';`).join('\n');
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
