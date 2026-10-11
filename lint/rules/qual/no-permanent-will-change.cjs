/* auraglass/no-permanent-will-change (REQ-QUAL-45, S-47; adopts the rule
   trimmed from PR #322). `will-change` keeps a compositor layer (and its GPU
   memory) alive for as long as it is set. It is legal only transiently: from
   animation state, or in CSS text scoped to [data-ag-animating],
   [data-starting-style] or [data-ending-style]. Reported in JS/TSX:
     - static style objects:  { willChange: 'transform' } (a literal value);
       a conditional/computed value ({ willChange: animating ? 'transform' : 'auto' }) is allowed
     - DOM writes:  el.style.willChange = 'transform' / setProperty('will-change', …)
       with no reset ('auto' / '' / removeProperty('will-change')) of the same style
       object anywhere in the file (cleanup, onfinish, stop())
     - CSS text:    `will-change: <x>` in a string/template outside the three
       animation-state selectors. `will-change: auto` is always allowed. */
'use strict';
const { agConfigFor, keyName, memberName, staticText } = require('./_shared.cjs');

const STYLE_KEYS = new Set(['willChange', 'WebkitWillChange', 'will-change']);
const SCOPES = /\[data-ag-animating\]|\[data-starting-style\]|\[data-ending-style\]/;
const CSS_TEXT = /(?:^|[\s{;"'`])will-change\s*:\s*([^;}]*)/gi;
const isReset = (v) => typeof v === 'string' && /^\s*(auto|initial|unset|revert)?\s*$/i.test(v);

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban permanent will-change; set it only transiently from animation state (REQ-QUAL-45)' },
    schema: [],
    messages: {
      literal: "Static `willChange: '{{value}}'` keeps a compositor layer alive permanently — derive it from animation state (e.g. animating ? '{{value}}' : 'auto') (REQ-QUAL-45).",
      write: "`{{target}}` sets will-change with no reset to 'auto' of the same style object in this file — clear it when the animation ends (REQ-QUAL-45).",
      css: "`will-change: {{value}}` in CSS text outside [data-ag-animating] / [data-starting-style] / [data-ending-style] is permanent (REQ-QUAL-45).",
    },
  },
  create(context) {
    const src = context.sourceCode;
    // DOM writes are collected and judged at Program:exit against resets of the
    // same style object (source text of `el.style`, `ref.current.style`, …).
    const writes = []; // { node, key, target }
    const resets = new Set(); // style-object keys that are reset somewhere
    const keyOf = (obj) => src.getText(obj).replace(/\s+/g, '').replace(/\?\./g, '.');
    const checkCssText = (node) => {
      const text = staticText(node);
      if (text == null || !/will-change/i.test(text)) return;
      if (SCOPES.test(text)) return;
      for (const m of text.matchAll(CSS_TEXT)) {
        const value = m[1].replace(/\u0000/g, '${…}').trim();
        if (!isReset(value)) {
          context.report({ node, messageId: 'css', data: { value } });
          return;
        }
      }
    };
    return {
      Property(node) {
        const name = keyName(node);
        if (!name || !STYLE_KEYS.has(name)) return;
        const v = node.value;
        const text = v && v.type === 'Literal' ? v.value : v && v.type === 'TemplateLiteral' && v.expressions.length === 0 ? staticText(v) : null;
        if (typeof text === 'string' && !isReset(text)) {
          context.report({ node: v, messageId: 'literal', data: { value: text } });
        }
      },
      AssignmentExpression(node) {
        const name = memberName(node.left);
        if (name !== 'willChange' && name !== 'WebkitWillChange') return;
        const text = staticText(node.right);
        const key = keyOf(node.left.object);
        if (text != null && isReset(text)) { resets.add(key); return; }
        writes.push({ node: node.right, key, target: src.getText(node.left) });
      },
      CallExpression(node) {
        const m = memberName(node.callee);
        if (m !== 'setProperty' && m !== 'removeProperty') return;
        const prop = staticText(node.arguments[0]);
        if (!prop || prop.toLowerCase() !== 'will-change') return;
        const key = keyOf(node.callee.object);
        if (m === 'removeProperty') { resets.add(key); return; }
        const text = staticText(node.arguments[1]);
        if (text != null && isReset(text)) { resets.add(key); return; }
        writes.push({ node: node.arguments[1] ?? node, key, target: src.getText(node.callee) });
      },
      Literal: checkCssText,
      TemplateLiteral: checkCssText,
      'Program:exit'() {
        for (const w of writes) {
          if (!resets.has(w.key)) context.report({ node: w.node, messageId: 'write', data: { target: w.target } });
        }
      },
    };
  },
  agConfig: agConfigFor('no-permanent-will-change'),
};
