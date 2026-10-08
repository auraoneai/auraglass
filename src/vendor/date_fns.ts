import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'date-fns' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("date-fns")>("date-fns");
export default mod;
export const addDays = lazyMember<(typeof import("date-fns"))["addDays"]>(
  "date-fns",
  "addDays"
);
export const addMonths = lazyMember<(typeof import("date-fns"))["addMonths"]>(
  "date-fns",
  "addMonths"
);
export const addYears = lazyMember<(typeof import("date-fns"))["addYears"]>(
  "date-fns",
  "addYears"
);
export const format = lazyMember<(typeof import("date-fns"))["format"]>(
  "date-fns",
  "format"
);
export const isValid = lazyMember<(typeof import("date-fns"))["isValid"]>(
  "date-fns",
  "isValid"
);
export const parse = lazyMember<(typeof import("date-fns"))["parse"]>(
  "date-fns",
  "parse"
);
