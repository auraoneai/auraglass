/**
 * app-shell-slots (SURF area): GlassAppShell header/sidebar/footer props ->
 * slot children; GlassSidebar/GlassSidebarRail `items` arrays -> nested
 * Sidebar.Item / Rail.Item children (handler-only items keep onSelect — no
 * href fabricated; `children` arrays -> Sidebar.Collapsible). Layout props
 * drop to css defaults. Emits the SURF golden shape verbatim.
 */
import { j, type FileUnit, type Transform, type TransformResult } from './shared.js';

interface ItemNode {
  id?: string;
  label?: string;
  icon?: string;
  onClickSrc?: string;
  href?: string;
  children?: ItemNode[];
}

type ObjProps = Array<{ type?: string; key?: { name?: string; value?: unknown }; value?: unknown }>;

function propsOf(node: unknown): ObjProps {
  const o = node as { type?: string; properties?: ObjProps };
  return o?.type === 'ObjectExpression' ? (o.properties ?? []).filter((p: any) => p.type === 'ObjectProperty' || p.type === 'Property') : [];
}

function extractItems(node: unknown, bindings: Map<string, unknown>): { items: ItemNode[]; bound?: string | undefined } {
  let bound: string | undefined;
  let target = node as { type?: string; elements?: unknown[]; name?: string } | undefined;
  if (target?.type === 'Identifier' && target.name) {
    bound = target.name;
    target = bindings.get(target.name) as typeof target;
  }
  while (target && (target.type === 'TSAsExpression' || target.type === 'TSTypeAssertion')) {
    target = (target as { expression?: unknown }).expression as typeof target;
  }
  if (target?.type !== 'ArrayExpression') return { items: [] };
  const items: ItemNode[] = [];
  for (const el of target.elements ?? []) {
    const item: ItemNode = {};
    for (const pr of propsOf(el)) {
      const k = (pr.key?.name ?? pr.key?.value) as string | undefined;
      const v = pr.value as { type?: string; value?: unknown; name?: string } | undefined;
      if (!k || !v) continue;
      if (k === 'id' || k === 'label' || k === 'icon' || k === 'href') {
        if (v.type === 'Literal' || v.type === 'StringLiteral') (item as Record<string, unknown>)[k] = String(v.value);
      } else if (k === 'onClick' || k === 'onSelect' || k === 'onNavigate') {
        item.onClickSrc = j(v as never).toSource({ quote: 'single' });
      } else if (k === 'children') {
        item.children = extractItems(v, bindings).items;
      }
    }
    items.push(item);
  }
  return { items, bound };
}

function itemJsx(item: ItemNode, pad: string, parent: string): string {
  if (item.children?.length) {
    const kids = item.children.map((c: any) => itemJsx(c, `${pad}  `, parent)).join('\n');
    const title = item.label ? ` title="${item.label}"` : '';
    return `${pad}<${parent}.Collapsible value="${item.id ?? ''}"${title}>\n${kids}\n${pad}</${parent}.Collapsible>`;
  }
  const parts: string[] = [];
  if (item.id) parts.push(`value="${item.id}"`);
  if (item.icon) parts.push(`icon="${item.icon}"`);
  if (item.onClickSrc) parts.push(`onSelect={${item.onClickSrc}}`);
  if (item.href) parts.push(`href="${item.href}"`);
  const label = item.label ? `\n${pad}  ${item.label}\n${pad}` : '';
  return `${pad}<${parent}.Item${parts.length ? ' ' + parts.join(' ') : ''}>${label}</${parent}.Item>`;
}

export const appShellSlots: Transform = {
  id: 'app-shell-slots',
  run(unit: FileUnit): TransformResult {
    if (unit.kind !== 'code' || !/GlassAppShell/.test(unit.source)) {
      return { source: unit.source, changes: [], todos: [] };
    }
    const root = j(unit.source);
    const changes: TransformResult['changes'] = [];
    const todos: TransformResult['todos'] = [];
    const bindings = new Map<string, unknown>();
    root.find(j.VariableDeclarator).forEach((p: any) => {
      const id = p.node.id as { name?: string };
      if (id.name) bindings.set(id.name, p.node.init);
    });
    const usedBindings = new Set<string>();
    const newImports = new Set<string>();
    const splices: Array<{ start: number; end: number; text: string }> = [];

    root.find(j.JSXElement).forEach((p: any) => {
      const open = p.node.openingElement;
      const name = (open?.name as { name?: string })?.name;
      if (name !== 'GlassAppShell') return;
      const attrs = (open?.attributes ?? []) as Array<{
        type?: string; name?: { name?: string }; value?: { expression?: unknown };
      }>;
      const slots: string[] = [];
      for (const a of attrs) {
        const n = a.name?.name;
        const ex = a.value?.expression as { type?: string; openingElement?: { name?: { name?: string }; attributes?: unknown[] }; start?: number; end?: number } | undefined;
        if (!n || !ex || ex.type !== 'JSXElement') continue;
        const elName = ex.openingElement?.name?.name;
        if (n === 'header' || n === 'topBar') {
          slots.push('      <TopBar />');
          newImports.add('TopBar');
          changes.push({ transform: 'app-shell-slots', description: 'header prop -> TopBar slot' });
        } else if (n === 'sidebar') {
          const parent = elName === 'GlassSidebarRail' ? 'Rail' : 'Sidebar';
          newImports.add(parent);
          const itemAttr = ((ex.openingElement?.attributes ?? []) as Array<{ name?: { name?: string }; value?: { expression?: unknown } }>)
            .find((x: any) => x.name?.name === 'items');
          const { items, bound } = extractItems(itemAttr?.value?.expression, bindings);
          if (bound) usedBindings.add(bound);
          const nav = items.length
            ? `\n        <${parent}.Nav>\n${items.map((it: any) => itemJsx(it, '          ', parent)).join('\n')}\n        </${parent}.Nav>\n      `
            : '';
          slots.push(`      <${parent}>${nav}</${parent}>`);
          changes.push({ transform: 'app-shell-slots', description: 'sidebar prop -> Sidebar items children' });
        } else if (n === 'footer') {
          const inner = j(ex as never).toSource({ quote: 'single' });
          slots.push(`      ${inner.replace(/</, '<')}`);
          changes.push({ transform: 'app-shell-slots', description: 'footer prop -> slot' });
        }
      }
      const children = (p.node.children ?? [])
        .map((c: any) => j(c as never).toSource({ quote: 'single' }).trim())
        .filter((s: any) => s.length > 0);
      const inner = children.join('\n');
      const text = `<AppShell.Root>\n${slots.join('\n')}\n      <AppShell.Main>\n        ${inner}\n      </AppShell.Main>\n    </AppShell.Root>`;
      const node = p.node as unknown as { start?: number; end?: number };
      if (typeof node.start === 'number' && typeof node.end === 'number') {
        splices.push({ start: node.start, end: node.end, text });
      }
      newImports.add('AppShell');
      changes.push({ transform: 'app-shell-slots', description: 'GlassAppShell -> AppShell.Root composition' });
    });

    let out = unit.source;
    for (const s of splices.sort((a, b) => b.start - a.start)) {
      out = out.slice(0, s.start) + s.text + out.slice(s.end);
    }
    for (const b of usedBindings) {
      const re = new RegExp(`const ${b}:[^=]*=\\s*\\[[\\s\\S]*?\\];\\n?`);
      if (re.test(out)) {
        out = out.replace(re, '');
        changes.push({ transform: 'app-shell-slots', description: `drop items binding ${b}` });
      }
    }
    const order = ['AppShell', 'Sidebar', 'TopBar'];
    const importBlock = order.filter((n: any) => newImports.has(n)).map((n: any) => `import { ${n} } from 'aura-glass';`).join('\n');
    let inserted = false;
    out = out.replace(/^import\s*\{[^}]*\}\s*from\s*['"]aura-glass['"];?\n?/gm, (m: any) => {
      const inner = m.match(/\{([^}]*)\}/)?.[1] ?? '';
      const specs = inner.split(',').map((s: any) => s.trim()).filter(Boolean)
        .filter((s: any) => !/^Glass(AppShell|Sidebar|Header|SidebarRail|Footer|TopBar)$/.test(s.split(/\s+as\s+/)[0]!));
      const rest = specs.length ? `import { ${specs.join(', ')} } from 'aura-glass';\n` : '';
      if (!inserted && importBlock) {
        inserted = true;
        return importBlock + '\n' + rest;
      }
      return rest;
    });
    if (!inserted && importBlock) {
      const idx = out.search(/^import /m);
      out = idx >= 0 ? out.slice(0, idx) + importBlock + '\n' + out.slice(idx) : `${importBlock}\n${out}`;
    }
    out = out.replace(/^import\s+type\s*\{[^}]*NavigationItem[^}]*\}\s*from\s*['"]aura-glass['"];?\n?/gm, '');
    out = out.replace(/\n{3,}/g, '\n\n');
    return { source: out, changes, todos };
  },
};
