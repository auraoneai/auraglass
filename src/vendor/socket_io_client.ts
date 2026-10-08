import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'socket.io-client' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("socket.io-client")>("socket.io-client");
export default mod;
export const io = lazyMember<(typeof import("socket.io-client"))["io"]>(
  "socket.io-client",
  "io"
);
