// auraglass/no-network-in-ai — REQ-SURF-05 (SURF-357/AI lane): no network,
// env reads or provider SDKs in shipped `src/ai/**` code. Model calls are
// always the consumer's; the library renders UI only.
// ESLint 9 flat-config rule module: { meta, create, agConfig }.
'use strict';

const NETWORK_GLOBALS = new Set(['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource']);
const PROVIDER_SPEC = /^(?:openai|ai|@ai-sdk\/.+|@anthropic-ai\/.+|@google\/.+|@google-ai\/.+|@google-cloud\/.+|cohere-ai|replicate|@aws-sdk\/.+|@azure\/.+)$/;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'No network, env reads, or provider SDK imports inside src/ai/**.' },
    schema: [],
    messages: {
      network: '{{name}} in shipped ai code — model calls live in consumer code (the library never talks to a provider).',
      sendBeacon: 'sendBeacon in shipped ai code — no network egress from the library.',
      env: 'process.env.{{name}} in shipped ai code — only NODE_ENV may be read.',
      importMetaEnv: 'import.meta.env in shipped ai code — bundler env is not a library input.',
      provider: "Provider SDK specifier '{{spec}}' in shipped ai code — the interim harness lives under ci/surf/ai-sdk/**.",
      dangerouslySetInnerHTML: 'dangerouslySetInnerHTML in shipped ai code — model text is never injected as HTML.',
      scrollIntoView: 'scrollIntoView in shipped ai code — scroll anchoring goes through the Thread viewport API.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type === 'Identifier' && NETWORK_GLOBALS.has(callee.name)) {
          context.report({ node, messageId: 'network', data: { name: callee.name } });
        }
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' && callee.object.name === 'navigator' &&
          callee.property.type === 'Identifier' && callee.property.name === 'sendBeacon'
        ) {
          context.report({ node, messageId: 'sendBeacon' });
        }
      },
      NewExpression(node) {
        const callee = node.callee;
        if (callee.type === 'Identifier' && NETWORK_GLOBALS.has(callee.name)) {
          context.report({ node, messageId: 'network', data: { name: callee.name } });
        }
      },
      ImportDeclaration(node) {
        const spec = node.source.value;
        if (typeof spec === 'string' && PROVIDER_SPEC.test(spec)) {
          context.report({ node, messageId: 'provider', data: { spec } });
        }
      },
      MemberExpression(node) {
        // process.env.X / process.env['X'] other than NODE_ENV
        if (
          node.object.type === 'MemberExpression' &&
          node.object.object.type === 'Identifier' && node.object.object.name === 'process' &&
          node.object.property.type === 'Identifier' && node.object.property.name === 'env'
        ) {
          const key = node.property.type === 'Identifier' ? node.property.name
            : node.property.type === 'Literal' ? String(node.property.value) : null;
          if (key && key !== 'NODE_ENV') {
            context.report({ node, messageId: 'env', data: { name: key } });
          }
        }
        if (
          node.object.type === 'MetaProperty' &&
          node.object.meta.name === 'import' && node.object.property.name === 'meta' &&
          node.property.type === 'Identifier' && node.property.name === 'env'
        ) {
          context.report({ node, messageId: 'importMetaEnv' });
        }
        if (
          node.property.type === 'Identifier' && node.property.name === 'scrollIntoView'
        ) {
          context.report({ node, messageId: 'scrollIntoView' });
        }
      },
      JSXAttribute(node) {
        if (node.name.type === 'JSXIdentifier' && node.name.name === 'dangerouslySetInnerHTML') {
          context.report({ node, messageId: 'dangerouslySetInnerHTML' });
        }
      },
    };
  },
};
