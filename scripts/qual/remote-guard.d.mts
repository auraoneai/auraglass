/* Types for scripts/qual/remote-guard.mjs (REQ-QUAL-67). */
export const REMOTE_EXIT: 2;
export const REMOTE_ENV: readonly string[];
export function remoteAllowed(env?: NodeJS.ProcessEnv | Record<string, string | undefined>): boolean;
export function remoteCommand(command: string): string;
export function remoteMessage(command: string, what?: string): string;
export function checkRemote(o?: { command?: string; env?: NodeJS.ProcessEnv | Record<string, string | undefined>; what?: string }): { code: 2; message: string } | null;
export function guardRemote(o?: { command?: string; env?: NodeJS.ProcessEnv | Record<string, string | undefined>; what?: string }): void;
