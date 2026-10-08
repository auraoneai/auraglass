/* lint/rules/mat/_strict.cjs — strict escalation table (MAT-099 mechanism,
   MAT-180 per-family escalation). eslint-plugin-auraglass.js reads
   { strict: { '<rule-name>': [glob, ...] } } and emits 'error' configs for
   those globs, on top of each rule's own agConfig severity.

   MAT-180: after each family deletion/migration PR (2e-B consumes the
   removal lanes), add that family's glob here so its optics are enforced at
   'error' while the rest of src/ stays at 'warn' via optics-baseline.json
   ratchet. On 5.0 GA the whole src/ glob escalates. */
module.exports = {
  strict: {
    // family globs land here per migration PR (MAT-180), e.g.
    // 'no-optics-outside-material': ['src/components/table/**', ...]
    // (an empty array is an invalid flat-config `files` value — the plugin
    // would reject it, so the table stays empty until the first family lands).
  },
};
