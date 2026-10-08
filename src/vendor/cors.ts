import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'cors' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("cors")>("cors");
export default mod;
