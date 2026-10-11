#!/usr/bin/env node
/* Generates src/ai/__fixtures__/ui-messages.ai-sdk.json from the authored
 * corpus src/ai/__fixtures__/ui-messages.source.ts (SURF-282/283,
 * REQ-SURF-106). Never hand-edit the .json.
 *
 * Before writing (and under --check, CI job surf:build:ai-fixtures) the
 * generator proves the corpus against the pinned AI SDK:
 * 1. SDK_PIN equals `ai@<version>` of both the package.json devDependency and
 *    the installed node_modules/ai (the pin is recorded in the fixture).
 * 2. The TypeScript compiler (repo `typescript` devDep, root tsconfig options)
 *    typechecks `SDK_MESSAGES satisfies UIMessage<AgMessageMetadata>[]` and
 *    `AG_EXTENSION_MESSAGES satisfies AgMessage[]` against the installed `ai`
 *    types; any diagnostic exits 1.
 * 3. Every AG_EXTENSION_MESSAGES entry uses an AgMessage-only feature (the
 *    'tool' role, a tool state outside SDK v5's four, or an unknown part type),
 *    so an SDK-native message cannot skip check 2.
 * 4. MESSAGES is exactly the id-ordered union of both sets.
 *
 * Usage: node scripts/surf/gen-ai-fixtures.mjs [--check] [--source <file.ts>] [--out <file.json>]
 * (--source/--out exist for scripts/surf/gen-ai-fixtures.test.mjs). */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const argValue = (flag, fallback) => {
  const i = args.indexOf(flag);
  if (i === -1) return fallback;
  const v = args[i + 1];
  if (!v || v.startsWith('--')) fail(`${flag} needs a path`);
  return resolve(v);
};
function fail(message) {
  console.error(`gen-ai-fixtures: ${message}`);
  process.exit(1);
}

const check = args.includes('--check');
const srcPath = argValue('--source', join(root, 'src/ai/__fixtures__/ui-messages.source.ts'));
const outPath = argValue('--out', join(root, 'src/ai/__fixtures__/ui-messages.ai-sdk.json'));

const require = createRequire(join(root, 'package.json'));
const ts = require('typescript');

// 1. Pin consistency ---------------------------------------------------------
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const declared = pkg.devDependencies?.ai ?? pkg.dependencies?.ai;
if (!declared || !/^\d+\.\d+\.\d+$/.test(declared)) fail(`package.json must pin \`ai\` to an exact version (found ${declared ?? 'none'})`);
const installedPkg = join(root, 'node_modules/ai/package.json');
if (!existsSync(installedPkg)) fail('node_modules/ai is not installed — run npm ci first');
const installed = JSON.parse(readFileSync(installedPkg, 'utf8')).version;
if (installed !== declared) fail(`installed ai@${installed} differs from the package.json pin ai@${declared}`);

// 2. Typecheck the corpus against the installed `ai` types -------------------
const tsconfig = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile);
if (tsconfig.error) fail(ts.flattenDiagnosticMessageText(tsconfig.error.messageText, '\n'));
const { options } = ts.parseJsonConfigFileContent(tsconfig.config, ts.sys, root);
const checkPath = join(root, 'scripts/surf/__ai-fixtures-check__.ts');
const srcSpecifier = srcPath.replace(/\.tsx?$/, '');
const typesSpecifier = join(root, 'src/ai/types');
const checkSource = [
  "import type { UIMessage } from 'ai';",
  `import type { AgMessage, AgMessageMetadata } from ${JSON.stringify(typesSpecifier)};`,
  `import { SDK_MESSAGES, AG_EXTENSION_MESSAGES } from ${JSON.stringify(srcSpecifier)};`,
  'export const sdk = SDK_MESSAGES satisfies UIMessage<AgMessageMetadata>[];',
  'export const ext = AG_EXTENSION_MESSAGES satisfies AgMessage[];',
  '',
].join('\n');
const host = ts.createCompilerHost({ ...options, noEmit: true });
const baseGetSourceFile = host.getSourceFile.bind(host);
const baseFileExists = host.fileExists.bind(host);
const baseReadFile = host.readFile.bind(host);
host.getSourceFile = (fileName, languageVersion, ...rest) =>
  resolve(fileName) === checkPath
    ? ts.createSourceFile(fileName, checkSource, languageVersion, true)
    : baseGetSourceFile(fileName, languageVersion, ...rest);
host.fileExists = (fileName) => resolve(fileName) === checkPath || baseFileExists(fileName);
host.readFile = (fileName) => (resolve(fileName) === checkPath ? checkSource : baseReadFile(fileName));
const program = ts.createProgram({ rootNames: [checkPath], options: { ...options, noEmit: true }, host });
const relevant = new Set([checkPath, resolve(srcPath)]);
const diagnostics = [
  ...program.getOptionsDiagnostics(),
  ...program.getGlobalDiagnostics(),
  ...program.getSourceFiles().filter((sf) => relevant.has(resolve(sf.fileName))).flatMap((sf) => [
    ...program.getSyntacticDiagnostics(sf),
    ...program.getSemanticDiagnostics(sf),
  ]),
];
if (diagnostics.length > 0) {
  console.error(ts.formatDiagnostics(diagnostics, {
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }));
  fail(`${diagnostics.length} type error(s): the corpus no longer satisfies the pinned ai@${installed} UIMessage / AgMessage types`);
}

// Evaluate the corpus (type-only imports are elided by the transpiler).
const { outputText } = ts.transpileModule(readFileSync(srcPath, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: 'ui-messages.source.ts',
});
const sandbox = { exports: {}, require: (id) => { throw new Error(`fixture source must not require '${id}'`); } };
vm.createContext(sandbox);
vm.runInContext(outputText, sandbox, { filename: 'ui-messages.source.js' });
const { MESSAGES, SDK_MESSAGES, AG_EXTENSION_MESSAGES, SDK_PIN, GENERATED } = sandbox.exports;

if (SDK_PIN !== `ai@${declared}`) fail(`SDK_PIN is ${SDK_PIN}; the pinned SDK is ai@${declared}`);
if (!Array.isArray(MESSAGES) || MESSAGES.length < 20) fail(`ui-messages.source.ts exported ${MESSAGES?.length ?? 'no'} messages (need >=20)`);
if (!Array.isArray(SDK_MESSAGES) || !Array.isArray(AG_EXTENSION_MESSAGES)) fail('source must export SDK_MESSAGES and AG_EXTENSION_MESSAGES arrays');

// 3. Extension entries must really be extensions ------------------------------
const SDK_ROLES = new Set(['system', 'user', 'assistant']);
const SDK_TOOL_STATES = new Set(['input-streaming', 'input-available', 'output-available', 'output-error']);
const SDK_PART_TYPES = new Set(['text', 'reasoning', 'step-start', 'source-url', 'source-document', 'file', 'dynamic-tool']);
const isToolPart = (p) => p.type === 'dynamic-tool' || p.type.startsWith('tool-');
const isSdkPartType = (t) => SDK_PART_TYPES.has(t) || t.startsWith('tool-') || t.startsWith('data-');
const agOnlyFeatures = (m) => [
  ...(SDK_ROLES.has(m.role) ? [] : [`role '${m.role}'`]),
  ...m.parts.filter((p) => isToolPart(p) && !SDK_TOOL_STATES.has(p.state)).map((p) => `tool state '${p.state}'`),
  ...m.parts.filter((p) => !isSdkPartType(p.type)).map((p) => `part type '${p.type}'`),
];
for (const m of AG_EXTENSION_MESSAGES) {
  if (agOnlyFeatures(m).length === 0) fail(`${m.id} is in AG_EXTENSION_MESSAGES but uses no AgMessage-only feature — move it to SDK_MESSAGES`);
}

// 4. MESSAGES is the id-ordered union -----------------------------------------
const expectedIds = [...SDK_MESSAGES, ...AG_EXTENSION_MESSAGES].map((m) => m.id).sort();
const ids = MESSAGES.map((m) => m.id);
if (new Set(ids).size !== ids.length) fail('duplicate message ids in MESSAGES');
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) fail('MESSAGES must be exactly SDK_MESSAGES + AG_EXTENSION_MESSAGES ordered by id');

const doc = JSON.stringify({
  $schema: 'ui-message-fixtures',
  sdk: SDK_PIN,
  generated: GENERATED,
  agExtensions: AG_EXTENSION_MESSAGES.map((m) => ({ id: m.id, features: agOnlyFeatures(m) })),
  messages: MESSAGES,
}, null, 2) + '\n';

if (check) {
  const existing = existsSync(outPath) ? readFileSync(outPath, 'utf8') : '';
  if (existing !== doc) fail(`fixtures drift: ${outPath} differs from generated output — run \`node scripts/surf/gen-ai-fixtures.mjs\``);
  console.log(`ui-messages.ai-sdk.json is up to date (${SDK_MESSAGES.length} SDK-native + ${AG_EXTENSION_MESSAGES.length} Ag-extension messages, typechecked against ai@${installed})`);
} else {
  writeFileSync(outPath, doc);
  console.log(`wrote ${outPath} (${MESSAGES.length} messages, ${SDK_PIN})`);
}
