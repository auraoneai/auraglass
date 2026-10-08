import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'socket.io' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("socket.io")>("socket.io");
export default mod;
