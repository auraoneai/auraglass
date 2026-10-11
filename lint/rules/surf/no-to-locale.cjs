// auraglass/no-to-locale — REQ-SURF-08 (S-47 owner SURF). SURF code never
// calls toLocaleString / toLocaleDateString / toLocaleTimeString: their output
// depends on the host's default locale and time zone, so a server at
// Pacific/Kiritimati and a client at Pacific/Pago_Pago render different text
// and hydration fails. Formatting goes through Intl.* with an explicit locale
// (and, for times, an explicit timeZone), so an Intl formatter built with no
// locale argument (or an `undefined` one) is reported too.
//
// This is the auraglass/<rule> form of the REQ's `no-restricted-properties`
// ban: lint/rules/surf/_strict.cjs can only escalate auraglass/<rule> configs
// (contract §4.11), so the ban ships as a SURF rule module and _strict.cjs
// sets it to 'error' over the SURF globs.
// ESLint 9 flat-config rule module: { meta, create, agConfig }.
'use strict';

const TO_LOCALE = new Set(['toLocaleString', 'toLocaleDateString', 'toLocaleTimeString']);

// Intl constructors whose first argument is the locale list.
const INTL_LOCALE_FIRST = new Set([
  'DateTimeFormat',
  'NumberFormat',
  'RelativeTimeFormat',
  'ListFormat',
  'PluralRules',
  'Collator',
  'DisplayNames',
  'Segmenter',
  'DurationFormat',
]);

function memberName(node) {
  if (node.type !== 'MemberExpression') return null;
  if (!node.computed && node.property.type === 'Identifier') return node.property.name;
  if (node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string') {
    return node.property.value;
  }
  if (
    node.computed &&
    node.property.type === 'TemplateLiteral' &&
    node.property.expressions.length === 0 &&
    node.property.quasis.length === 1
  ) {
    return node.property.quasis[0].value.cooked;
  }
  return null;
}

function isIntlCtor(callee) {
  const name = memberName(callee);
  return (
    name !== null &&
    INTL_LOCALE_FIRST.has(name) &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'Intl'
  );
}

function isImplicitLocale(args) {
  if (args.length === 0) return true;
  const first = args[0];
  return (first.type === 'Identifier' && first.name === 'undefined') ||
    (first.type === 'UnaryExpression' && first.operator === 'void');
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'No toLocale* calls and no locale-less Intl formatters in SURF code (hydration-stable formatting, REQ-SURF-08).',
    },
    schema: [],
    messages: {
      toLocale:
        '{{name}} depends on the host locale and time zone, so server and client text differ (REQ-SURF-08). Use Intl.* with an explicit locale and, for times, timeZone.',
      intlImplicitLocale:
        'Intl.{{name}} without an explicit locale uses the host default, so server and client text differ (REQ-SURF-08). Pass the locale (and timeZone for times).',
    },
  },
  // No repo-wide severity: SURF escalates to 'error' over its own globs in
  // lint/rules/surf/_strict.cjs (contract §4.11 non-blocking rollout).
  agConfig: [],
  create(context) {
    return {
      MemberExpression(node) {
        const name = memberName(node);
        if (name !== null && TO_LOCALE.has(name)) {
          context.report({ node: node.property, messageId: 'toLocale', data: { name } });
        }
      },
      NewExpression(node) {
        if (isIntlCtor(node.callee) && isImplicitLocale(node.arguments)) {
          context.report({ node, messageId: 'intlImplicitLocale', data: { name: memberName(node.callee) } });
        }
      },
      CallExpression(node) {
        // Intl.DateTimeFormat() without `new` is also a constructor call.
        if (isIntlCtor(node.callee) && isImplicitLocale(node.arguments)) {
          context.report({ node, messageId: 'intlImplicitLocale', data: { name: memberName(node.callee) } });
        }
      },
    };
  },
};
