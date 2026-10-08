import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'compression' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("compression")>("compression");
export default mod;
