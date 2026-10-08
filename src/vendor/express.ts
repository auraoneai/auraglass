import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for 'express' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("express")>("express");
export default mod;
