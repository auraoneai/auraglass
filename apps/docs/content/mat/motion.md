# Motion

AuraGlass motion is spring-first. Enter, exit and press transitions run on
damped springs compiled to CSS `linear()` easings at build time, and the few
non-physical transitions use duration and easing tokens. Components animate
only `transform`, `opacity`, `translate`, `scale` and the library's own
optics properties, so motion never triggers layout.

## Tokens

| Token family | Names |
| --- | --- |
| Durations | `--ag-duration-{instant,micro,small,medium,large}` and a matching `-exit` token each |
| Easings | `--ag-ease-{standard,emphasized,emphasized-decelerate,accelerate}` |
| Springs | `--ag-spring-{snappy,smooth,fluid}` (a `linear()` easing) with `--ag-spring-*-duration` |
| Ambient | `--ag-duration-ambient`, valid only inside `[data-ag-continuous="on"]` |

The values are generated from `src/motion/tokens.generated.ts`; the motion
token reference (`docs/motion.md`, generated) lists every one, so this page
never repeats a number that could drift.

```css
.my-panel {
  transition: translate var(--ag-spring-smooth-duration) var(--ag-spring-smooth);
}
```

## The three motion modes

The resolved motion preference is written to `data-ag-motion` and every
library animation follows it:

| Mode | What happens |
| --- | --- |
| `full` | Springs, light response and morphs as designed |
| `calm` | Opacity cross-fades keep their durations; transforms settle at once; springs fall back to the standard ease; hover and press light response is instant; no CSS animation runs |
| `none` | No transition and no animation on library parts and surfaces |

`prefers-reduced-motion: reduce` caps motion at `calm`. An app or user
setting can choose `calm` or `none`, never `full` against the OS. Before the
provider hydrates, the same rules apply through the media query, so reduced
motion holds on the first paint too.

Under forced colours, pointer light, sweeps and optics fades are off, and only
paint properties may transition.

## Continuous animation is opt-in

Loops (shimmer, lens drift, ambient backdrops) run only when the user or app
sets `allowContinuous` and motion resolves to `full`. They pause when the
element is offscreen or the document is hidden. Leave `allowContinuous` off
unless the loop carries meaning.

```tsx
<AuraGlassProvider allowContinuous={false}>…</AuraGlassProvider>
```

## Using the `motion` library

`aura-glass/motion` adapts the optional `motion` peer to the same tokens and
preferences. Install `motion` yourself; importing `aura-glass` never needs
it.

```tsx
'use client';
import { MotionProvider, toMotionTransition } from 'aura-glass/motion';
import { motion } from 'motion/react';

<MotionProvider>
  <motion.div animate={{ opacity: 1 }} transition={toMotionTransition('spring-smooth')} />
</MotionProvider>
```

`MotionProvider` maps the resolved preference onto the library's
`reducedMotion` setting, so your own `motion` components follow `calm` and
`none` without extra code. `useDragDetents`, `useMomentum`, `magnetic` and
`SharedLayout` provide the drag, inertia and shared-element patterns the
components use.

## Writing reduced-motion-safe animations

When an element enters with `initial`, give the reduced branch the final
state, not an empty object or `undefined`; otherwise it stays at the initial
pose:

```tsx
<motion.div
  initial={reduced ? false : { opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={reduced ? { duration: 0 } : toMotionTransition('spring-snappy')}
/>
```

The `auraglass/motion-*` lint rules flag the common mistakes.
