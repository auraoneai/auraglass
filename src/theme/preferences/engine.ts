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

// The brand alternation is the REQ-MAT-59 list (Chromium/Edge/Opera): every
// Chromium-based browser also carries the 'Chromium' brand, so Brave/Vivaldi/
// Arc/Samsung match `chrom` without being named. The regex tests the joined
// brand names; brands present but unmatched means
// 'unknown' with no UA fallback. UA tokens are matched in their canonical
// casing ('AppleWebKit', 'Chrom*', 'Edg*', 'Gecko/…Firefox/').
export const detectEngine = (nav: NavigatorLike): AgEngine => {
  const brands = nav.userAgentData?.brands;
  const ua = nav.userAgent ?? '';
  return brands?.length
    ? /chrom|edg|opera/i.test(brands.map((b) => b.brand).join()) ? 'chromium' : 'unknown'
    : ua.includes('AppleWebKit') && !/Chrom|Edg/.test(ua) ? 'webkit'
      : /Gecko\/.*Firefox\//.test(ua) ? 'gecko' : 'unknown';
};

export interface CapabilityInput {
  saveData?: boolean;
  deviceMemory?: number | null;
}

export const detectCapability = (nav: NavigatorLike): CapabilityInput => ({
  saveData: nav.connection?.saveData === true,
  deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
});
