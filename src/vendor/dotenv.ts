import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'dotenv' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("dotenv")>("dotenv");
export default mod;
