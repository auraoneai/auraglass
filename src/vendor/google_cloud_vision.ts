import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for '@google-cloud/vision' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("@google-cloud/vision")>(
  "@google-cloud/vision"
);
export default mod;
