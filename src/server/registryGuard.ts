/**
 * Registry helpers are retained for backward compatibility. The design-token
 * architecture no longer requires a runtime stylesheet registry, so these
 * functions are implemented as innocuous no-ops that always report success.
 */
export const markStyledRegistryHealthy = (): void => {
  /* noop */
};

export const clearStyledRegistryHealth = (): void => {
  /* noop */
};

export const hasStyledComponentsRegistry = (): boolean => true;

export const ensureStyledComponentsRegistry = (): void => {
  /* noop */
};
