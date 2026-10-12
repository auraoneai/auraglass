# Focus Management Quick Reference

## TL;DR

AuraGlass 5 components ship their own keyboard model and a visible
`:focus-visible` ring. Native interactive elements get the same ring from the
global stylesheet. Custom code is needed only for overlays and widgets you
build yourself.

---

## Automatic (no code needed)

```tsx {fragment}
<button>Button</button>
<a href="/page">Link</a>
<input type="text" aria-label="Name" />
<textarea aria-label="Notes" />
<div role="button" tabIndex={0}>Custom button</div>
```

---

## Custom implementation

### Overlay focus trap

```tsx
import { FocusScope } from 'aura-glass/primitives';

export function Panel({ onClose }: { onClose: () => void }) {
  return (
    <FocusScope trapped loop autoFocus>
      <button type="button" onClick={onClose}>Close</button>
    </FocusScope>
  );
}
```

Prefer `Dialog`, `AlertDialog` or `Sheet` from `aura-glass`: they trap, close on
Escape and restore focus without extra code.

### Arrow-key navigation

`Menu`, `Tabs`, `ToggleGroup`, `RadioGroup`, `Toolbar` and `SegmentedControl`
implement roving tab index.

```tsx
import { Tabs } from 'aura-glass';

export function Settings() {
  return (
    <Tabs.Root defaultValue="general">
      <Tabs.List>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general">General settings</Tabs.Panel>
      <Tabs.Panel value="billing">Billing settings</Tabs.Panel>
    </Tabs.Root>
  );
}
```

---

## Public focus APIs

| API | Use case | Import |
|-----|----------|--------|
| `FocusScope` | Trap, loop and restore focus in a custom overlay | `aura-glass/primitives` |
| `Dialog`, `AlertDialog`, `Sheet` | Modal overlays with trap and restore | `aura-glass` |
| `Menu`, `Tabs`, `ToggleGroup`, `Toolbar` | Roving tab index | `aura-glass` |
| `VisuallyHidden` | Accessible names without visible text | `aura-glass` |

---

## CSS variables

```css
.brand-scope {
  --ag-focus-outer: #10b981; /* ring colour */
}
```

---

## Testing checklist

- [ ] Tab through page: all interactive elements focusable
- [ ] Focus indicators visible (3:1 contrast)
- [ ] Shift+Tab works (reverse navigation)
- [ ] Escape closes overlays
- [ ] Focus restored after an overlay closes
- [ ] Arrow keys work in menus, tabs and groups

---

## Common mistakes

```css
/* Don't remove the outline without a replacement */
button { outline: none; }
```

```tsx {fragment}
{/* Don't make non-interactive elements focusable: <div tabIndex={0}>Not a button</div> */}
<button>Actual button</button>
```

Restore focus when you close a custom popup:

```tsx
import { useRef, useState } from 'react';

export function Popup() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const handleClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  return (
    <>
      <button ref={triggerRef} aria-expanded={open} onClick={() => setOpen(true)}>Open</button>
      {open && <button onClick={handleClose}>Close</button>}
    </>
  );
}
```

---

## WCAG checklist

- [ ] 2.1.1: All functionality keyboard accessible
- [ ] 2.1.2: No keyboard traps (except modals with Escape)
- [ ] 2.4.3: Logical focus order
- [ ] 2.4.7: Focus indicators visible
- [ ] 2.4.11: Focused element not obscured
- [ ] 3.2.1: No context changes on focus

---

See the [full guide](./focus-management-guide.md).
