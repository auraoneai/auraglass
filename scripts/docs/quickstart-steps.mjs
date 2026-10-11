// quickstart-steps.mjs — REQ-PLAT-103 (PLAT-386/388/390). One parser for the
// `{step}` blocks of docs/quickstart/{next,vite}.md, shared by
// tests/dx/quickstart.spec.ts (which executes them literally), the docs
// rules test and gen-readme (which renders the README quick start from
// next.md). Pure functions, no I/O.
//
// Grammar: a tag line immediately followed (blank lines allowed) by a fenced
// block.
//
//   {step <phase> [variant=<v>] [file=<path>]}     a quickstart step
//   {prepare <phase> [variant=<v>] [file=<path>]}  a cell precondition that is
//                                                  not an AuraGlass step (e.g.
//                                                  adding Tailwind to Vite);
//                                                  executed, never counted or timed
//
// Shell fences (bash/sh) hold exactly one command. A fence with `file=` is a
// manual edit: its body replaces that file. Blocks without `variant=` apply to
// every variant; a block with `variant=x` applies only to variant x.

export const PHASES = ['scaffold', 'install', 'init', 'add', 'edit', 'run'];
export const SHELL_LANGS = new Set(['bash', 'sh', 'shell']);
export const LIMITS = { commands: 6, edits: 2 };

const TAG_RE = /^\{(step|prepare)\s+([a-z][a-z0-9-]*)((?:\s+[a-z]+=[^\s}]+)*)\s*\}\s*$/;
const FENCE_OPEN_RE = /^(`{3,})([a-z0-9-]*)\s*$/i;

/** Parse every tagged block of a quickstart markdown file, in document order. */
export function parseQuickstart(md) {
  const lines = md.split('\n');
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const tag = lines[i].trim().match(TAG_RE);
    if (!tag) {
      if (/^\{(step|prepare)\b/.test(lines[i].trim())) throw new Error(`line ${i + 1}: malformed tag ${lines[i].trim()}`);
      continue;
    }
    const [, kind, phase, rawAttrs] = tag;
    const attrs = Object.fromEntries([...rawAttrs.matchAll(/([a-z]+)=([^\s}]+)/g)].map((m) => [m[1], m[2]]));
    for (const k of Object.keys(attrs)) if (k !== 'variant' && k !== 'file') throw new Error(`line ${i + 1}: unknown attribute ${k}`);
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    const open = (lines[j] ?? '').match(FENCE_OPEN_RE);
    if (!open) throw new Error(`line ${i + 1}: {${kind} ${phase}} is not followed by a fenced block`);
    const body = [];
    let k = j + 1;
    for (; k < lines.length && lines[k].trim() !== open[1]; k++) body.push(lines[k]);
    if (k >= lines.length) throw new Error(`line ${j + 1}: unclosed fence`);
    blocks.push({
      kind, phase, line: i + 1,
      variant: attrs.variant ?? null,
      file: attrs.file ?? null,
      lang: open[2].toLowerCase(),
      body: body.join('\n'),
    });
    i = k;
  }
  return blocks;
}

/** The ordered blocks one cell executes. */
export function stepsFor(blocks, variant) {
  return blocks.filter((b) => b.variant === null || b.variant === variant);
}

export const isShell = (b) => SHELL_LANGS.has(b.lang) && b.file === null;
export const isEdit = (b) => b.file !== null;

/** The single command of a shell block (comments and blank lines ignored). */
export function commandOf(b) {
  const cmds = b.body.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  if (cmds.length !== 1) throw new Error(`line ${b.line}: a shell step holds exactly one command, found ${cmds.length}`);
  return cmds[0];
}

/** Command / manual-edit counts of the AuraGlass steps (preconditions excluded). */
export function countSteps(steps) {
  const own = steps.filter((b) => b.kind === 'step');
  return { commands: own.filter(isShell).length, edits: own.filter(isEdit).length };
}

/**
 * REQ-PLAT-103 document rules for one variant. Returns human-readable
 * violations (empty = conforming).
 */
export function validateVariant(blocks, variant, framework) {
  const errors = [];
  const steps = stepsFor(blocks, variant);
  const own = steps.filter((b) => b.kind === 'step');
  for (const b of own) {
    if (!PHASES.includes(b.phase)) errors.push(`line ${b.line}: unknown phase ${b.phase}`);
    if (!isShell(b) && !isEdit(b)) errors.push(`line ${b.line}: a step is either a shell command or a file edit (file=...)`);
    if (isEdit(b) && b.phase !== 'edit') errors.push(`line ${b.line}: file edits use phase edit`);
    if (isShell(b)) { try { commandOf(b); } catch (e) { errors.push(e.message); } }
    if (/@source\b/.test(b.body)) errors.push(`line ${b.line}: no @source line is allowed`);
    if (b.file && /(^|\/)tsconfig[^/]*\.json$/.test(b.file)) errors.push(`line ${b.line}: no tsconfig.json edit is allowed`);
  }
  const { commands, edits } = countSteps(steps);
  if (commands > LIMITS.commands) errors.push(`${variant}: ${commands} shell commands (max ${LIMITS.commands})`);
  if (edits > LIMITS.edits) errors.push(`${variant}: ${edits} manual edits (max ${LIMITS.edits})`);
  const cmds = own.filter(isShell).map((b) => { try { return commandOf(b); } catch { return ''; } });
  const scaffold = framework === 'next' ? /^npx create-next-app@latest\b/ : /^npm create vite@latest\b.*--template react-ts\b/;
  if (!cmds.some((c) => scaffold.test(c))) errors.push(`${variant}: the scaffold step must be ${framework === 'next' ? 'npx create-next-app@latest' : 'npm create vite@latest -- --template react-ts'}`);
  /* No optional-peer install: the only package an install step names is aura-glass. */
  for (const c of cmds) {
    const m = c.match(/^npm (?:install|i|add)\s+(.*)$/);
    if (!m) continue;
    const pkgs = m[1].split(/\s+/).filter((t) => t && !t.startsWith('-'));
    const extra = pkgs.filter((p) => p.replace(/@[^@/]*$/, '') !== 'aura-glass');
    if (extra.length) errors.push(`${variant}: install step adds ${extra.join(', ')} (only aura-glass; init never needs optional peers)`);
  }
  if (!own.some((b) => b.phase === 'init' && /@auraglass\/cli(@\S+)? init\b.*--yes/.test(b.body))) errors.push(`${variant}: missing \`@auraglass/cli init --yes\` step`);
  if (!own.some((b) => b.phase === 'add' && /@auraglass\/cli(@\S+)? add app-frame\b.*--yes/.test(b.body))) errors.push(`${variant}: missing \`@auraglass/cli add app-frame --yes\` step`);
  if (!own.some((b) => b.phase === 'run' && isShell(b))) errors.push(`${variant}: missing run step`);
  return errors;
}

const LABELS = {
  scaffold: 'Create the app',
  install: 'Install AuraGlass',
  init: 'Set up AuraGlass',
  add: 'Add the app-frame block',
  run: 'Start the dev server',
};

/**
 * Markdown for the README `generated:quickstart` region, rendered from the
 * given variant of next.md: consecutive shell steps of one phase share a fence.
 */
export function renderReadmeQuickstart(blocks, variant) {
  const steps = stepsFor(blocks, variant).filter((b) => b.kind === 'step');
  const groups = [];
  for (const b of steps) {
    const last = groups[groups.length - 1];
    if (last && isShell(b) && last.shell && last.phase === b.phase) last.blocks.push(b);
    else groups.push({ phase: b.phase, shell: isShell(b), blocks: [b] });
  }
  const out = [];
  groups.forEach((g, i) => {
    const label = g.shell ? LABELS[g.phase] ?? g.phase : `Render it — replace \`${g.blocks[0].file}\` with`;
    out.push(`${i + 1}. ${label}:`, '');
    const lang = g.shell ? 'bash' : g.blocks[0].lang;
    const body = g.shell ? g.blocks.map(commandOf).join('\n') : g.blocks[0].body;
    out.push(`   \`\`\`${lang}`, ...body.split('\n').map((l) => (l ? `   ${l}` : '')), '   ```', '');
  });
  return out.join('\n').trimEnd();
}
