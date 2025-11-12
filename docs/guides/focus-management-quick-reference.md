# Focus Management Quick Reference

## 🎯 TL;DR

**Most components get focus management automatically!** Our global CSS provides visible focus indicators for all interactive elements. You only need custom implementation for modals and complex navigation.

---

## ✅ Automatic (No Code Needed)

These elements get focus indicators automatically:

```tsx
<button>Button</button>                  // ✅ Automatic
<a href="/page">Link</a>                 // ✅ Automatic
<input type="text" />                    // ✅ Automatic
<select>...</select>                     // ✅ Automatic
<textarea>...</textarea>                 // ✅ Automatic
<div role="button" tabIndex={0}>...</div> // ✅ Automatic
```

---

## 🔧 Custom Implementation Needed

### Modal/Dialog (Focus Trap)

```tsx
import { trapFocus } from '@/utils/focus';

const modalRef = useRef<HTMLDivElement>(null);
const prevFocusRef = useRef<HTMLElement | null>(null);

useEffect(() => {
  if (!isOpen || !modalRef.current) return;

  prevFocusRef.current = document.activeElement as HTMLElement;
  const release = trapFocus(modalRef.current, {});

  return () => {
    release();
    setTimeout(() => prevFocusRef.current?.focus(), 0);
  };
}, [isOpen]);
```

### Menu/List (Arrow Keys)

```tsx
import { RovingTabIndex } from '@/utils/focus';

const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!containerRef.current) return;
  const roving = new RovingTabIndex(containerRef.current, '[role="menuitem"]');
  return () => roving.destroy();
}, []);
```

---

## 📚 Available Utilities

| Utility | Use Case | Import |
|---------|----------|--------|
| `trapFocus()` | Modal focus trap | `@/utils/focus` |
| `RovingTabIndex` | Arrow key navigation | `@/utils/focus` |
| `useGlassFocus()` | Comprehensive focus hook | `@/hooks/extended/useGlassFocus` |
| `getFocusableElements()` | Get all focusable elements | `@/utils/focus` |

---

## 🎨 CSS Variables

```css
--glass-focus-ring-color: #3b82f6;    /* Focus color */
--glass-focus-ring-width: 2px;         /* Outline width */
--glass-focus-ring-offset: 2px;        /* Offset from element */
--glass-focus-ring-opacity: 0.2;       /* Ring opacity */
```

**Override:**
```tsx
<button
  style={{ '--glass-focus-ring-color': '#10b981' } as any}
>
  Custom Green Focus
</button>
```

---

## ✨ Helper Classes

```tsx
className="glass-focus-visible"      // Glass-style focus
className="glass-focus-keyboard"     // Keyboard-only focus
```

---

## 🧪 Testing Checklist

- [ ] Tab through page - all elements focusable
- [ ] Focus indicators visible (3:1 contrast)
- [ ] Shift+Tab works (reverse navigation)
- [ ] Escape closes modals
- [ ] Focus restored after modal close
- [ ] Arrow keys work in menus/lists

---

## 🚫 Common Mistakes

```tsx
// ❌ DON'T: Remove focus outline
button {
  outline: none;  // Bad!
}

// ✅ DO: Use :focus-visible (already global)
button:focus-visible {
  outline: 2px solid var(--glass-focus-ring-color);
}
```

```tsx
// ❌ DON'T: Make non-interactive elements focusable
<div tabIndex={0}>Not a button</div>

// ✅ DO: Use semantic HTML
<button>Actual button</button>
```

```tsx
// ❌ DON'T: Skip focus restoration
const handleClose = () => {
  setIsOpen(false); // Focus lost!
};

// ✅ DO: Restore focus
const handleClose = () => {
  setIsOpen(false);
  setTimeout(() => triggerRef.current?.focus(), 0);
};
```

---

## 📋 WCAG Checklist

- [ ] 2.1.1: All functionality keyboard accessible
- [ ] 2.1.2: No keyboard traps (except modals with Escape)
- [ ] 2.4.3: Logical focus order
- [ ] 2.4.7: Focus indicators visible (3:1 contrast)
- [ ] 3.2.1: No context changes on focus

---

## 🔗 Quick Links

- [Full Guide](/docs/FOCUS_MANAGEMENT_GUIDE.md)
- [Implementation Report](/reports/FOCUS_MANAGEMENT_SUMMARY.md)
- [Focus Utils](/src/utils/focus.ts)
- [Focus Hook](/src/hooks/extended/useGlassFocus.ts)

---

## 💡 Pro Tips

1. **Unplug your mouse** - Test keyboard-only navigation
2. **Use DevTools** - Chrome DevTools > Accessibility > Focus order
3. **Screen reader test** - VoiceOver (Mac) or NVDA (Windows)
4. **Check contrast** - Use browser extensions for contrast checking
5. **Automated tests** - axe-core, Lighthouse, WAVE

---

**Need help?** Check the [full guide](/docs/FOCUS_MANAGEMENT_GUIDE.md) or [implementation summary](/reports/FOCUS_MANAGEMENT_SUMMARY.md).
