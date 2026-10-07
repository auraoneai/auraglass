#!/usr/bin/env node
/* Generates src/ai/__fixtures__/ui-messages.ai-sdk.json from the authored
 * corpus src/ai/__fixtures__/ui-messages.source.ts (SURF-282/283): the source
 * is transpiled with the repo's own `typescript` devDep (no new deps) and
 * evaluated in a vm sandbox; `--check` diffs the on-disk fixture (CI job
 * surf:build:ai-fixtures). Never hand-edit the .json. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const srcPath = join(root, 'src/ai/__fixtures__/ui-messages.source.ts');
const outPath = join(root, 'src/ai/__fixtures__/ui-messages.ai-sdk.json');

const require = createRequire(import.meta.url);
const ts = require('typescript');
const { transpileModule, ModuleKind } = ts;

const source = readFileSync(srcPath, 'utf8');
const { outputText } = transpileModule(source, {
  compilerOptions: { module: ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: 'ui-messages.source.ts',
});
const sandbox = { exports: {}, require: (id) => { throw new Error(`fixture source must not require '${id}'`); } };
vm.createContext(sandbox);
vm.runInContext(outputText, sandbox, { filename: 'ui-messages.source.js' });

const { MESSAGES, SDK_PIN, GENERATED } = sandbox.exports;
if (!Array.isArray(MESSAGES) || MESSAGES.length < 20) {
  console.error(`ui-messages.source.ts exported ${MESSAGES?.length ?? 'no'} messages (need >=20)`);
  process.exit(1);
}

const doc = JSON.stringify({ $schema: 'ui-message-fixtures', sdk: SDK_PIN, generated: GENERATED, messages: MESSAGES }, null, 2) + '\n';

if (process.argv.includes('--check')) {
  const existing = readFileSync(outPath, 'utf8');
  if (existing !== doc) {
    console.error(`fixtures drift: ${outPath} differs from generated output — run \`node scripts/surf/gen-ai-fixtures.mjs\``);
    process.exit(1);
  }
  console.log('ui-messages.ai-sdk.json is up to date');
} else {
  writeFileSync(outPath, doc);
  console.log(`wrote ${outPath} (${MESSAGES.length} messages, ${SDK_PIN})`);
}
