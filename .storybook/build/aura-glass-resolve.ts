/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): how the Storybook build resolves the library.
 *
 * - `AG_STORYBOOK_DIST=1` (the `qual:build:storybook` CI build): `aura-glass` and every `aura-glass/<subpath>`
 *   resolve through package.json `exports` to the built `dist/` files, exactly as a consumer resolves them. A
 *   specifier that is not a package export is a build error, as it would be for a consumer. No `src/` or `@/`
 *   alias may be configured. Relative imports that land in `src/**` (stream stories, `.storybook/contract`)
 *   are redirected to their 1:1 `dist/` twin (tsdown unbundle mode emits one `dist/<path>.js` per reachable
 *   source module), so the story, the preview provider and the package entry share one module instance.
 *   Source modules with no twin (pure re-export barrels, seed-filtered modules, CSS) stay on `src/` and are
 *   listed in the resolution report (`AG_STORYBOOK_RESOLUTION_REPORT`) for `check-build-log.mjs`.
 * - otherwise (dev server, local `storybook dev`): `aura-glass` and its subpaths alias to the entry source files
 *   named in `build/exports.manifest.json`, so stories and showcases run against `src/` without a build.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import type { InlineConfig, Plugin } from 'vite';

export const PACKAGE_NAME = 'aura-glass';
export const DIST_ENV = 'AG_STORYBOOK_DIST';
export const REPORT_ENV = 'AG_STORYBOOK_RESOLUTION_REPORT';
export type ResolveMode = 'dist' | 'source';

export interface ResolutionReport {
  version: 1;
  mode: ResolveMode;
  /** `aura-glass[/<subpath>]` specifier → repo-relative file it resolved to. */
  packageImports: Record<string, string>;
  /** Number of relative `src/**` imports redirected to their `dist/` twin. */
  redirectedToDist: number;
  /** Repo-relative `src/**` modules that had no `dist/` twin and were loaded from source. */
  sourceFallbacks: string[];
}

type ExportValue = string | { default?: string; css?: string; types?: string; [k: string]: string | undefined };

export function resolveMode(env: Record<string, string | undefined> = process.env): ResolveMode {
  return env[DIST_ENV] === '1' ? 'dist' : 'source';
}

const toPosix = (p: string) => p.split(sep).join('/');

/** `aura-glass` → `.`, `aura-glass/ai` → `./ai`; null for any other specifier. */
export function exportKey(specifier: string): string | null {
  if (specifier === PACKAGE_NAME) return '.';
  if (specifier.startsWith(`${PACKAGE_NAME}/`)) return `./${specifier.slice(PACKAGE_NAME.length + 1)}`;
  return null;
}

/** Repo-relative file for `key` from package.json `exports` (the runtime `default` condition, or a bare string). */
export function distTarget(root: string, key: string): string | null {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { exports?: Record<string, ExportValue> };
  const value = pkg.exports?.[key];
  if (value === undefined) return null;
  const file = typeof value === 'string' ? value : value.default;
  return file ? toPosix(file).replace(/^\.\//, '') : null;
}

/** Repo-relative entry source for `key` from build/exports.manifest.json (dev mode); null when the subpath has none. */
export function sourceTarget(root: string, key: string): string | null {
  const manifestPath = join(root, 'build', 'exports.manifest.json');
  if (!existsSync(manifestPath)) return null;
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { entries?: Array<{ subpath: string; source?: string }> };
  const entry = manifest.entries?.find((e) => e.subpath === key);
  return entry?.source ? toPosix(entry.source) : null;
}

const SOURCE_MODULE = /\.(?:[cm]?[jt]sx?)$/;

/** The `dist/` twin of a `src/` module (`src/a/B.client.tsx` → `dist/a/B.client.js`), or null when none was built. */
export function distTwin(root: string, absSourceFile: string): string | null {
  const rel = toPosix(relative(join(root, 'src'), absSourceFile));
  if (rel.startsWith('../') || isAbsolute(rel) || !SOURCE_MODULE.test(rel)) return null;
  const twin = join(root, 'dist', rel.slice(0, -extname(rel).length) + '.js');
  return existsSync(twin) ? twin : null;
}

/** Every configured alias whose key is `@`-prefixed or whose replacement points into `src/`; must be empty in dist mode. */
export function sourceAliases(config: InlineConfig, root: string): string[] {
  const alias = config.resolve?.alias;
  if (!alias) return [];
  const entries: Array<{ find: unknown; replacement: unknown }> = Array.isArray(alias)
    ? (alias as Array<{ find: unknown; replacement: unknown }>)
    : Object.entries(alias as Record<string, string>).map(([find, replacement]) => ({ find, replacement }));
  const src = resolve(root, 'src');
  return entries
    .filter(({ find, replacement }) => {
      const f = String(find);
      const r = String(replacement);
      return f === '@' || f.startsWith('@/') || f.startsWith('/^@') || (isAbsolute(r) && resolve(r).startsWith(src));
    })
    .map(({ find, replacement }) => `${String(find)} → ${String(replacement)}`);
}

export function auraGlassResolve(opts: { root: string; mode: ResolveMode; reportPath?: string | undefined }): Plugin {
  const { root, mode } = opts;
  const srcDir = resolve(root, 'src') + sep;
  const distDir = resolve(root, 'dist') + sep;
  const report: ResolutionReport = { version: 1, mode, packageImports: {}, redirectedToDist: 0, sourceFallbacks: [] };
  const fallbacks = new Set<string>();
  return {
    name: 'aura-glass:resolve',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      const key = exportKey(source);
      if (key !== null) {
        const target = mode === 'dist' ? distTarget(root, key) : (sourceTarget(root, key) ?? distTarget(root, key));
        if (!target) this.error(`${source} is not a package export of ${PACKAGE_NAME} (package.json "exports" has no "${key}")`);
        const abs = resolve(root, target);
        if (!existsSync(abs)) {
          this.error(mode === 'dist'
            ? `${source} resolves to ${target}, which is not built; run \`npm run build\` (or download the plat:build:dist artifact) before ${DIST_ENV}=1 storybook build`
            : `${source} resolves to ${target}, which does not exist`);
        }
        report.packageImports[source] = toPosix(relative(root, abs));
        return abs;
      }
      if (mode !== 'dist' || !importer || !(source.startsWith('.') || source.startsWith('/'))) return null;
      if (importer.startsWith(distDir)) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved || resolved.external) return resolved;
      const file = resolved.id.split('?')[0]!;
      if (!file.startsWith(srcDir)) return resolved;
      const twin = distTwin(root, file);
      if (twin) {
        report.redirectedToDist += 1;
        return twin;
      }
      fallbacks.add(toPosix(relative(root, file)));
      return resolved;
    },
    buildEnd() {
      if (!opts.reportPath) return;
      report.sourceFallbacks = [...fallbacks].sort();
      mkdirSync(dirname(opts.reportPath), { recursive: true });
      writeFileSync(opts.reportPath, JSON.stringify(report, null, 2) + '\n');
    },
  };
}

/** Applies the resolution to the Storybook Vite config; throws in dist mode when a `src/`/`@/` alias is configured. */
export function withAuraGlassResolution(config: InlineConfig, opts: { root: string; mode: ResolveMode; reportPath?: string | undefined }): InlineConfig {
  if (opts.mode === 'dist') {
    const offenders = sourceAliases(config, opts.root);
    if (offenders.length) {
      throw new Error(`${DIST_ENV}=1 resolves the library through package exports only; remove these aliases: ${offenders.join(', ')}`);
    }
  }
  return {
    ...config,
    plugins: [auraGlassResolve(opts), ...(config.plugins ?? [])],
    define: { ...(config.define ?? {}), __AG_STORYBOOK_DIST__: JSON.stringify(opts.mode === 'dist') },
  };
}
