/* contract-v1.0 verbatim (ESM). A rule module is lint/rules/<stream>/<rule-name>.cjs exporting { meta, create, agConfig }.
   agConfig: Array<{ files: string[], ignores?: string[], severity: 'error' | 'warn' }>. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const root = import.meta.dirname; // Node >= 20.11
const RULE_OWNERS = require('./contracts/lint-rule-owners.json'); // { "<rule-name>": "<stream>" } = the table below
const rules = {};
const discovered = [];
for (const stream of ['plat', 'mat', 'cmp', 'surf', 'qual']) {
  const dir = path.join(root, 'lint', 'rules', stream);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.cjs') && !f.startsWith('_')).sort()) {
    const name = path.basename(file, '.cjs');
    if (RULE_OWNERS[name] !== stream) throw new Error(`auraglass/${name}: owner is ${RULE_OWNERS[name] ?? 'unregistered'}, found in ${stream}`);
    const mod = require(path.join(dir, file));
    rules[name] = { meta: mod.meta, create: mod.create };
    for (const c of mod.agConfig ?? []) discovered.push({ files: c.files, ignores: c.ignores ?? [], rules: { [`auraglass/${name}`]: c.severity } });
  }
  const strictFile = path.join(dir, '_strict.cjs'); // { strict: { '<rule-name>': string[] /* globs this stream owns */ } }
  if (fs.existsSync(strictFile)) {
    for (const [name, files] of Object.entries(require(strictFile).strict ?? {})) discovered.push({ files, rules: { [`auraglass/${name}`]: 'error' } });
  }
}
export default { meta: { name: 'eslint-plugin-auraglass' }, rules, configs: { discovered } };
