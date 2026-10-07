// Planning tool (contract §7.1): re-keys the archived DS/MAT/MOT/A11Y, FND/CTL/OVL and
// QA/SB/PERF task fragments into tasks/MAT.json, tasks/CMP.json and tasks/QUAL.json.
// It applies relocation rules R-01..R-13, resolves every path through the ordered ownership
// table (tools/ownership-table.mjs = contract §3.2), keeps only same-stream, same-lane
// depends_on edges, turns every other archived edge into contract-seam citations, maps
// archived REQ ids through each PRD's Appendix A, and rewrites GitHub Actions references to
// the GitLab CI model (contract §4.13). PLAT and SURF fragments were re-keyed separately and
// are not touched. Run once by the PRD authors; it is not a stream deliverable.
//
// Usage: node docs/auraglass-5/tools/relocate-archived-paths.mjs [--force]
//   Without --force it refuses to overwrite an existing MAT/CMP/QUAL fragment.
// Also writes archive/v1-19-prd/task-disposition.json (where every archived task went).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ownerOf, expandBraces, filesOf } from './ownership-table.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(root, '..', '..');
const ARCH = join(root, 'archive', 'v1-19-prd');
const force = process.argv.includes('--force');

const GROUPS = { DS: 'MAT', MAT: 'MAT', MOT: 'MAT', A11Y: 'MAT', FND: 'CMP', CTL: 'CMP', OVL: 'CMP', QA: 'QUAL', SB: 'QUAL', PERF: 'QUAL' };
const OTHER_GROUPS = { TRUST: 'PLAT', REL: 'PLAT', PKG: 'PLAT', DX: 'PLAT', NAV: 'SURF', DATA: 'SURF', AI: 'SURF', MED: 'SURF', EXP: 'SURF' };
const PRD_ID = { PLAT: 'PRD-1', MAT: 'PRD-2', CMP: 'PRD-3', SURF: 'PRD-4', QUAL: 'PRD-5' };
const PRD_FILE = { MAT: 'AURAGLASS_MATERIAL_SYSTEM_PRD.md', CMP: 'AURAGLASS_CORE_COMPONENTS_PRD.md', QUAL: 'AURAGLASS_QUALITY_SHOWCASE_PRD.md' };
const TARGETS = ['MAT', 'CMP', 'QUAL'];
const head = new Set(execFileSync('git', ['ls-files', '--', 'src', 'tests', 'scripts', '.storybook', 'docs/*.md', 'docs/*/*.md', 'canaries', 'certification', 'stories'], { cwd: repo, encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n'));
const headDirs = new Set([...head].flatMap((f) => f.split('/').slice(0, -1).map((_, i, a) => a.slice(0, i + 1).join('/') + '/')));
const FIVE_DIRS = new Set('button icon-button button-group toolbar toggle-group segmented-control switch slider checkbox radio-group text-field search-field select combobox number-field field dialog alert-dialog sheet popover tooltip menu toast text heading stack grid container icon card badge avatar alert progress meter skeleton separator kbd accordion collapsible link scroll-area rating inline-edit file-upload color-picker description-list image-list tour state-view tabs tab-bar breadcrumbs pagination command-palette source-transition timeline'.split(' '));
const KEEP = /^src\/(primitives\/(Slot|Portal|FocusScope|Label|DismissableLayer)\.tsx|icons\/|theme\/(color|materials|createGlassTheme|createBrandGlassTheme)\.ts)|^tokens\//;

// Seams that replace an archived edge, by the archived group of the depended-on task (contract §7.1 categories).
const SEAMS_BY_GROUP = {
  DS: ['S-03', 'S-04', 'S-10', 'S-11'], MAT: ['S-01', 'S-02', 'S-05', 'S-06'], MOT: ['S-12', 'S-13'], A11Y: ['S-20', 'S-21', 'S-22', 'S-23', 'S-24', 'S-25', 'S-26'],
  FND: ['S-30', 'S-31', 'S-32', 'S-33', 'S-34'], CTL: ['S-30'], OVL: ['S-30'], QA: ['S-40', 'S-41', 'S-42', 'S-43'], SB: ['S-41', 'S-51'], PERF: ['S-44', 'S-45'],
  TRUST: ['S-37', 'S-38'], REL: ['S-38', 'S-39'], PKG: ['S-35', 'S-36', 'S-49'], DX: ['S-39', 'S-46'], NAV: ['S-31', 'S-41'], DATA: ['S-31', 'S-41'], AI: ['S-31', 'S-41'], MED: ['S-31', 'S-41'], EXP: ['S-31', 'S-46'],
};
const PRD_TO_GROUP = { '00': 'TRUST', '01': 'REL', '02': 'PKG', '03': 'DS', '04': 'MAT', '05': 'A11Y', '06': 'MOT', '07': 'PERF', '08': 'FND', '09': 'CTL', '10': 'OVL', '11': 'NAV', '12': 'DATA', '13': 'AI', '14': 'MED', '15': 'EXP', '16': 'DX', '17': 'SB', '18': 'QA' };

// ---------- Lanes (each PRD §20; first match wins; null = fall back on the archived group) ----------
const pm = (await import(join(repo, 'node_modules', 'picomatch', 'index.js'))).default;
const lane = (id, globs) => ({ id, test: pm(globs, { dot: true }) });
const LANES = {
  MAT: [
    lane('2e-B', ['tokens/compat-alias-map.json', 'tokens/legacy/**', 'src/styles/**', 'src/compat/mat/**', 'src/root/mat.ts', 'fragments/**', 'ci/mat*', 'ci/mat/**', 'etc/api/**', 'stories/mat/**', 'apps/docs/content/mat/**', 'canaries/**', 'tests/fixtures/consumer-4x/cases/mat/**', 'tests/{rsc,types}/mat/**', 'tests/material/exports/**', '.changeset/mat-*']),
    lane('2b-M', ['scripts/tokens/lens-maps.mjs', 'src/material/css/generated/**__never__']),
    lane('2a-T', ['tokens/**', 'scripts/tokens/**', 'src/tokens/**', 'src/material/css/generated/**', 'src/motion/tokens.generated.ts', 'stylelint*', 'stylelint-plugin-auraglass/**', 'lint/rules/mat/no-raw-design-values*', 'tests/lint/mat/no-raw-design-values*', 'tests/tokens/**', 'tests/a11y/contrast-matrix.test.ts', 'tests/visual/mat/tokens/**', 'src/theme/{color,createGlassTheme,createBrandTheme,createBrandGlassTheme,presets,materials}.ts', 'tests/theme/{presets,createGlassTheme,createBrandTheme,color}.test.ts', 'docs/{motion,design-tokens}.md']),
    lane('2b-M', ['src/material/**', 'scripts/mat/{verify-optics-css,count-glass-recipes,verify-material-runtime}*', 'lint/rules/mat/{no-optics-outside-material,no-inline-glass}*', 'tests/lint/mat/{no-optics-outside-material,no-inline-glass}*', 'tests/material/**', 'tests/{e2e,visual,perf/browser}/mat/material/**']),
    lane('2c-V', ['src/motion/**', 'scripts/mat/verify-motion-css*', 'lint/rules/mat/motion-*', 'tests/lint/mat/motion-*', 'tests/motion/**', 'tests/{e2e,perf/browser}/mat/motion/**']),
    lane('2d-P', ['src/theme/**', 'src/a11y/**', 'src/hooks/**', 'scripts/mat/{verify-preference-source,verify-a11y-css,build-prepaint-script}*', 'lint/rules/mat/{no-document-escape,no-runtime-contrast}*', 'tests/lint/mat/{no-document-escape,no-runtime-contrast}*', 'tests/theme/**', 'tests/a11y/**', 'tests/{e2e,visual,ssr,perf/browser}/mat/a11y/**']),
  ],
  CMP: [
    lane('3i-Q', ['tests/{a11y/apg,e2e,visual,perf/browser,a11y/manual/records,a11y/manual/scripts}/cmp/**']),
    lane('3h-M', ['src/compat/cmp/**', 'fragments/{deprecations,codemods}/cmp*', 'fragments/codemods/cmp/**', 'tests/fixtures/consumer-4x/cases/cmp/**', 'registry/**', 'stories/cmp/migration/**']),
    lane('3b-A', ['src/components/{button,icon-button,button-group,toolbar,toggle-group,segmented-control}/**']),
    lane('3c-I', ['src/components/{field,text-field,search-field,number-field,checkbox,radio-group,switch,slider}/**', 'tests/controls/**']),
    lane('3d-P', ['src/components/{select,combobox}/**']),
    lane('3e-O1', ['src/components/{overlays,dialog,alert-dialog,sheet}/**', 'tests/overlays/**']),
    lane('3f-O2', ['src/components/{popover,tooltip,menu,toast}/**']),
    lane('3g-T', ['src/components/{text,heading,stack,grid,container,icon,card,badge,avatar,alert,progress,meter,skeleton,separator,kbd,accordion,collapsible,link,scroll-area,rating,inline-edit,file-upload,color-picker,description-list,image-list,tour,state-view}/**']),
    lane('3a-F', ['**']),
  ],
  QUAL: [
    lane('5a-Q1', ['tests/contract/**', 'tests/helpers/**', 'tests/a11y/apg/harness.ts', 'tests/a11y/apg/__selftest__/**', 'tests/a11y/browser/**']),
    lane('5h-Q8', ['showcase/**', 'stylelint.showcase.config.mjs', 'tests/showcase/**']),
    lane('5g-Q7', ['.storybook/**', 'tsconfig.storybook.json', 'scripts/storybook/**', 'stories/qual/**', 'tests/storybook/**', 'scripts/qual/lint-stories*', 'tests/lint/qual/story-rules*', 'tests/e2e/qual/storybook/**', 'vitest.storybook.config.ts']),
    lane('5f-Q6', ['tests/perf/**', 'packages/qa/src/perf/**', 'scripts/qual/{verify-css-perf,verify-dist-perf}*', 'scripts/qual/stylelint-perf/**', 'lint/rules/qual/**', 'tests/lint/qual/{perf,layer,raf,no-global}*', 'fragments/perf-budgets/qual.ts', 'certification/calibration.json', 'docs/certification/real-device-matrix.md', 'tests/{e2e,visual}/qual/perf/**']),
    lane('5e-Q5', ['certification/lanes/{behaviour,ssr-hydration,overlay-stacking,motion,canaries}.spec.ts', 'certification/ratchets.json', 'scripts/qual/lint-tests*', 'tests/lint/qual/no-vacuous*']),
    lane('5d-Q4', ['certification/baselines/**', 'certification/lanes/regression.spec.ts', 'packages/qa/src/evidence/**', 'certification/{exemptions,console-allowlist,quarantine}.json', 'certification/RELEASE_CHECKLIST.md', 'certification/review/**']),
    lane('5c-Q3', ['certification/scenes/**', 'packages/qa/src/{pixel,ocr,inspect}/**', 'packages/qa/fixtures/**', 'certification/lanes/{environment-visual,preference-modes,console,engine,known-failures}.spec.ts', 'certification/thresholds.json']),
    lane('5b-Q2', ['certification/**', 'ci/qual*', 'ci/qual/**', 'packages/qa/src/{resolve,inventory,matrix}/**', 'fragments/**', 'jest*', 'playwright*', '__mocks__/**']),
  ],
};
const LANE_FALLBACK = { DS: '2a-T', MAT: '2b-M', MOT: '2c-V', A11Y: '2d-P', FND: '3a-F', CTL: '3c-I', OVL: '3e-O1', QA: '5b-Q2', SB: '5g-Q7', PERF: '5f-Q6' };
const CTL_SYSTEM_LANE = [[/button|toolbar|toggle|segment/i, '3b-A'], [/select|combobox|autocomplete/i, '3d-P'], [/dialog|sheet|drawer|modal/i, '3e-O1'], [/popover|tooltip|menu|toast/i, '3f-O2']];

// ---------- Archived REQ → new REQ (each PRD's Appendix A) ----------
function parseAppendix(key) {
  const text = readFileSync(join(root, 'prd', PRD_FILE[key]), 'utf8');
  const app = text.slice(text.indexOf('## Appendix A'));
  const map = new Map();
  let header = null;
  for (const line of app.split('\n')) {
    if (!line.startsWith('|')) { header = null; continue; }
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.every((c) => /^-+$/.test(c))) continue;
    if (cells.includes('Old') && (cells.includes('New') || cells.includes('Disposition'))) { header = cells; continue; }
    if (!header) continue;
    header.forEach((h, i) => {
      if (h !== 'Old' || header[i + 1] !== 'New') return;
      const olds = expandOld(cells[i] ?? ''), news = expandNew(cells[i + 1] ?? '', key);
      for (const o of olds) map.set(o, news);
    });
  }
  return map;
}
function expandOld(cell) {
  const out = [];
  let prefix = null;
  for (const tok of cell.replace(/`/g, '').split(',')) {
    const m = tok.trim().match(/^(?:REQ-)?([A-Z][A-Z0-9]*)?-(\d+)([a-z]?)(?:\.\.(?:[A-Z][A-Z0-9]*-)?(\d+))?/);
    if (!m) continue;
    prefix = m[1] ?? prefix;
    if (!prefix || /^AC$/.test(prefix)) continue;
    const a = +m[2], b = m[4] ? +m[4] : a;
    for (let n = a; n <= b; n++) out.push(`${prefix}-${n}${n === a ? m[3] : ''}`);
  }
  return out;
}
const pad = (n) => String(n).padStart(2, '0');
function expandNew(cell, key) {
  if (/^\s*(→|dropped|replaced)/.test(cell)) return [];
  let c = cell.split(/[;→]/)[0].replace(/\([^)]*\)/g, '').replace(/`[^`]*`/g, '').replace(/§[\d.]+/g, '').replace(/AC-[A-Z]+-[\d.,\- ]+/g, '');
  const out = [];
  for (const tok of c.split(/[,/]|\bplus\b/)) {
    const m = tok.trim().match(/^(?:(?:REQ-)?[A-Z]+-|-)?(\d{1,3})([a-z]?)$/);
    if (m) out.push(`REQ-${key}-${pad(+m[1])}${m[2]}`);
  }
  return out;
}
const REQMAP = Object.fromEntries(TARGETS.map((k) => [k, parseAppendix(k)]));
// Fallback when Appendix A has no row for the archived REQ (or the task moved stream): pick the
// REQ-<KEY> paragraphs of PRD §5 that name the task's files, directories or system.
const REQTEXT = Object.fromEntries(TARGETS.map((k) => [k, [...readFileSync(join(root, 'prd', PRD_FILE[k]), 'utf8').matchAll(new RegExp(`^- \\*\\*(REQ-${k}-\\d+[a-z]?)\\b(.*)$`, 'gm'))].map((m) => ({ id: m[1], text: m[2] }))]));
function inferReqs(key, files, system) {
  const needles = new Set();
  for (const f of files) {
    const clean = f.replace(/^NEW:/, '').replace(/\{[^}]*\}/g, '').replace(/\*.*$/, '');
    if (clean.length > 8) needles.add(clean.replace(/\/$/, ''));
    const b = basename(clean).replace(/\.(test|spec|stories|meta|apg\.spec|visual\.spec)?\.?(tsx?|mjs|cjs|css|json|md|mdx)$/, '').replace(/\.(test|spec)$/, '');
    if (b.length >= 5 && !/^(index|types|README)$/.test(b)) needles.add(b);
  }
  for (const w of String(system).split(/[\/\s,]+/)) if (w.length >= 6) needles.add(w);
  const scored = REQTEXT[key].map((r) => ({ id: r.id, n: [...needles].filter((x) => r.text.includes(x)).length })).filter((r) => r.n).sort((a, b) => b.n - a.n);
  return scored.slice(0, scored.length && scored[0].n > 1 ? 2 : 1).map((r) => r.id);
}
function mapReqs(text, group, key) {
  const reqs = new Set();
  for (const m of String(text).matchAll(/REQ-([A-Z][A-Z0-9]*)-(\d+)([a-z]?)/g)) {
    const g = m[1];
    if (!GROUPS[g]) continue;
    for (const r of REQMAP[key].get(`${g}-${+m[2]}${m[3]}`) ?? REQMAP[key].get(`${g}-${+m[2]}`) ?? []) reqs.add(r);
  }
  return [...reqs];
}

// ---------- Text rewrites: GitHub Actions → GitLab CI (contract §4.13, R-12) ----------
const WORKFLOW_JOB = {
  'certify-pr': 'the qual:certify:l* jobs in ci/qual.gitlab-ci.yml (AG_SCOPE=pr)', 'certify-main': 'the qual:certify:l* jobs (AG_SCOPE=main)',
  'certify-nightly': 'qual:certify:nightly (GitLab pipeline schedule)', 'certify-release': 'qual:certify:release (tag pipeline)',
  'certify-image': 'a ci/qual.gitlab-ci.yml image job', 'glass-pipeline': 'ci/<stream>.gitlab-ci.yml jobs registered through fragments/lanes/<stream>.ts',
  'deploy-storybook': "PLAT's GitLab Pages job (pages)", 'publish-npm': 'plat:publish:npm (GitLab tag pipeline, npm trusted publishing over GitLab OIDC id_tokens)',
  'release': 'plat:publish:npm (GitLab tag pipeline)', 'visual-regression': 'qual:certify:l7', 'design-system-compliance': 'qual:certify:l1',
  'storybook-tests': 'qual:certify:l5/l6', 'removal-gate': 'plat:gate:removal', 'foundation-pattern': 'cmp:test:foundation-pattern',
  'artifact': 'plat:package:pack', 'overlays-remote': 'a cmp:* job extending .ag-aws-remote',
};
function gitlabify(s, stream) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/\.github\/workflows\/([a-z0-9-]+)\.yml/g, (_, n) => WORKFLOW_JOB[n] ?? `a ${stream.toLowerCase()}:* job in ci/${stream.toLowerCase()}.gitlab-ci.yml`)
    .replace(/<stream>/g, stream.toLowerCase())
    .replace(/GitHub[- ]Actions?( workflows?)?/g, 'GitLab CI')
    .replace(/GitHub-hosted( runners?)?/g, 'GitLab SaaS runners')
    .replace(/ubuntu-latest/g, 'saas-linux-medium-amd64')
    .replace(/workflow_dispatch/g, 'a manual GitLab job (when: manual)')
    .replace(/\bpull_request(_target)?\b/g, 'pipelines on mirrored branch pushes (AG_SCOPE=pr)')
    .replace(/GITHUB_STEP_SUMMARY/g, 'the job log and a .artifacts/ summary file')
    .replace(/GITHUB_WORKFLOW_REF/g, 'CI_CONFIG_PATH/CI_PIPELINE_SOURCE')
    .replace(/GITHUB_TOKEN/g, 'CI_JOB_TOKEN (read-only)')
    .replace(/actions\/upload-pages-artifact|actions\/deploy-pages/g, 'the GitLab pages job')
    .replace(/actions\/upload-artifact(@v\d+)?/g, 'GitLab artifacts (expire_in)')
    .replace(/gh workflow run ([\w-]+)/g, 'glab ci run ($1)')
    .replace(/gh run (list|view|watch)/g, 'glab ci $1')
    .replace(/\bPR labels?\b/g, 'PR title/branch markers (GitLab CI reads no GitHub labels)')
    .replace(/GitHub Releases?/g, 'GitLab release (from the tag pipeline)')
    .replace(/GitHub Pages/g, 'GitLab Pages')
    .replace(/certify-pr \/ (static|artifact|token|behaviour|visual-reduced|regression|engine|motion|unit|canaries)/g, (_, n) => `qual:certify:${{ static: 'l1', artifact: 'l2', token: 'l4', behaviour: 'l5', 'visual-reduced': 'l6', regression: 'l7', engine: 'l8', motion: 'l9', unit: 'l12', canaries: 'l11' }[n]}`)
    .replace(/certify-pr(\.yml)?/g, 'the PR-scope qual:certify:l* jobs')
    .replace(/certify-main(\.yml)?/g, 'the main-scope qual:certify:l* jobs')
    .replace(/certify-nightly(\.yml)?/g, 'qual:certify:nightly')
    .replace(/certify-release(\.yml)?/g, 'qual:certify:release')
    .replace(/certify-\*\.yml/g, 'the qual:certify:* jobs')
    .replace(/storybook-tests\.yml/g, 'the qual:certify:l5 Storybook steps')
    .replace(/deploy-storybook\.yml/g, "PLAT's pages job")
    .replace(/glass-pipeline\.yml/g, 'the stream CI fragment')
    .replace(/publish-npm\.yml/g, 'plat:publish:npm')
    .replace(/gh release (download|upload|view)/g, 'glab release $1 (GitLab release assets)')
    .replace(/\bgh pr (view|edit)\b/g, 'the PR page on GitHub (read by a human; CI holds no GitHub credential)')
    .replace(/\bgh PR\b/g, 'GitHub PR')
    .replace(/retention-days:? ?(\d+)/g, 'expire_in $1 days')
    .replace(/material-lanes workflow/g, 'material lane registrations');
}

// GitLab CI rewrites of archived QA/SB/PERF CI tasks (contract §4.13; QUAL Appendix A notes QA-33/34/35, SB-50..53).
// source id -> { drop: reason } | partial task fields.
const OVERRIDES = {
  'DS-002': { drop: '4.2 regeneration of the 4.x src/tokens/generated.ts is release/4.x work, PLAT (§2.4.1)' },
  'MAT-098': { drop: 'release/4.x CSS fallback scoping is PLAT (§2.4.1; D-28 4.2 fixes)' },
  'MOT-012': { drop: '4.2 animations.css selector fix is PLAT on release/4.x (§2.4.1)' },
  'A11Y-093': { drop: 'verification of the 4.2 tag output is PLAT release verification (G-07 checklist)' },
  'QA-017': { file: 'NEW:certification/runner/image/Dockerfile; NEW:ci/qual/image.gitlab-ci.yml', description: '[REQ-QA-63, §4.7] Cert container FROM mcr.microsoft.com/playwright:v1.63.0-noble@sha256:<digest> (equal to the @playwright/test pin) with tesseract-ocr 5.x + eng, fonts-inter, fonts-noto-core, zstd; writes /opt/ag-cert/fonts.json. Built and pushed only by the GitLab job qual:build:cert-image (ci/qual/image.gitlab-ci.yml, included by ci/qual.gitlab-ci.yml; AG_SCOPE=main on certification/runner/image/** changes, or when: manual) to the project container registry $CI_REGISTRY_IMAGE/cert using CI_REGISTRY credentials only; digest written to certification/image.lock.json in the same QUAL PR.', test: 'qual:build:cert-image green; docker manifest inspect of the lock digest resolves inside the job; tesseract --version prints 5' },
  'QA-019': { description: 'REQ-QA-60: any code path that launches a browser exits 2 and prints the remote command (push the branch and read its GitLab pipeline, `glab ci run --branch <b> --variables LANE:<lane>`, or `node certification/runner/build-bundle.mjs`) unless CI==="true" (GitLab sets it) or AG_CERT_REMOTE==="1"; AG_CERT_ALLOW_LOCAL=1 is honoured only when set explicitly by the operator. The runner entrypoint sets AG_CERT_REMOTE=1 and AG_REMOTE_RUNNER=1.' },
  'QA-028': { description: 'REQ-QA-64: list EC2 instances tagged ag-cert=1 whose launch time + ttl tag < now and print attempt-id/sha/lane; exit 1 if any; never terminates and never touches untagged instances. Run by agents through the governed /Users/gurbakshchahal/.local/bin/aws wrapper, and inside qual:certify:nightly only on the registered auraglass-aws-remote runner (OD-11, its own instance role); without that runner the step reports pending. Creating IAM trust is outside the autonomous perimeter.' },
  'QA-029': { description: '[REQ-QA-36] Generic lane runner certification/run.mjs (LANE_COMMAND, S-43: `node certification/run.mjs --lane <id> --scope $AG_SCOPE`) used by every qual:certify:l<n> job; reads registrations through loadFragments("lanes") (F lanes); a missing provider path fails the lane with "provider missing: <path>"; 0-test junit or empty subject list fails; writes lane-manifest.json (durationMs, captureRatePerSec) under .artifacts/qual/<lane>/; registrations from other streams on paths the PR does not own report pre-existing.' },
  'QA-031': { description: '[REQ-QA-34, REQ-QA-36] Fill ci/qual.gitlab-ci.yml from its C0 seed: .qual-lane template (extends .ag-playwright, needs qual:build:storybook optional, rules $AG_LINE == "5x" && ($AG_SCOPE == "pr" || "main")), qual:build:storybook (npm run build-storybook + verify-fresh.mjs, artifact storybook-static/ expire_in 14 days) and the twelve CERT_JOBS qual:certify:l1..l12 exactly as named in src/contracts/testing.ts; image pinned by digest from certification/image.lock.json; no credentials, no merge_request_event; every new job allow_failure: true until its first green run on next, then QUAL flips it.', test: 'packages/qa/test/ci-fragment.test.ts parses the fragment: job names = CERT_JOBS + qual:build:storybook + qual:certify:{nightly,release}; contract:ci-fragments green', file: 'ci/qual.gitlab-ci.yml' },
  'QA-032': { description: '[REQ-QA-34] Main scope ($AG_SCOPE == "main" on next and release/4.x): every PR lane on all subjects plus full L6 (shards from packages/qa/src/matrix/shard.ts via parallel: N) and L11; artifacts expire_in 30 days through .ag-evidence-main; job qual:certify:cert-scene runs environment-visual.spec.ts on stories tagged cert-scene (its artifact is read by PLAT\'s pages job through an optional need).' , test: 'packages/qa/test/ci-fragment.test.ts; first main pipeline URL' },
  'QA-033': { description: '[REQ-QA-34, REQ-QA-63] qual:certify:nightly ($AG_SCOPE == "nightly", GitLab pipeline schedule on next and release/4.x, OD-11): full L6 in chromium/webkit/firefox; L10 profile (a) on .ag-gpu (saas-linux-medium-amd64-gpu-standard), reporting pending if the GPU runner is unavailable; L7 run twice on the same SHA and compared by flake.ts; stale-instance report only on the auraglass-aws-remote runner; artifacts expire_in 30 days.', test: 'packages/qa/test/ci-fragment.test.ts; first scheduled pipeline URL' },
  'QA-034': { description: '[REQ-QA-34] qual:certify:release ($AG_SCOPE == "release", tag pipeline on $CI_COMMIT_TAG): every lane L1-L12 on the tag SHA (full set) via needs, then verify (cert:verify, REQ-QA-30) and claims (cert:claims, REQ-QA-31); writes .artifacts/qual/release-verdict.json (ReleaseVerdict, S-55) that PLAT\'s plat:publish:npm reads through an optional need; artifacts expire_in 90 days (.ag-evidence-release); no npm publish, no id_tokens in any QUAL job.', test: 'packages/qa/test/ci-fragment.test.ts: no "npm publish" and no id_tokens in ci/qual.gitlab-ci.yml; release-verdict.json schema test' },
  'QA-035': { file: 'NEW:packages/qa/test/ci-fragment.test.ts', description: '[REQ-QA-36] Parse ci/qual.gitlab-ci.yml (and ci/qual/**) with yaml: 0 allow_failure on jobs already flipped, 0 "|| true", 0 jobs computing a "score"; every artifacts block has expire_in in {14, 30, 90} days; no job reads a credential variable; no job uses merge_request_event or id_tokens; qual:certify:release contains no npm publish. Complements PLAT\'s contract:ci-fragments.', test: 'node_modules/.bin/jest packages/qa/test/ci-fragment.test.ts' },
  'QA-037': { drop: 'branch protection and required-status configuration is PLAT (REQ-PLAT-17, verify-branch-protection.mjs) and OD-9' },
  'QA-068': { description: 'REQ-QA-25: manual job qual:certify:baseline-update (when: manual, input variable PR_BRANCH): runs regression.spec.ts with --update-snapshots in the pinned image on that branch, writes the ag-image-digest PNG chunk, generates baseline-diff-report.html (packages/qa/src/evidence/diffReport.ts) as an artifact (expire_in 14 days). CI holds no GitHub credential, so the job never pushes: the QUAL author downloads the artifact and commits certification/baselines/** to the PR branch, pasting the job URL into the PR.', test: 'packages/qa/test/ci-fragment.test.ts asserts --update-snapshots appears only in qual:certify:baseline-update' },
  'QA-070': { description: 'REQ-QA-25 baseline guard inside qual:certify:l7: if the PR diff (git diff origin/$BASE...HEAD) touches certification/baselines/**, the commit message or PR branch must carry a baseline-refresh marker and the PR body must link the baseline-diff-report.html job artifact; otherwise L7 fails. Design approval is CODEOWNERS review on GitHub (OD-9 records whether GitLab status is required).', test: 'packages/qa/test/ci-fragment.test.ts; throwaway branch without the marker fails L7' },
  'QA-072': { description: 'REQ-QA-26: qual:certify:l7 captures element-cropped default-preference cells at 1440x900 and 390x844 for merge-base and head and itself writes .artifacts/qual/visual-class.json (VisualClassReport, S-55, from VISUAL_TOLERANCE). PLAT\'s plat:gate:change-class only reads that artifact through an optional need; QUAL never calls a PLAT script. On release/4.x the evidence-only 4.x capture is PLAT\'s plat:test:visual-4x.', test: 'throwaway branch on next: visual-class.json present in the L7 job artifacts' },
  'QA-073': { description: '[REQ-QA-26] AC-QA-09 proof on a throwaway branch (never merged): change one pixel row colour of the Button default; L7 visual-class.json shows changed:true (ratio > 0.001 of the crop) and plat:gate:change-class fails without a visual-bug-fix record. Paste the GitLab pipeline URLs in the lane report.', test: 'GitLab pipeline URLs: change-class red without the record' },
  'QA-074': { description: '[REQ-QA-24, REQ-QA-25] AC-QA-08 proof on a throwaway branch: change the Button border radius by 2px (seed sentinel until CMP\'s Button is real); qual:certify:l7 fails with a diff-image artifact and the baseline guard demands the refresh marker plus design review.', test: 'GitLab pipeline URL: L7 red with diff artifact' },
  'QA-085': { description: 'REQ-QA-20: invoke tests/perf/harness/run-perf.mjs for profiles a-d and grade.mjs; publish perf-results.json, perf-grades.json and .artifacts/qual/perf-report.json (S-55); fail if a profile host is missing (gpu for (a) reports pending until OD-11) or 0 frames; T1 below C or T2 below D fails; a grade drop of >=1 letter against the previous release tag\'s perf-grades.json (fetched from that tag pipeline\'s artifacts via the GitLab API with CI_JOB_TOKEN) on the same perfHost class fails.', test: 'qual:certify:nightly L10; packages/qa/test/perf-regression.test.ts (B->C same host fails, different host not compared)' },
  'QA-087': { description: 'REQ-QA-39: L11 step consumer-4x-frozen installs the PLAT harness tests/fixtures/consumer-4x/ with every stream\'s cases/<stream>/ from the packed tarball (AURAGLASS_TARBALL dotenv from plat:package:pack); on 4.x: build + render + default-mode cells unchanged; on 5.0: install the packed @auraglass/cli tarball and run its local bin `migrate 4to5` (no npx download; missing CLI -> provider missing: packages/cli), then build with 0 TODO(aura-glass 5) markers in the flagship subset.', test: 'qual:certify:l11 green on release/4.x; on next pending until migrate exists' },
  'QA-096': { drop: 'publishing is PLAT\'s plat:publish:npm, which reads QUAL\'s ReleaseVerdict artifact through an optional need (contract §3.5 row 16, S-55); QUAL never edits publish config' },
  'QA-097': { description: '[REQ-QA-30, REQ-QA-35] AC-QA-11 proof: run qual:certify:release in dry-run mode (manual pipeline on a throwaway tag-like branch with AG_CERT_DRY_RUN=1 and DROP_LANE=L7, honoured only in dry runs) -> verify exits non-zero, the claims step does not start and release-verdict.json says fail. No tag is pushed, nothing is published. Paste the pipeline URL.', test: 'dry-run pipeline URL: verify red, claims not started' },
  'QA-100': { description: 'REQ-QA-72: manual job qual:certify:record-review (when: manual, variables REVIEWER, SUBJECT, SCORES_JSON) validates against review-record.schema.json (or contracts/schemas/sr-record.schema.json for screen-reader records), binds sha + composite sha256 and publishes review-record-<sha>-<subject>.json / a11y-manual-<sha>.json as artifacts (expire_in 90 days). Never committed; the agent never fills reviewer scores.', test: 'packages/qa/test/ci-fragment.test.ts asserts schema validation and no git push in the job' },
  'QA-102': { description: '[REQ-QA-31] AC-QA-19: qual:certify:release runs PLAT\'s docs claims lint (registered by PLAT as a node-script lane through fragments/lanes/plat.ts) against claims.json; when the registration is missing the step reports provider missing, never passes.' },
  'QA-125': { description: 'REQ-QA-18 / REQ-A11Y-42 (b): L5 step behaviour-axe-full (nightly and release scopes) runs tests/a11y/browser/axe.spec.ts with color-contrast enabled on every T0/T1/T2 subject from listSubjects (S-40) in all 8 scenes, light and dark, chromium and webkit; 0 serious/critical, moderate fails for T1 flagships; writes an L5 lane manifest; artifacts expire_in 30 days nightly, 90 release.', test: 'packages/qa/test/ci-fragment.test.ts asserts the nightly/release L5 scope with 8 scenes x 2 engines; first nightly pipeline URL' },
  'QA-126': { description: 'REQ-QA-20 / REQ-PERF-36: size the GPU pool for the per-PR frame-time ratchet tests/perf/browser/qual/pr-ratchet.spec.ts (44 flagships, standard tier, profile (a)): pool = ceil(44 x perFlagshipSeconds / 600) parallel jobs on .ag-gpu (GitLab saas-linux-medium-amd64-gpu-standard), or the gated auraglass-aws-remote runner as fallback (OD-11); no credential ever reaches branch code. Record pool size, minutes and cost in certification/runner/README.md.', test: 'packages/qa/test/shard.test.ts asserts gpuPoolSize(44, s) = ceil(44*s/600); first ratchet pipeline completes <= 10 min' },
  'QA-036': { description: 'REQ-QA-37: compare pipeline wall clock to budgets (PR-scope lane jobs p90 <= 20 min over the last 20 pipelines, main <= 45, release <= 90) using the GitLab pipelines API with CI_JOB_TOKEN (read-only) in a main-scope job; after 5 consecutive overruns write a budget-overrun record to the GA dashboard artifact (CI cannot open GitHub issues); never fails the release. Per-cell capture p95 <= 2.5 s from lane manifests.' },
  'QA-095': { description: 'REQ-QA-33: build certification-<version>.tar.zst (zstd -19) from .artifacts/qual/<sha>; captures JPEG q85 except baseline-compared cells (PNG); fail if > 2 GB; qual:certify:release publishes it as a job artifact (expire_in 90 days) linked from the GitLab release created by PLAT\'s tag pipeline; runs on the AWS remote runner also copy to the S3 evidence prefix with that runner\'s instance role.' },
  'QA-101': { description: 'REQ-QA-80 items 1-8 as a template with machine keys; packages/qa/src/evidence/checklist.ts renders it from evidence-manifest.json + verify output into .artifacts/qual/release-checklist.md (a qual:certify:release artifact that the release PR links; CI holds no GitHub credential to edit PR bodies); mechanical items ticked only from evidence, human items (L13/L14) only from review records.' },
  'QA-124': { description: '[REQ-QA-80] GA run: qual:certify:release on the GA tag SHA, every lane pass, verify pass, claims.json built (worst OCR >= 4.5/3/7; solid/forced-colors 0 backdrop filters; contrast-more >= 0.5% delta), canaries green, checklist rendered, bundle attached, PR-scope p90 <= 20 min over 20 pipelines and release <= 90 min. The agent reports artifact links; humans approve.', test: 'qual:certify:release pipeline URL on the GA SHA all green' },
  'SB-001': { file: 'ci/qual.gitlab-ci.yml', description: 'qual:build:storybook: npm ci, `npm run build-storybook 2>&1 | tee sb-build.log`, `node scripts/storybook/check-build-log.mjs sb-build.log`, `node scripts/storybook/verify-fresh.mjs`; artifact storybook-static/ (incl. cert-manifest.json) named evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA, expire_in 14 days; rules AG_SCOPE pr/main/release on both lines; no credentials. Replaces the deleted deploy-storybook.yml build job.', test: 'tests/storybook/ci-storybook.test.mjs asserts job name, script order and expire_in' },
  'SB-002': { description: 'Storybook test steps run inside QUAL lane jobs (no reusable workflows on GitLab): qual:certify:l5 and l6 consume the storybook-static/ artifact of qual:build:storybook (needs, optional: true), re-run verify-fresh.mjs and record build duration (target <= 6 min). Lint gates and Storybook test shards are added by the lint-gates task.', test: 'tests/storybook/ci-storybook.test.mjs asserts the needs edge and verify-fresh step' },
  'SB-003': { drop: 'Storybook deploy moves to PLAT\'s GitLab Pages job (pages, REQ-PLAT-07; QUAL Appendix A.4 SB-50..53)' },
  'SB-004': { drop: 'the cert-scene gate is an optional need of PLAT\'s pages job on qual:certify:cert-scene; no GitHub check-runs API in CI' },
  'SB-005': { drop: 'Cloudflare PR previews are gone (QUAL Appendix A.4); next previews are the storybook-static/ job artifact browsable in GitLab' },
  'SB-006': { drop: 'Pages assembly is PLAT\'s scripts/ci/assemble-pages.mjs (contract §4.13.6)' },
  'SB-014': { description: 'Contract check: qual:build:storybook runs `node scripts/storybook/verify-fresh.mjs storybook-static` after `npm run build-storybook` and before any artifact upload, and no CI file references the deleted visual-regression.yml.', test: 'tests/storybook/ci-storybook.test.mjs' },
  'SB-017': { description: 'On release/4.x the 4.x Storybook build is PLAT\'s (contract §2.4.1); QUAL\'s ci/qual.gitlab-ci.yml (owned on both branches, row A20) adds a release/4.x-scoped qual:build:storybook ($AG_LINE == "4x") that runs verify-fresh.mjs before artifact upload and publishes storybook-static/ for PLAT\'s pages job (AG_PAGES_BRANCH = release/4.x until GA). No story or visual change (D-27).', test: 'release/4.x pipeline: qual:build:storybook green, artifact present', branch: 'release/4.x' },
  'SB-018': { file: 'NEW:tests/storybook/ci-storybook.test.mjs', description: 'node --test; yaml devDependency is in the frozen set. Parse ci/qual.gitlab-ci.yml: qual:build:storybook and every Storybook-related job extend a root template, have AG_SCOPE rules, no credential variables, no merge_request_event, expire_in present; verify-fresh precedes artifact upload; the Storybook artifact path is storybook-static/ (consumed by PLAT pages via optional need).', test: 'node --test tests/storybook/ci-storybook.test.mjs (qual:certify:l1)' },
  'SB-033': { description: 'Add Storybook lint gates (lint:stories, ratchet --check, lint-titles, static-gates, typecheck:stories, RuleTester + node tests) to lane L1 and Storybook interaction tests (`npm run test-storybook -- --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL`, parallel: 4, Playwright browsers from the .ag-playwright image, never installed locally) to lane L5 through fragments/lanes/qual.ts; JUnit + a11y reports as artifacts expire_in 14 days; <= 12 min wall.', file: 'fragments/lanes/qual.ts' },
  'SB-102': { description: 'Wraps verify-showcase-imports.mjs; negative fixture importing aura-glass/src/... must fail; registered on lane L1 (fragments/lanes/qual.ts).' },
  'PERF-022': { drop: 'stream gates join CI through F lanes or the stream\'s own fragment; QUAL never edits PLAT jobs (contract §4.13.4 rule 7). Perf static/artifact checks are QUAL lane registrations (see the 5f-Q6 lint and dist gates)' },
  'PERF-053': { description: 'L10 Performance inside QUAL\'s own lane jobs: main scope runs perf-self-test and profiles b/c/d on .ag-playwright (saas-linux-medium-amd64, AG_REMOTE_RUNNER=1, built storybook-static/ artifact); nightly adds profile (a) on .ag-gpu; device lanes use .ag-aws-remote (manual, allow_failure until the runner is registered, OD-11). Artifacts perf-results-<profile> expire_in 30 days. No cloud credential in any job.', test: 'main and nightly pipeline URLs with all L10 profile jobs green or pending with the exact runner reason' },
  'PERF-055': { description: 'Register node-cold-import as a QUAL L2 lane step (fragments/lanes/qual.ts, kind node-script) that reads the packed tarball from AURAGLASS_TARBALL (plat:package:pack dotenv, optional need) and runs tests/perf/node-cold-import.test.mjs on node 20.19.0 and 22 (parallel: matrix); artifact node-import-<node> expire_in 14 days. QUAL never edits plat:package:pack.', file: 'fragments/lanes/qual.ts' },
  'PERF-076': { description: 'perf-pr-ratchet as part of qual:certify:l10 at PR scope for changes under src/** (rules: changes): GPU profile (a) from the sized .ag-gpu pool; when no GPU runner is available, profile (c) runs on SaaS runners and the cell is re-measured on main after merge (documented limitation). No credentials reach branch code.', test: 'PR-scope pipeline URL with pr-ratchet green, or profile-c leg with the recorded reason' },
  'PERF-078': { description: 'Beta: on the beta SHA, `rg -n "backdrop-filter|backdropFilter|backdrop-blur" src` excluding src/material/**, stories and tests = 0 (4.1: 513/537), as a QUAL L1 lane step; perf beta gates green; QUAL flips its own L1/L10 jobs to allow_failure: false (REQUIRED_JOBS activation is per stream, §4.13.4 rule 6).' },
  'PERF-021': { file: 'NEW:tests/perf/ci-wiring.qual.test.ts', description: 'REQ-PERF-11: parse ci/qual.gitlab-ci.yml and fragments/lanes/qual.ts: QUAL\'s perf-static and perf-artifact steps exist inside lane jobs L1/L2, none is allow_failure after flip, no rule reads PR labels or titles. (PLAT owns tests/build/ci-wiring.test.ts for its own jobs.)' },
  'PERF-040': { test: 'qual:certify:l10 (nightly profile a on .ag-gpu; profiles b-c-d on .ag-playwright) produce schema-valid perf-results.json per profile' },
  'SB-016': { test: 'rg -n "storybook-visual-certification|story-presentation-audit" package.json .gitlab-ci.yml ci .storybook = 0 (also enforced by static-gates.mjs)' },
};

// ---------- Path relocation (R-01..R-13) ----------
const D02 = ['a11y/apg', 'a11y/manual/records', 'a11y/manual/scripts', 'perf/browser', 'visual', 'e2e', 'ssr', 'rsc', 'types', 'lint'];
const D09 = ['release', 'build', 'deps', 'pack', 'ci', 'dx', 'exports', 'side-effects', 'react19', 'css', 'removal', 'registry', 'compat', 'deprecations', 'docs'];
const AREA = { DS: 'tokens', MAT: 'material', MOT: 'motion', A11Y: 'a11y', FND: 'foundation', CTL: 'controls', OVL: 'overlays', QA: 'qual', SB: 'qual', PERF: 'qual' };
const STREAMS_L = ['plat', 'mat', 'cmp', 'surf', 'qual'];
const isLegacy = (p) => /^(src|tests)\//.test(p) && !KEEP.test(p) && (head.has(p) || headDirs.has(p.endsWith('/') ? p : p + '/') || /[*]/.test(p) && headDirs.has(p.replace(/[*].*$/, '')));

/** Returns { path } (relocated), { drop: reason } or { path, note }. */
function relocate(p, s, group, action) {
  const l = s.toLowerCase();
  let m;
  if ((m = p.match(/^\.github\/workflows\/([a-z0-9-]+)\.yml$/))) {
    if (/REMOVE|DELETE/.test(action)) return { drop: 'C0-11 deletes the GitHub workflows' };
    return { path: `ci/${l}.gitlab-ci.yml`, note: `R-12 ${m[1]}.yml` };
  }
  if (p === '.github/CODEOWNERS') return { drop: 'CONTRACT (generated from contracts/ownership.json)' };
  if (p === 'deprecations.json') return { path: `fragments/deprecations/${l}.ts` };
  if (p === 'docs/size-budgets.json' || p === '.bundlesizerc') return { path: `fragments/size-budgets/${l}.ts` };
  if (p === 'tests/perf/harness/budgets.json' && s !== 'QUAL') return { path: `fragments/perf-budgets/${l}.ts` };
  if (/^certification\/lanes\.config\.ts$/.test(p) && s !== 'QUAL') return { path: `fragments/lanes/${l}.ts` };
  if (/^(certification\/playwright\.cert\.config\.ts|playwright\.config\.ts|playwright\.[\w.-]+\.config\.ts)$/.test(p) && s !== 'QUAL') return { path: `fragments/playwright/${l}.json` };
  if (/^certification\/review\//.test(p) && s !== 'QUAL') return { path: `fragments/review/${l}.ts` };
  if (/^certification\/lanes\/[\w.-]+\.spec\.ts$/.test(p) && s !== 'QUAL') return { drop: 'S-41: lane subjects come from story parameters and meta, not from edits to QUAL specs' };
  if (/^scripts\/tokens\/gates\/literals-baseline\.json$/.test(p) && s !== 'MAT') return { path: `fragments/literals-baseline/${l}.json` };
  if (/^build\/css-ownership\.json$/.test(p)) return { path: `fragments/css/${l}.ts` };
  if (/^\.storybook\//.test(p) && s !== 'QUAL') return { drop: 'S-20/S-42/S-41: QUAL builds Storybook globals and decorators from the contract; no other stream edits .storybook' };
  if (/^(jest\.config\.js|jest\.setup\.js)$/.test(p) && s !== 'QUAL') return { drop: 'jest.config.js is verbatim (§4.11) and discovers tests by location' };
  if (/^(eslint-plugin-auraglass\.js|eslint\.config\.js|\.eslintrc\.js)$/.test(p)) return s === 'PLAT' ? { path: p } : { path: `lint/rules/${l}/`, note: 'S-47 auto-discovered rule (verbatim loader)' };
  if (/^(package\.json|package-lock\.json|docs\/dependency-allowlist\.json|tsconfig[\w.-]*\.json|\.gitignore|\.npmignore|tsdown\.config\.ts|rollup\.config\.js|vite\.config\.ts)$/.test(p) && !(p === 'tsconfig.storybook.json' && s === 'QUAL'))
    return { drop: 'pre-declared in the contract (§4.11/§4.12, S-36/S-49/S-52); a change is a contract PR' };
  if (/^src\/index\.ts$/.test(p)) return s === 'QUAL' ? { drop: 'CONTRACT' } : { path: `src/root/${l}.ts` };
  if (/^src\/compat\/index\.ts$/.test(p)) return s === 'QUAL' ? { drop: 'CONTRACT' } : { path: `src/compat/${l}/index.ts` };
  if (/^src\/lib\/(cn|utils\w*)\.ts$/.test(p)) return { drop: 'S-37: cn and warnDeprecated are final seeds in src/internal (PLAT)' };
  if (/^CHANGELOG\.md$/.test(p)) return { path: `.changeset/${l}-${group.toLowerCase()}.md` };
  if (/^(CONTRIBUTING|README)[\w.-]*\.md$/.test(p) && s !== 'PLAT') return { path: `apps/docs/content/${l}/${basename(p).toLowerCase()}` };
  if (/^scripts\/codemods\/internal\//.test(p)) return { drop: 'dropped: internal forwardRef codemod has nothing to convert (5.0 files are written fresh)' };
  if ((m = p.match(/^packages\/cli\/src\/migrate\/4to5\/(transforms|__fixtures__)\/(.*)$/)) && s !== 'PLAT')
    return { path: m[1] === 'transforms' ? `fragments/codemods/${l}.ts` : `fragments/codemods/${l}/fixtures/${m[2]}` };
  if ((m = p.match(/^src\/compat\/([^/]+)\/(.*)$/)) && !STREAMS_L.includes(m[1]) && m[1] !== 'css') return { path: `src/compat/${l}/${m[1]}/${m[2]}` };
  if ((m = p.match(/^src\/(?:design-system\/)?stories\/(.*)$/))) {
    if (/flagships\/.*\.mdx$/.test(m[1])) return { drop: 'R-07: flagship MDX replaced by generated docs pages (S-51)' };
    if (isLegacy(p) && /REMOVE|DELETE/.test(action)) return { drop: 'legacy story (PLAT deletes legacy families)' };
    return { path: `stories/${l}/${m[1]}` };
  }
  if ((m = p.match(/^scripts\/(ci|build|release|docs)\/(.*)$/)) && s !== 'PLAT') {
    if (head.has(p)) return /REMOVE|DELETE/.test(action) ? { drop: 'PLAT removes 4.x scripts (E04)' } : { drop: '4.x script edit: PLAT on release/4.x (§2.4.1)' };
    if (m[2] === 'lens-maps.mjs') return { path: 'scripts/tokens/lens-maps.mjs' };
    return { path: `scripts/${l}/${m[2]}` };
  }
  if ((m = p.match(/^docs\/(.*)$/)) && !/^docs\/certification\//.test(p) && !/^docs\/(motion|design-tokens)\.md$/.test(p) && s !== 'PLAT' && !/^docs\/auraglass-5\//.test(p))
    return { path: `apps/docs/content/${l}/${m[1]}` };
  if (/^docs\/(motion|design-tokens)\.md$/.test(p) && s !== 'MAT') return { drop: 'MAT-owned docs' };
  if ((m = p.match(/^apps\/docs\/content\/(?!plat\/|mat\/|cmp\/|surf\/|qual\/)(.*)$/))) return { path: `apps/docs/content/${l}/${m[1]}` };
  if (p === 'canaries/' || p === 'canaries') return { path: `canaries/next16/app/${l}/` };
  if ((m = p.match(/^docs\/auraglass-5\/(migration|cert|release)\/(.*)$/))) return s === 'QUAL' ? { path: `docs/certification/${m[2]}` } : { path: `apps/docs/content/${l}/${m[1]}/${m[2]}` };
  if ((m = p.match(/^canaries\/next16\/app\/(?!plat\/|mat\/|cmp\/|surf\/|qual\/)(.*)$/))) return { path: `canaries/next16/app/${l}/${m[1]}` };
  if ((m = p.match(/^canaries\/vite\/src\/(?!plat\/|mat\/|cmp\/|surf\/|qual\/)(.*)$/))) return { path: `canaries/vite/src/${l}/${m[1].replace(/\.tsx$/, '.page.tsx')}` };
  if ((m = p.match(/^tests\/(eslint|lint)\/(?!plat\/|mat\/|cmp\/|surf\/|qual\/)(.*)$/))) return { path: `tests/lint/${l}/${m[2]}` };
  if ((m = p.match(/^tests\/a11y\/browser\/(.*)$/)) && s !== 'QUAL') return { path: `tests/e2e/${l}/${m[1]}` };
  if ((m = p.match(/^tests\/motion\/(.*)$/)) && s !== 'MAT') return { path: `tests/e2e/${l}/motion/${m[1]}` };
  if ((m = p.match(/^tests\/canary\/(.*)$/))) return { path: `tests/e2e/${l}/canary/${m[1]}` };
  for (const k of D02) {
    const pre = `tests/${k}/`;
    if (p.startsWith(pre)) {
      const rest = p.slice(pre.length);
      if (k === 'a11y/apg' && /^(harness\.ts|__selftest__\/)/.test(rest)) return { path: p };
      if (k === 'a11y/apg' && /^harness\.selftest/.test(rest)) return { path: `tests/a11y/apg/__selftest__/${rest}` };
      if (STREAMS_L.includes(rest.split('/')[0])) return { path: p };
      if (isLegacy(p)) return { drop: 'legacy 4.x spec (quarantined; PLAT owns legacy/**)' };
      return { path: `${pre}${l}/${rest}` };
    }
  }
  if ((m = p.match(/^tests\/([^/]+)\/(.*)$/)) && D09.includes(m[1]) && s !== 'PLAT') return { path: `tests/${AREA[group]}/${m[1]}/${m[2]}` };
  if ((m = p.match(/^tests\/(material|tokens|motion|theme|a11y)\/(.*)$/)) && s !== 'MAT') return { path: `tests/e2e/${l}/${m[1]}/${m[2]}`.replace(/\.test\.tsx?$/, (x) => x) };
  if (/DEPRECATE/.test(action) && /^(src|tests)\//.test(p) && isLegacy(p)) return { path: `fragments/deprecations/${l}.ts`, note: 'deprecation entry on release/4.x' };
  if (/^src\/primitives\/(GlassCore|OptimizedGlassCore|LiquidGlass\w*|motion\/)/.test(p) || /^src\/styles\/glass\.css$/.test(p) || /^src\/tokens\/glass\.ts$/.test(p)) return { drop: 'legacy 4.x file (quarantined; successor at its 5.0 path; PLAT on release/4.x)' };
  if (isLegacy(p) && (m = p.match(/^src\/components\/([^/]+)\/(.*)$/)) && FIVE_DIRS.has(m[1]) && /REDESIGN|POLISH|CONSOLIDATE|REPLACE|MODIFY|CREATE|TEST/.test(action))
    return { path: `src/components/${m[1]}/${m[2].replace(/(^|\/)Glass(?=[A-Z])/g, '$1')}`, note: 'rebuilt at its 5.0 path' };
  if (isLegacy(p) && /^tests\//.test(p) && ownerOf(p).owner === s) return { path: p, note: 'rewritten fresh on next' };
  if (isLegacy(p) && !/^src\/(material|tokens|theme|a11y|motion|styles|hooks|foundation|primitives|icons|forms|compat)\//.test(p)) {
    if (/DEPRECATE/.test(action)) return { path: `fragments/deprecations/${l}.ts`, note: 'deprecation entry on release/4.x' };
    return { drop: 'legacy 4.x path: quarantined on next (§3.1a); 4.x edits are PLAT on release/4.x (§2.4.1)' };
  }
  return { path: p };
}

// ---------- Convert ----------
const archived = {};
for (const g of [...Object.keys(GROUPS), ...Object.keys(OTHER_GROUPS)]) archived[g] = JSON.parse(readFileSync(join(ARCH, 'tasks', `${g}.json`), 'utf8'));
const groupOf = (id) => String(id).split('-')[0];
const consumed = new Map();
for (const k of ['PLAT', 'SURF']) for (const t of JSON.parse(readFileSync(join(root, 'tasks', `${k}.json`), 'utf8'))) for (const s of String(t.source ?? '').match(/[A-Z][A-Z0-9]*-\d{3}/g) ?? []) consumed.set(s, [...(consumed.get(s) ?? []), t.id]);

const disposition = {};
for (const g of Object.keys(OTHER_GROUPS)) for (const t of archived[g]) disposition[t.id] = consumed.has(t.id) ? `carried by ${consumed.get(t.id).join(', ')}` : `not carried: consolidated or dropped by the ${OTHER_GROUPS[g]} re-key (see ${OTHER_GROUPS[g] === 'PLAT' ? 'AURAGLASS_PLATFORM_RELEASE_PRD' : 'AURAGLASS_PRODUCT_SURFACES_PRD'} Appendix A)`;
const drafts = [];
for (const g of Object.keys(GROUPS)) {
  for (const t of archived[g]) {
    if (consumed.has(t.id)) { disposition[t.id] = `carried by ${consumed.get(t.id).join(', ')}`; continue; }
    const removal = /^(REMOVE|DELETE)$/.test(t.action) || /^(removal|dispositions)\//.test(t.system);
    const files = filesOf(t.file).flatMap((f) => (/\{/.test(f) && !/\*/.test(f) && expandBraces(f).length <= 12 ? [f] : [f]));
    const kept = [], dropped = [];
    let stream = GROUPS[g];
    for (const f of files) {
      const r = relocate(f, stream, g, t.action);
      if (r.drop) { dropped.push(`${f} (${r.drop})`); continue; }
      kept.push({ path: r.path, note: r.note, owner: ownerOf(expandBraces(r.path)[0].replace(/\*\*.*$/, 'x/x').replace(/\*/g, 'x')).owner });
    }
    if (removal && kept.every((k) => isLegacy(k.path) || k.owner === 'PLAT' || k.owner === 'NONE')) {
      disposition[t.id] = 'R-01 → PLAT (legacy quarantine; PLAT deletes legacy families RM-01..RM-13)';
      continue;
    }
    // Owner of the task = majority owner among MAT/CMP/QUAL of the kept files.
    const counts = {};
    for (const k of kept) if (TARGETS.includes(k.owner)) counts[k.owner] = (counts[k.owner] ?? 0) + 1;
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1] || (a[0] === stream ? -1 : b[0] === stream ? 1 : 0))[0]?.[0];
    if (best && best !== stream) {
      // Re-run relocation for the new owner so per-stream directories follow it.
      stream = best;
      kept.length = 0;
      for (const f of files) { const r = relocate(f, stream, g, t.action); if (!r.drop) kept.push({ path: r.path, note: r.note, owner: ownerOf(expandBraces(r.path)[0].replace(/\*\*.*$/, 'x/x').replace(/\*/g, 'x')).owner }); }
    }
    const own = kept.filter((k) => k.owner === stream);
    const foreign = kept.filter((k) => k.owner !== stream);
    for (const k of foreign) dropped.push(`${k.path} (owned by ${k.owner}; consumed through the contract)`);
    if (!own.length && files.length) {
      const why = foreign.length ? `owner ${[...new Set(foreign.map((k) => k.owner))].join('/')}` : dropped.join('; ');
      disposition[t.id] = `not carried: ${why}`;
      continue;
    }
    drafts.push({ t, g, stream, files: [...new Set(own.map((k) => k.path))], notes: own.map((k) => k.note).filter(Boolean), dropped });
  }
}


// Contract-driven tasks for PRD requirements no archived task carried (source "new (contract-v1.1)").
// [stream, lane, REQ, file, action, system, description, test, storybook, priority, branch?]
const SUPPLEMENT = [
  ['CMP', '3b-A', 'REQ-CMP-42', 'src/components/segmented-control/SegmentedControl.css', 'CREATE', 'SegmentedControl/indicator', 'Track as SurfaceGroup (chrome, regular, capsule); indicator layer transient, thin, concentric, inner fill at rest; glass plus [data-ag-animating] (will-change: transform) only while moving, removed on transitionend; moves by transform + width through S-13 startMorph when View Transitions exist, else CSS transition with --ag-spring-snappy <= --ag-duration-small; jumps under calm/none; one ResizeObserver on the root.', 'src/components/segmented-control/SegmentedControl.test.tsx (attribute lifecycle); tests/e2e/cmp/controls/segmented-indicator.spec.ts (remote, GitLab .ag-playwright)', 'Controls/SegmentedControl: States', 'P1'],
  ['CMP', '3b-A', 'REQ-CMP-44', 'src/components/segmented-control/SegmentedControl.tsx', 'MODIFY', 'SegmentedControl/overflow', 'Segments never wrap: below the summed width (container query) labels ellipsize with item min-inline-size >= 44px and title = full label; with more than 5 items at 390px a dev-only warning recommends Select (stripped in production).', 'src/components/segmented-control/SegmentedControl.test.tsx (title attribute, dev warning once); tests/visual/cmp/controls/segmented-390.visual.spec.ts', 'Controls/SegmentedControl: Overflow at 390', 'P2'],
  ['CMP', '3c-I', 'REQ-CMP-46', 'src/components/switch/Switch.css', 'CREATE', 'Switch/material', 'Track content-sunken when unchecked and opaque --ag-color-accent when checked; thumb transient (inner fill at rest, glass only while dragged or animating); translate with --ag-spring-snappy <= --ag-duration-small; no transition under calm/none; no shimmer and no infinite animation on next (the 4.x shimmer fix is PLAT on release/4.x).', 'src/components/switch/Switch.test.tsx; stylelint (no infinite animation, no backdrop-filter outside material)', 'Controls/Switch: States', 'P1'],
  ['CMP', '3c-I', 'REQ-CMP-49', 'src/components/slider/Slider.css', 'CREATE', 'Slider/material', 'Track content-sunken 4/6/8px by size; range is the accent fill; thumb transient 16/20/24px with glass only under [data-dragging]; never scales (dragging raises --ag-specular instead).', 'src/components/slider/Slider.test.tsx (size classes); tests/visual/cmp/controls/slider.visual.spec.ts', 'Controls/Slider: States', 'P1'],
  ['CMP', '3c-I', 'REQ-CMP-51', 'src/components/slider/Slider.client.tsx', 'MODIFY', 'Slider/pointer', 'Pointer capture on the control; track click jumps to the value; touch-action: none on the control only; during a drag forward onValueChange at most once per frame (latest value in a ref, flushed through S-13 subscribeFrame, no React state of its own); keyboard changes forward synchronously; onValueCommitted fires once on pointerup/keyup after any pending flush.', 'src/components/slider/Slider.test.tsx; tests/perf/browser/cmp/controls.spec.ts (remote)', 'Controls/Slider: Keyboard', 'P0'],
  ['CMP', '3c-I', 'REQ-CMP-54', 'src/components/checkbox/Checkbox.css; src/components/radio-group/RadioGroup.css', 'CREATE', 'Checkbox/RadioGroup material', 'Box content-sunken with a 1px --ag-surface-rim; checked = opaque accent fill with a contrast-color() icon (fallback --ag-color-on-accent); no backdrop-filter anywhere in a checkbox or radio group (fixes E-12).', 'src/components/checkbox/Checkbox.test.tsx; src/components/radio-group/RadioGroup.test.tsx; scripts/mat/verify-optics-css.mjs reports 0 for both files (lane L1)', 'Controls/Checkbox, Controls/RadioGroup: States', 'P1'],
  ['CMP', '3c-I', 'REQ-CMP-59', 'NEW:src/components/field/Fieldset.tsx', 'CREATE', 'Fieldset', 'Flat Fieldset on Base UI Fieldset with a legend prop and legend part; absorbs GlassFieldGroup (compat adapter in src/compat/cmp/, codemod mapping in fragments/codemods/cmp.ts).', 'src/components/field/Fieldset.test.tsx (legend part, disabled propagation)', 'Controls/Field: Fieldset', 'P1'],
  ['CMP', '3d-P', 'REQ-CMP-67', 'src/components/select/Select.css', 'CREATE', 'Select/material', 'Trigger is the content-sunken field shell; popup overlay regular; item highlight a content-raised fill with no blur; popup materialises from var(--transform-origin) with opacity + scale(0.96->1) over --ag-duration-small (exit uses -exit), opacity only under calm; backdrop-filter never animated.', 'src/components/select/Select.test.tsx; tests/e2e/cmp/controls/select-motion.spec.ts (remote)', 'Controls/Select: States', 'P1'],
  ['CMP', '3c-I', 'REQ-CMP-76', 'NEW:src/components/number-field/parse.ts', 'CREATE', 'NumberField/parse', 'Parse and format with Intl.NumberFormat(locale) (de-DE "1.234,5" -> 1234.5); blur normalises and clamps to [min, max]; invalid text restores the last valid value; no number library.', 'src/components/number-field/parse.test.ts (en-US, de-DE, fr-CH, ar-EG digits; clamp; invalid restore)', 'n/a', 'P1'],
  ['CMP', '3g-T', 'REQ-CMP-111', 'NEW:src/components/text/Text.tsx; NEW:src/components/heading/Heading.tsx', 'CREATE', 'Text/Heading (T0)', 'Text renders the S-03 --ag-type-<role>-* roles (body default, callout, caption, label, mono); Heading takes level 1-6 and size display|title-1|title-2|title-3 (absorbs DisplayText); both server components with render for the element; absorb Typography (compat adapters).', 'src/components/text/Text.test.tsx; src/components/heading/Heading.test.tsx; tests/ssr/cmp/t0-server-safe.test.tsx', 'Foundation/Text, Foundation/Heading', 'P0'],
  ['CMP', '3g-T', 'REQ-CMP-114', 'NEW:src/components/badge/Badge.tsx', 'CREATE', 'Badge', 'Flat server Badge with intent, dot and count (max renders "99+"); opaque tint with contrast-color() text and no material; absorbs LiquidGlassBadgeCluster, GlassStatusDot, GlassConnectionStatus.', 'src/components/badge/Badge.test.tsx', 'Core/Badge: States', 'P1'],
  ['CMP', '3g-T', 'REQ-CMP-115', 'NEW:src/components/avatar/AvatarGroup.tsx', 'CREATE', 'Avatar/AvatarGroup', 'Avatar (Root, Image, Fallback; root SizeProps) on Base UI Avatar (img with alt, or initials + aria-label; fallback timing client-side); flat server AvatarGroup with max and an accessible "+N" overflow count.', 'src/components/avatar/Avatar.test.tsx; src/components/avatar/AvatarGroup.test.tsx', 'Core/Avatar: Group', 'P1'],
  ['CMP', '3g-T', 'REQ-CMP-119', 'NEW:src/components/link/Link.tsx; NEW:src/components/kbd/Kbd.tsx', 'CREATE', 'Separator/Kbd/Link/DescriptionList', 'Separator on Base UI Separator (hairline token; role=separator + orientation only when semantic, decorative otherwise); Kbd renders <kbd> content-sunken; Link renders <a> with render for router links and, for target=_blank, rel="noopener noreferrer" plus a VisuallyHidden "(opens in new tab)"; DescriptionList takes items {term; details}[] and orientation, renders <dl>, stacks below a 400px container. All four are server components.', 'src/components/{separator,kbd,link,description-list}/*.test.tsx; tests/ssr/cmp/t2-server-safe.test.tsx', 'Core/Link, Core/Kbd, Core/Separator, Core/DescriptionList', 'P1'],
  ['CMP', '3g-T', 'REQ-CMP-127', 'NEW:src/components/image-list/ImageList.css', 'CREATE', 'ImageList/material', 'Item bar chrome thin and declares data-ag-backdrop="media"; cols is a maximum reduced by container width via minItemWidth (default 160px); one ResizeObserver only for the masonry variant; absorbs ImageListItem, ImageListItemBar, GlassGallery.', 'src/components/image-list/ImageList.test.tsx (ResizeObserver count by variant)', 'Core/ImageList: Variants', 'P2'],
  ['CMP', '3g-T', 'REQ-CMP-129', 'NEW:src/components/state-view/StateView.tsx', 'CREATE', 'EmptyState/ErrorState', 'One shared flat server layout for EmptyState and ErrorState (title, description, icon, actions; no material); ErrorState is role="alert" only when urgent.', 'src/components/state-view/StateView.test.tsx', 'Core/StateView: Empty, Error', 'P1'],
  ['CMP', '3h-M', 'REQ-CMP-135', 'NEW:tests/fixtures/consumer-4x/cases/cmp/', 'TEST', 'consumer-4x cases', 'On release/4.x (branch 4x-cmp/*): author the CMP subset of real 4.x usage (GlassButton, GlassInput, GlassSelectCompound, GlassSwitch, GlassCheckbox, GlassModal, GlassDrawer, GlassPopover, GlassTooltip, GlassDropdownMenu, GlassToast, GlassCard, Typography). Must compile on every 4.x minor unchanged and, after migrate 4to5, with 0 TODOs on mechanically mappable props (G-08).', 'PLAT harness tests/fixtures/consumer-4x (lane L11 on both lines)', 'n/a', 'P0', 'release/4.x'],
  ['CMP', '3a-F', 'REQ-CMP-137', 'NEW:fragments/perf-budgets/cmp.ts', 'CREATE', 'perf-budgets fragment', 'PerfBudgetRow[] for the PRD §16 runtime rows (frame-p95-ms, long-tasks, blurred-surfaces, grade) per CMP subject and profile, provisional: true until the state-triggered calibration event.', 'npm run typecheck (satisfies PerfBudgetRow[]); tests/contract-doubles/fragments loader test', 'n/a', 'P1'],
  ['CMP', '3a-F', 'REQ-CMP-142', 'NEW:.changeset/cmp-*.md', 'DOC', 'changesets + API reports', 'Every CMP PR carries .changeset/cmp-<slug>.md with the bump implied by its change class and refreshes etc/api/{primitives,icons,forms}.* and etc/api/{root,compat}.cmp.* in the same PR via npm run api:update -- --entry <entry> (S-52).', 'plat:gate:change-class reads the changeset; api reports diff-clean in the GitLab pipeline', 'n/a', 'P1'],
  ['QUAL', '5c-Q3', 'REQ-QUAL-18', 'certification/lanes/environment-visual.spec.ts', 'TEST', 'L6 containment/target/focus', 'Containment, target and focus suites at 390x844 with every ancestor overflow-x clipping disabled: scrollWidth <= clientWidth + 1 on [data-ag-story-content], no subject pixel on the right edge; hit boxes >= 44x44 (>= 24x24 with spacing when meta size includes sm and the story declares it); focus indicator >= 3:1 against adjacent pixels on every scene; product scenes also at 768x1024 for layout only.', 'qual:certify:l6 on GitLab SaaS runners (mcr.microsoft.com/playwright image); self-test fixtures in packages/qa/fixtures', 'n/a', 'P0'],
  ['QUAL', '5e-Q5', 'REQ-QUAL-33', 'NEW:certification/lanes/canaries.spec.ts', 'TEST', '4.x coverage today', 'From day 0 qual:certify:nightly and main-scope l2/l3/l11 also run against two 4.x tarballs: npm pack aura-glass@$AG_V4_DIST_TAG (public registry, no credential) and one packed in-job from release/4.x head (git fetch with the job token, npm ci && npm pack in a scratch worktree). L3 checks G-07 against them; results go to the GA dashboard.', 'qual:certify:l11 job log shows both tarball runs; artifact .artifacts/qual/l11/4x-*.json', 'n/a', 'P0'],
  ['QUAL', '5f-Q6', 'REQ-QUAL-36', 'NEW:packages/qa/src/perf/bci.ts', 'CREATE', 'Blur Cost Index', 'Implement §4.6 BCI behind perf.bci (S-40; replaces the seed area-weighted fraction): effective nesting per element = ancestors whose ::before computed backdrop-filter != none.', 'packages/qa/test/bci.test.ts (full-viewport 20px = 1.0; 12px scrim = 0.6; 4.1 modal fixture >= 2.4)', 'n/a', 'P0'],
  ['QUAL', '5a-Q1', 'REQ-QUAL-69', 'tests/helpers/index.ts; NEW:tests/helpers/setup.ts', 'MODIFY', 'S-40 helpers final', 'Replace the C0 seed with the real helpers exporting exactly renderAg, renderAgServer, expectParts, expectNoBannedAttributes, gotoStory, listSubjects, apg, perf, scenes with the frozen signatures; setup adds jest-dom and jest-axe matchers; renderAg applies AgEnvironment as data-ag-* attributes and wraps AuraGlassProvider unless provider:false; gotoStory opens iframe.html?id=<id>&globals=...&ag-cert=1 and injects contracts/stubs/reference.css only while stub:"reference" is requested and material.css is absent.', 'tests/helpers/__tests__/helpers.test.tsx; contract:conformance stays green', 'n/a', 'P0'],
  ['QUAL', '5a-Q1', 'REQ-QUAL-70', 'NEW:tests/contract/', 'TEST', 'contract conformance suite', 'tests/contract/{material,attributes,css-vars,layers,preferences,components,meta,entries,fragments,ownership,doubles}.test.* each assert exactly the contract §6.3 row against seams and seeds, pass on day 0 and keep passing as real code lands; npm run test:contract runs in the blocking root job contract:conformance; failures name the seam id and owning stream; pre-existing failures are reported as such for other streams.', 'contract:conformance green on next and release/4.x', 'n/a', 'P0'],
  ['QUAL', '5d-Q4', 'REQ-QUAL-71', 'NEW:packages/qa/src/deliverables/check.ts', 'CREATE', 'flagship deliverables (G-04)', 'For each of the 44 flagships (ComponentMeta.flagship) verify meta, rendered parts = meta.parts, migration.selectors, a composing registry block/item, an APG spec under tests/a11y/apg/<stream>/, a size-budgets row, perf grade >= C, L7 baselines and a codemod fixture per absorbed 4.x name; reads only meta, fragments, artifacts and file existence; registered on L1; pending before RC-1, fail at release.', 'packages/qa/test/deliverables.test.ts', 'n/a', 'P0'],
];
function laneFor(d) {
  for (const f of d.files) {
    const probe = f.replace(/\{([^,}]*)[^}]*\}/g, '$1').replace(/\*\*.*$/, 'x/x').replace(/\*/g, 'x');
    for (const L of LANES[d.stream]) if (L.test(probe)) {
      if (d.stream === 'CMP' && L.id === '3a-F' && d.g === 'CTL') break;
      if (d.stream === 'CMP' && L.id === '3a-F' && d.g === 'OVL') break;
      return L.id;
    }
  }
  if (d.stream === 'CMP' && d.g === 'CTL') for (const [re, id] of CTL_SYSTEM_LANE) if (re.test(d.t.system) || re.test(d.files.join(' '))) return id;
  if (d.stream === 'CMP' && d.g === 'OVL') return /popover|tooltip|menu|toast/i.test(d.t.system + d.files.join(' ')) ? '3f-O2' : '3e-O1';
  const fb = LANE_FALLBACK[d.g];
  return fb.startsWith(PRD_ID[d.stream].slice(-1)) ? fb : LANES[d.stream].at(-1).id;
}
for (const d of drafts) d.lane = laneFor(d);

for (let i = drafts.length - 1; i >= 0; i--) if (OVERRIDES[drafts[i].t.id]?.drop) { disposition[drafts[i].t.id] = `not carried: ${OVERRIDES[drafts[i].t.id].drop}`; drafts.splice(i, 1); }
const out = { MAT: [], CMP: [], QUAL: [] };
const newId = new Map();
for (const key of TARGETS) {
  const order = LANES[key].map((l) => l.id).filter((v, i, a) => a.indexOf(v) === i).sort();
  const mine = drafts.filter((d) => d.stream === key).sort((a, b) => order.indexOf(a.lane) - order.indexOf(b.lane));
  mine.forEach((d, i) => { d.id = `${key}-${String(i + 1).padStart(3, '0')}`; newId.set(d.t.id, d); });
}
for (const d of drafts) {
  const deps = [], seams = new Set();
  const depIds = [].concat(d.t.depends_on ?? []);
  for (const dep of depIds) {
    const pm2 = String(dep).match(/^PRD-(\d{2})/);
    const dg = pm2 ? PRD_TO_GROUP[pm2[1]] : groupOf(dep);
    const nd = newId.get(dep);
    if (nd && nd.stream === d.stream && nd.lane === d.lane) deps.push(nd.id);
    else if (nd && nd.stream === d.stream) seams.add(`lane:${nd.lane}`);
    else for (const s of SEAMS_BY_GROUP[dg] ?? []) seams.add(s);
  }
  if (d.files.some((f) => f.startsWith('fragments/'))) seams.add('S-38..S-45 fragment kinds');
  const laneSeams = [...seams].filter((s) => s.startsWith('lane:'));
  const contractSeams = [...seams].filter((s) => !s.startsWith('lane:'));
  const on4x = d.files.some((f) => /^(fragments\/deprecations\/|tests\/fixtures\/consumer-4x\/cases\/)/.test(f)) || /DEPRECATE/.test(d.t.action);
  let reqs = mapReqs([d.t.acceptance, d.t.description, d.t.test].join(' '), d.g, d.stream);
  if (!reqs.length) reqs = inferReqs(d.stream, d.files, d.t.system);
  const S = d.stream;
  const desc = gitlabify(d.t.description, S) + (laneSeams.length ? ` (Cross-lane input ${laneSeams.map((l) => l.slice(5)).join(', ')} is consumed through its frozen interface, never waited for.)` : '') + (d.dropped.length ? ` [Relocated per contract §7.1; not edited by this task: ${d.dropped.join('; ')}]` : '');
  const task = {
    id: d.id, prd: PRD_ID[S], lane: d.lane, system: d.t.system,
    file: d.files.length ? d.files.map((f, i) => (i === 0 && /^NEW:/.test(String(d.t.file)) ? `NEW:${f}` : f)).join('; ') : 'n/a',
    action: d.t.action, description: desc, depends_on: deps, contract_seams: contractSeams,
    priority: d.t.priority, test: gitlabify(d.t.test, S), storybook: gitlabify(d.t.storybook, S),
    acceptance: `${reqs.length ? reqs.join(', ') + '; ' : ''}archived: ${gitlabify(d.t.acceptance, S)}`,
    reqs, branch: on4x ? 'release/4.x' : 'next', source: d.t.id, status: 'todo',
  };
  if (on4x) task.gate = 'G-07';
  if (d.t.gate) task.gate = task.gate ? `${task.gate}; ${d.t.gate}` : d.t.gate;
  const ov = OVERRIDES[d.t.id];
  if (ov) Object.assign(task, ov, ov.branch === 'release/4.x' ? { gate: 'G-07' } : {});
  out[S].push(task);
  disposition[d.t.id] = `${d.id} (${S} lane ${d.lane})`;
}
const nextNum = Object.fromEntries(TARGETS.map((k) => [k, out[k].length]));
for (const [S, laneId, req, file, action, system, description, test, storybook, priority, branch] of SUPPLEMENT) {
  if (out[S].some((t) => t.reqs.includes(req))) continue;
  const t = { id: `${S}-${String(++nextNum[S]).padStart(3, '0')}`, prd: PRD_ID[S], lane: laneId, system, file, action, description: gitlabify(description, S), depends_on: [], contract_seams: [], priority, test, storybook, acceptance: req, reqs: [req], branch: branch ?? 'next', source: 'new (contract-v1.1)', status: 'todo' };
  if (branch === 'release/4.x') t.gate = 'G-07';
  out[S].push(t);
}
for (const key of TARGETS) {
  out[key].sort((a, b) => a.id.localeCompare(b.id));
  const file = join(root, 'tasks', `${key}.json`);
  if (existsSync(file) && !force) { console.error(`${file} exists; pass --force to overwrite`); continue; }
  writeFileSync(file, JSON.stringify(out[key], null, 1) + '\n');
}
writeFileSync(join(ARCH, 'task-disposition.json'), JSON.stringify(Object.fromEntries(Object.entries(disposition).sort()), null, 1) + '\n');
const lanes = {};
for (const k of TARGETS) for (const t of out[k]) lanes[t.lane] = (lanes[t.lane] ?? 0) + 1;
const notCarried = Object.values(disposition).filter((v) => v.startsWith('not carried')).length;
const r01 = Object.values(disposition).filter((v) => v.startsWith('R-01')).length;
const covered = Object.fromEntries(TARGETS.map((k) => { const have = new Set(out[k].flatMap((t) => t.reqs)); return [k, REQTEXT[k].filter((r) => !have.has(r.id)).map((r) => r.id)]; }));
console.log('REQs without a task:', JSON.stringify(covered));
console.log(JSON.stringify({ MAT: out.MAT.length, CMP: out.CMP.length, QUAL: out.QUAL.length, lanes, r01, notCarried, noReqs: TARGETS.flatMap((k) => out[k]).filter((t) => !t.reqs.length).length }, null, 1));
