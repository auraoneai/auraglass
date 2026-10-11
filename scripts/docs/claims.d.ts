/* Shared claim record shape for gen-claims / render-claims. */
export interface Claim {
  value: unknown;
  unit?: string | null | undefined;
  source?: { artifact: string; sha: string | null; path: string };
  state?: 'pending' | 'error';
  reason?: string;
}
export type Claims = Record<string, Claim>;
