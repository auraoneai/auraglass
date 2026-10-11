// Declarations for formats/manifest.mjs.
export const MANIFEST_TYPES: readonly [
  'color', 'dimension', 'number', 'duration', 'cubicBezier', 'motion-spring',
  'shadow', 'glass-material', 'fontFamily', 'fontWeight',
];
export function manifestType(name: string, rec: { type: string; ext?: Record<string, unknown> }): (typeof MANIFEST_TYPES)[number];
export function emitManifest(records: Map<string, unknown>, cells: unknown[], readerCorpus?: string[]): string;
export function emitManifestTs(manifestJson: string): string;
