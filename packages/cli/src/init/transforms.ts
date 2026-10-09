/** Per-framework file transforms for `auraglass init` (PLAT-86).
 *  Each function returns the new file contents (or null when unchanged). */
import fs from 'node:fs';
import path from 'node:path';
import jscodeshift from 'jscodeshift';
import { auraGlassPrepaintScript } from './prepaint.js';

const j = jscodeshift.withParser('tsx');

export const NEXT_GLOBALS_CSS =
  '@layer theme, base, ag, components, utilities;\n' +
  '@import "aura-glass/styles.css" layer(ag);\n';

const escapeInline = (s: string): string => s.replace(/</g, '\\u003c');

/** Merge AuraGlass lines into an existing globals.css (or return the canonical
 *  content for a fresh file): layer statement + styles import inside layer(ag)
 *  + tailwind.css import after an existing `@import "tailwindcss";`. */
export function mergeGlobalsCss(existing: string | null): string {
  if (existing === null || existing.trim() === '') return NEXT_GLOBALS_CSS;
  let out = existing;
  if (!out.includes('@layer')) {
    out = '@layer theme, base, ag, components, utilities;\n' + out;
  }
  if (!out.includes('aura-glass/styles.css')) {
    const importRe = /^@import .*$/m;
    if (importRe.test(out)) {
      /* put the layer()d import ahead of the first existing @import */
      out = out.replace(importRe, '@import "aura-glass/styles.css" layer(ag);\n$&');
    } else {
      const layerRe = /^@layer .*$/m;
      out = layerRe.test(out)
        ? out.replace(layerRe, '$&\n@import "aura-glass/styles.css" layer(ag);')
        : `@import "aura-glass/styles.css" layer(ag);\n${out}`;
    }
  }
  if (!out.includes('aura-glass/tailwind.css')) {
    const tw = out.match(/^@import\s+["']tailwindcss["'];?\s*$/m);
    if (tw) {
      out = out.replace(tw[0], `${tw[0]}\n@import "aura-glass/tailwind.css";`);
    }
  }
  return out;
}

/** app/providers.tsx scaffold (idempotent — same bytes every time). */
export function providersTsx(): string {
  return `'use client';
import { AuraGlassProvider } from 'aura-glass/theme';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <AuraGlassProvider>{children}</AuraGlassProvider>;
}
`;
}

/**
 * AST-edit a Next App Router layout: ensure `import { AuraGlassScript } from
 * 'aura-glass/theme'` + `import { Providers } from './providers'`; insert
 * <AuraGlassScript /> as the first <head> child (create <head> when absent,
 * inside <html>); wrap {children} in <Providers>.
 * Returns the transformed source or null when already migrated.
 */
export function transformLayoutTsx(source: string): string | null {
  const root = j(source);
  let changed = false;

  /* imports */
  const ensureImport = (spec: string, from: string): void => {
    const exists = root.find(j.ImportDeclaration).some((p: any) => {
      const d = p.node;
      return d.source.value === from &&
        (d.specifiers ?? []).some((s: any) =>
          (s.type === 'ImportSpecifier' && (s.imported as { name?: string }).name === spec) ||
          (s.type === 'ImportDefaultSpecifier'));
    });
    if (exists) return;
    const decl = j.importDeclaration(
      [j.importSpecifier(j.identifier(spec))],
      j.literal(from),
    );
    const imports = root.find(j.ImportDeclaration);
    if (imports.length) imports.at(-1).insertAfter(decl);
    else root.get().node.program.body.unshift(decl);
    changed = true;
  };
  ensureImport('AuraGlassScript', 'aura-glass/theme');
  ensureImport('Providers', './providers');

  /* <AuraGlassScript /> first <head> child (create <head> when absent) */
  const heads = root.find(j.JSXElement, { openingElement: { name: { name: 'head' } } });
  const scriptEl = (): ReturnType<typeof j.jsxElement> =>
    j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier('AuraGlassScript'), [], true),
      null,
      [],
    );
  const hasScript = (): boolean =>
    root.find(j.JSXElement, { openingElement: { name: { name: 'AuraGlassScript' } } }).length > 0;
  if (!hasScript()) {
    if (heads.length) {
      heads.forEach((p: any) => {
        p.node.children = [j.jsxText('\n      '), scriptEl(), ...(p.node.children ?? [])];
        changed = true;
      });
    } else {
      /* insert <head><AuraGlassScript /></head> as first child of <html> */
      root.find(j.JSXElement, { openingElement: { name: { name: 'html' } } }).forEach((p: any) => {
        const headEl = j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier('head'), []),
          j.jsxClosingElement(j.jsxIdentifier('head')),
          [j.jsxText('\n        '), scriptEl(), j.jsxText('\n      ')],
        );
        p.node.children = [j.jsxText('\n      '), headEl, ...(p.node.children ?? [])];
        changed = true;
      });
    }
  }

  /* wrap {children} inside <body> in <Providers> */
  const wrapped = (): boolean =>
    root.find(j.JSXIdentifier, { name: 'Providers' }).length > 0 &&
    root.find(j.JSXElement, { openingElement: { name: { name: 'Providers' } } }).length > 0;
  if (!wrapped()) {
    root.find(j.JSXElement, { openingElement: { name: { name: 'body' } } }).forEach((p: any) => {
      const kids = p.node.children ?? [];
      const idx = kids.findIndex((c: any) =>
        c.type === 'JSXExpressionContainer' &&
        (c.expression as { type?: string }).type === 'Identifier' &&
        (c.expression as { name?: string }).name === 'children');
      if (idx === -1) return;
      const providersEl = j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier('Providers'), []),
        j.jsxClosingElement(j.jsxIdentifier('Providers')),
        [j.jsxText('\n          '), kids[idx] as never, j.jsxText('\n        ')],
      );
      kids[idx] = providersEl;
      changed = true;
    });
  }
  return changed ? root.toSource({ quote: 'single', trailingComma: true }) : null;
}

/** Vite src/main.tsx: add `import 'aura-glass/styles.css';` before the app CSS
 *  import, and wrap the <App /> element in <AuraGlassProvider>. */
export function transformMainTsx(source: string): string | null {
  let changed = false;
  let out = source;
  if (!out.includes('aura-glass/styles.css')) {
    const appCss = out.match(/^import\s+["'](\.\/.+\.css)["'];?\s*$/m);
    const line = `import 'aura-glass/styles.css';\n`;
    if (appCss) out = out.replace(appCss[0], `${line}${appCss[0]}`);
    else {
      const lastImport = [...out.matchAll(/^import .*$/gm)].pop();
      if (lastImport) out = out.replace(lastImport[0], `${lastImport[0]}\n${line}`);
      else out = line + out;
    }
    changed = true;
  }
  const root = j(out);
  const hasProviderImport = root.find(j.ImportDeclaration).some((p: any) =>
    p.node.source.value === 'aura-glass/theme' &&
    (p.node.specifiers ?? []).some((s: any) =>
      s.type === 'ImportSpecifier' && (s.imported as { name?: string }).name === 'AuraGlassProvider'));
  if (!root.find(j.JSXElement, { openingElement: { name: { name: 'AuraGlassProvider' } } }).length) {
    if (!hasProviderImport) {
      root.find(j.ImportDeclaration).at(-1).insertAfter(
        j.importDeclaration([j.importSpecifier(j.identifier('AuraGlassProvider'))], j.literal('aura-glass/theme')),
      );
      changed = true;
    }
    root.find(j.JSXElement, { openingElement: { name: { name: 'App' } } }).forEach((p: any) => {
      if (p.parent && p.parent.node.type === 'JSXElement' &&
          (p.parent.node.openingElement.name as { name?: string }).name === 'AuraGlassProvider') return;
      p.replace(j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier('AuraGlassProvider'), []),
        j.jsxClosingElement(j.jsxIdentifier('AuraGlassProvider')),
        [p.node],
      ));
      changed = true;
    });
  }
  return changed ? root.toSource({ quote: 'single', trailingComma: true }) : null;
}

/** Inline the prepaint script into index.html <head> (skip when empty or
 *  already present). */
export function transformIndexHtml(html: string): string | null {
  const script = auraGlassPrepaintScript;
  if (!script || html.includes('__agP')) return null;
  const tag = `<script>${escapeInline(script)}</script>`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${tag}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${tag}</head>`);
  }
  return null;
}

/** Resolve the consumer-facing path helpers. */
export function existsAt(cwd: string, rel: string): boolean {
  return fs.existsSync(path.join(cwd, rel));
}
