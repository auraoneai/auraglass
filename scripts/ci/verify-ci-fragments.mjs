#!/usr/bin/env node
/* contract:ci-fragments (§4.13.4 rules 1-9, G-16, activation.json, task-graph hook).
   Usage: node scripts/ci/verify-ci-fragments.mjs [--root <dir>] [--files f1,f2] [--base <ref>]

   Checks (§4.13.4):
   1. Fragment keys are only .<s>-* templates or <s>:* jobs; `pages` only in plat.
      Reserved top-level keys (stages/workflow/default/include/variables/image)
      may not appear in a fragment.
   2. Every job declares stage ∈ STAGES and extends a root template
      (.ag-node/.ag-playwright/.ag-gpu/.ag-aws-remote), possibly via own-stream
      hidden templates or the .ag-evidence-release mixin.
   3. Every job has a non-empty rules array that mentions $AG_SCOPE and never
      keys on merge_request_event.
   4. needs:/dependencies: may not reach across streams except needs on a
      CI_JOBS name with optional:true.
   5. artifacts.paths are inside .artifacts/<s>/ (or the bare .artifacts/ dir)
      plus the fixed producer paths; evidence jobs carry when:always and the
      evidence-* name; expire_in matches scope (pr/main 14d, nightly 30d,
      release 90d via .ag-evidence-release).
   6. Every REQUIRED_JOBS name is defined; once ci/plat/activation.json records
      a first green run for (job,line) the effective allow_failure on that line
      is false (gates: pr and main scope; other jobs: every scope they run on).
   7. Only qual may define certify lane jobs (implied by the name rule).
   8. No credential names or id_tokens outside plat:publish:npm
      (NPM_ID_TOKEN, SIGSTORE_ID_TOKEN).
   9. Browser/perf invocations (playwright, lhci, chromium) run on
      .ag-playwright/.ag-gpu/.ag-aws-remote; no --maxWorkers/workers > 16.
   G-16: .github/workflows contains only mirror-to-gitlab.yml; no GHA tokens in
   CI files.
   Task-graph hook: a change under docs/auraglass-5/tasks/*.json runs
   docs/auraglass-5/tools/verify-task-graph.mjs when it exists (absent → pending).
*/
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import yaml from 'yaml';

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : null;
};
const ROOT = opt('root') ?? '.';
const rel = (p) => join(ROOT, p);

// package precedes certify: qual:certify:* need plat:package:pack (contract C-item,
// docs/release/decisions/gitlab-ci-verification.md).
const STAGES = ['contract', 'build', 'test', 'package', 'certify', 'deploy', 'publish'];
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];
const ROOT_TEMPLATES = ['.ag-node', '.ag-playwright', '.ag-gpu', '.ag-aws-remote'];
const MIXINS = ['.ag-evidence-release']; // artifact mixin allowed alongside a root template
const REQUIRED_JOBS = [
  'contract:ownership',
  'contract:conformance',
  'contract:ci-fragments',
  'plat:gate:glass-quality',
  'plat:integration:next',
  'plat:integration:vite',
  'plat:gate:change-class',
];
const CERT_JOBS = Array.from({ length: 12 }, (_, i) => `qual:certify:l${i + 1}`);
const CI_JOBS = {
  root: ['contract:ownership', 'contract:conformance', 'contract:ci-fragments'],
  plat: [
    'plat:build:dist',
    'plat:package:pack',
    'plat:gate:glass-quality',
    'plat:gate:change-class',
    'plat:integration:next',
    'plat:integration:vite',
    'plat:build:docs',
    'plat:publish:npm',
    'pages',
  ],
  mat: ['mat:build:tokens'],
  qual: ['qual:build:storybook', ...CERT_JOBS, 'qual:certify:nightly', 'qual:certify:release'],
  cmp: [],
  surf: [],
};
// Fixed producer paths a job may write besides .artifacts/<s>/ (§4.13.2).
const PRODUCER_PATHS = {
  'plat:build:dist': ['dist/'],
  'plat:package:pack': ['.artifacts/pack/', 'pack.env'],
  'plat:build:docs': ['apps/docs/out/', 'apps/docs/public/', 'storybook-static/'],
  'mat:build:tokens': ['dist/tokens/', 'dist/tokens.css', 'dist/compat/tokens.css'],
  'qual:build:storybook': ['storybook-static/'],
  pages: ['public/'],
};
const CREDENTIAL_RE = /\b(NPM_TOKEN|NODE_AUTH_TOKEN|GH_TOKEN|GITHUB_TOKEN|CI_JOB_JWT|AWS_SECRET_ACCESS_KEY|GCLOUD_[A-Z_]*|AZURE_[A-Z_]*)\b|secrets\./;
const PUBLISH_ID_TOKENS = ['NPM_ID_TOKEN', 'SIGSTORE_ID_TOKEN'];
const BROWSER_RE = /\b(playwright|lhci|chromium|chrome(?:ium)?\s+(?:--|test|run))/;

const fail = [];
const warn = [];
const TOP_KEYS = new Set(['stages', 'workflow', 'default', 'include', 'variables', 'image']);
const isHidden = (k) => k.startsWith('.');
const JOB_SCALAR_KEYS = ['stage', 'rules', 'allow_failure', 'when'];

// Effective value of a scalar job key, inheriting through `extends` chains.
// The job's own value wins; among parents the first listed parent wins.
function effective(doc, jobName, key, seen = new Set()) {
  if (seen.has(jobName)) return undefined;
  seen.add(jobName);
  const node = doc?.[jobName];
  if (!node || typeof node !== 'object') return undefined;
  if (node[key] !== undefined) return node[key];
  const ex = node.extends ? (Array.isArray(node.extends) ? node.extends : [node.extends]) : [];
  for (const e of ex) {
    const v = effective(doc, e, key, seen);
    if (v !== undefined) return v;
  }
  return undefined;
}

// ---------- minimal `rules:if` evaluator (==, !=, =~, !~, &&, ||, !, parens) ----------
function evalIf(expr, vars) {
  const tokens = String(expr).match(
    /\(|\)|&&|\|\||==|!=|=~|!~|!|\$[A-Za-z_][A-Za-z0-9_]*|"[^"]*"|'[^']*'|\/(?:[^/\\]|\\.)*\/|[^\s()&|!=$'"\/]+/g,
  );
  if (!tokens) return false;
  let i = 0;
  const value = () => {
    const t = tokens[i++];
    if (t === '!') return !value();
    if (t === '(') {
      const v = or();
      if (tokens[i++] !== ')') throw new Error(`unbalanced paren in "${expr}"`);
      return v;
    }
    if (t === undefined) throw new Error(`unexpected end of "${expr}"`);
    if (t.startsWith('$')) return String(vars[t.slice(1)] ?? '');
    if (t.startsWith('"') || t.startsWith("'")) return t.slice(1, -1);
    if (t.startsWith('/')) return t;
    return t;
  };
  const compare = () => {
    const l = value();
    const op = tokens[i];
    if (op === '==' || op === '!=') {
      i++;
      return String(l) === String(value()) === (op === '==');
    }
    if (op === '=~' || op === '!~') {
      i++;
      const r = String(value()).replace(/^\/|\/$/g, '');
      return new RegExp(r).test(String(l)) === (op === '=~');
    }
    return Boolean(l && l !== 'false' && l !== 'null');
  };
  const and = () => {
    let v = compare();
    while (tokens[i] === '&&') {
      i++;
      const r = compare();
      v = v && r;
    }
    return v;
  };
  const or = () => {
    let v = and();
    while (tokens[i] === '||') {
      i++;
      const r = and();
      v = v || r;
    }
    return v;
  };
  return or();
}

// Effective allow_failure for a job on (line, scope). null = job does not run.
function effectiveAllowFailure(doc, jobName, vars) {
  const rules = effective(doc, jobName, 'rules');
  const jobAf = effective(doc, jobName, 'allow_failure');
  if (!Array.isArray(rules) || rules.length === 0) return null;
  for (const r of rules) {
    if (r.when === 'never') continue;
    let match;
    try {
      match = r.if === undefined || r.if === null || evalIf(r.if, vars);
    } catch {
      match = false;
    }
    if (!match) continue;
    if (r.allow_failure !== undefined) return r.allow_failure;
    return jobAf ?? false;
  }
  return null;
}

const VARSET = (line, scope) => ({
  AG_LINE: line,
  AG_SCOPE: scope,
  CI_PIPELINE_SOURCE: scope === 'nightly' ? 'schedule' : 'push',
  CI_COMMIT_BRANCH: line === '4x' ? 'release/4.x' : 'next',
  CI_COMMIT_REF_NAME: line === '4x' ? 'release/4.x' : 'next',
  CI_COMMIT_TAG: '',
});

// ---------- load docs ----------
const docs = {};
const rootFile = rel('.gitlab-ci.yml');
if (!existsSync(rootFile)) {
  fail.push('.gitlab-ci.yml missing');
} else {
  docs['.gitlab-ci.yml'] = yaml.parse(readFileSync(rootFile, 'utf8'));
}
for (const s of STREAMS) {
  const f = `ci/${s}.gitlab-ci.yml`;
  const p = rel(f);
  if (!existsSync(p)) fail.push(`${f} missing`);
  else docs[f] = yaml.parse(readFileSync(p, 'utf8'));
}
const jobKeys = (doc) =>
  Object.keys(doc ?? {}).filter((k) => !isHidden(k) && !TOP_KEYS.has(k));
const hiddenKeys = (doc) => Object.keys(doc ?? {}).filter(isHidden);

// ---------- root file ----------
const root = docs['.gitlab-ci.yml'];
if (root) {
  const includes = (Array.isArray(root.include) ? root.include : [root.include])
    .filter(Boolean)
    .map((i) => (typeof i === 'string' ? i : (i.local ?? i.file ?? '')));
  const wildcard = includes.some((i) => /ci\/\*(\*|\.gitlab-ci\.yml)/.test(i));
  for (const s of STREAMS) {
    if (!wildcard && !includes.includes(`ci/${s}.gitlab-ci.yml`)) {
      fail.push(`root include missing ci/${s}.gitlab-ci.yml`);
    }
  }
  if (JSON.stringify(root.stages ?? []) !== JSON.stringify(STAGES)) {
    fail.push(`root stages must equal ${STAGES.join(',')}`);
  }
  const wfRules = root.workflow?.rules ?? [];
  if (!wfRules.some((r) => /merge_request_event/.test(String(r.if ?? '')) && r.when === 'never')) {
    fail.push('root workflow.rules must set merge_request_event → never (mirror has no MR pipelines)');
  }
  // rule 3 (root side): no job may exist at root other than contract:*
  for (const j of jobKeys(root)) {
    if (!j.startsWith('contract:')) fail.push(`root job '${j}' is not contract:*`);
  }
}

// ---------- per-fragment rules ----------
const allJobs = {}; // name -> {file, def}
const extendsChain = (doc, name, seen = new Set()) => {
  // resolve extends to a list of template names (through same-file hidden keys)
  if (seen.has(name)) return [];
  seen.add(name);
  const node = doc?.[name];
  if (!node) return [name]; // external/root template
  const ex = node.extends ? (Array.isArray(node.extends) ? node.extends : [node.extends]) : [];
  return ex.flatMap((e) => (e.startsWith('.') && docs ? extendsChain(doc, e, seen) : [e]));
};

for (const s of STREAMS) {
  const file = `ci/${s}.gitlab-ci.yml`;
  const doc = docs[file];
  if (!doc) continue;

  // rule 1 — key namespaces + reserved top-level keys
  for (const k of Object.keys(doc)) {
    if (!isHidden(k) && TOP_KEYS.has(k)) fail.push(`${file}: reserved top-level key '${k}'`);
  }
  for (const j of jobKeys(doc)) {
    const ok = j.startsWith(`${s}:`) || (s === 'plat' && j === 'pages');
    if (!ok) fail.push(`${file}: job '${j}' must be named ${s}:* (or .${s}-* template)`);
  }
  for (const h of hiddenKeys(doc)) {
    if (!h.startsWith(`.${s}-`) && !h.startsWith('.ag-')) {
      fail.push(`${file}: hidden key '${h}' must be .${s}-*`);
    }
  }
  // every hidden template must extend a root template (transitively)
  for (const h of hiddenKeys(doc)) {
    if (h.startsWith('.ag-')) continue;
    const chain = extendsChain(doc, h);
    if (!chain.some((c) => ROOT_TEMPLATES.includes(c))) {
      fail.push(`${file}: template '${h}' does not resolve to a root .ag-* template`);
    }
  }

  for (const [j, def] of Object.entries(doc)) {
    if (isHidden(j) || TOP_KEYS.has(j)) continue;
    allJobs[j] = { file, def };
    if (typeof def !== 'object' || def === null) {
      fail.push(`${file}: job '${j}' is not a mapping`);
      continue;
    }

    // rule 2 — stage + extends (effective: inherited values count)
    const stage = effective(doc, j, 'stage');
    if (!STAGES.includes(stage)) fail.push(`${file}: job '${j}' stage '${stage}' not in STAGES`);
    const chain = extendsChain(doc, j).concat(
      def.extends ? (Array.isArray(def.extends) ? def.extends : [def.extends]) : [],
    );
    if (!chain.some((c) => ROOT_TEMPLATES.includes(c))) {
      fail.push(`${file}: job '${j}' does not extend a root .ag-* template`);
    }

    // rule 3 — effective rules array, scoping vars, no merge_request_event
    const rules = effective(doc, j, 'rules');
    if (!Array.isArray(rules) || rules.length === 0) {
      fail.push(`${file}: job '${j}' has no rules`);
    } else {
      const text = yaml.stringify(rules);
      if (/merge_request_event/.test(text)) {
        fail.push(`${file}: job '${j}' references merge_request_event (mirror, §4.13.3)`);
      }
      if (!/\$AG_(SCOPE|LINE)/.test(text)) {
        fail.push(`${file}: job '${j}' rules test neither $AG_SCOPE nor $AG_LINE`);
      }
    }

    // rule 4 — needs/dependencies
    const needList = (Array.isArray(def.needs) ? def.needs : def.needs ? [def.needs] : []).map((n) =>
      typeof n === 'string' ? { job: n } : n,
    );
    for (const n of needList) {
      if (!n?.job) continue;
      const m = /^([a-z]+):/.exec(n.job);
      const foreign = m ? m[1] !== s : n.job === 'pages' && s !== 'plat';
      if (foreign) {
        const owner = m ? m[1] : 'plat';
        if (!((CI_JOBS[owner] ?? []).includes(n.job) || CI_JOBS.root.includes(n.job))) {
          fail.push(`${file}: job '${j}' needs foreign job '${n.job}' not in CI_JOBS`);
        } else if (n.optional !== true) {
          fail.push(`${file}: job '${j}' needs foreign job '${n.job}' without optional: true`);
        }
      }
    }
    // rule 7 — only qual defines :certify: jobs
    if (s !== 'qual' && /:certify:/.test(j)) {
      fail.push(`${file}: job '${j}' is a certify job outside ci/qual.gitlab-ci.yml (rule 7)`);
    }
    for (const d of Array.isArray(def.dependencies) ? def.dependencies : []) {
      const m = /^([a-z]+):/.exec(d);
      if (m && m[1] !== s) fail.push(`${file}: job '${j}' uses dependencies on foreign job '${d}'`);
    }

    // rule 5 — artifacts
    const art = def.artifacts;
    if (art) {
      const prod = PRODUCER_PATHS[j] ?? [];
      for (const p of art.paths ?? []) {
        const ok =
          p === '.artifacts/' ||
          p.startsWith(`.artifacts/${s}/`) ||
          prod.some((pp) => p === pp || p.startsWith(pp));
        if (!ok) fail.push(`${file}: job '${j}' artifact path '${p}' outside .artifacts/${s}/ and producer paths`);
      }
      const otherStreamPath = (art.paths ?? []).find((p) =>
        STREAMS.some((o) => o !== s && p.startsWith(`.artifacts/${o}/`)),
      );
      if (otherStreamPath) {
        fail.push(`${file}: job '${j}' artifact path '${otherStreamPath}' writes into another stream's dir`);
      }
      // evidence contract (REQ-FIN-21/22): applies to artifacts that ARE
      // evidence — any path under .artifacts/, or the job is a gate/certify.
      // Producer artifacts (storybook-static/, Pages public/) are covered by
      // the producer-path rule above, not the evidence name.
      const isEvidence =
        (art.paths ?? []).some((p) => p === '.artifacts/' || p.startsWith('.artifacts')) ||
        /^evidence-/.test(String(art.name ?? '')) ||
        /:(gate|certify):/.test(j);
      if (isEvidence) {
        if (art.when !== 'always') {
          fail.push(`${file}: job '${j}' evidence artifacts missing when: always`);
        }
        const artName = String(art.name ?? '');
        const expectedName = j === 'pages' ? /^pages-/ : /^evidence-/;
        if (!expectedName.test(artName)) {
          fail.push(`${file}: job '${j}' evidence artifacts name '${artName || '(unset)'}' must match ${j === 'pages' ? 'pages-*' : 'evidence-*'}`);
        }
        const exp = String(art.expire_in ?? '');
        if (!['14 days', '30 days', '90 days'].includes(exp)) {
          fail.push(`${file}: job '${j}' artifacts expire_in '${exp || '(unset)'}' must be 14 days (pr/main), 30 days (nightly) or 90 days (release)`);
        }
        if ((def.extends ?? []).includes('.ag-evidence-release') && exp && exp !== '90 days') {
          fail.push(`${file}: job '${j}' on .ag-evidence-release must expire_in 90 days, not '${exp}'`);
        }
      }
    }

    // rule 8 — credentials / id_tokens
    const flat = yaml.stringify(def);
    if (CREDENTIAL_RE.test(flat)) fail.push(`${file}: job '${j}' references a credential name`);
    const idTok = Object.keys(def.id_tokens ?? {});
    if (idTok.length && j !== 'plat:publish:npm') {
      fail.push(`${file}: job '${j}' declares id_tokens (only plat:publish:npm may)`);
    }
    for (const t of idTok) {
      if (!PUBLISH_ID_TOKENS.includes(t)) fail.push(`${file}: job '${j}' id_token '${t}' not allowed`);
    }

    // rule 9 — heavyweight runner + worker counts
    const scriptText = yaml.stringify(def.script ?? []);
    if (BROWSER_RE.test(scriptText) && !chain.some((c) => ['.ag-playwright', '.ag-gpu', '.ag-aws-remote'].includes(c))) {
      fail.push(`${file}: job '${j}' runs browser/perf commands without .ag-playwright/.ag-gpu/.ag-aws-remote`);
    }
    const w = scriptText.match(/(?:--maxWorkers[=\s]+|workers:\s*|--parallel[=\s]+)(\d+)/);
    if (w && Number(w[1]) > 16) fail.push(`${file}: job '${j}' sets worker count ${w[1]} > 16`);
  }
}

// ---------- rule 6 — REQUIRED_JOBS + activation ----------
for (const j of REQUIRED_JOBS) {
  if (!allJobs[j] && !root?.[j]) fail.push(`required job '${j}' is not defined`);
}
const actFile = rel('ci/plat/activation.json');
if (existsSync(actFile)) {
  let act;
  try {
    act = JSON.parse(readFileSync(actFile, 'utf8'));
  } catch (e) {
    fail.push(`ci/plat/activation.json does not parse: ${e.message}`);
  }
  for (const row of act?.activations ?? []) {
    const { job, line } = row;
    // REQ-FIN-22/24 (B3-14): any defined job may be activated, not only the
    // REQUIRED_JOBS gates. Gates (REQUIRED_JOBS ∪ CERT_JOBS) must run and be
    // allow_failure:false on both pr and main scope; any other activated job
    // must run on at least one of pr/main/nightly and be false wherever it runs.
    const file = allJobs[job]?.file ?? '.gitlab-ci.yml';
    const doc = docs[file];
    if (!doc || !jobKeys(doc).includes(job)) {
      fail.push(`activation.json: '${job}' not defined`);
      continue;
    }
    const gate = REQUIRED_JOBS.includes(job) || CERT_JOBS.includes(job);
    let runs = 0;
    for (const scope of gate ? ['pr', 'main'] : ['pr', 'main', 'nightly']) {
      const eff = effectiveAllowFailure(doc, job, VARSET(line, scope));
      if (eff === null) {
        if (gate) fail.push(`activation.json: '${job}' on ${line} does not run on ${scope} scope`);
        continue;
      }
      runs++;
      if (eff !== false)
        fail.push(`activation.json: '${job}' on ${line} has effective allow_failure=${eff} on ${scope} scope — flip it to false`);
    }
    if (!gate && runs === 0) fail.push(`activation.json: '${job}' on ${line} does not run on pr, main or nightly scope`);
  }
}

// ---------- G-16 + GHA token scan ----------
const wfDir = rel('.github/workflows');
if (existsSync(wfDir)) {
  for (const f of readdirSync(wfDir)) {
    if (f !== 'mirror-to-gitlab.yml') fail.push(`.github/workflows/${f} must not exist (G-16)`);
  }
}
const GHA_RE = /\bGITHUB_[A-Z_]+\b|\bgh\s+run\b|actions\/checkout|uses:\s*actions\//;
for (const f of ['.gitlab-ci.yml', ...STREAMS.map((s) => `ci/${s}.gitlab-ci.yml`)]) {
  const p = rel(f);
  if (!existsSync(p)) continue;
  const t = readFileSync(p, 'utf8');
  if (GHA_RE.test(t)) fail.push(`${f} references GitHub Actions machinery (G-16)`);
}

// ---------- task-graph hook ----------
const explicit = opt('files')?.split(',').filter(Boolean);
let changed = explicit;
if (!changed && existsSync(join(ROOT, '.git'))) {
  const lineBase =
    process.env.AG_LINE === '4x' ? 'origin/release/4.x'
    : process.env.AG_LINE === '5x' ? 'origin/next'
    : null;
  const base = opt('base') ?? process.env.AG_BASE ?? lineBase;
  if (base) {
    try {
      changed = execFileSync('git', ['-C', ROOT, 'diff', '--name-only', `${base}...HEAD`], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 64 * 1024 * 1024,
      })
        .trim()
        .split('\n')
        .filter(Boolean);
    } catch (e) {
      changed = null;
      // In CI the job fetches its base ref first (contract:ci-fragments), so an
      // unresolvable base means the task-graph hook would be silently skipped.
      if (process.env.GITLAB_CI === 'true') {
        fail.push(`cannot diff ${base}...HEAD (base ref not fetched?): ${String(e.stderr ?? e.message).split('\n')[0]}`);
      }
    }
  }
}
const tasksChanged = (changed ?? []).some((f) => /^docs\/auraglass-5\/tasks\/.*\.json$/.test(f));
const tgTool = rel('docs/auraglass-5/tools/verify-task-graph.mjs');
if (tasksChanged) {
  if (existsSync(tgTool)) {
    const r = execFileSync('node', [tgTool], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
    void r;
  } else {
    fail.push('task-graph verifier docs/auraglass-5/tools/verify-task-graph.mjs absent (G-15 hook, REQ-FIN-21)');
  }
}

for (const w of warn) console.warn(`contract:ci-fragments WARN: ${w}`);
if (fail.length) {
  console.error('contract:ci-fragments FAIL:\n' + fail.join('\n'));
  process.exit(1);
}
console.log('contract:ci-fragments OK');
