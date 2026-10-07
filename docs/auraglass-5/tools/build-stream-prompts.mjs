// Planning tool: writes the MAT, CMP and QUAL execution prompts (one index prompt per stream
// plus one prompt per internal lane) from each PRD's §19-§21 and from tasks/<KEY>.json.
// PLAT (PROMPT_1*) and SURF (PROMPT_4*) prompts are hand-written and are not touched.
// Re-run after editing a PRD §20 lane table or a task fragment.
// Usage: node docs/auraglass-5/tools/build-stream-prompts.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const STREAMS = {
  MAT: {
    n: 2, prd: 'AURAGLASS_MATERIAL_SYSTEM_PRD.md', title: 'Material System', prdId: 'PRD-2',
    scope: 'MAT owns the token tree and compiler, the material engine (`Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, tiers, lens maps), the motion system (CSS motion tokens, frame ticker, View Transitions, pointer light, optional `./motion` adapter), the preference model, provider, pre-paint script, portal root, LayerStack, announcer and the accessibility rungs, and the `release/4.x` bridge content of row group H (4.2 experimental `aura-glass/material`, 4.3 `data-ag-preview="v5"` CSS, `compat/tokens.css` alias map). It provides seams S-01..S-06, S-10..S-13 and S-20..S-26 to every other stream.',
    lanes: [
      ['2a-T', 'T', 'TOKENS', 'Tokens and compiler'],
      ['2b-M', 'M', 'MATERIAL', 'Material engine and tiers'],
      ['2c-V', 'V', 'MOTION', 'Motion'],
      ['2d-P', 'P', 'PREFS_A11Y', 'Preferences, provider and a11y rungs'],
      ['2e-B', 'B', 'BRIDGE', 'Bridge, compat and integration'],
    ],
  },
  CMP: {
    n: 3, prd: 'AURAGLASS_CORE_COMPONENTS_PRD.md', title: 'Core Components', prdId: 'PRD-3',
    scope: 'CMP owns the Base UI wrapping pattern (`src/foundation/**`), the six KEEP primitives (`./primitives`), `./icons`, `./forms`, flagships 1-13 (controls) and 15-21 (overlays), the T0 layout/type set and the T2 core, their compat adapters (`src/compat/cmp/**`), deprecation and codemod fragments, the registry block `overlay-flows` and the items `account-menu` and `confirm-dialog`. It provides seams S-30..S-34 to every other stream.',
    lanes: [
      ['3a-F', 'F', 'FOUNDATION', 'Foundation and platform glue'],
      ['3b-A', 'A', 'ACTIONS', 'Actions'],
      ['3c-I', 'I', 'INPUTS', 'Inputs'],
      ['3d-P', 'P', 'PICKERS', 'Pickers'],
      ['3e-O1', 'O1', 'MODAL_OVERLAYS', 'Modal overlays'],
      ['3f-O2', 'O2', 'ANCHORED_OVERLAYS', 'Anchored and transient overlays'],
      ['3g-T', 'T', 'CORE', 'Core T0 and T2'],
      ['3h-M', 'M', 'MIGRATION', 'Migration and registry'],
      ['3i-Q', 'Q', 'BROWSER_SPECS', 'Browser specs'],
    ],
  },
  QUAL: {
    n: 5, prd: 'AURAGLASS_QUALITY_SHOWCASE_PRD.md', title: 'Quality, Certification and Showcase', prdId: 'PRD-5',
    scope: 'QUAL owns the certification system (8 licensed scenes, lanes L1-L14, the lane runner and `ci/qual.gitlab-ci.yml` lane jobs, pixel/OCR gates, regression baselines, evidence and the `ReleaseVerdict`), the performance harness and budgets runtime half, Storybook (`.storybook/**`, story contract, docs blocks), the Material Lab, the showcases and the GA checklist runner. It provides seams S-40..S-43, S-44 (runtime half), S-48, S-51 and S-55. Its lanes run continuously on whatever has merged, including 4.x code today.',
    lanes: [
      ['5a-Q1', 'Q1', 'CONTRACT_HELPERS', 'Contract conformance and test helpers'],
      ['5b-Q2', 'Q2', 'RUNNER_CI', 'Lane runner and GitLab CI'],
      ['5c-Q3', 'Q3', 'SCENES_PIXEL', 'Scenes and pixel gates'],
      ['5d-Q4', 'Q4', 'REGRESSION_EVIDENCE', 'Regression and evidence'],
      ['5e-Q5', 'Q5', 'BEHAVIOUR', 'Behaviour, motion, canaries and unit'],
      ['5f-Q6', 'Q6', 'PERF', 'Performance'],
      ['5g-Q7', 'Q7', 'STORYBOOK_LAB', 'Storybook and Material Lab'],
      ['5h-Q8', 'Q8', 'SHOWCASES', 'Showcases'],
    ],
  },
};

const section = (text, n) => {
  const start = text.search(new RegExp(`^## ${n}\\.`, 'm'));
  if (start < 0) return '';
  const rest = text.slice(start);
  const end = rest.slice(3).search(/^## /m);
  return (end < 0 ? rest : rest.slice(0, end + 3)).trim();
};
const cells = (line) => line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const short = (s, n) => { const t = String(s).replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1).replace(/\s+\S*$/, '')} …` : t; };
const range = (ids) => {
  const nums = ids.map((i) => +i.split('-')[1]).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    let j = i;
    while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
    const p = (n) => String(n).padStart(3, '0');
    out.push(i === j ? p(nums[i]) : `${p(nums[i])}..${p(nums[j])}`);
    i = j;
  }
  return out.join(', ');
};

/** Lane rows of PRD §20: { label, files, delivers, order }. */
function laneRows(s20) {
  const lines = s20.split('\n').filter((l) => l.startsWith('|'));
  const header = cells(lines[0]);
  const col = (re) => header.findIndex((h) => re.test(h));
  const iFiles = col(/^(Files|Paths)/i), iOrder = col(/Order|Sequence/i), iDel = col(/Delivers/i);
  return lines.slice(2).map(cells).map((c) => ({ label: c[0].replace(/\*/g, ''), files: c[iFiles], order: c[iOrder], delivers: iDel >= 0 ? c[iDel] : '' }));
}

const COMMON = (S) => {
  const l = S.toLowerCase();
  return `- **Repo** \`/Users/gurbakshchahal/platforms/AuraGlass\`; work only in your lane worktree. GitHub \`github.com/auraoneai/auraglass\` is the git source of truth (PRs are opened and merged there); the GitLab project \`gitlab.com/chahal-foundation-group/github-auraoneai/auraglass\` (project 87152036) is its one-way mirror and runs **all** CI/CD.
- **CI/CD is GitLab CI only.** No GitHub Actions workflow is used, added or edited by ${S}. Never reference \`publish-npm.yml\`, \`GITHUB_WORKFLOW_REF\`, \`gh run\` or \`actions/*\`; use \`CI_PIPELINE_SOURCE\`, \`CI_COMMIT_BRANCH\`, \`CI_COMMIT_TAG\`, \`id_tokens\`, \`glab\`. ${S}'s own jobs live only in \`ci/${l}.gitlab-ci.yml\` and \`ci/${l}/**\` (names \`${l}:<stage>:<name>\`, each \`extends\` a root template \`.ag-node\`/\`.ag-playwright\`/\`.ag-gpu\`/\`.ag-aws-remote\`, rules on \`$AG_SCOPE\`/\`$AG_LINE\`, no \`merge_request_event\`, cross-stream \`needs\` only to \`CI_JOBS\` names with \`optional: true\`, evidence under \`.artifacts/${l}/\` with \`expire_in\`, no credentials, \`allow_failure: true\` until the job's first green run on \`next\`, then ${S} flips it). Lane-level checks register in \`fragments/lanes/${l}.ts\` and run inside QUAL's \`qual:certify:l*\` jobs. Storybook, Material Lab and docs deploy through PLAT's GitLab Pages job. Because the mirror is one-way, no MR is opened on GitLab: pipelines run on mirrored branch and tag pushes, and the merge rule on GitHub is "the GitLab pipeline for the PR head SHA is \`success\`" (\`node scripts/ci/gitlab-status.mjs --sha <sha>\`; paste the pipeline URL into the PR). Owner decision **OD-8** (replace the org-managed \`mirror-to-gitlab\` GitHub Action with GitLab pull mirroring) is the user's; never touch \`.github/workflows/mirror-to-gitlab.yml\`.
- **Remote-first (machine policy).** Local runs are limited to \`npm test -- <paths>\`, \`npm run typecheck\`, \`node_modules/.bin/eslint <paths>\` and plain node scripts. Every Playwright, APG, visual, perf, canary and Storybook run happens on GitLab SaaS runners (\`.ag-playwright\`, image \`mcr.microsoft.com/playwright\`) or, for GPU and real-device cells, \`.ag-gpu\` / the gated AWS remote runner (\`.ag-aws-remote\`, \`auraone-remote-run\`). Never start a local browser for certification and never use local Docker.
- **No fake completion.** Prohibited: mock, placeholder or simulated product behaviour; \`test.skip\`, \`test.fixme\`, \`it.todo\`, \`xit\`, commented-out assertions; lowering any threshold, budget, contrast floor or timeout; updating snapshots or visual baselines to make a test pass; a jsdom assertion standing in for a layout, contrast, blur, motion or frame-time measurement; closing a requirement with a seed, double (\`double-pass\`), stub or committed report; shipping anything from \`contracts/stubs/**\` or \`tests/contract-doubles/**\`. A task that cannot be finished is reported \`BLOCKED\` with the exact command output.
- **Contract first.** \`docs/auraglass-5/AURAGLASS_5_CONTRACTS.md\` (\`contract-v1.1\`) wins over the PRD and over this prompt. Read-only for ${S}: \`src/contracts/**\`, \`contracts/**\`, \`tests/contract-doubles/**\`, \`src/index.ts\`, \`src/compat/index.ts\`, \`package.json\`, \`package-lock.json\`, \`.gitlab-ci.yml\`, \`eslint.config.js\`, \`jest.config.js\`, \`playwright.config.ts\`, \`legacy/**\` and every path whose first matching row in contract §3.2 is another stream. A missing seam name is an additive contract PR on a \`contract/<topic>\` branch, never an edit of another stream's path and never a wait.
- **Evidence.** Measured on GitLab job artifacts (\`.artifacts/**\`, \`expire_in\`), never committed reports. Visual quality is judged by the L14 human review through QUAL; nothing is committed under \`reports/\`.
- **LLM features.** The library makes no model calls. Any AI route in a block or example goes through Kiro Prism (\`https://prism.auraone.ai/v1\`), tested against a mocked Prism.`;
};

function build(key) {
  const cfg = STREAMS[key];
  const l = key.toLowerCase();
  const prd = readFileSync(join(root, 'prd', cfg.prd), 'utf8');
  const tasks = JSON.parse(readFileSync(join(root, 'tasks', `${key}.json`), 'utf8'));
  const rows = laneRows(section(prd, 20));
  const files = [];
  const laneInfo = cfg.lanes.map(([id, label, slug, title], i) => {
    const row = rows.find((r) => r.label.startsWith(`${label} `) || r.label === label || r.label.startsWith(`${label}:`)) ?? rows[i];
    const lt = tasks.filter((t) => t.lane === id);
    const reqs = [...new Set(lt.flatMap((t) => t.reqs))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return { id, label, slug, title, row, tasks: lt, reqs, file: `PROMPT_${cfg.n}${id[1]}_${key}_${slug}.md` };
  });

  // ---------- lane prompts ----------
  for (const L of laneInfo) {
    const seams = [...new Set(L.tasks.flatMap((t) => t.contract_seams ?? []))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const on4x = L.tasks.filter((t) => t.branch === 'release/4.x');
    const out = [
      `# PROMPT-${cfg.n}${L.id[1]} (${key} lane ${L.label}): ${L.title}`,
      '',
      `Stream index: \`docs/auraglass-5/prompts/PROMPT_${cfg.n}_${key}.md\` (its "Common rules" are binding here). Source PRD: \`docs/auraglass-5/prd/${cfg.prd}\` (${cfg.prdId}, key ${key}) §20 lane **${L.label}**. Frozen contract: \`docs/auraglass-5/AURAGLASS_5_CONTRACTS.md\` (\`contract-v1.1\`, wins on any conflict). Tasks: \`docs/auraglass-5/tasks/${key}.json\`, field \`lane = "${L.id}"\` (${L.tasks.length} tasks: ${key}-${range(L.tasks.map((t) => t.id))}).`,
      '',
      `This lane starts on **day 0**, runs at the same time as every other ${key} lane and every other stream, and waits for nothing: its \`depends_on\` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.`,
      '',
      '## Scope',
      '',
      `**Owned paths (exclusive inside ${key}):** ${L.row?.files ?? 'see PRD §20'}`,
      '',
      ...(L.row?.delivers ? [`**Delivers:** ${L.row.delivers}`, ''] : []),
      `**Order inside the lane:** ${L.row?.order ?? 'task id order'}`,
      '',
      `**Requirements closed by this lane:** ${L.reqs.join(', ') || 'see tasks'}.`,
      '',
      '## Branch and worktree',
      '',
      '```bash',
      `git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x`,
      `git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/${l}-${L.label.toLowerCase()} -b next-${l}/${L.label.toLowerCase()}-<topic> origin/next`,
      ...(on4x.length ? [`# release/4.x work in this lane (${on4x.map((t) => t.id).join(', ')}): fragments and frozen 4.x cases only`, `git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/${l}-${L.label.toLowerCase()}-4x -b 4x-${l}/<topic> origin/release/4.x`] : []),
      '```',
      '',
      `Merge small PRs into \`next\` at least daily, each only after the GitLab pipeline for its head SHA is \`success\` (\`node scripts/ci/gitlab-status.mjs --sha <sha>\`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported \`pre-existing\` and does not block the PR (contract §2.3). Each PR carries \`.changeset/${l}-<slug>.md\` and refreshes the ${key}-owned \`etc/api/*\` reports it affects (\`npm run api:update -- --entry <entry>\`).`,
      '',
      '## Tasks',
      '',
      `Read the full rows with \`node -e 'for (const t of require("./docs/auraglass-5/tasks/${key}.json")) if (t.lane === "${L.id}") console.log(JSON.stringify(t, null, 1))'\`. The \`description\`, \`test\` and \`acceptance\` fields are binding; \`source\` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).`,
      '',
      '| ID | Action | File | Summary | Depends on | REQ |',
      '|---|---|---|---|---|---|',
      ...L.tasks.map((t) => `| ${t.id} | ${t.action} | \`${esc(short(t.file, 90))}\` | ${esc(short(t.description, 170))} | ${esc((t.depends_on ?? []).join(', '))} | ${esc(t.reqs.join(', '))} |`),
      '',
      '## Contract seams this lane consumes',
      '',
      `${seams.filter((s) => /^S-/.test(s)).join(', ') || 'none beyond the stream-wide set in the index prompt'}. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.`,
      '',
      '## Done for this lane',
      '',
      `1. Every task above is \`done\` with its \`test\` green in the GitLab pipeline of the merge SHA on \`next\` (or \`release/4.x\` for the 4.x rows), and every REQ listed above is closed by at least one of them.`,
      `2. No file outside the owned paths was edited; \`contract:ownership\`, \`contract:conformance\` and \`contract:ci-fragments\` are green.`,
      `3. No result rests on a seed, double or stub; rows that are still \`pending\` or \`double-pass\` are reported as such, not as passes.`,
      '',
      '```',
      `${key} LANE ${L.label} REPORT  contract-v1.1  next@<sha>${on4x.length ? '  release/4.x@<sha>' : ''}`,
      `<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL`,
      'Contract PRs opened: <branch> — state',
      'Open items touched: <id> — status',
      '```',
      '',
    ];
    writeFileSync(join(root, 'prompts', L.file), out.join('\n'));
    files.push(L.file);
  }

  // ---------- stream index prompt ----------
  const idx = [
    `# PROMPT-${cfg.n} (${key}): ${cfg.title} — stream index`,
    '',
    `Source PRD: \`docs/auraglass-5/prd/${cfg.prd}\` (${cfg.prdId}, key **${key}**). Binding contract: \`docs/auraglass-5/AURAGLASS_5_CONTRACTS.md\` **contract-v1.1** (frozen 2026-10-06; wins over the PRD on any conflict, contract §1.4). Architecture decisions D-01..D-32 in \`docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md\` stay valid. Task fragment: \`docs/auraglass-5/tasks/${key}.json\` (${key}-001..${key}-${String(tasks.length).padStart(3, '0')}, ${tasks.length} tasks, field \`lane\` selects the prompt). Archived sources are kept in each task's \`source\` field; where every archived task went is in \`archive/v1-19-prd/task-disposition.json\`.`,
    '',
    cfg.scope,
    '',
    `It is split into **${laneInfo.length} internal lanes that start on day 0 and run at the same time**. Lanes own disjoint paths, \`depends_on\` never crosses a lane, and the stream waits for no other PRD.`,
    '',
    '## Lane table',
    '',
    '| Prompt | Lane | Owned paths (PRD §20) | Tasks | REQ (primary) |',
    '|---|---|---|---|---|',
    ...laneInfo.map((L) => `| [\`${L.file}\`](${L.file}) | ${L.label} ${L.title} | ${esc(short(L.row?.files ?? '', 260))} | ${L.tasks.length} (${key}-${range(L.tasks.map((t) => t.id))}) | ${esc(short(L.reqs.join(', '), 200))} |`),
    '',
    '## Concurrency model (hard rules)',
    '',
    `1. **No cross-PRD dependency.** Every need on another stream is met by a frozen contract seam that exists from C0 as a type, seed, double, stub, pre-declared file or fragment kind. \`depends_on\` names only ${key} tasks of the same lane; cross-stream needs are in \`contract_seams\`; 4.x release ordering is \`gate: "G-07"\`, never a dependency.`,
    `2. **One owner per path.** ${key} edits only the globs its rows own in contract §3.2 (PRD §6). Inside ${key} each lane owns the disjoint paths in the table above. Per-kind fragment files \`fragments/<kind>/${l}.*\` are written by the lane that owns them in PRD §20; another lane's row for a file that does not exist yet is registered in advance and reports \`pending\`, never fails.`,
    `3. **Lines.** 5.0 work merges into \`next\` from \`next-${l}/<lane>-<topic>\` branches. On \`release/4.x\` ${key} writes only its own fragments, its CI fragment${key === 'MAT' ? ' and row group H (bridge content)' : ''}${key === 'CMP' ? ' and `tests/fixtures/consumer-4x/cases/cmp/**`' : ''} on \`4x-${l}/<topic>\` branches; every 4.x code fix in ${key}'s domain is PLAT's (contract §2.4.1). Both lines run at the same time.`,
    `4. **Worktrees.** One worktree per lane (\`git worktree add ../AuraGlass.wt/${l}-<lane> -b next-${l}/<lane>-<topic> origin/next\`). Merge small PRs at least daily when the GitLab pipeline for the PR head SHA is \`success\`.`,
    `5. **Integration is continuous; GA is a checklist.** QUAL lanes run on whatever has merged, including 4.x code today. Results against seeds are \`pending\` and against doubles \`double-pass\`; neither counts as a pass and neither blocks a ${key} PR. GA is the G-01..G-16 checklist (contract §6.2) on the release SHA, not a dependency.`,
    '',
    '## Dependencies: frozen contract seams (PRD §19, verbatim)',
    '',
    section(prd, 19).replace(/^## 19\.[^\n]*\n/, '').trim(),
    '',
    '## Concurrency statement (PRD §21, verbatim)',
    '',
    section(prd, 21).replace(/^## 21\.[^\n]*\n/, '').trim(),
    '',
    `Residual non-waits (contract §7.3): W-1 (a removal ships at GA only if its deprecation shipped in a published 4.x minor, release gate G-07), W-2 (budget calibration is state-triggered), W-3 (area codemod transform code is PLAT's; ${key} ships spec and fixtures), W-4 (blocks and showcases render seeds, doubles and \`ShowcasePending\` until inputs land), W-6 (mirror latency to GitLab until OD-8).`,
    '',
    '## Common rules (binding for every lane prompt)',
    '',
    COMMON(key),
    '',
    '## Final report (orchestrator aggregation)',
    '',
    'Each lane prompt emits its own report block. The orchestrator joins them into:',
    '',
    '```',
    `${key} STREAM REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>`,
    `REQ-${key}-NN | lane | task ids | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | pipeline URL`,
    `AC-${key}-NN  | PASS / FAIL / PENDING | release SHA | artifact path`,
    'Open items (PRD §22): status, default in force, owner',
    'Contract PRs opened: <branch> — state',
    '```',
    '',
  ];
  const indexFile = `PROMPT_${cfg.n}_${key}.md`;
  writeFileSync(join(root, 'prompts', indexFile), idx.join('\n'));
  return [indexFile, ...files];
}

const written = Object.keys(STREAMS).flatMap(build);
console.log(JSON.stringify({ written: written.length, files: written }, null, 1));
