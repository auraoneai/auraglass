/* Types for scripts/release/verify-release-comms.mjs (PLAT-209). */
export function bannerOf(readme: string): string | null;
export function versionsSection(llms: string): string | null;
export function majorOf(v: string): string;
export function checkComms(input?: { readme?: string; llms?: string; pkgVersion?: string; distTags?: Record<string, string> | null }): { errors: string[]; notes: string[] };
export function main(argv?: string[], opts?: { root?: string }): number;
