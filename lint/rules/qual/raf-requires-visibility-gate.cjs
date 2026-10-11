/* auraglass/raf-requires-visibility-gate (REQ-QUAL-45, S-47). A
   requestAnimationFrame loop (a frame callback that schedules itself again)
   must stop while the page is hidden: the loop body checks
   `document.visibilityState` / `document.hidden`, or the code that owns the
   loop listens for `visibilitychange`. The preferred form is the S-13 seam
   `subscribeFrame` from src/motion (no direct rAF at all), which already gates
   on visibility.
   A loop is detected when requestAnimationFrame(cb) runs inside function F and
   cb is F itself (by name) or an inline function that calls F. One-shot frames
   are not loops (raf-requires-cancel covers their ids). */
'use strict';
const { agConfigFor, memberName } = require('./_shared.cjs');

const RAF_GLOBALS = new Set(['window', 'globalThis', 'self']);
const isFn = (n) => n && (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression');

function isRaf(call) {
  const c = call.callee;
  if (c.type === 'Identifier') return c.name === 'requestAnimationFrame';
  return c.type === 'MemberExpression' && memberName(c) === 'requestAnimationFrame' && c.object.type === 'Identifier' && RAF_GLOBALS.has(c.object.name);
}

function fnName(fn) {
  if ((fn.type === 'FunctionDeclaration' || fn.type === 'FunctionExpression') && fn.id) return fn.id.name;
  const p = fn.parent;
  if (p && p.type === 'VariableDeclarator' && p.id.type === 'Identifier') return p.id.name;
  if (p && p.type === 'AssignmentExpression') return p.left.type === 'Identifier' ? p.left.name : memberName(p.left);
  if (p && (p.type === 'Property' || p.type === 'MethodDefinition' || p.type === 'PropertyDefinition') && !p.computed) {
    return p.key.type === 'Identifier' ? p.key.name : String(p.key.value);
  }
  return null;
}

/** Names a callback refers to: `tick`, `this.tick`, `this.tick.bind(this)`, `() => tick()`. */
function referencedNames(cb) {
  const out = new Set();
  if (cb.type === 'Identifier') out.add(cb.name);
  else if (cb.type === 'MemberExpression') { const m = memberName(cb); if (m) out.add(m); }
  else if (cb.type === 'CallExpression' && memberName(cb.callee) === 'bind') { const m = memberName(cb.callee.object) ?? (cb.callee.object.type === 'Identifier' ? cb.callee.object.name : null); if (m) out.add(m); }
  else if (isFn(cb)) {
    // only callee names of calls inside the inline callback
    const calls = (n) => {
      if (!n || typeof n !== 'object') return;
      if (n.type === 'CallExpression') {
        if (n.callee.type === 'Identifier') out.add(n.callee.name);
        else { const m = memberName(n.callee); if (m) out.add(m); }
      }
      for (const k of Object.keys(n)) {
        if (k === 'parent') continue;
        const v = n[k];
        if (Array.isArray(v)) v.forEach(calls); else if (v && typeof v.type === 'string') calls(v);
      }
    };
    calls(cb.body);
  }
  return out;
}

const within = (inner, outer) => inner.range[0] >= outer.range[0] && inner.range[1] <= outer.range[1];

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'a requestAnimationFrame loop must gate on document.visibilityState or use subscribeFrame (REQ-QUAL-45)' },
    schema: [],
    messages: {
      ungated: "requestAnimationFrame loop '{{name}}' keeps running while the page is hidden — check document.visibilityState (or listen for visibilitychange), or use subscribeFrame from the motion seam (S-13) (REQ-QUAL-45).",
    },
  },
  create(context) {
    const loops = []; // { node, fn, name }
    const checks = []; // document.visibilityState / document.hidden nodes
    const listeners = []; // addEventListener('visibilitychange', …) nodes
    return {
      MemberExpression(node) {
        const m = memberName(node);
        if ((m === 'visibilityState' || m === 'hidden') && node.object.type === 'Identifier' && node.object.name === 'document') checks.push(node);
      },
      CallExpression(node) {
        if (memberName(node.callee) === 'addEventListener') {
          const ev = node.arguments[0];
          if (ev && ev.type === 'Literal' && ev.value === 'visibilitychange') listeners.push(node);
          return;
        }
        if (!isRaf(node) || !node.arguments[0]) return;
        const names = referencedNames(node.arguments[0]);
        for (let n = node.parent; n; n = n.parent) {
          if (!isFn(n)) continue;
          const name = fnName(n);
          if (name && names.has(name)) { loops.push({ node, fn: n, name }); break; }
        }
      },
      'Program:exit'(program) {
        for (const l of loops) {
          if (checks.some((c) => within(c, l.fn))) continue;
          // owner scope of the loop: the function that defines it, or the module
          let owner = program;
          for (let n = l.fn.parent; n; n = n.parent) if (isFn(n)) { owner = n; break; }
          // class methods: the owning class body
          for (let n = l.fn.parent; n; n = n.parent) if (n.type === 'ClassBody') { owner = n; break; }
          if (listeners.some((x) => within(x, owner))) continue;
          context.report({ node: l.node, messageId: 'ungated', data: { name: l.name } });
        }
      },
    };
  },
  agConfig: agConfigFor('raf-requires-visibility-gate'),
};
