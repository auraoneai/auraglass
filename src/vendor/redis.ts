import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'redis' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("redis")>("redis");
export default mod;
export const createClient = lazyMember<
  (typeof import("redis"))["createClient"]
>("redis", "createClient");
