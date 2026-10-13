// Diagnostic overlay: every job allow_failure, written to a separate pipeline file outside the
// tracked tree, so checks that read .gitlab-ci.yml / ci/*.gitlab-ci.yml still see the real files.
// Usage: node diag-overlay.mjs <expanded.yml> <out.yml>   (expanded = `gitlab-ci-local --preview`)
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const YAML = createRequire('/srv/ag-ci/tools/package.json')('yaml');
const [src, out] = process.argv.slice(2);
const doc = YAML.parseDocument(readFileSync(src, 'utf8'), { uniqueKeys: false });
let n = 0;
for (const item of doc.contents?.items ?? []) {
  const key = String(item.key?.value ?? item.key);
  if (key.startsWith('.') || ['stages', 'variables', 'workflow', 'include', 'default'].includes(key)) continue;
  if (!YAML.isMap(item.value)) continue;
  item.value.set('allow_failure', true);
  n++;
}
writeFileSync(out, doc.toString({ lineWidth: 0 }));
console.log(`diag overlay: allow_failure on ${n} jobs -> ${out}`);
