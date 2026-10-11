/* auraglass/raf-requires-cancel (REQ-QUAL-45, S-47). Every
   requestAnimationFrame id must reach cancelAnimationFrame in a teardown —
   the cleanup a function returns (useEffect, subscribe), or a function named
   stop/end/finish/cancel/dispose/destroy/teardown/cleanup/unmount/disconnect/unsubscribe/
   abort/reset (incl. componentWillUnmount), or an 'abort'/'pagehide' handler.
   Otherwise an unmounted component keeps a frame callback (and whatever it
   closes over) alive.
   Sinks for the returned id:
     - discarded (`requestAnimationFrame(cb);`)               → reported
     - stored (`id = …`, `const id = …`, `ref.current = …`,
       `this.frame = …`)                                    → a teardown must call
                                                               cancelAnimationFrame(<same target>)
     - collected (`ids.push(…)`, `set.add(…)`, `map.set(k, …)`) → a teardown must
                                                               reference the collection and cancelAnimationFrame
     - returned (`return requestAnimationFrame(cb)`, concise arrow body) → the caller owns the id
     - anything else                                        → reported (untracked) */
'use strict';
const { agConfigFor, memberName } = require('./_shared.cjs');

const RAF_GLOBALS = new Set(['window', 'globalThis', 'self']);
const TEARDOWN_NAME = /^(stop|end|finish|cancel|dispose|destroy|teardown|clean[uU]?p|unmount|componentWillUnmount|disconnect|unsubscribe|abort|reset|unobserve|detach|release|close)/i;
const TEARDOWN_EVENTS = new Set(['abort', 'pagehide', 'beforeunload']);
const PASS_THROUGH = new Set(['ConditionalExpression', 'LogicalExpression', 'TSAsExpression', 'TSNonNullExpression', 'TSTypeAssertion', 'TSSatisfiesExpression', 'ChainExpression', 'ParenthesizedExpression']);

function isGlobalFn(callee, name) {
  if (!callee) return false;
  if (callee.type === 'Identifier') return callee.name === name;
  return callee.type === 'MemberExpression' && memberName(callee) === name && callee.object.type === 'Identifier' && RAF_GLOBALS.has(callee.object.name);
}
const isRaf = (call) => isGlobalFn(call.callee, 'requestAnimationFrame');
const isCaf = (call) => isGlobalFn(call.callee, 'cancelAnimationFrame');

const isFn = (n) => n && (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression');

function functionName(fn) {
  if (fn.type === 'FunctionDeclaration' && fn.id) return fn.id.name;
  if (fn.type === 'FunctionExpression' && fn.id) return fn.id.name;
  const p = fn.parent;
  if (!p) return null;
  if (p.type === 'VariableDeclarator' && p.id.type === 'Identifier') return p.id.name;
  if ((p.type === 'Property' || p.type === 'MethodDefinition' || p.type === 'PropertyDefinition') && !p.computed) {
    return p.key.type === 'Identifier' ? p.key.name : String(p.key.value);
  }
  if (p.type === 'AssignmentExpression') return memberName(p.left) ?? (p.left.type === 'Identifier' ? p.left.name : null);
  return null;
}

function isTeardownFn(fn) {
  const p = fn.parent;
  if (!p) return false;
  if (p.type === 'ReturnStatement') return true; // returned cleanup
  if (p.type === 'ArrowFunctionExpression' && p.body === fn) return true; // () => () => cleanup
  const name = functionName(fn);
  if (name && TEARDOWN_NAME.test(name)) return true;
  // x.addEventListener('abort' | 'pagehide', fn)
  if (p.type === 'CallExpression' && memberName(p.callee) === 'addEventListener' && p.arguments[1] === fn) {
    const ev = p.arguments[0];
    return ev && ev.type === 'Literal' && TEARDOWN_EVENTS.has(String(ev.value));
  }
  return false;
}

function inTeardown(node) {
  for (let n = node.parent; n; n = n.parent) if (isFn(n) && isTeardownFn(n)) return n;
  return null;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'every requestAnimationFrame id must reach cancelAnimationFrame in a cleanup or stop() (REQ-QUAL-45)' },
    schema: [],
    messages: {
      discarded: 'requestAnimationFrame id is discarded — store it and cancelAnimationFrame it in the cleanup / stop() (REQ-QUAL-45).',
      untracked: 'requestAnimationFrame id is not stored in a variable, member or collection that a cleanup / stop() cancels (REQ-QUAL-45).',
      uncancelled: "requestAnimationFrame id '{{target}}' never reaches cancelAnimationFrame({{target}}) in a cleanup or stop() (REQ-QUAL-45).",
      collection: "requestAnimationFrame ids collected in '{{target}}' are never cancelled in a cleanup or stop() (REQ-QUAL-45).",
    },
  },
  create(context) {
    const src = context.sourceCode;
    const norm = (node) => src.getText(node).replace(/\s+/g, '').replace(/\?\./g, '.').replace(/!$/, '');
    const stored = []; // { node, target }
    const collected = []; // { node, target }
    const cancelled = new Set(); // normalized args of cancelAnimationFrame(...) inside a teardown
    const cafTeardowns = []; // teardown fns that call or reference cancelAnimationFrame

    return {
      CallExpression(node) {
        if (isCaf(node)) {
          const td = inTeardown(node);
          if (td) {
            cafTeardowns.push(td);
            if (node.arguments[0]) cancelled.add(norm(node.arguments[0]));
          }
          return;
        }
        if (!isRaf(node)) return;
        let child = node;
        let p = node.parent;
        while (p && PASS_THROUGH.has(p.type)) { child = p; p = p.parent; }
        if (!p) return;
        if (p.type === 'ExpressionStatement' || p.type === 'SequenceExpression' || p.type === 'UnaryExpression') {
          context.report({ node, messageId: 'discarded' });
        } else if (p.type === 'ReturnStatement' || (p.type === 'ArrowFunctionExpression' && p.body === child)) {
          // returned: the caller owns the id
        } else if (p.type === 'VariableDeclarator' && p.init === child && p.id.type === 'Identifier') {
          stored.push({ node, target: p.id.name });
        } else if (p.type === 'AssignmentExpression' && p.right === child) {
          stored.push({ node, target: norm(p.left) });
        } else if (p.type === 'CallExpression' && p.callee.type === 'MemberExpression' && ['push', 'add', 'set', 'unshift'].includes(memberName(p.callee))) {
          collected.push({ node, target: norm(p.callee.object) });
        } else {
          context.report({ node, messageId: 'untracked' });
        }
      },
      Identifier(node) {
        // cancelAnimationFrame passed by reference: ids.forEach(cancelAnimationFrame)
        if (node.name !== 'cancelAnimationFrame') return;
        const p = node.parent;
        if (p && p.type === 'CallExpression' && p.callee === node) return;
        if (p && p.type === 'MemberExpression' && p.property === node && p.parent?.type === 'CallExpression' && p.parent.callee === p) return;
        const td = inTeardown(node);
        if (td) cafTeardowns.push(td);
      },
      'Program:exit'() {
        for (const s of stored) {
          if (!cancelled.has(s.target)) context.report({ node: s.node, messageId: 'uncancelled', data: { target: s.target } });
        }
        for (const c of collected) {
          const ok = cafTeardowns.some((fn) => src.getText(fn).replace(/\s+/g, '').replace(/\?\./g, '.').includes(c.target));
          if (!ok) context.report({ node: c.node, messageId: 'collection', data: { target: c.target } });
        }
      },
    };
  },
  agConfig: agConfigFor('raf-requires-cancel'),
};
