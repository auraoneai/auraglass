import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'helmet' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("helmet")>("helmet");
export default mod;
