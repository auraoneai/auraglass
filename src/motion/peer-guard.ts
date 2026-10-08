/* REQ-MOT-15/-59: friendly missing-peer error for `aura-glass/motion`.
 * Imported first in public.ts so it evaluates before adapter.tsx's static
 * `motion/react` import — a consumer without the optional peer gets the
 * contract message instead of ERR_MODULE_NOT_FOUND. Anchors resolution at the
 * consumer project root (process.cwd()) and this file's dir when __filename
 * is available (CJS builds); never statically imports the peer. */
import { createRequire } from 'node:module';

const MESSAGE =
  'aura-glass/motion requires the optional peer "motion@^12". Install it with: npm i motion@^12';

const anchors: string[] = [`${process.cwd()}/package.json`];
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (typeof __filename === 'string') anchors.push(__filename);

let resolved = false;
for (const anchor of anchors) {
  try {
    createRequire(anchor).resolve('motion/react');
    resolved = true;
    break;
  } catch { /* try next anchor */ }
}
if (!resolved) throw new Error(MESSAGE);
