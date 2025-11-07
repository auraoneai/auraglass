# Focus Management Implementation Guide

This guide shows how to implement focus management in AuraGlass components.

## Quick Start

**Good News:** Most components get focus management automatically through our global CSS!

For standard interactive elements (buttons, inputs, links), you don't need to do anything - they automatically receive visible focus indicators.

---

## Global Focus Indicators (Automatic)

All these elements automatically receive focus indicators:

```tsx
// ✅ Automatic focus management - no extra code needed
<button>Click me</button>
<a href="/page">Link</a>
<input type="text" />
<select>...</select>
<textarea>...</textarea>
<div role="button" tabIndex={0}>Custom button</div>
```

The global styles apply:
- 2px solid outline with primary color (#3b82f6)
- 2px offset from element
- 4px blur ring with 20% opacity
- Only visible on keyboard focus (not mouse clicks)

---

## When You Need Custom Implementation

### 1. Modal/Dialog Components (Need Focus Trap)

Use the `trapFocus()` utility for modal dialogs:

```tsx
import { trapFocus } from '@/utils/focus';
import { useRef, useEffect } from 'react';

function MyModal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Store previously focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Set up focus trap
    const releaseFocus = trapFocus(modalRef.current, {
      returnFocus: false, // We handle this manually
      escapeDeactivates: false,
      allowOutsideClick: true,
    });

    return () => {
      releaseFocus();
      // Restore focus
      if (previouslyFocusedRef.current) {
        setTimeout(() => previouslyFocusedRef.current?.focus(), 0);
      }
    };
  }, [isOpen]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  );
}
```

### 2. Complex Navigation (Menus, Lists, Tabs)

Use the `RovingTabIndex` class for arrow key navigation:

```tsx
import { RovingTabIndex } from '@/utils/focus';
import { useEffect, useRef } from 'react';

function MyMenu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rovingTabIndexRef = useRef<RovingTabIndex | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    rovingTabIndexRef.current = new RovingTabIndex(
      containerRef.current,
      '[role="menuitem"]'
    );

    return () => rovingTabIndexRef.current?.destroy();
  }, []);

  return (
    <div ref={containerRef} role="menu">
      <div role="menuitem" tabIndex={0}>Item 1</div>
      <div role="menuitem" tabIndex={-1}>Item 2</div>
      <div role="menuitem" tabIndex={-1}>Item 3</div>
    </div>
  );
}
```

### 3. Custom Interactive Components

Use the `useGlassFocus()` hook for comprehensive focus management:

```tsx
import { useGlassFocus } from '@/hooks/extended/useGlassFocus';

function MyCustomButton({ onClick, children }) {
  const { ref, focusState, focus, blur } = useGlassFocus({
    enabled: true,
    autoFocus: false,
    keyboardNavigation: true,
  });

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={focusState.isKeyboardFocused ? 'keyboard-focus' : ''}
    >
      {children}
    </button>
  );
}
```

---

## CSS Customization

### Using Focus Variables

Customize focus indicators using CSS variables:

```tsx
<button
  style={{
    '--glass-focus-ring-color': '#10b981', // Green
    '--glass-focus-ring-width': '3px',
    '--glass-focus-ring-offset': '4px',
  } as React.CSSProperties}
>
  Custom Focus
</button>
```

### Custom Focus Classes

Use predefined focus classes:

```tsx
// Glass-specific focus
<div className="glass-focus-visible">
  Custom component
</div>

// Keyboard-only focus
<div className="glass-focus-keyboard">
  Shows focus only on keyboard navigation
</div>
```

---

## Common Patterns

### Pattern 1: Button with Loading State

```tsx
<button
  disabled={loading}
  aria-busy={loading}
  aria-label={loading ? 'Loading...' : 'Submit'}
>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

Focus indicators are automatically hidden on disabled elements.

### Pattern 2: Custom Dropdown

```tsx
function Dropdown({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    // Restore focus to trigger
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Select option
      </button>

      {isOpen && (
        <div role="listbox">
          {options.map(opt => (
            <div
              key={opt.id}
              role="option"
              tabIndex={0}
              onClick={() => {
                // Handle selection
                handleClose();
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
```

### Pattern 3: Focusable Card

```tsx
function Card({ title, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer"
    >
      <h3>{title}</h3>
      {/* Card content */}
    </div>
  );
}
```

### Pattern 4: Skip Links

```tsx
import { useSkipLinks } from '@/hooks/extended/useGlassFocus';

function Layout() {
  const { skipTo } = useSkipLinks([
    { id: 'skip-nav', label: 'Skip to navigation', targetId: 'main-nav' },
    { id: 'skip-content', label: 'Skip to content', targetId: 'main-content' },
  ]);

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          skipTo('main-content');
        }}
      >
        Skip to main content
      </a>

      <nav id="main-nav">{/* Navigation */}</nav>
      <main id="main-content">{/* Content */}</main>
    </>
  );
}
```

---

## Utilities Reference

### `trapFocus(container, options)`

Traps focus within a container (modals, dialogs).

**Options:**
```ts
{
  initialFocus?: RefObject<HTMLElement>;
  returnFocus?: boolean;
  allowOutsideClick?: boolean;
  escapeDeactivates?: boolean;
}
```

### `getFocusableElements(container)`

Returns all focusable elements within a container.

```tsx
const focusables = getFocusableElements(containerRef.current);
console.log(focusables); // [button, input, select, ...]
```

### `RovingTabIndex`

Manages arrow key navigation for lists/menus.

```tsx
const roving = new RovingTabIndex(container, '[role="menuitem"]');
// Cleanup
roving.destroy();
```

### `useGlassFocus(options)`

Comprehensive focus management hook.

**Options:**
```ts
{
  enabled?: boolean;
  autoFocus?: boolean;
  focusTrap?: boolean;
  restoreFocus?: boolean;
  keyboardNavigation?: boolean;
}
```

**Returns:**
```ts
{
  ref: RefObject<HTMLElement>;
  focusState: {
    isFocused: boolean;
    isKeyboardFocused: boolean;
    focusOrigin: 'mouse' | 'keyboard' | 'programmatic' | null;
  };
  focus: () => void;
  blur: () => void;
}
```

---

## Testing Focus Management

### Manual Testing

```bash
# Test keyboard navigation
1. Tab through the page
2. Verify focus indicators are visible
3. Test Shift+Tab (reverse navigation)
4. Test Escape key in modals
5. Test Arrow keys in menus
```

### Automated Testing (Jest + Testing Library)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button is keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<MyButton>Click me</MyButton>);

  const button = screen.getByRole('button');

  // Tab to button
  await user.tab();
  expect(button).toHaveFocus();

  // Activate with Enter
  await user.keyboard('{Enter}');
  // Assert action occurred
});
```

---

## WCAG Compliance Checklist

When implementing focus management:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible with 3:1 contrast
- [ ] Tab order is logical
- [ ] Focus is not trapped unintentionally
- [ ] Focus is restored when closing modals
- [ ] No context changes on focus alone
- [ ] ARIA attributes properly set (role, aria-label, etc.)
- [ ] Disabled elements are not focusable

---

## Common Issues & Solutions

### Issue: Focus indicator not showing
**Solution:** Ensure you're using `:focus-visible` not `:focus`, and the element is being focused via keyboard.

### Issue: Focus trapped in wrong place
**Solution:** Check tab order with `tabIndex`. Use `-1` for programmatic focus only, `0` for tab order.

### Issue: Focus not restored after modal
**Solution:** Store `document.activeElement` before opening modal, restore on close.

### Issue: Focus skipping elements
**Solution:** Ensure elements are not `display: none` or `visibility: hidden` when they should be focusable.

---

## Best Practices

1. **Use Native Elements**
   - Prefer `<button>` over `<div role="button">`
   - Native elements have built-in keyboard support

2. **Don't Suppress Focus Indicators**
   - Never use `outline: none` without replacement
   - Users need to see where focus is

3. **Logical Tab Order**
   - Follow DOM order
   - Use `tabIndex={0}` for custom elements in flow
   - Use `tabIndex={-1}` for programmatic focus only

4. **Focus Management in SPA Navigation**
   - Focus main heading on page change
   - Announce page changes to screen readers

5. **Test with Keyboard Only**
   - Unplug your mouse
   - Try to complete all tasks via keyboard

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [Focus Management](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [AuraGlass Focus Utils](/src/utils/focus.ts)
- [AuraGlass Focus Hook](/src/hooks/extended/useGlassFocus.ts)

---

**Questions?** Check the [Focus Management Report](/reports/FOCUS_MANAGEMENT_SUMMARY.md) for implementation details.
