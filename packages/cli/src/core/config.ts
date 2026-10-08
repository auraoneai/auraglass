/** auraglass.json project config (PLAT-305): read/write + $schema pointer. */
import fs from 'node:fs';
import path from 'node:path';
import { DOCS_BASE_URL } from '../meta.js';

export interface AuraConfig {
  $schema?: string;
  framework?: string;
  css?: { global?: string; layerOrder?: string[] };
  aliases?: Record<string, string>;
  components?: string;
  registry?: string;
  [k: string]: unknown;
}

export const CONFIG_FILE = 'auraglass.json';
export const SCHEMA_URL = `${DOCS_BASE_URL}schema/auraglass.schema.json`;

export function readConfig(cwd: string): AuraConfig | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(cwd, CONFIG_FILE), 'utf8')) as AuraConfig;
  } catch {
    return null;
  }
}

export function writeConfig(cwd: string, cfg: AuraConfig): void {
  const withSchema: AuraConfig = { $schema: cfg.$schema ?? SCHEMA_URL, ...cfg };
  fs.writeFileSync(path.join(cwd, CONFIG_FILE), `${JSON.stringify(withSchema, null, 2)}\n`);
}
