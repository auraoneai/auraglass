/**
 * app-shell-slots (SURF area): GlassAppShell header/sidebar/footer props ->
 * slot children of AppShell.Root; GlassSidebar/GlassSidebarRail `items`
 * arrays -> Sidebar.Root with Sidebar.Nav/Sidebar.Item children (handler-only
 * items -> render={<button type="button" onClick={…} />}, no fabricated href;
 * `children` arrays -> Sidebar.Collapsible label=…). The rail variant sets
 * defaultSidebar="rail" on AppShell.Root. Layout props drop to css defaults.
 */
import { j, specNames, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';

interface ItemNode {
  id?: string;
  label?: string;
  icon?: string;
  onClickSrc?: string;
  href?: string;
  children?: ItemNode[];
  unsupported?: boolean;
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
  if (target?.type !== 'ArrayExpression') return { items: [{ unsupported: true }] };
  const items: ItemNode[] = [];
  for (const el of target.elements ?? []) {
    const item: ItemNode = {};
    const obj = el as { type?: string; properties?: Array<{ type?: string }> };
    if (obj?.type !== 'ObjectExpression' || obj.properties?.some(p => p.type !== 'ObjectProperty' && p.type !== 'Property')) item.unsupported = true;
    for (const pr of propsOf(el)) {
      const k = (pr.key?.name ?? pr.key?.value) as string | undefined;
      const v = pr.value as { type?: string; value?: unknown; name?: string } | undefined;
      if (!k || !v) continue;
      if (k === 'id' || k === 'label' || k === 'icon' || k === 'href') {
        if (v.type === 'Literal' || v.type === 'StringLiteral') (item as Record<string, unknown>)[k] = String(v.value);
        else item.unsupported = true;
      } else if (k === 'onClick' || k === 'onSelect' || k === 'onNavigate') {
        item.onClickSrc = j(v as never).toSource({ quote: 'single' });
      } else if (k === 'children') {
        item.children = extractItems(v, bindings).items;
        if (item.children.some(c => c.unsupported)) item.unsupported = true;
      } else item.unsupported = true;
    }
    if (item.href && item.onClickSrc) item.unsupported = true;
    items.push(item);
  }
  return { items, bound };
}

function itemJsx(item: ItemNode, pad: string, parent: string): string {
  if (item.children?.length) {
    const kids = item.children.map((c: any) => itemJsx(c, `${pad}  `, parent)).join('\n');
    return `${pad}<${parent}.Collapsible label="${item.label ?? ''}">\n${kids}\n${pad}</${parent}.Collapsible>`;
  }
  const parts: string[] = [];
  if (item.icon) parts.push(`icon="${item.icon}"`);
  if (item.href) parts.push(`href="${item.href}"`);
  else if (item.onClickSrc) parts.push(`render={<button type="button" onClick={${item.onClickSrc}} />}`);
  const label = item.label ? `\n${pad}  ${item.label}\n${pad}` : '';
  return `${pad}<${parent}.Item${parts.length ? ' ' + parts.join(' ') : ''}>${label}</${parent}.Item>`;
}

export const appShellSlots: Transform = {
  id: 'app-shell-slots',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    // 4.x names come from the app-shell-slots spec (REQ-PLAT-90): the shell whose
    // props become slot children, and the rail variant of the item-array sidebars.
    const [APP_SHELL] = specNames(ctx.mappings, 'app-shell-slots', /props -> slot children/);
    const SIDEBAR_RAIL = specNames(ctx.mappings, 'app-shell-slots', /item arrays/).find((n) => /Rail$/.test(n));
    if (unit.kind !== 'code' || !unit.source.includes(APP_SHELL!)) {
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
    let unsafe = false;
    const usedBindings = new Set<string>();
    const newImports = new Set<string>();
    const splices: Array<{ start: number; end: number; text: string }> = [];

    root.find(j.JSXElement).forEach((p: any) => {
      const open = p.node.openingElement;
      const name = (open?.name as { name?: string })?.name;
      if (name !== APP_SHELL) return;
      const attrs = (open?.attributes ?? []) as Array<{
        type?: string; name?: { name?: string }; value?: { expression?: unknown };
      }>;
      // Preserve shell state, layout, handlers and spreads until their new
      // contracts can be proven; this transform only understands slot props.
      if (attrs.some(a => a.type !== 'JSXAttribute' || !['header', 'topBar', 'sidebar', 'footer'].includes(a.name?.name ?? '') || (a.value?.expression as { type?: string } | undefined)?.type !== 'JSXElement')) {
        unsafe = true;
        return;
      }
      const slots: string[] = [];
      let rootAttrs = '';
      for (const a of attrs) {
        const n = a.name?.name;
        const ex = a.value?.expression as { type?: string; openingElement?: { name?: { name?: string }; attributes?: unknown[] }; start?: number; end?: number } | undefined;
        if (!n || !ex || ex.type !== 'JSXElement') continue;
        const elName = ex.openingElement?.name?.name;
        if (n === 'header' || n === 'topBar') {
          slots.push('      <TopBar.Root />');
          newImports.add('TopBar');
          changes.push({ transform: 'app-shell-slots', description: 'header prop -> TopBar slot' });
        } else if (n === 'sidebar') {
          if (elName !== undefined && elName === SIDEBAR_RAIL) rootAttrs = ' defaultSidebar="rail"';
          newImports.add('Sidebar');
          const itemAttr = ((ex.openingElement?.attributes ?? []) as Array<{ name?: { name?: string }; value?: { expression?: unknown } }>)
            .find((x: any) => x.name?.name === 'items');
          const { items, bound } = extractItems(itemAttr?.value?.expression, bindings);
          if (items.some(item => item.unsupported)) { unsafe = true; return; }
          if (bound) usedBindings.add(bound);
          const nav = items.length
            ? `\n        <Sidebar.Nav aria-label="Main">\n${items.map((it: any) => itemJsx(it, '          ', 'Sidebar')).join('\n')}\n        </Sidebar.Nav>\n      `
            : '';
          slots.push(`      <Sidebar.Root>${nav}</Sidebar.Root>`);
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
      const text = `<AppShell.Root${rootAttrs}>\n${slots.join('\n')}\n      <AppShell.Main>\n        ${inner}\n      </AppShell.Main>\n    </AppShell.Root>`;
      const node = p.node as unknown as { start?: number; end?: number };
      if (typeof node.start === 'number' && typeof node.end === 'number') {
        splices.push({ start: node.start, end: node.end, text });
      }
      newImports.add('AppShell');
      changes.push({ transform: 'app-shell-slots', description: `${APP_SHELL} -> AppShell.Root composition` });
    });

    if (unsafe) return { source: unit.source, changes: [], todos: [{ transform: 'app-shell-slots', reason: 'Shell props or sidebar items contain state, dynamic or unsupported fields; preserve the original shell and migrate manually', doc: 'docs/auraglass-5/migrate/5.md' }] };
    let out = unit.source;
    for (const s of splices.sort((a, b) => b.start - a.start)) {
      out = out.slice(0, s.start) + s.text + out.slice(s.end);
    }
    for (const b of usedBindings) {
      const re = new RegExp(`const ${b}\\s*(?::[^=]*)?=\\s*\\[[\\s\\S]*?\\];\\n?`);
      if (re.test(out)) {
        out = out.replace(re, '');
        changes.push({ transform: 'app-shell-slots', description: `drop items binding ${b}` });
      }
    }
    const order = ['AppShell', 'Sidebar', 'TopBar'];
    const importedNames = order.filter((n: any) => newImports.has(n));
    const importBlock = importedNames.length ? `import { ${importedNames.join(', ')} } from 'aura-glass/app-shell';` : '';
    if (!splices.length) return { source: unit.source, changes: [], todos: [] };
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
