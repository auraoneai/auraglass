/* server-safe.mjs — emits the server-safe exports record (PLAT-261, REQ-PLAT-69).
   Safe list = every ComponentMeta with rsc:'server' PLUS the always-safe
   foundations (cn, tokens, icon glyphs). For each, the graph reached under the
   react-server condition (i.e. without crossing a 'use client' boundary) must
   import no client signal and no SSR shim.
   --check: exit 1 when committed build/server-safe-exports.json drifts. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, manifestEntries, importClosure, walk, loadJson } from './lib/graph.mjs';

const SRC = join(ROOT, 'src');
const RECORD = join(ROOT, 'build', 'server-safe-exports.json');
const DOM_RE = /(^|\s)(document|window|navigator|HTMLElement|customElements|localStorage|sessionStorage|matchMedia|ResizeObserver|IntersectionObserver)\s*[.(\[=]/;
const SHIM_RE = /AuraGlassClientBoundary|AuraGlassSSRProvider|StyleSheetManager|registryGuard/;
const USE_CLIENT = /^\s*(?:\/\*[\s\S]*?\*\/|\/\/[^\n]*\n|\s)*['"]use client['"]/;
const CLIENT_HOOK = /\buse(State|Effect|LayoutEffect|Ref|Reducer|Context|Memo|Callback|Id|SyncExternalStore|Transition|ActionState|Optimistic)\b/;

/* Files whose exports are always server-safe foundations (PLAT-69): cn,
   tokens, icon glyph modules. */
const ALWAYS_SAFE = (file) =>
  /\/internal\/cn\.tsx?$/.test(file) ||
  /\/tokens\//.test(file) ||
  /\/icons\/(?!Icon\.meta)[^/]+\.tsx?$/.test(file) ||
  /\/icons\/[a-z-]+\/[a-z-]+\.tsx?$/.test(file);

const metaFiles = () => walk(SRC, (p) => p.endsWith('.meta.ts'));

function serverSafeModules() {
  /* Every *.meta.ts declaring rsc:'server' contributes its sibling modules;
     always-safe foundations are included unconditionally. */
  const modules = new Set();
  const metaEntries = [];
  for (const m of metaFiles()) {
    const text = readFileSync(m, 'utf8');
    const rsc = /rsc:\s*'(server|client|mixed)'/.exec(text)?.[1];
    const name = /name:\s*'([^']+)'/.exec(text)?.[1] ?? m.split('/').pop();
    metaEntries.push({ file: m, name, rsc });
    if (rsc === 'server') modules.add(m);
  }
  for (const f of walk(SRC, (p) => /\.tsx?$/.test(p) && ALWAYS_SAFE(p))) modules.add(f);
  return { modules, metaEntries };
}

export function generateServerSafeExports(root = ROOT) {
  const { modules, metaEntries } = serverSafeModules();
  const entries = [];
  for (const e of manifestEntries(root).js) {
    const src = join(root, e.source);
    if (!existsSync(src)) { entries.push({ subpath: e.subpath, safe: false, reason: 'missing' }); continue; }
    let safe = true; let reason = '';
    for (const f of importClosure(src)) {
      const head = readFileSync(f, 'utf8');
      if (USE_CLIENT.test(head.slice(0, 1200))) break; // crossing a client boundary stops the server graph
      if (SHIM_RE.test(head)) { safe = false; reason = `SSR shim reachable: ${f}`; break; }
      const top = head.slice(0, 400);
      if (DOM_RE.test(top) || CLIENT_HOOK.test(top)) { safe = false; reason = `client signal in ${f}`; break; }
    }
    entries.push({ subpath: e.subpath, safe, ...(reason ? { reason } : {}) });
  }
  return {
    version: 1,
    safeModules: [...modules].map((m) => m.replace(root + '/', '')).sort(),
    meta: metaEntries.map(({ name, rsc }) => ({ name, rsc })).sort((a, b) => a.name.localeCompare(b.name)),
    entries,
  };
}

const mode = process.argv[2] ?? '--check';
const want = generateServerSafeExports();
if (mode === '--write' || mode === '--emit') {
  writeFileSync(RECORD, JSON.stringify(want, null, 2) + '\n');
  console.log(`server-safe-exports: wrote ${want.entries.length} entries, ${want.safeModules.length} safe modules`);
} else {
  const have = existsSync(RECORD) ? loadJson(RECORD) : null;
  if (JSON.stringify(have) !== JSON.stringify(want)) {
    console.error('server-safe-exports: DRIFT — regenerate with `node scripts/build/server-safe.mjs --write`');
    process.exit(1);
  }
  console.log(`server-safe-exports: up to date (${want.entries.length} entries)`);
}
