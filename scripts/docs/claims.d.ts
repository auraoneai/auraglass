/* Shared claim record shape for gen-claims / render-claims. */
export interface Claim {
  value: unknown;
  unit?: string | null | undefined;
  source?: { artifact: string; sha: string; path: string };
  state?: 'pending';
}
export type Claims = Record<string, Claim>;
