# Accessibility

Accessibility in AuraGlass is a set of floors the library enforces for you,
plus a few hooks for your own markup. Components are built on Base UI, so
keyboard interaction, focus management and ARIA follow the WAI-ARIA
Authoring Practices for each pattern.

## Preferences the library honours

The provider reads the OS signals before the first paint and keeps them as
floors (an app or user setting can go further, never back):

| OS signal | Effect |
| --- | --- |
| `prefers-reduced-transparency` | Transparency at least `tinted` |
| `prefers-contrast: more` | Transparency at least `tinted`, contrast `more` |
| `forced-colors: active` | Transparency `solid`, contrast `more`, system colours, no optics |
| `prefers-reduced-motion` | Motion at most `calm`; continuous animation off |
| `pointer: coarse` | Larger minimum target size |

Users can raise any of these in `GlassPreferencesPanel`, which exposes the
seven user-settable keys (transparency, glass opacity, contrast, motion,
scheme, density, continuous animation). A glass opacity of `0.7` or more also
moves transparency to at least `tinted`.

## Contrast

Glass is never allowed to make text unreadable. For every combination of
transparency, thickness and declared backdrop, the build solves the minimum
fill alpha that keeps text at its contrast minimum, and surfaces never render
below it. The solved minima for regular and large text are published with
each release as the generated `contrast-min-regular` and `contrast-min-large`
claims, read from the build's contrast output.

That guarantee depends on the declared backdrop. Declare `data-ag-backdrop`
(or use `Environment`) wherever your own background is not the page scheme;
see [Choosing a material](/mat/choosing-a-material). Themes built with
`createGlassTheme` or `createBrandTheme` report every text pair they adjusted
in `theme.contrast`.

## Focus

Every focusable library part draws the same focus ring on `:focus-visible`:
an outer outline plus an inner ring, so it stays visible on light, dark and
media backdrops, and it becomes a `Highlight` outline under forced colours.
The library never removes outlines.

For your own focusable elements, add `data-ag-focusable` to get the same
ring. Inside a container that clips overflow, add `data-ag-focus-inset` so
the ring is drawn inside the element instead of being cut off.

```tsx
<a href="/settings" data-ag-focusable>Settings</a>
```

## Target size

Small controls (icon buttons, checkboxes, switch thumbs) carry an invisible
hit area that extends the pointer target to the minimum size, larger on
coarse pointers, without changing the visual size. Adjacent targets never
overlap: a toolbar or group sets `data-ag-hit-clamp` and the hit areas stop
at half the gap between items.

## Overlays, layers and announcements

All overlays register with one layer stack. It is the only place that
handles Escape, makes the rest of the page inert behind a modal and locks
scrolling, so nested dialogs, menus and toasts close in the right order and
focus returns to the trigger. Toasts render into a labelled `Notifications`
region, and status messages go through a shared polite and assertive live
region that coalesces repeats instead of announcing them twice.

## Scroll padding

Sticky chrome (an app bar or a bottom toolbar) would otherwise hide the
element that keyboard focus scrolls to. Library chrome writes its size into
the document's scroll padding, so focused elements always land in view.

## What to test in your app

- Query by role and accessible name (`getByRole('button', { name: 'Save' })`),
  not by class names; see [Testing](/guides/testing).
- Run your pages with reduced motion, increased contrast and forced colours
  enabled at least once; the library's floors apply, but your own CSS must
  not undo them.
- Give every icon-only control an accessible name. `IconButton` requires a
  `label`.
