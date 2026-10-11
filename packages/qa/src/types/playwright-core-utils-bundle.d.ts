/* `playwright-core/lib/utilsBundle` (an exported subpath of playwright-core, pinned through @playwright/test) ships no
   typings. The ported 4.x colour census (inspect/v41/census.ts) uses its bundled pngjs `PNG.sync.read` exactly as the
   4.1 audit did; only that member is declared. No package.json dependency is added. */
declare module 'playwright-core/lib/utilsBundle' {
  export const PNG: {
    sync: { read(buffer: Buffer): { width: number; height: number; data: Buffer } };
  };
}
