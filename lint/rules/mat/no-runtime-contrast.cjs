/* auraglass/no-runtime-contrast — A11Y-owned rule (SC-16, MAT-257).
   Flags runtime contrast measurement: getComputedStyle color/background reads
   feeding contrast/luminance calls, canvas getImageData, and ResizeObserver/
   MutationObserver callbacks that call contrast functions. Contrast is solved
   statically (PRD-03 matrix), never measured at runtime. Exemption:
   src/backdrops/** (PRD-13 sampler is the sanctioned measured-contrast site),
   plus the expiring rows in no-runtime-contrast.exemptions.json (REQ-MAT-64). */
'use strict';

const meta = {
  type: 'problem',
  docs: { description: 'Disallow runtime contrast measurement; contrast is statically solved.' },
  schema: [],
  messages: {
    computedStyle: 'Do not feed getComputedStyle {{prop}} into {{fn}}() — measure contrast statically (matrix contract).',
    imageData: 'Do not sample pixels for contrast (canvas getImageData) — the PRD-13 backdrop sampler in src/backdrops is the only measured-contrast site.',
    observer: 'Do not call {{fn}}() inside a {{observer}} callback — contrast is solved statically, not re-measured on layout/DOM changes.',
  },
};

const CONTRAST_FNS = /^(?:contrast|wcag|luminan|contrastRatio|wcagContrast|deltaE|apca|relativeLuminance)/i;
const COLOR_PROPS = /^(?:color|background|background-color|fill|stroke)/i;

const fs = require('node:fs');
const path = require('node:path');

const EXEMPTIONS_FILE = path.join(__dirname, 'no-runtime-contrast.exemptions.json');
const PACKAGE_JSON = path.join(__dirname, '..', '..', '..', 'package.json');

/* Minimal SemVer 2.0 precedence compare (core, then pre-release identifiers). */
function compareSemver(a, b) {
  const parse = (v) => {
    const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$/.exec(String(v).trim());
    if (!m) throw new Error(`no-runtime-contrast: not a SemVer version: ${v}`);
    return { core: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4] ? m[4].split('.') : [] };
  };
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < 3; i += 1) if (x.core[i] !== y.core[i]) return x.core[i] < y.core[i] ? -1 : 1;
  if (!x.pre.length || !y.pre.length) return x.pre.length === y.pre.length ? 0 : (x.pre.length ? -1 : 1);
  for (let i = 0; i < Math.max(x.pre.length, y.pre.length); i += 1) {
    const p = x.pre[i];
    const q = y.pre[i];
    if (p === undefined) return -1;
    if (q === undefined) return 1;
    const pn = /^\d+$/.test(p);
    const qn = /^\d+$/.test(q);
    if (pn && qn) { if (Number(p) !== Number(q)) return Number(p) < Number(q) ? -1 : 1; continue; }
    if (pn !== qn) return pn ? -1 : 1;
    if (p !== q) return p < q ? -1 : 1;
  }
  return 0;
}

/* Temporary exemption rows (REQ-MAT-64). A row is active only while the
   package version is below its `expires` version. */
function loadExemptions(version = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8')).version) {
  const rows = JSON.parse(fs.readFileSync(EXEMPTIONS_FILE, 'utf8')).rows ?? [];
  return rows.map((row) => ({ ...row, expired: compareSemver(version, row.expires) >= 0 }));
}

const toPosix = (f) => String(f).replace(/\\/g, '/');
const ACTIVE_EXEMPT_PATHS = loadExemptions().filter((r) => !r.expired).map((r) => r.path);

const isExempt = (f) => {
  const file = toPosix(f);
  if (/(?:^|\/)src\/backdrops\//.test(file)) return true;
  return ACTIVE_EXEMPT_PATHS.some((p) => file.startsWith(p) || file.includes(`/${p}`));
};

function create(context) {
  const filename = context.filename ?? context.getFilename?.() ?? '';
  if (isExempt(filename)) return {};
  const src = context.sourceCode ?? context.getSourceCode();
  const fullName = (callee) => {
    if (!callee) return '';
    if (callee.type === 'Identifier') return callee.name;
    if (callee.type === 'MemberExpression' && callee.property?.type === 'Identifier') return callee.property.name;
    return '';
  };
  const isContrastCall = (node) =>
    node?.type === 'CallExpression' && CONTRAST_FNS.test(fullName(node.callee));
  const hasContrastCallDeep = (node) => {
    if (!node || typeof node !== 'object') return false;
    let hit = false;
    const visit = (n) => {
      if (hit || !n || typeof n !== 'object') return;
      if (isContrastCall(n)) { hit = true; return; }
      for (const k of Object.keys(n)) {
        if (k === 'parent' || k === 'range' || k === 'loc') continue;
        const v = n[k];
        if (Array.isArray(v)) v.forEach(visit);
        else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v);
      }
    };
    visit(node);
    return hit;
  };
  const isGetComputedStyleOf = (node) => {
    // getComputedStyle(x).<prop> or getComputedStyle(x).getPropertyValue('<prop>')
    if (node?.type === 'MemberExpression' && node.object?.type === 'CallExpression'
      && node.object.callee?.type === 'Identifier' && node.object.callee.name === 'getComputedStyle') {
      return { prop: node.property?.name ?? 'property' };
    }
    if (node?.type === 'CallExpression' && node.callee?.type === 'MemberExpression'
      && node.callee.property?.name === 'getPropertyValue'
      && node.callee.object?.type === 'CallExpression'
      && node.callee.object.callee?.type === 'Identifier'
      && node.callee.object.callee.name === 'getComputedStyle') {
      const arg = node.arguments?.[0];
      return { prop: arg?.type === 'Literal' ? String(arg.value) : 'property' };
    }
    return null;
  };

  return {
    CallExpression(node) {
      // contrastFn(getComputedStyle(el).color-ish args)
      if (isContrastCall(node)) {
        for (const arg of node.arguments) {
          const found = isGetComputedStyleOf(arg);
          if (found && (found.prop === 'property' || COLOR_PROPS.test(String(found.prop)))) {
            context.report({ node, messageId: 'computedStyle', data: { prop: String(found.prop), fn: fullName(node.callee) } });
            return;
          }
        }
        return;
      }
      // canvas.getImageData(...)
      if (node.callee?.type === 'MemberExpression' && node.callee.property?.name === 'getImageData') {
        context.report({ node, messageId: 'imageData' });
        return;
      }
      // new ResizeObserver(cb)/new MutationObserver(cb) handled in NewExpression
    },
    NewExpression(node) {
      const which = node.callee?.type === 'Identifier' ? node.callee.name : '';
      if (which !== 'ResizeObserver' && which !== 'MutationObserver') return;
      const cb = node.arguments?.[0];
      if (cb && hasContrastCallDeep(cb)) {
        context.report({ node, messageId: 'observer', data: { observer: which, fn: 'contrast' } });
      }
    },
  };
}

const agConfig = [
  {
    files: ['src/a11y/**/*.{ts,tsx}', 'src/theme/**/*.{ts,tsx}', 'src/material/**/*.{ts,tsx}'],
    severity: 'error',
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    ignores: [
      'src/a11y/**', 'src/theme/**', 'src/material/**',
      'src/backdrops/**',
      '**/*.test.*', '**/__tests__/**', 'tests/**',
    ],
    // REQ-MAT-64: runtime contrast is an error in every stream, not only MAT's.
    severity: 'error',
  },
];

module.exports = { meta, create, agConfig, compareSemver, loadExemptions, EXEMPTIONS_FILE };
