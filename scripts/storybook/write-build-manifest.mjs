#!/usr/bin/env node
/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): write storybook-static/ag-build.json after `storybook build`.
   Usage: node scripts/storybook/write-build-manifest.mjs [--dir storybook-static] [--sha <sha>]

   ag-build.json = { sha, dirty, builtAt, storybookVersion, packageVersion, storyCount, indexSha256 }:
   sha = --sha, else $CI_COMMIT_SHA, else git HEAD; dirty = the working tree has changes (paths printed);
   storyCount = index.json entries of type "story"; indexSha256 = sha256 of index.json bytes. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUILD_MANIFEST, expectedSha, gitDirtyPaths, parseArgs, readIndex, storyEntries } from './lib/storybook-build.mjs';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

export function buildManifest({ root, dir, sha, now = new Date() }) {
  const { index, sha: indexSha256 } = readIndex(dir);
  const dirtyPaths = gitDirtyPaths(root);
  const require = createRequire(join(root, 'package.json'));
  const storybookVersion = JSON.parse(readFileSync(require.resolve('storybook/package.json'), 'utf8')).version;
  const packageVersion = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
  return {
    manifest: {
      sha,
      dirty: dirtyPaths.length > 0,
      builtAt: now.toISOString(),
      storybookVersion,
      packageVersion,
      storyCount: storyEntries(index).length,
      indexSha256,
    },
    dirtyPaths,
  };
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const dir = resolve(String(args.dir ?? 'storybook-static'));
  const root = resolve(String(args.root ?? ROOT));
  const sha = expectedSha(root, typeof args.sha === 'string' ? args.sha : undefined, env);
  const { manifest, dirtyPaths } = buildManifest({ root, dir, sha });
  writeFileSync(join(dir, BUILD_MANIFEST), JSON.stringify(manifest, null, 2) + '\n');
  if (dirtyPaths.length) console.warn(`write-build-manifest: dirty tree (${dirtyPaths.length}): ${dirtyPaths.slice(0, 20).join(', ')}`);
  console.log(`write-build-manifest: ${join(dir, BUILD_MANIFEST)} sha=${manifest.sha} stories=${manifest.storyCount} dirty=${manifest.dirty}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());
