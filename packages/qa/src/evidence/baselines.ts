/* REQ-QUAL-24 (QUAL, FIN-432). Committed-baseline budget: every file under certification/baselines/ is a PNG at
   linux/<engine>/<subject>/<state>__<scene>__<scheme>__<viewport>.png for one of the ten L7 configs, ≤ 80 KB each, the tree
   ≤ 30 MB, no darwin/win32 platform names, and image chunks only (no tEXt/zTXt/iTXt/tIME/eXIf/… metadata). */
import { existsSync, globSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pngChunks } from '../pixel/png';
import { BASELINE_PLATFORM, parseBaselinePath } from './regression';

export const BASELINE_FILE_MAX_BYTES = 80 * 1024;
export const BASELINE_TREE_MAX_BYTES = 30 * 1024 * 1024;
/** Chunks that describe pixels only; anything else is metadata and fails. */
export const IMAGE_CHUNKS = new Set(['IHDR', 'PLTE', 'tRNS', 'IDAT', 'IEND']);

export interface BaselineViolation { file: string; code: 'file-too-large' | 'tree-too-large' | 'platform-name' | 'bad-path' | 'not-png' | 'metadata-chunk'; message: string }

export interface BaselineTreeResult { files: number; bytes: number; violations: BaselineViolation[] }

export function checkBaselineFile(rel: string, bytes: Buffer): BaselineViolation[] {
  const out: BaselineViolation[] = [];
  if (/(^|[/_.-])(darwin|win32)([/_.-]|$)/i.test(rel)) {
    out.push({ file: rel, code: 'platform-name', message: `non-Linux platform name in ${rel} (baselines come only from AG_PLAYWRIGHT_IMAGE)` });
  }
  const parsed = parseBaselinePath(rel);
  if (!parsed) out.push({ file: rel, code: 'bad-path', message: `${rel} is not ${BASELINE_PLATFORM}/<engine>/<subject>/<state>__<scene>__<scheme>__<viewport>.png for an L7 config` });
  else if (parsed.platform !== BASELINE_PLATFORM) out.push({ file: rel, code: 'platform-name', message: `${rel}: platform directory '${parsed.platform}' ≠ '${BASELINE_PLATFORM}'` });
  if (bytes.length > BASELINE_FILE_MAX_BYTES) out.push({ file: rel, code: 'file-too-large', message: `${rel} is ${bytes.length} B > ${BASELINE_FILE_MAX_BYTES} B` });
  try {
    const extra = [...new Set(pngChunks(bytes).map((c) => c.type).filter((t) => !IMAGE_CHUNKS.has(t)))];
    if (extra.length) out.push({ file: rel, code: 'metadata-chunk', message: `${rel} carries non-image PNG chunk(s) ${extra.join(', ')}` });
  } catch (e) {
    out.push({ file: rel, code: 'not-png', message: `${rel}: ${(e as Error).message}` });
  }
  return out;
}

/** Checks every file under `dir` (absolute). A missing directory is an empty tree. */
export function checkBaselineTree(dir: string): BaselineTreeResult {
  if (!existsSync(dir)) return { files: 0, bytes: 0, violations: [] };
  const files = globSync('**/*', { cwd: dir }).filter((f) => statSync(join(dir, f)).isFile()).sort();
  const violations: BaselineViolation[] = [];
  let bytes = 0;
  for (const f of files) {
    const buf = readFileSync(join(dir, f));
    bytes += buf.length;
    violations.push(...checkBaselineFile(f, buf));
  }
  if (bytes > BASELINE_TREE_MAX_BYTES) violations.push({ file: '.', code: 'tree-too-large', message: `baseline tree is ${bytes} B > ${BASELINE_TREE_MAX_BYTES} B` });
  return { files: files.length, bytes, violations };
}
