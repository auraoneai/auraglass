/* Type declarations for css.mjs (REQ-PLAT-74), so TS tests can import it. */
export type CssLayer = 'ag.compat' | 'ag.reset' | 'ag.tokens' | 'ag.material' | 'ag.components' | 'ag.a11y';
export const CSS_LAYERS: string[];
export const LAYER_ORDER_STATEMENT: string;
export const TAILWIND_BRIDGE_ORDER: string;
export const LAYER_CONTENT_OWNER: Record<string, unknown>;
export const MAT_BUNDLES: Set<string>;
export const CSS_TARGETS: string;
export const COLOR_MIX_SUPPORTS: string;
export const CSS_FILES_BASELINE: string;
export interface StyleRule { selector: string; headers: string[]; body: string }
export interface CssFragmentEntry { stream: string; layer: string; bundle: string; order: number; file: string; content: string; baselined?: string }
export interface CssFilesBaselineRow { file: string; owner: string; reqFin: string; expires: string; [key: string]: unknown }
export function topLevelHeaders(css: string): string[];
export function styleRules(css: string): StyleRule[];
export function splitSelectors(list: string): string[];
export function selectorPrefix(selector: string): string;
export function loadCssFilesBaseline(root?: string): Promise<Map<string, CssFilesBaselineRow>>;
export function collectCssFragments(root?: string, opts?: { validate?: boolean }): Promise<CssFragmentEntry[]>;
export function validateFragment(f: { file: string; content: string }): void;
export function guardColorMix(css: string): string;
export function containerCount(css: string): number;
export function rebaseCssUrls(css: string, srcFile: string, bundle: string, root?: string): { css: string; assets: Array<{ from: string; to: string }> };
export function assembleBundle(bundle: string, fragments: CssFragmentEntry[], root?: string, assets?: Array<{ from: string; to: string }> | null): Promise<string>;
export function lowerCss(css: string, targets?: string): Promise<string>;
export function computeOwnership(fragments: CssFragmentEntry[]): unknown;
export function checkOwnership(bundle: string, css: string, ownership: unknown): unknown;
export function assembleAllCss(root?: string, opts?: { lower?: boolean }): Promise<unknown>;
