/* Types for scripts/mat/a11y-pixel-contrast.mjs (REQ-MAT-65, D.3-39). */
export type RGB = [number, number, number] | number[];
export interface Rect { x: number; y: number; width: number; height: number }
export interface PixelContrastContract {
  thresholds: { body: number; large: { ratio: number; definition: string }; more: number; nonText: number };
  matrix: { scenes: string[]; engines: string[]; schemes: string[]; transparency: string[]; modes: string[]; viewports: number[] };
  rowSchema: { required: string[] };
  artifact: string;
}
export const CONTRACT_PATH: string;
export function loadContract(root?: string): PixelContrastContract;
export function luminance(rgb: RGB): number;
export function contrast(a: RGB, b: RGB): number;
export function composite(rgb: RGB, alpha: number, backdrop: RGB): [number, number, number];
export function hex(rgb: RGB): string;
export function medianPixel(data: ArrayLike<number>, width: number, rect: Rect): [number, number, number] | null;
export function glyphCore(visible: ArrayLike<number>, hidden: ArrayLike<number>, width: number, rect: Rect): [number, number, number] | null;
export function requiredRatio(run: { mode: string; fontSizePx: number; fontWeight: number }, thresholds: PixelContrastContract['thresholds']): number;
export function matrixCells(contract: PixelContrastContract): string[];
export function validateArtifact(art: unknown, contract: PixelContrastContract): string[];
export function artifactRequired(env: Record<string, string | undefined>): boolean;
export function gate(env: Record<string, string | undefined>, root?: string): string[];
export function mergeParts(dir: string, env?: Record<string, string | undefined>): { version: 1; rows: Array<Record<string, unknown>> } & Record<string, unknown>;
export function main(argv?: string[], env?: Record<string, string | undefined>): number;
