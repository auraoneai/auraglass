# Choosing a material

Every AuraGlass surface is described by a role, not by optical numbers. You
say what the element is (its layer), and the material engine picks the blur,
tint, rim and contrast floor for the current backdrop and preferences. There
is no `blur`, `opacity` or `glassIntensity` prop.

```tsx {fragment}
import { Surface } from 'aura-glass/material';

<Surface layer="chrome" thickness="thin">Toolbar</Surface>
<Surface layer="content">Card body</Surface>
```

## Step 1: pick the layer

| Layer | Use it for | Material |
| --- | --- | --- |
| `chrome` | App bars, rails, toolbars, tab bars | Glass (`variant` × `thickness`) |
| `overlay` | Popover, menu, dialog, sheet, toast | Glass (`variant` × `thickness`) |
| `transient` | A knob or thumb that is glass only while it is manipulated | Glass while interacting |
| `content` | Cards, tables, threads, forms | `content-raised` (default) or `content-sunken` — not glass |

Content is not glass by default. Long-form reading, data and forms sit on the
content materials, which are opaque enough to read at any backdrop. Glass is
for the chrome and overlays that float above content. If a content element
really must be glass, set `variant` on it explicitly; the engine then treats
it like chrome.

## Step 2: pick variant and thickness (glass layers only)

| Prop | Values | Default | Choose |
| --- | --- | --- | --- |
| `variant` | `regular`, `clear`, `identity` | `regular` | `regular` for almost everything; `clear` over media where the content behind is the point; `identity` to keep the surface geometry but render no glass (it inherits the parent's look) |
| `thickness` | `thin`, `regular`, `thick` | from the component | `thin` for bars and small controls, `regular` for panels and menus, `thick` for sheets and dialogs |

Two states are derived and are never props: a surface nested inside another
surface renders the *inner* fill (never blurred again), and an overlay
backdrop renders as `scrim`.

## Step 3: declare the backdrop

Browsers cannot read the pixels behind an element, so the backdrop is
declared. Put `data-ag-backdrop` on any ancestor, or wrap the region in
`Environment`:

| `backdrop` | Meaning |
| --- | --- |
| `light` | Light page or image behind the glass |
| `dark` | Dark page or image behind the glass |
| `media` | Photo or video; the strongest tint and floor apply |
| `auto` | Resolve from the current colour scheme (the default) |

```tsx
import { Environment, Surface } from 'aura-glass/material';

<Environment backdrop="media" image="/hero.jpg">
  <Surface layer="chrome" variant="clear">Now playing</Surface>
</Environment>
```

Library-owned backdrops (`aura-glass/backdrops`, `aura-glass/media`, and
`Environment` with `image` or `video`) declare themselves. For your own
backgrounds, declare the closest value; the contrast floor is solved per
backdrop, so a wrong declaration is the one way to get unreadable text.

## Step 4: optional role flags

| Prop | Effect |
| --- | --- |
| `interactive` | Hover and press light response on the surface |
| `prominent` | The one tinted, high-emphasis surface of a view (intent tints only rim and specular otherwise) |
| `shape` | `fixed`, `capsule` or `concentric` corner geometry; `ConcentricFrame` sets the outer radius and inset for concentric children |
| `refraction` | Lens refraction where the engine supports it; ignored elsewhere |
| `allowNested` | Lets a glass surface sit inside another glass surface instead of falling back to the inner fill |

`SurfaceGroup` places sibling surfaces so they read as one piece of glass,
and `ScrollEdge` softens or hardens the edge where content scrolls under a
bar.

## Using the role on your own element

`materialProps(role)` returns only `data-ag-*` attributes, so you can give any
element a material without a wrapper. `Surface` accepts `render` to do the
same with a component element.

```tsx
import { materialProps } from 'aura-glass/material';

<nav {...materialProps({ layer: 'chrome', thickness: 'thin' })}>…</nav>
```

## What you do not control

User and OS preferences sit above every choice on this page. Reduced
transparency, increased contrast and forced colours move surfaces to `tinted`
or `solid`; reduced motion removes the light response. A role is a request,
and the resolved preferences are the floor. See
[Accessibility](/mat/accessibility) and [Theming](/mat/theming).
