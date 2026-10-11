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
      const local = s.local?.name ?? imp;
      if (!imp) { kept.push(s); continue; }
      const row = map[imp];
      if (!row?.to || isCompat) {
        kept.push(s);
        continue;
      }
      const entry = row.compatOnly ? 'aura-glass/compat' : (row.toEntry ?? src);
      const newImported = row.to;
      if (entry === src) {
        (s.imported as { name?: string }).name = newImported;
        if (!s.local?.name || s.local.name === imp) {
          (s.local as { name?: string } | undefined) ??= undefined;
        }
        kept.push(s);
        if ((s.local?.name ?? newImported) === newImported && local === imp) {
          jsxRenames.set(imp, newImported);
        } else if (local === imp) {
          jsxRenames.set(imp, newImported);
        }
        changes.push({ transform: 'canonical-names', description: `${imp} -> ${newImported}` });
      } else {
        // Move to a different entry, preserving any `as` local name.
        const m = moves.get(entry) ?? [];
        m.push({ imported: newImported, local: (local === imp ? newImported : local) ?? newImported });
        moves.set(entry, m);
        if (local === imp) jsxRenames.set(imp, newImported);
        changes.push({ transform: 'canonical-names', description: `${imp} -> ${entry} ${newImported}` });
      }
      if (row.compatOnly && !isCompat) {
        todos.push({ transform: 'canonical-names', reason: `'${imp}' is compat-only in 5.0 — imported from 'aura-glass/compat'`, doc: DOC });
      }
    }
    p.node.specifiers = kept as never;
    if (kept.length === 0) j(p).remove();
  });

  // Fix double-renames: when we renamed a specifier in place but kept local
  // alias, JSX refs still use the local alias — no tag rename needed. Only
  // unaliased specifiers renamed to a different name need tag rewrites.
  let out = root.toSource({ quote: 'single', reuseWhitespace: true });

  // Add/move import declarations for moved specifiers.
  for (const [entry, specs] of moves) {
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
