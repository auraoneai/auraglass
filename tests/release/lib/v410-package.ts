/* tests/release/lib/v410-package.ts — REQ-PLAT-55 patch-scope base.

   The 4.1.1 cut must keep dependencies/peerDependencies/exports identical to
   the 4.1.0 release commit 15b6de6f7 (tag v4.1.0). GitLab CI clones shallowly
   (plat:gate:glass-quality sets no GIT_DEPTH), so that commit is not in the job's object
   store and `git show 15b6de6f7:package.json` fails before any assertion runs.
   When the object is missing this helper fetches exactly the v4.1.0 tag at
   depth 1 from `origin`, then verifies the tag still points at the pinned SHA
   (a moved tag is an error, never a silent re-base). Any failure throws, so the
   suites fail loudly rather than skip. */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

export const V410_SHA = '15b6de6f74e66bcaa4e09f6bc2c8e0b5bdaeae07';
export const V410_TAG = 'v4.1.0';
export const ROOT = join(__dirname, '..', '..', '..');

const git = (args: string[]) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });

function hasCommit(sha: string): boolean {
  try {
    git(['cat-file', '-e', `${sha}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

export function ensureV410Commit(): void {
  if (hasCommit(V410_SHA)) return;
  git(['fetch', '--no-tags', '--depth=1', 'origin', `+refs/tags/${V410_TAG}:refs/tags/${V410_TAG}`]);
  const resolved = git(['rev-parse', `refs/tags/${V410_TAG}^{commit}`]).trim();
  if (resolved !== V410_SHA) {
    throw new Error(`${V410_TAG} resolves to ${resolved}, expected the 4.1.0 release commit ${V410_SHA}`);
  }
}

/** package.json exactly as released in 4.1.0 (git show 15b6de6f7:package.json). */
export function v410PackageJson(): Record<string, any> {
  ensureV410Commit();
  return JSON.parse(git(['show', `${V410_SHA}:package.json`]));
}
