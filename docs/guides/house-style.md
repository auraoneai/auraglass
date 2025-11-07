AuraGlass House Style

Goals
- Premium, readable glass surfaces with consistent depth, motion, and focus.
- Zero dark-on-dark or light-on-light contrast mistakes across themes.
- No truncation by default; opt-in ellipsis only with affordance.
- Motion respects prefers-reduced-motion; no layout shift.
- All styling goes through tokens, CSS variables, or unified utilities.

Core Tokens
- Colors: use surface/intent tokens; foregrounds via `--glass-text-*` and `--glass-fg-on-*`.
- Motion: `--glass-duration-*`, `--glass-ease-*` applied via `.glass-animate-*`.
- Spacing: `--glass-space-*` (4px grid).
- Radius: `--glass-radius-*` or `.glass-radius-*` utilities.
- Elevation: `.glass-elev-{0..4}` or `.glass-elevation-{1..3}`.
 - Blur: compose from `--glass-filter-base` with `.glass-blur-{none|sm|md|lg}`.

Utilities
- Base: `.glass` or `.glass-foundation-complete` for surfaces.
- Blur: `.glass-blur-{none|sm|md|lg}`.
- Focus: add `.glass-focus` on focusable elements; rely on `:focus-visible`.
- Typography: `.glass-text-balance`, `.glass-hyphenate`, `.glass-no-truncate`, `.glass-ellipsis-optin`.
- Contrast: apply `.glass-contrast-guard` on dynamic content containers.
 - Spacing between sections: prefer `.glass-auto-gap` with size modifiers over Tailwind `space-y-*`.
   - Examples: `.glass-auto-gap glass-auto-gap-sm` (8px), `-md` (12px), `-lg` (16px), `-2xl` (24px), `-3xl` (32px), `-4xl` (64px).
   - Backward-compatibility: existing `space-y-*` still works via aliases, but new code must use `.glass-auto-gap`.

Accessibility
- Focus: visible, 2px ring with 2px offset, theme-aware.
- Hit targets: min 44×44px for interactive controls.
- Reduced Motion: animations disabled under `prefers-reduced-motion: reduce`.
- Keyboard semantics: if a surface is clickable, add `role="button"`, `tabIndex=0`, and Enter/Space handlers.

Do/Don’t
- Do use `createGlassStyle({ intent, elevation, tier })` or `.glass` classes.
- Don’t use raw `backdrop-filter` or RGBA backgrounds inline.
- Do wrap long labels with `.glass-text-balance` or `.glass-hyphenate`.
- Don’t truncate text unless using `.glass-ellipsis-optin` and providing full-view affordance.
 - Don’t hardcode colors (hex/rgb/rgba/hsl); map to tokens or CSS variables.
- Don’t use Tailwind `animate-pulse`; prefer `.glass-animate-*` utilities.
 - Don’t use Tailwind `space-y-*`; use `.glass-auto-gap` variants for consistent, tokenized spacing.

Theme Rules
- Light theme: foreground defaults to near-black, dark theme to near-white.
- Tint surfaces: prefer `--glass-fg-on-tint` for icons/labels.
- Use `.glass-contrast-guard` when foreground is dynamic or user-supplied.

Motion
- Defaults: `--glass-duration-normal` with ease standard; subtle and reversible.
- Use `.glass-animate-fade|slide-up|pop|float|shimmer`; never Tailwind animation utilities for glass surfaces.
 - Reduced motion: all `.glass-animate-*` utilities are disabled automatically.

Adoption Checklist (per component)
- Map colors to tokens (no raw values); verify AA contrast in light/dark.
- Replace magic numbers with spacing/radius/elevation/blur utilities.
- Ensure focus ring and keyboard order; add semantics to clickable wrappers.
- Validate responsive wrapping 320→1920; no overflow; opt-in ellipsis only.
- Respect reduced motion; avoid layout shift on enter/hover.

CI Guardrails
- Run `npm run lint:tokens` to flag raw colors, inline blur, or `animate-pulse` usage with precise file:line.

Icon Buttons (Global Rule)
- Default style: icon-only controls render as transparent/ghost (no frosted block).
- Rationale: specular/edge overlays on tiny surfaces wash out glyph contrast.
- Implementation: `IconButton` defaults to `variant="ghost"` and `flat` true; specular overlay is disabled for `iconOnly` buttons.
- Do: pass `variant="ghost"` or `variant="outline"` for icon buttons; rely on hover/focus rings for affordance.
- Don’t: use tinted/frosted variants for `iconOnly` buttons unless accompanied by a dark glyph and adequate contrast testing.
