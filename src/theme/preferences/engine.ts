/* MAT-273/REQ-MAT-54/REQ-MAT-59: the single engine detector for data-ag-engine,
   shared by the preference store and the pre-paint script (prepaint.ts imports
   it, so it is bundled into the <= 1 536 B body — keep it minimal).
   navigator.userAgentData brands first (any Chromium/Edge/Opera brand ->
   'chromium'; every Chromium-based browser also lists the 'Chromium' brand),
   else the UA string (AppleWebKit without Chrome/Chromium/Edg -> 'webkit';
   Gecko/ followed by Firefox/ -> 'gecko'), else 'unknown'. Never
   @supports-based. Also capability signals for the lightweight tier rule. */
export type AgEngine = 'chromium' | 'webkit' | 'gecko' | 'unknown';

interface NavigatorLike {
  userAgent?: string;
  userAgentData?: { brands?: readonly { brand: string; version?: string }[] } | null;
  deviceMemory?: number;
  connection?: { saveData?: boolean } | null;
}

// A loop rather than brands.some(callback): the pre-paint script runs this on
// every page load, and each callback is one more lazy compile (REQ-MAT-59 1 ms).
export const detectEngine = (nav: NavigatorLike): AgEngine => {
  const brands = nav.userAgentData?.brands;
  const ua = nav.userAgent ?? '';
  if (brands?.length) {
    for (const b of brands) if (/chrom|edg|opera|brave|vivaldi|arc|samsung/i.test(b.brand)) return 'chromium';
    return 'unknown';
  }
  return /^(?!.*(Chrom|Edg)).*AppleWebKit/i.test(ua) ? 'webkit'
    : /Gecko\/.*Firefox\//i.test(ua) ? 'gecko' : 'unknown';
};

export interface CapabilityInput {
  saveData?: boolean;
  deviceMemory?: number | null;
}

export const detectCapability = (nav: NavigatorLike): CapabilityInput => ({
  saveData: nav.connection?.saveData === true,
  deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
});
