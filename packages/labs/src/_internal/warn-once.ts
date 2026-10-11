const warned = new Set<string>();

/**
 * One-time dev warning for a promoted labs resident (REQ-SURF-169). A resident
 * promoted to core re-exports the core symbol for exactly one labs minor; the
 * first import of each promoted name warns once per process, then never again.
 */
export function warnLabsPromoted(name: string, to = 'aura-glass'): void {
  if (warned.has(name)) return;
  warned.add(name);
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(
      `@auraglass/labs: ${name} was promoted to ${to}. ` +
      `Import it from "${to}" — this re-export is removed in the next labs minor.`
    );
  }
}

/** Test-only: reset the dedup set between assertions. */
export function __resetWarned(): void {
  warned.clear();
}
