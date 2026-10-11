/* Types for scripts/qual/remote/build-bundle.mjs (REQ-QUAL-67). */
export interface BundleOptions { out: string; storybook: string; tarball: string | null; browsers: string; tesseract: string | null; tessdata: string | null; imageDigest: string | null; sha: string | null; root: string | null; tar: boolean }
export interface BundleFile { path: string; sha256: string; bytes: number }
export interface BundleManifest { version: 1; gitSha: string; imageDigest: string; createdAt: string; tarball: string; browsers: string[]; modules: number; totals: { files: number; bytes: number; links: number }; files: BundleFile[]; links: Array<{ path: string; target: string }> }
export const REPO_PATHS: { required: readonly string[]; optional: readonly string[] };
export const ALWAYS_MODULES: readonly string[];
export const BROWSER_DIRS: { required: readonly RegExp[]; optional: readonly RegExp[] };
export function parseArgs(argv: readonly string[], env?: Record<string, string | undefined>): BundleOptions;
export function bareImports(dir: string): string[];
export function moduleClosure(root: string, roots: readonly string[]): string[];
export function hashTree(dir: string, exclude?: Set<string>): { files: BundleFile[]; links: Array<{ path: string; target: string }> };
export function buildBundle(o: BundleOptions, env?: Record<string, string | undefined>): Promise<{ ok: boolean; problems: string[]; bundle?: string; archive?: string | null; manifest?: BundleManifest }>;
