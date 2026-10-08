import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'openai' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("openai")>("openai");
export default mod;
