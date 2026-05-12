### GlassButton

Primary action button with app, status, link, and marketing CTA variants.

```tsx
<GlassButton
  variant="aurora"
  size="md"
  disabled={loading}
  loading={loading}
  onClick={handleClick}
>
  Click me
</GlassButton>
```

**Props:**
- `variant?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'error' | 'outline' | 'link' | 'gradient' | 'aurora' | 'success' | 'warning'` - Button variant
- `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` - Button size
- `disabled?: boolean` - Disabled state
- `loading?: boolean` - Loading state
- `onClick?: () => void` - Click handler

## Aurora Variant

Use `variant="aurora"` for premium landing-page and launch-page CTAs. It is a real `GlassButton` variant, so focus rings, disabled behavior, loading state, icon slots, `asChild`, and reduced-motion behavior stay aligned with the normal button API.

```tsx
<GlassButton variant="aurora" size="xl">
  Start building
</GlassButton>
```

The aurora treatment is backed by Marketing Kit token variables such as `--aura-marketing-button-aurora-background`, `--aura-marketing-button-aurora-glow`, and `--aura-marketing-palettes-aurora-*`.
