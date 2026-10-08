import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'ioredis' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("ioredis")>("ioredis");
export default mod;
