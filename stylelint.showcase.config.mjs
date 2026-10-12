/* stylelint.showcase.config.mjs — QUAL (REQ-QUAL-59 showcase hygiene; run on L1 by REQ-QUAL-27 through
   certification/gates/stylelint-showcase.mjs over every tracked showcase CSS file).
   Showcase CSS lays out library components; it never styles material. Only layout properties are allowed
   (box alignment `align-*`/`justify-*`/`place-*` is flex/grid layout, and `list-style: none` is the marker
   half of the margin/padding reset on layout stacks), with 0 `!important`, 0 colour literals and 0 selectors
   reaching into `[data-ag-part]`. Custom properties are ignored by `property-allowed-list` (they only carry
   token references). */
export default {
  rules: {
    'property-allowed-list': [
      [
        'display', '/^grid-/', '/^flex/', '/^align-/', '/^justify-/', '/^place-/', 'gap', 'row-gap', 'column-gap', 'padding', '/^padding-/', 'margin', '/^margin-/', 'inline-size', 'block-size',
        '/^min-/', '/^max-/', 'position', '/^inset/', 'overflow', '/^container-/', 'list-style',
      ],
      { message: (p) => `showcase CSS may only lay out (REQ-QUAL-59): '${p}' is not an allowed property` },
    ],
    'declaration-no-important': true,
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix']],
    'selector-disallowed-list': [['/\\[data-ag-part/']],
  },
};
