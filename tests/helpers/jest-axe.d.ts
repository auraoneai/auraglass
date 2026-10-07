declare module 'jest-axe' {
  export function axe(...args: unknown[]): Promise<unknown>;
  export function configureAxe(...args: unknown[]): unknown;
  export const toHaveNoViolations: Record<string, unknown>;
}
