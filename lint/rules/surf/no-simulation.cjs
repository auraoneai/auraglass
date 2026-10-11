// auraglass/no-simulation — REQ-SURF-05 (S-47 owner SURF). Bans simulated
// behaviour in shipped code: Math.random outside event handlers, fake
// progress timers, mock Blob payloads and demo-data defaults.
// Loaded by eslint-plugin-auraglass.js (contract §4.11): a rule module exports
// { meta, create, agConfig }.
'use strict';

const HANDLER_NAME = /^(?:on[A-Z]|handle[A-Z])/;

// The nearest enclosing function counts as an event handler when it is:
//  - the value of a JSX attribute named onXxx,
//  - named onXxx/handleXxx or assigned to a variable/property/method with such
//    a name, or
//  - passed as a listener argument (el.addEventListener('x', fn)).
function isInEventHandler(fn) {
  let node = fn;
  let parent = fn.parent;
  while (
    parent &&
    (parent.type === 'TSAsExpression' ||
      parent.type === 'TSTypeAssertion' ||
      parent.type === 'ChainExpression')
  ) {
    node = parent;
    parent = parent.parent;
  }
  if (
    parent &&
    parent.type === 'JSXExpressionContainer' &&
    parent.parent &&
    parent.parent.type === 'JSXAttribute' &&
    parent.parent.name &&
    parent.parent.name.type === 'JSXIdentifier' &&
    /^on[A-Z]/.test(parent.parent.name.name)
  ) {
    return true;
  }
  if (
    (fn.type === 'FunctionDeclaration' && fn.id && HANDLER_NAME.test(fn.id.name)) ||
    (parent &&
      parent.type === 'VariableDeclarator' &&
      parent.id.type === 'Identifier' &&
      HANDLER_NAME.test(parent.id.name)) ||
    (parent &&
      parent.type === 'Property' &&
      parent.key &&
      parent.key.type === 'Identifier' &&
      HANDLER_NAME.test(parent.key.name)) ||
    (parent &&
      (parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') &&
      parent.key &&
      parent.key.type === 'Identifier' &&
      HANDLER_NAME.test(parent.key.name))
  ) {
    return true;
  }
  if (
    parent &&
    parent.type === 'CallExpression' &&
    parent.arguments.includes(node) &&
    parent.callee &&
    parent.callee.type === 'MemberExpression' &&
    parent.callee.property &&
    parent.callee.property.type === 'Identifier' &&
    parent.callee.property.name === 'addEventListener'
  ) {
    return true;
  }
  return false;
}

function nearestFunction(node) {
  let cur = node.parent;
  while (cur) {
    if (/Function/.test(cur.type)) return cur;
    cur = cur.parent;
  }
  return null;
}

// set[A-Z]* call that mutates progress-like state: a numeric-literal argument
// (setProgress(40)) or an updater `x => x + <number>` (setProgress(p => p + 1)).
function isFakeProgressCall(call) {
  const callee = call.callee;
  if (callee.type !== 'Identifier' || !/^set[A-Z]/.test(callee.name)) return false;
  for (const arg of call.arguments) {
    if (arg.type === 'Literal' && typeof arg.value === 'number') return true;
    if (
      arg.type === 'ArrowFunctionExpression' &&
      arg.body &&
      arg.body.type === 'BinaryExpression' &&
      arg.body.operator === '+' &&
      arg.body.right &&
      arg.body.right.type === 'Literal' &&
      typeof arg.body.right.value === 'number'
    ) {
      return true;
    }
  }
  return false;
}

// Walk a function body looking for a fake-progress set* call.
function bodyHasFakeProgress(fn) {
  let found = false;
  const visit = (n) => {
    if (!n || found || typeof n !== 'object') return;
    if (n.type === 'CallExpression' && isFakeProgressCall(n)) {
      found = true;
      return;
    }
    for (const key of Object.keys(n)) {
      if (key === 'parent') continue;
      const child = n[key];
      if (Array.isArray(child)) child.forEach((c) => c && c.type && visit(c));
      else if (child && child.type) visit(child);
    }
  };
  visit(fn.body);
  return found;
}

// Array literal with >=3 object-literal elements = baked-in demo data.
function isDemoArray(node) {
  return (
    node &&
    node.type === 'ArrayExpression' &&
    node.elements.filter((el) => el && el.type === 'ObjectExpression').length >= 3
  );
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban simulated behaviour in shipped AuraGlass surfaces: Math.random outside event handlers, fake progress timers, mock Blob payloads and demo-data defaults (REQ-SURF-05).',
    },
    schema: [],
    messages: {
      mathRandom:
        'Math.random outside an event handler is simulated behaviour (REQ-SURF-05). Take randomness from props or remove the feature.',
      fakeProgressTimer:
        'setTimeout/setInterval driving a set* updater is a fake progress timer (REQ-SURF-05). Drive progress from real state or remove it.',
      mockBlob:
        'new Blob() over a string/template literal fabricates a payload (REQ-SURF-05). Require the caller to supply real data.',
      demoDataDefault:
        'A default value of >=3 object literals is baked-in demo data (REQ-SURF-05). Defaults must be empty; demos live in stories.',
    },
  },
  agConfig: [
    {
      files: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'registry/**/*.ts',
        'registry/**/*.tsx',
        'packages/labs/src/**/*.ts',
        'packages/labs/src/**/*.tsx',
      ],
      // warn repo-wide; SURF paths escalate to error via lint/rules/surf/_strict.cjs (§4.11 rollout).
      severity: 'warn',
    },
  ],
  create(context) {
    return {
      CallExpression(node) {
        // mathRandom: Math.random outside event-handler props
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'Math' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'random'
        ) {
          const fn = nearestFunction(node);
          if (!fn || !isInEventHandler(fn)) {
            context.report({ node, messageId: 'mathRandom' });
          }
          return;
        }
        // fakeProgressTimer: setTimeout/setInterval whose callback calls
        // set[A-Z]* with a numeric literal or `x => x + <literal>` updater
        if (
          node.callee.type === 'Identifier' &&
          (node.callee.name === 'setTimeout' || node.callee.name === 'setInterval')
        ) {
          const cb = node.arguments[0];
          if (cb && /Function/.test(cb.type) && bodyHasFakeProgress(cb)) {
            context.report({ node, messageId: 'fakeProgressTimer' });
          }
        }
      },
      NewExpression(node) {
        // mockBlob: new Blob([<string or template literal>, ...])
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Blob' &&
          node.arguments[0] &&
          node.arguments[0].type === 'ArrayExpression' &&
          node.arguments[0].elements.some(
            (el) =>
              el &&
              ((el.type === 'Literal' && typeof el.value === 'string') ||
                el.type === 'TemplateLiteral')
          )
        ) {
          context.report({ node, messageId: 'mockBlob' });
        }
      },
      AssignmentPattern(node) {
        // demoDataDefault: default parameter or destructured-prop default that
        // is an array of >=3 object literals (`items = [{},{},{}]`).
        if (isDemoArray(node.right)) {
          context.report({ node: node.right, messageId: 'demoDataDefault' });
        }
      },
      AssignmentExpression(node) {
        // demoDataDefault: `Foo.defaultProps = { items: [{},{},{}] }`
        if (
          node.left &&
          node.left.type === 'MemberExpression' &&
          node.left.property &&
          node.left.property.type === 'Identifier' &&
          node.left.property.name === 'defaultProps' &&
          node.right &&
          node.right.type === 'ObjectExpression'
        ) {
          for (const prop of node.right.properties) {
            if (prop && prop.type === 'Property' && isDemoArray(prop.value)) {
              context.report({ node: prop.value, messageId: 'demoDataDefault' });
            }
          }
        }
      },
    };
  },
};
