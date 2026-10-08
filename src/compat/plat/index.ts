/* src/compat/plat/index.ts — REQ-PLAT-30. PLAT's compat barrel: adapters only
   for 4.x names whose deprecation entries are PLAT's (fragments/deprecations/
   plat.ts) AND have `compat != null`. There are currently none, so this barrel
   is intentionally empty. Contract rule for any future adapter: warn once per
   symbol at call time (never at module scope), never throw on unmappable
   props. */
export {};
