/* MAT-273/REQ-MAT-54: engine detection for data-ag-engine. navigator.userAgentData
   brands first (Chromium family -> 'chromium'), else the UA string, else 'unknown'.
   Also capability signals for the lightweight tier rule (saveData, deviceMemory). */
export type AgEngine = 'chromium' | 'webkit' | 'gecko' | 'unknown';

interface NavigatorLike {
  userAgent?: string;
  userAgentData?: { brands?: readonly { brand: string; version?: string }[] } | null;
  deviceMemory?: number;
  connection?: { saveData?: boolean } | null;
}

const CHROMIUM_BRANDS = /chromium|google chrome|microsoft edge|edge|opera|brave|vivaldi|arc|samsung internet/i;

export const detectEngine = (nav: NavigatorLike): AgEngine => {
  const brands = nav.userAgentData?.brands;
  if (Array.isArray(brands) && brands.length > 0) {
    return brands.some((b) => CHROMIUM_BRANDS.test(b.brand)) ? 'chromium' : 'unknown';
  }
  const ua = nav.userAgent ?? '';
  if (/AppleWebKit/i.test(ua) && !/Chrome|Chromium|Edg\//i.test(ua)) return 'webkit';
  if (/Gecko\//i.test(ua) && /Firefox\//i.test(ua)) return 'gecko';
  return 'unknown';
};

export interface CapabilityInput {
  saveData?: boolean;
  deviceMemory?: number | null;
}

export const detectCapability = (nav: NavigatorLike): CapabilityInput => ({
  saveData: nav.connection?.saveData === true,
  deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
});
