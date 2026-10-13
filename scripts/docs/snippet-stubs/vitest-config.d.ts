/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   Models `vitest/config`'s defineConfig for the one config shape the
   testing guide shows. It never ships. */
import type { Plugin } from 'vite';

export interface VitestUserConfig {
  plugins?: Plugin[][];
  test?: { environment?: string };
}

export declare function defineConfig(config: VitestUserConfig): VitestUserConfig;
