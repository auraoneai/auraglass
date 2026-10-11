import type { Server } from 'node:http';
export function docsBasePath(env?: Record<string, string | undefined>): string;
export function fileFor(dir: string, base: string, urlPath: string): string | null;
export function serve(opts: { dir: string; port: number; base: string }): Server;
