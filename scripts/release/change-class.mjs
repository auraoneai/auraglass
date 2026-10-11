#!/usr/bin/env node
/* plat:gate:change-class entry point (C0 seed name, kept working). The real
   implementation is scripts/release/classify-change.mjs per the job→entry-point
   table; this wrapper forwards argv verbatim so either name produces the same
   .artifacts/plat/change-class/change-class.json and verdict. */
import { main } from './classify-change.mjs';
process.exit(main(process.argv.slice(2)));
