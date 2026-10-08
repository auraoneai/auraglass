/**
 * doctor checks (PLAT-314): each returns {id, status, message, detail?}.
 * fail <20.19 node; react <19 for aura-glass@5; duplicates; undeclared
 * transitive warns; global-css + layer-order; script-missing; tailwind info;
 * MUI/Radix info; Lucide warn only beside aura-glass/icons. Never fails a
 * shadcn/Radix app.
 */
import fs from 'node:fs';
import path from 'node:path';
import { detectProject } from '../core/project-detect.js';

export interface CheckResult {
  id: string;
  status: 'pass' | 'info' | 'warn' | 'fail';
  message: string;
  detail?: string;
}

const TRANSITIVE = ['date-fns', 'chart.js', 'react-chartjs-2', 'zod', 'framer-motion', 'motion', 'tailwind-merge'];

function readJson(p: string): Record<string, unknown> | null {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) as Record<string, unknown>; } catch { return null; }
}

function versionLt(v: string, floor: string): boolean {
  const pa = v.replace(/^[^\d]*/, '').split('.').map((n: any) => Number(n) || 0);
  const pb = floor.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const a = pa[i] ?? 0;
    const b = pb[i] ?? 0;
    if (a !== b) return a < b;
  }
  return false;
}

export function runChecks(cwd: string): CheckResult[] {
  const results: CheckResult[] = [];
  const pkg = readJson(path.join(cwd, 'package.json')) ?? {};
  const deps = { ...(pkg.dependencies as Record<string, string> | undefined), ...(pkg.devDependencies as Record<string, string> | undefined) };
  const project = detectProject(cwd);

  // node-version
  const nv = process.versions.node;
  results.push(versionLt(nv, '20.19.0')
    ? { id: 'node-version', status: 'fail', message: `node ${nv} < 20.19 — aura-glass 5 requires node >=20.19` }
    : { id: 'node-version', status: 'pass', message: `node ${nv}` });

  // react-version (aura-glass@5 only)
  const aura5 = /^[\^~>=\s]*5/.test(deps['aura-glass'] ?? '') || deps['aura-glass'] === '5' || deps['aura-glass']?.startsWith('^5') || deps['aura-glass']?.startsWith('~5');
  if (aura5) {
    const rv = deps.react ?? '';
    if (rv && versionLt(rv, '19.0.0')) {
      results.push({ id: 'react-version', status: 'fail', message: `react ${rv} < 19.0 with aura-glass@5` });
    } else {
      results.push({ id: 'react-version', status: 'pass', message: `react ${rv || 'unknown'}` });
    }
  } else {
    results.push({ id: 'react-version', status: 'info', message: 'react floor applies to aura-glass@5' });
  }

  // duplicate-react / duplicate-base-ui
  const dup = (name: string): string[] => {
    const found: string[] = [];
    const nmRoot = path.join(cwd, 'node_modules');
    const direct = path.join(nmRoot, name);
    if (fs.existsSync(direct)) found.push(name);
    try {
      for (const top of fs.readdirSync(nmRoot)) {
        if (top.startsWith('.')) continue;
        const nested = path.join(nmRoot, top, 'node_modules', name);
        if (fs.existsSync(nested)) found.push(`${top}/node_modules/${name}`);
        const scoped = path.join(nmRoot, top);
        if (top.startsWith('@') && fs.statSync(scoped).isDirectory()) {
          for (const s of fs.readdirSync(scoped)) {
            if (fs.existsSync(path.join(scoped, s, 'node_modules', name))) found.push(`${top}/${s}/node_modules/${name}`);
          }
        }
      }
    } catch { /* no node_modules */ }
    return found;
  };
  const dupReact = dup('react').length > 1;
  results.push(dupReact
    ? { id: 'duplicate-react', status: 'warn', message: 'multiple react copies detected' }
    : { id: 'duplicate-react', status: 'pass', message: 'single react' });
  const dupBase = dup('@base-ui-components/react').length > 1 || dup('@base-ui/react').length > 1;
  results.push(dupBase
    ? { id: 'duplicate-base-ui', status: 'warn', message: 'multiple base-ui copies detected' }
    : { id: 'duplicate-base-ui', status: 'pass', message: 'single base-ui' });

  // undeclared-transitive warns
  for (const t of TRANSITIVE) {
    if (!deps[t]) {
      const imported = grepImports(cwd, t);
      if (imported) {
        results.push({ id: `undeclared-transitive:${t}`, status: 'warn', message: `imports '${t}' but it is not declared — declare directly (B7)` });
      }
    }
  }

  // global-css-reliance + layer-order
  if (project.globalCss) {
    const css = fs.readFileSync(path.join(cwd, project.globalCss), 'utf8');
    const usesGlass = /--glass-|aura-glass\/styles|@import\s+['"]aura-glass/.test(css);
    if (usesGlass && !/aura-glass\/styles\.css|aura-glass\/tokens\.css|aura-glass\/tailwind\.css/.test(css)) {
      results.push({ id: 'global-css-reliance', status: 'warn', message: `${project.globalCss} uses 4.x global css entry — see B17`, detail: project.globalCss });
    }
    const layerIdx = css.indexOf('@layer');
    const importIdx = css.search(/@import\s+['"]aura-glass/);
    if (usesGlass && layerIdx === -1) {
      results.push({ id: 'layer-order', status: 'warn', message: 'no @layer statement — unlayered app css wins over the layered sheet (B8)', detail: project.globalCss });
    } else if (usesGlass && importIdx >= 0 && layerIdx > importIdx) {
      results.push({ id: 'layer-order', status: 'warn', message: '@layer declared after the aura-glass import — declare layer order first', detail: project.globalCss });
    }
  }
  if (!results.some((r: any) => r.id === 'global-css-reliance')) {
    results.push({ id: 'global-css-reliance', status: 'pass', message: 'no 4.x global css reliance' });
  }
  if (!results.some((r: any) => r.id === 'layer-order')) {
    results.push({ id: 'layer-order', status: 'pass', message: 'layer order ok' });
  }

  // script-missing (Next app router layout needs AuraGlassScript)
  if (project.framework === 'next-app' && aura5) {
    const layoutCandidates = ['app/layout.tsx', 'app/layout.jsx', 'src/app/layout.tsx', 'src/app/layout.jsx'];
    const layout = layoutCandidates.find((l) => fs.existsSync(path.join(cwd, l)));
    if (layout) {
      const src = fs.readFileSync(path.join(cwd, layout), 'utf8');
      if (!/AuraGlassScript|auraGlassPrepaintScript/.test(src)) {
        results.push({ id: 'script-missing', status: 'warn', message: `${layout} is missing <AuraGlassScript/> — first-paint material flashes`, detail: layout });
      } else {
        results.push({ id: 'script-missing', status: 'pass', message: 'prepaint script present' });
      }
    }
  }
  if (!results.some((r: any) => r.id === 'script-missing')) {
    results.push({ id: 'script-missing', status: 'info', message: 'no Next app router layout detected' });
  }

  // tailwind-source info
  if (project.tailwind.present) {
    const maj = project.tailwind.major;
    results.push(maj !== null && maj < 4
      ? { id: 'tailwind-source', status: 'info', message: `tailwind ${maj}.x — v5 material tokens are Tailwind v4 css-first; v3 unsupported (B17)` }
      : { id: 'tailwind-source', status: 'info', message: `tailwind ${maj ?? '?'} detected` });
  }

  // MUI / Radix → info (never fail)
  const mui = Object.keys(deps).filter((d) => d.startsWith('@mui/') || d === 'mui');
  if (mui.length) results.push({ id: 'mui-present', status: 'info', message: `mui packages present (${mui.join(', ')}) — report-only guidance` });
  const radix = Object.keys(deps).filter((d) => d.startsWith('@radix-ui/'));
  if (radix.length) results.push({ id: 'radix-present', status: 'info', message: `radix packages present (${radix.length}) — 5.0 uses Base UI` });
  if (deps['shadcn'] || project.componentsJson) {
    results.push({ id: 'shadcn-app', status: 'info', message: 'shadcn app detected — registry add handles @/ aliases' });
  }

  // lucide: warn only beside aura-glass/icons
  const lucideImports = grepImports(cwd, 'lucide-react');
  const usesAuraIcons = grepImports(cwd, 'aura-glass/icons');
  if (lucideImports && usesAuraIcons) {
    results.push({ id: 'lucide-beside-icons', status: 'warn', message: 'lucide-react used beside aura-glass/icons — pick one icon system' });
  }

  return results;
}

function grepImports(cwd: string, spec: string): boolean {
  const hit = (dir: string, depth: number): boolean => {
    if (depth > 6) return false;
    let ents: fs.Dirent[];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return false; }
    for (const ent of ents) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
        if (hit(p, depth + 1)) return true;
      } else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(ent.name)) {
        try {
          if (fs.readFileSync(p, 'utf8').includes(spec)) return true;
        } catch { /* unreadable */ }
      }
    }
    return false;
  };
  return hit(cwd, 0);
}
