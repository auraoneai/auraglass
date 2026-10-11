// Declarations for transforms/contrast-solve.mjs.
export interface MatrixCell { floorAlpha: number; minRatio: number; pair: string | null; apcaLc: number }
export interface ContrastMatrix {
  version: number; generatedFrom: string; inputSha256: string | null; cellCount: number;
  tintFloors: Record<string, Record<string, Record<string, number>>>;
  tintFloorsMore: Record<string, Record<string, number>>;
  cells: Record<string, unknown>;
  summary?: Record<string, unknown>;
}
export function solveContrastMatrix(records: Map<string, unknown>, resolved: Map<string, unknown>, opts?: { throwOnUnmet?: boolean }): ContrastMatrix;
export function matrixJson(matrix: unknown): string;
