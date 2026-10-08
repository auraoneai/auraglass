import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'bcryptjs' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("bcryptjs")>("bcryptjs");
export default mod;
