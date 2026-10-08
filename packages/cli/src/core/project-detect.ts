/** Project detection (PLAT-305): framework, router, TS paths, pm, Tailwind, global CSS, components.json. */
import fs from 'node:fs';
import path from 'node:path';
import { detectPackageManager, type PackageManager } from './package-manager.js';

export type Framework = 'next-app' | 'next-pages' | 'vite' | 'react-router' | 'unknown';

export interface ProjectInfo {
  framework: Framework;
  typescript: boolean;
  tsconfigPaths: Record<string, string[]>;
  packageManager: PackageManager;
  tailwind: { present: boolean; major: number | null };
  globalCss: string | null;
  componentsJson: Record<string, unknown> | null;
  hasAura: boolean;
  reactVersion: string | null;
  nextVersion: string | null;
}

function readJson(p: string): Record<string, unknown> | null {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function detectProject(cwd: string): ProjectInfo {
  const pkg = readJson(path.join(cwd, 'package.json')) ?? {};
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };
  const reactVersion = deps.react ?? null;
  const nextVersion = deps.next ?? null;

  let framework: Framework = 'unknown';
  if (deps.next) {
    const hasApp = fs.existsSync(path.join(cwd, 'app')) || fs.existsSync(path.join(cwd, 'src', 'app')) || fs.existsSync(path.join(cwd, 'apps')) && hasDirLike(cwd, 'app');
    const hasPages = fs.existsSync(path.join(cwd, 'pages')) || fs.existsSync(path.join(cwd, 'src', 'pages'));
    framework = hasPages && !hasApp ? 'next-pages' : 'next-app';
  } else if (deps['react-router'] || deps['@react-router/dev'] || deps['react-router-dom']) {
    framework = 'react-router';
  } else if (deps.vite || readJson(path.join(cwd, 'vite.config.ts')) || readJson(path.join(cwd, 'vite.config.js')) || fs.existsSync(path.join(cwd, 'vite.config.ts')) || fs.existsSync(path.join(cwd, 'vite.config.js'))) {
    framework = 'vite';
  }

  const tsc = readJson(path.join(cwd, 'tsconfig.json'));
  const paths = ((tsc?.compilerOptions as { paths?: Record<string, string[]> } | undefined)?.paths ?? {});
  const typescript = Boolean(tsc) || fs.existsSync(path.join(cwd, 'tsconfig.json'));

  let twMajor: number | null = null;
  const twv = deps.tailwindcss;
  if (twv) {
    const m = twv.match(/(\d+)/);
    twMajor = m ? Number(m[1]) : null;
  }

  const cssCandidates = ['src/index.css', 'src/globals.css', 'app/globals.css', 'src/app/globals.css', 'styles/globals.css', 'pages/_app.css'];
  const globalCss = cssCandidates.find((c: any) => fs.existsSync(path.join(cwd, c))) ?? null;

  const componentsJson = readJson(path.join(cwd, 'components.json'));

  return {
    framework,
    typescript,
    tsconfigPaths: paths,
    packageManager: detectPackageManager(cwd),
    tailwind: { present: Boolean(twv || globalCss && cssHasTailwind(path.join(cwd, globalCss))), major: twMajor },
    globalCss,
    componentsJson,
    hasAura: Boolean(deps['aura-glass']),
    reactVersion,
    nextVersion,
  };
}

function hasDirLike(cwd: string, name: string): boolean {
  try {
    return fs.existsSync(path.join(cwd, 'apps')) && fs.readdirSync(path.join(cwd, 'apps')).some((d) => fs.existsSync(path.join(cwd, 'apps', d, name)));
  } catch {
    return false;
  }
}

function cssHasTailwind(file: string): boolean {
  try {
    const s = fs.readFileSync(file, 'utf8');
    return /@import\s+['"]tailwindcss|@tailwind/.test(s);
  } catch {
    return false;
  }
}
