/* REQ-FIN-07: the single usePortalContainer definition lives in
   src/theme/portal.ts (S-23 context + document adoption). This module exists
   only as the foundation import path — it adds nothing. */
export { usePortalContainer } from '../theme/portal';
export type { PortalRootState } from '../theme/portal';
