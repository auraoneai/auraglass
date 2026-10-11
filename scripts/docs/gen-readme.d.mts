/* Types for gen-readme.mjs (PLAT-390, REQ-PLAT-103, REQ-PLAT-104). */
export declare function fillQuickstart(text: string, nextMd: string): string;
export declare function peerRows(pkg: { peerDependencies?: Record<string, string>; peerDependenciesMeta?: Record<string, { optional?: boolean }> }): Array<{ name: string; range: string; optional: boolean }>;
export declare function fillPeers(text: string, pkg: { peerDependencies?: Record<string, string>; peerDependenciesMeta?: Record<string, { optional?: boolean }> }): string;
export declare function generate(root?: string): string;
export declare function checkReadme(root?: string): { ok: boolean; expected: string; actual: string };
export declare function main(argv?: string[], root?: string): number;
