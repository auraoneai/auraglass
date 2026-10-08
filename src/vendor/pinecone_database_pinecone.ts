import { lazyPeer } from "../utils/optionalPeer";
/** Optional-peer shim for '@pinecone-database/pinecone' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("@pinecone-database/pinecone")>(
  "@pinecone-database/pinecone"
);
export default mod;
