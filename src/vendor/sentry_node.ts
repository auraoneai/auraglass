import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for '@sentry/node' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("@sentry/node")>("@sentry/node");
export default mod;
