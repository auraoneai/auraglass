/* auraglass/no-runtime-contrast — A11Y-owned rule (SC-16, MAT-257).
   Flags runtime contrast measurement: getComputedStyle color/background reads
   feeding contrast/luminance calls, canvas getImageData, and ResizeObserver/
   MutationObserver callbacks that call contrast functions. Contrast is solved
   statically (PRD-03 matrix), never measured at runtime. Exemption:
   src/backdrops/** (PRD-13 sampler is the sanctioned measured-contrast site). */
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

const isExempt = (f) => /(?:^|[/\\])src[/\\]backdrops[/\\]/.test(f);

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
    severity: 'warn',
  },
];

module.exports = { meta, create, agConfig };
