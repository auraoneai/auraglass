import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'zod' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("zod")>("zod");
export default mod;
export const z = lazyMember<(typeof import("zod"))["z"]>("zod", "z");
