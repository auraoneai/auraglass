import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'express-rate-limit' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("express-rate-limit")>("express-rate-limit");
export default mod;
