import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'jsonwebtoken' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("jsonwebtoken")>("jsonwebtoken");
export default mod;
