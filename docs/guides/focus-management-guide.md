# Focus Management Implementation Guide

This guide shows how focus works in AuraGlass 5 and what to do when you build
your own interactive pieces on top of it.

## Quick Start

Most of the time you do nothing. Every AuraGlass component ships its keyboard
model (Tab order, arrow keys, Escape, focus trap and focus restore) and a
visible `:focus-visible` ring drawn from the `--ag-focus-*` tokens.

```tsx
import { Button, TextField } from 'aura-glass';

export function SignIn() {
  return (
    <form>
      <TextField label="Email" type="email" />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

Native elements (`button`, `a[href]`, `input`, `select`, `textarea`) receive the
same ring through the global stylesheet, on keyboard focus only.

---

## When You Need Custom Implementation

### 1. Modal and dialog content (focus trap)

Use `Dialog` (or `AlertDialog`, `Sheet`). It traps focus while open, closes on
Escape and returns focus to the trigger:

```tsx
import { Button, Dialog } from 'aura-glass';

export function ConfirmDelete() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Delete project</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Body>This cannot be undone.</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Button intent="danger">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

For a custom overlay that is not a dialog, wrap it in `FocusScope` from
`aura-glass/primitives`. `trapped` keeps Tab inside, `loop` wraps from the last
stop to the first, `restoreFocus` (default `true`) returns focus on unmount:

```tsx
import { FocusScope } from 'aura-glass/primitives';

export function InlineEditor({ onDone }: { onDone: () => void }) {
  return (
    <FocusScope trapped loop autoFocus onKeyDown={(e) => e.key === 'Escape' && onDone()}>
      <input aria-label="Title" />
      <button type="button" onClick={onDone}>Done</button>
    </FocusScope>
  );
}
```

### 2. Menus, lists and tabs (arrow keys)

`Menu`, `Tabs`, `ToggleGroup`, `RadioGroup`, `Toolbar` and `SegmentedControl`
implement roving tab index: one Tab stop for the group, arrow keys move inside.

```tsx
import { Menu } from 'aura-glass';

export function RowActions() {
  return (
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}
```

### 3. Custom interactive elements

Prefer a native `<button>`. When an element must carry `role="button"`, give it
`tabIndex={0}` and handle Enter and Space; the global `:focus-visible` ring
applies automatically:

```tsx
export function Tile({ title, onOpen }: { title: string; onOpen: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <h3>{title}</h3>
    </div>
  );
}
```

---

## CSS Customization

The ring is drawn from tokens; override them on a scope instead of writing
`outline` rules:

```css
.brand-scope {
  --ag-focus-outer: #10b981;
}
```

Never remove the ring (`outline: none`) without an equivalent replacement.

---

## Common Patterns

### Restoring focus after a custom popup closes

```tsx
import { useRef, useState } from 'react';

export function Disclosure() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  return (
    <>
      <button ref={triggerRef} aria-expanded={open} onClick={() => setOpen(!open)}>
        Details
      </button>
      {open && (
        <div role="region" aria-label="Details">
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  );
}
```

### Skip links

A skip link is a plain anchor as the first focusable element, pointing at the
main landmark (`tabIndex={-1}` lets it take focus):

```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <nav aria-label="Primary">{/* navigation */}</nav>
      <main id="main-content" tabIndex={-1}>{children}</main>
    </>
  );
}
```

---

## Testing Focus Management

### Manual testing

1. Tab through the page; every stop shows a ring.
2. Shift+Tab reverses the order.
3. Escape closes overlays and focus returns to the trigger.
4. Arrow keys move inside menus, tabs and groups.

### Automated testing (Jest + Testing Library)

```tsx
import { expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from 'aura-glass';

test('button is keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<Button>Save</Button>);
  await user.tab();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Save' }));
});
```

---

## WCAG Compliance Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible with 3:1 contrast
- [ ] Tab order is logical
- [ ] Focus is not trapped unintentionally
- [ ] Focus is restored when closing overlays
- [ ] No context changes on focus alone
- [ ] Disabled elements are not focusable

---

## Resources

- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Keyboard accessibility](https://webaim.org/techniques/keyboard/)
- [APG keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

See the [Focus Management Quick Reference](./focus-management-quick-reference.md) for a one-page summary.
