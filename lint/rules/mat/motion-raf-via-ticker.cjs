/* auraglass/motion-raf-via-ticker (MAT-229 REQ-MOT-65): components never own an
   animation loop — the shared ticker does. Errors on requestAnimationFrame( /
   setInterval( in src/components/** and src/primitives/**, and on useState
   setters/dispatch inside requestAnimationFrame( / subscribe( callbacks. */
'use strict';
const { norm } = require('./_helpers.cjs');

const GUARDED_DIRS = /src\/(components|primitives)\//;
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
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
