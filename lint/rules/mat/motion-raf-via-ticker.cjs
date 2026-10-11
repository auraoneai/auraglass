/* auraglass/motion-raf-via-ticker (MAT-229 REQ-MOT-65, REQ-MAT-51): components and
   product surfaces never own an animation loop — the shared ticker does. Errors on
   requestAnimationFrame( / setInterval( in src/{components,primitives,app-shell,
   data,ai,media,backdrops,date}/**, and on useState setters/dispatch inside
   requestAnimationFrame( / subscribe( callbacks anywhere in src/**.

   Severity (REQ-MAT-51 / D.3-31): 'error' in the guarded dirs. Files that still
   carried a loop when the guard was widened are listed in motion-baseline.json
   (owner + expires RC-1, routed to their owning WP); they stay at 'warn' until
   their owner removes the loop. The baseline only shrinks: the L1 cell
   scripts/mat/motion-lint-l1.mjs fails on any new finding, on a count increase
   and on a stale row, and --enforce-zero (release scope) fails on any row. */
'use strict';
const { norm } = require('./_helpers.cjs');
const BASELINE = require('./motion-baseline.json');

const GUARDED = ['components', 'primitives', 'app-shell', 'data', 'ai', 'media', 'backdrops', 'date'];
const GUARDED_DIRS = new RegExp(`src/(${GUARDED.join('|')})/`);
const GUARDED_GLOBS = GUARDED.map((d) => `src/${d}/**/*.{ts,tsx,js,jsx}`);
const RATCHETED = BASELINE.rows.filter((r) => r.rule === 'motion-raf-via-ticker').map((r) => r.file);
const LOOP_CALLS = new Set(['requestAnimationFrame', 'setInterval']);
const SINKS = new Set(['requestAnimationFrame', 'subscribe', 'subscribeFrame']);
const SETTER = /^set[A-Z]|^dispatch$|^forceUpdate$/;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Frame loops go through the shared motion ticker.' },
    schema: [],
    messages: {
      raf: "requestAnimationFrame/setInterval is forbidden here (REQ-MOT-65): subscribe to src/motion's ticker instead.",
      stateInLoop: "'{{name}}' inside a frame/subscribe callback defers React work to the compositor (REQ-MOT-65): set state from events or effects, not frame ticks.",
    },
  },
  create(context) {
    const fileIsGuarded = GUARDED_DIRS.test(norm(context.filename));
    let sinkDepth = 0;
    const calleeIsSink = (callee) => callee?.type === 'Identifier' && (SINKS.has(callee.name) || /subscribe$/i.test(callee.name));
    const enterSink = (n) => {
      if (calleeIsSink(n.callee)) sinkDepth += 1;
    };
    const leaveSink = (n) => {
      if (calleeIsSink(n.callee)) sinkDepth -= 1;
    };
    return {
      // default visit = enter; open the sink before inspecting the call itself
      CallExpression: (n) => {
        enterSink(n);
        if (n.callee?.type === 'Identifier') {
          if (fileIsGuarded && LOOP_CALLS.has(n.callee.name)) {
            context.report({ node: n, messageId: 'raf' });
          } else if (sinkDepth > 0 && !calleeIsSink(n.callee) && SETTER.test(n.callee.name)) {
            context.report({ node: n, messageId: 'stateInLoop', data: { name: n.callee.name } });
          }
        }
      },
      'CallExpression:exit': leaveSink,
    };
  },
  // Flat config: the later entry wins for files it matches, so ratcheted files
  // (ignored by the error entry) keep the src/** 'warn'.
  agConfig: [
    { files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' },
    { files: GUARDED_GLOBS, ignores: RATCHETED, severity: 'error' },
  ],
};
