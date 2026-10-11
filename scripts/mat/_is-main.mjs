/* scripts/mat/_is-main.mjs — REQ-MAT-39 (FIN-D D.3-03) entry-point check shared by
   every scripts/mat/*.mjs CLI. Node resolves symlinks for the main module, so
   import.meta.url is the real path while process.argv[1] may be a symlink (worktree
   links, npx bins, /tmp mirrors). Comparing both realpaths keeps the CLI body
   running when the script is invoked through a symlinked path. */
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * @param {string} metaUrl  the caller's import.meta.url
 * @param {string | undefined} [argv1]  defaults to process.argv[1]
 * @returns {boolean} true when the caller is the process entry point
 */
export function isMain(metaUrl, argv1 = process.argv[1]) {
  if (!argv1) return false;
  let self;
  let entry;
  try {
    self = realpathSync(fileURLToPath(metaUrl));
    entry = realpathSync(argv1);
  } catch {
    // argv[1] does not exist on disk (e.g. `node -e`, a REPL): not our entry point.
    return false;
  }
  return self === entry;
}
