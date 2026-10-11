/**
 * PLAT-102 — RuleTester coverage for auraglass/motion-no-empty-animate.
 * The rule flags `initial` with a zero-opacity start plus a conditional
 * `animate` (ternary, &&, ??) — the shape that leaves reduced-motion users
 * staring at invisible elements — and bare `animate={{}}`.
 */

const { RuleTester } = require("eslint");
const plugin = require("../../eslint-plugin-auraglass.js");

const rule = plugin.rules["motion-no-empty-animate"];

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
});

describe("auraglass/motion-no-empty-animate", () => {
    ruleTester.run("motion-no-empty-animate", rule, {
      valid: [
        // unconditional animate, zero-opacity initial: fine
        `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />`,
        // conditional initial(false) + conditional animate, no empty branch:
        // reduced branch renders the element directly (safe)
        `<motion.div initial={cond ? false : { opacity: 0 }} animate={cond ? { opacity: 1 } : { opacity: 1 }} />`,
        // ? undefined : — the REQ-PLAT-48 conversion spelling (no empty object)
        `<motion.div animate={prefersReducedMotion ? undefined : { scale: 1 }} />`,
        `<motion.div whileHover={shouldAnimate ? { scale: 1.02 } : undefined} />`,
        // cookie-consent exception: motion gated via its disableAnimation prop
        {
          code: `<motion.div animate={prefersReducedMotion ? {} : { scale: 1 }} />`,
          filename: 'src/components/cookie-consent/CookieConsent.tsx',
        },
        // non-conditional, non-empty animate
        `<motion.div animate={{ opacity: 1 }} />`,
        // no animate at all
        `<motion.div initial={{ opacity: 0 }} />`,
        // string-variant animate (not a conditional expression)
        `<motion.div initial="hidden" animate="visible" />`,
      ],
      invalid: [
        // canonical spelling: cond ? {} : target
        {
          code: `<motion.div initial={{ opacity: 0 }} animate={prefersReducedMotion ? {} : { opacity: 1 }} />`,
          errors: [{ messageId: "fadedConditional" }, { messageId: "emptyConditional" }],
        },
        // empty object in the other branch
        {
          code: `<motion.div initial={{ opacity: 0 }} animate={prefersReducedMotion ? { opacity: 1 } : {}} />`,
          errors: [{ messageId: "fadedConditional" }, { messageId: "emptyConditional" }],
        },
        // REQ-PLAT-48: empty-object conditional branches on motion props
        {
          code: `<motion.div animate={cond ? {} : { scale: 1 }} />`,
          errors: [{ messageId: "emptyConditional" }],
        },
        {
          code: `<motion.div animate={cond ? { scale: 1 } : {}} />`,
          errors: [{ messageId: "emptyConditional" }],
        },
        {
          code: `<motion.div whileHover={shouldAnimate ? {} : { scale: 1.02 }} />`,
          errors: [{ messageId: "emptyConditional" }],
        },
        {
          code: `<motion.div whileTap={shouldAnimate ? { scale: 0.98 } : {}} />`,
          errors: [{ messageId: "emptyConditional" }],
        },
        // logical spellings
        {
          code: `<motion.div initial={{ opacity: 0 }} animate={shouldAnimate && { opacity: 1 }} />`,
          errors: [{ messageId: "fadedConditional" }],
        },
        {
          code: `<motion.div initial={{ opacity: 0 }} animate={target ?? { opacity: 1 }} />`,
          errors: [{ messageId: "fadedConditional" }],
        },
        // nested ternary still counts as conditional
        {
          code: `<motion.div initial={{ opacity: 0 }} animate={a ? (b ? {} : { opacity: 1 }) : { opacity: 0.5 }} />`,
          errors: [{ messageId: "fadedConditional" }, { messageId: "emptyConditional" }],
        },
        // bare empty animate
        {
          code: `<motion.div animate={{}} />`,
          errors: [{ messageId: "emptyAnimate" }],
        },
      ],
    });
});
