# CSS Pipeline & Conflict Analysis

## Summary

- **Total CSS Files**: 18
- **Total CSS Variables**: 556
- **Total Classes**: 563
- **Conflicts Found**: 87

## Import Order Analysis

### styles/glass.css

1. `./tokens.css`
2. `./themes/dark.css`
3. `./themes/light.css`

### styles/index.css

1. `./glass.generated.css`
2. `./glass.css`
3. `./design-tokens.css`
4. `./typography.css`
5. `./animations.css`
6. `./performance-animations.css`
7. `./theme-transitions.css`
8. `./storybook-enhancements.css`
9. `./storybook-utility-shim.css`

## Conflicts

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-surface has 2 different values across 2 files

**Variable**: `--glass-surface`

**Definitions**:

- `rgba(255, 255, 255, 0.05)` in `styles/animations.css`
- `rgba(255, 255, 255, 0.8)` in `styles/animations.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-border has 2 different values across 2 files

**Variable**: `--glass-border`

**Definitions**:

- `rgba(255, 255, 255, 0.1)` in `styles/animations.css`
- `rgba(0, 0, 0, 0.1)` in `styles/animations.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-text has 2 different values across 2 files

**Variable**: `--glass-text`

**Definitions**:

- `rgba(255, 255, 255, 0.9)` in `styles/animations.css`
- `rgba(0, 0, 0, 0.9)` in `styles/animations.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow has 2 different values across 2 files

**Variable**: `--glass-shadow`

**Definitions**:

- `rgba(0, 0, 0, 0.3)` in `styles/animations.css`
- `rgba(0, 0, 0, 0.1)` in `styles/animations.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-backdrop-blur has 5 different values across 6 files

**Variable**: `--glass-backdrop-blur`

**Definitions**:

- `blur(var(--glass-blur-none))` in `styles/glass.css`
- `blur(var(--glass-blur-sm))` in `styles/glass.css`
- `blur(var(--glass-blur-md))` in `styles/glass.css`
- `blur(var(--glass-blur-lg))` in `styles/glass.css`
- `blur(var(--glass-blur-xl))` in `styles/glass.css`
- `blur(var(--glass-blur-lg))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-text-primary has 3 different values across 9 files

**Variable**: `--glass-text-primary`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-90))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-90))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-95))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-90))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-95))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-100))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-95))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-90))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-95))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-text-secondary has 3 different values across 9 files

**Variable**: `--glass-text-secondary`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-70))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-70))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-80))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-70))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-80))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-95))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-80))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-70))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-80))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-text-tertiary has 2 different values across 8 files

**Variable**: `--glass-text-tertiary`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-60))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-60))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-60))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-60))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-text-disabled has 2 different values across 8 files

**Variable**: `--glass-text-disabled`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-40))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-40))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/glass.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-40))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-40))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-bg-default has 4 different values across 4 files

**Variable**: `--glass-bg-default`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-80))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-25))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-bg-strong has 2 different values across 3 files

**Variable**: `--glass-bg-strong`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-90))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-35))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-90))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-border-default has 4 different values across 4 files

**Variable**: `--glass-border-default`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-90))` in `styles/glass.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-30))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-70))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-bg-hover has 3 different values across 3 files

**Variable**: `--glass-bg-hover`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-25))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-70))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-30))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-bg-active has 3 different values across 3 files

**Variable**: `--glass-bg-active`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-30))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-80))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-35))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-bg-disabled has 3 different values across 3 files

**Variable**: `--glass-bg-disabled`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-10))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-15))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-bg-subtle has 2 different values across 2 files

**Variable**: `--glass-bg-subtle`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-15))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-45))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-border-hover has 3 different values across 3 files

**Variable**: `--glass-border-hover`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-80))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-50))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-border-active has 3 different values across 3 files

**Variable**: `--glass-border-active`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-90))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-border-disabled has 3 different values across 3 files

**Variable**: `--glass-border-disabled`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-15))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-30))` in `styles/themes/light.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-20))` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-border-subtle has 2 different values across 2 files

**Variable**: `--glass-border-subtle`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-50))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-border-strong has 2 different values across 2 files

**Variable**: `--glass-border-strong`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-95))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-focus-color has 2 different values across 2 files

**Variable**: `--glass-focus-color`

**Definitions**:

- `hsl(var(--glass-color-primary) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-primary) / var(--glass-opacity-60))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-focus-offset-color has 2 different values across 2 files

**Variable**: `--glass-focus-offset-color`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-0))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-100))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-color has 2 different values across 2 files

**Variable**: `--glass-shadow-color`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-40))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-15))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-color-subtle has 2 different values across 2 files

**Variable**: `--glass-shadow-color-subtle`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-30))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-10))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-color-strong has 2 different values across 2 files

**Variable**: `--glass-shadow-color-strong`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-20))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-xs has 2 different values across 3 files

**Variable**: `--glass-shadow-xs`

**Definitions**:

- `0 1px 2px var(--glass-shadow-color-subtle)` in `styles/themes/dark.css`
- `0 1px 2px var(--glass-shadow-color-subtle)` in `styles/themes/light.css`
- `0 1px 2px rgba(var(--glass-color-black) / 0.05)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-sm has 2 different values across 3 files

**Variable**: `--glass-shadow-sm`

**Definitions**:

- `0 2px 4px var(--glass-shadow-color-subtle)` in `styles/themes/dark.css`
- `0 2px 4px var(--glass-shadow-color-subtle)` in `styles/themes/light.css`
- `0 2px 4px rgba(var(--glass-color-black) / 0.08)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-md has 2 different values across 3 files

**Variable**: `--glass-shadow-md`

**Definitions**:

- `0 4px 12px var(--glass-shadow-color)` in `styles/themes/dark.css`
- `0 4px 12px var(--glass-shadow-color)` in `styles/themes/light.css`
- `0 4px 12px rgba(var(--glass-color-black) / 0.12)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-lg has 2 different values across 3 files

**Variable**: `--glass-shadow-lg`

**Definitions**:

- `0 8px 24px var(--glass-shadow-color)` in `styles/themes/dark.css`
- `0 8px 24px var(--glass-shadow-color)` in `styles/themes/light.css`
- `0 8px 24px rgba(var(--glass-color-black) / 0.16)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-xl has 2 different values across 3 files

**Variable**: `--glass-shadow-xl`

**Definitions**:

- `0 12px 36px var(--glass-shadow-color-strong)` in `styles/themes/dark.css`
- `0 12px 36px var(--glass-shadow-color-strong)` in `styles/themes/light.css`
- `0 12px 36px rgba(var(--glass-color-black) / 0.20)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-shadow-2xl has 2 different values across 3 files

**Variable**: `--glass-shadow-2xl`

**Definitions**:

- `0 16px 48px var(--glass-shadow-color-strong)` in `styles/themes/dark.css`
- `0 16px 48px var(--glass-shadow-color-strong)` in `styles/themes/light.css`
- `0 16px 48px rgba(var(--glass-color-black) / 0.24)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-elev-1 has 3 different values across 3 files

**Variable**: `--glass-elev-1`

**Definitions**:

- `0 2px 8px var(--glass-shadow-color-subtle), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-10)) inset` in `styles/themes/dark.css`
- `0 2px 8px var(--glass-shadow-color-subtle)` in `styles/themes/light.css`
- `0 2px 8px rgba(var(--glass-color-black) / 0.12)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-elev-2 has 3 different values across 3 files

**Variable**: `--glass-elev-2`

**Definitions**:

- `0 4px 16px var(--glass-shadow-color), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-10)) inset` in `styles/themes/dark.css`
- `0 4px 16px var(--glass-shadow-color)` in `styles/themes/light.css`
- `0 4px 16px rgba(var(--glass-color-black) / 0.16)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-elev-3 has 3 different values across 3 files

**Variable**: `--glass-elev-3`

**Definitions**:

- `0 8px 24px var(--glass-shadow-color), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-15)) inset` in `styles/themes/dark.css`
- `0 8px 24px var(--glass-shadow-color)` in `styles/themes/light.css`
- `0 8px 24px rgba(var(--glass-color-black) / 0.20)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-elev-4 has 3 different values across 3 files

**Variable**: `--glass-elev-4`

**Definitions**:

- `0 12px 32px var(--glass-shadow-color-strong), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-20)) inset` in `styles/themes/dark.css`
- `0 12px 32px var(--glass-shadow-color-strong)` in `styles/themes/light.css`
- `0 12px 32px rgba(var(--glass-color-black) / 0.24)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-elev-5 has 3 different values across 3 files

**Variable**: `--glass-elev-5`

**Definitions**:

- `0 16px 40px var(--glass-shadow-color-strong), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-20)) inset` in `styles/themes/dark.css`
- `0 16px 40px var(--glass-shadow-color-strong)` in `styles/themes/light.css`
- `0 16px 40px rgba(var(--glass-color-black) / 0.28)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-elev-6 has 3 different values across 3 files

**Variable**: `--glass-elev-6`

**Definitions**:

- `0 24px 56px var(--glass-shadow-color-strong), 0 0 0 1px rgba(var(--glass-color-white) / var(--glass-opacity-25)) inset` in `styles/themes/dark.css`
- `0 24px 56px var(--glass-shadow-color-strong)` in `styles/themes/light.css`
- `0 24px 56px rgba(var(--glass-color-black) / 0.32)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-bg has 2 different values across 2 files

**Variable**: `--glass-control-bg`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-10))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-50))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-bg-hover has 2 different values across 2 files

**Variable**: `--glass-control-bg-hover`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-15))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-bg-active has 2 different values across 2 files

**Variable**: `--glass-control-bg-active`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-70))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-bg-disabled has 2 different values across 2 files

**Variable**: `--glass-control-bg-disabled`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-5))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-30))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-border has 2 different values across 2 files

**Variable**: `--glass-control-border`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-25))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-20))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-border-hover has 2 different values across 2 files

**Variable**: `--glass-control-border-hover`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-35))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-30))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-border-active has 2 different values across 2 files

**Variable**: `--glass-control-border-active`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-45))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-40))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-control-border-disabled has 2 different values across 2 files

**Variable**: `--glass-control-border-disabled`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-10))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-10))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-primary-bg has 2 different values across 2 files

**Variable**: `--glass-accent-primary-bg`

**Definitions**:

- `hsl(var(--glass-color-primary) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-primary) / var(--glass-opacity-15))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-primary-fg has 2 different values across 2 files

**Variable**: `--glass-accent-primary-fg`

**Definitions**:

- `hsl(217 91% 70%)` in `styles/themes/dark.css`
- `hsl(var(--glass-color-primary) / var(--glass-opacity-90))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-primary-border has 2 different values across 2 files

**Variable**: `--glass-accent-primary-border`

**Definitions**:

- `hsl(var(--glass-color-primary) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-primary) / var(--glass-opacity-40))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-success-bg has 2 different values across 2 files

**Variable**: `--glass-accent-success-bg`

**Definitions**:

- `hsl(var(--glass-color-success) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-success) / var(--glass-opacity-15))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-success-fg has 2 different values across 2 files

**Variable**: `--glass-accent-success-fg`

**Definitions**:

- `hsl(160 84% 65%)` in `styles/themes/dark.css`
- `hsl(var(--glass-color-success) / var(--glass-opacity-90))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-success-border has 2 different values across 2 files

**Variable**: `--glass-accent-success-border`

**Definitions**:

- `hsl(var(--glass-color-success) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-success) / var(--glass-opacity-40))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-warning-bg has 2 different values across 2 files

**Variable**: `--glass-accent-warning-bg`

**Definitions**:

- `hsl(var(--glass-color-warning) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-warning) / var(--glass-opacity-15))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-warning-fg has 2 different values across 2 files

**Variable**: `--glass-accent-warning-fg`

**Definitions**:

- `hsl(38 92% 65%)` in `styles/themes/dark.css`
- `hsl(var(--glass-color-warning) / var(--glass-opacity-90))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-warning-border has 2 different values across 2 files

**Variable**: `--glass-accent-warning-border`

**Definitions**:

- `hsl(var(--glass-color-warning) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-warning) / var(--glass-opacity-40))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-danger-bg has 2 different values across 2 files

**Variable**: `--glass-accent-danger-bg`

**Definitions**:

- `hsl(var(--glass-color-danger) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-danger) / var(--glass-opacity-15))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-danger-fg has 2 different values across 2 files

**Variable**: `--glass-accent-danger-fg`

**Definitions**:

- `hsl(0 84% 70%)` in `styles/themes/dark.css`
- `hsl(var(--glass-color-danger) / var(--glass-opacity-90))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-danger-border has 2 different values across 2 files

**Variable**: `--glass-accent-danger-border`

**Definitions**:

- `hsl(var(--glass-color-danger) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-danger) / var(--glass-opacity-40))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-info-bg has 2 different values across 2 files

**Variable**: `--glass-accent-info-bg`

**Definitions**:

- `hsl(var(--glass-color-info) / var(--glass-opacity-20))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-info) / var(--glass-opacity-15))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-info-fg has 2 different values across 2 files

**Variable**: `--glass-accent-info-fg`

**Definitions**:

- `hsl(199 89% 65%)` in `styles/themes/dark.css`
- `hsl(var(--glass-color-info) / var(--glass-opacity-90))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-accent-info-border has 2 different values across 2 files

**Variable**: `--glass-accent-info-border`

**Definitions**:

- `hsl(var(--glass-color-info) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `hsl(var(--glass-color-info) / var(--glass-opacity-40))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-overlay-bg has 2 different values across 2 files

**Variable**: `--glass-overlay-bg`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-70))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-50))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-overlay-bg-subtle has 2 different values across 2 files

**Variable**: `--glass-overlay-bg-subtle`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-50))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-30))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-overlay-bg-strong has 2 different values across 2 files

**Variable**: `--glass-overlay-bg-strong`

**Definitions**:

- `rgba(var(--glass-color-black) / var(--glass-opacity-90))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-black) / var(--glass-opacity-70))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-backdrop-brightness has 2 different values across 3 files

**Variable**: `--glass-backdrop-brightness`

**Definitions**:

- `brightness(1.1)` in `styles/themes/dark.css`
- `brightness(1.05)` in `styles/themes/light.css`
- `brightness(1.1)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-backdrop-contrast has 2 different values across 3 files

**Variable**: `--glass-backdrop-contrast`

**Definitions**:

- `contrast(1.05)` in `styles/themes/dark.css`
- `contrast(0.95)` in `styles/themes/light.css`
- `contrast(1.05)` in `styles/tokens.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-gradient-default has 2 different values across 2 files

**Variable**: `--glass-gradient-default`

**Definitions**:

- `linear-gradient(135deg,
    rgba(var(--glass-color-white) / var(--glass-opacity-25)) 0%,
    rgba(var(--glass-color-white) / var(--glass-opacity-15)) 50%,
    rgba(var(--glass-color-white) / var(--glass-opacity-10)) 100%)` in `styles/themes/dark.css`
- `linear-gradient(135deg,
    rgba(var(--glass-color-white) / var(--glass-opacity-60)) 0%,
    rgba(var(--glass-color-white) / var(--glass-opacity-40)) 50%,
    rgba(var(--glass-color-white) / var(--glass-opacity-30)) 100%)` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-gradient-subtle has 2 different values across 2 files

**Variable**: `--glass-gradient-subtle`

**Definitions**:

- `linear-gradient(135deg,
    rgba(var(--glass-color-white) / var(--glass-opacity-15)) 0%,
    rgba(var(--glass-color-white) / var(--glass-opacity-10)) 50%,
    rgba(var(--glass-color-white) / var(--glass-opacity-5)) 100%)` in `styles/themes/dark.css`
- `linear-gradient(135deg,
    rgba(var(--glass-color-white) / var(--glass-opacity-45)) 0%,
    rgba(var(--glass-color-white) / var(--glass-opacity-30)) 50%,
    rgba(var(--glass-color-white) / var(--glass-opacity-20)) 100%)` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-gradient-strong has 2 different values across 2 files

**Variable**: `--glass-gradient-strong`

**Definitions**:

- `linear-gradient(135deg,
    rgba(var(--glass-color-white) / var(--glass-opacity-35)) 0%,
    rgba(var(--glass-color-white) / var(--glass-opacity-25)) 50%,
    rgba(var(--glass-color-white) / var(--glass-opacity-20)) 100%)` in `styles/themes/dark.css`
- `linear-gradient(135deg,
    rgba(var(--glass-color-white) / var(--glass-opacity-80)) 0%,
    rgba(var(--glass-color-white) / var(--glass-opacity-60)) 50%,
    rgba(var(--glass-color-white) / var(--glass-opacity-50)) 100%)` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-specular-color has 2 different values across 2 files

**Variable**: `--glass-specular-color`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-30))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-60))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-specular-intensity has 2 different values across 2 files

**Variable**: `--glass-specular-intensity`

**Definitions**:

- `var(--glass-opacity-15)` in `styles/themes/dark.css`
- `var(--glass-opacity-25)` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-edge-color has 2 different values across 2 files

**Variable**: `--glass-edge-color`

**Definitions**:

- `rgba(var(--glass-color-white) / var(--glass-opacity-25))` in `styles/themes/dark.css`
- `rgba(var(--glass-color-white) / var(--glass-opacity-40))` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-edge-blur has 2 different values across 2 files

**Variable**: `--glass-edge-blur`

**Definitions**:

- `18px` in `styles/themes/dark.css`
- `12px` in `styles/themes/light.css`

---

### CSS_VARIABLE_CONFLICT - high

CSS variable --glass-state-disabled-opacity has 2 different values across 2 files

**Variable**: `--glass-state-disabled-opacity`

**Definitions**:

- `var(--glass-opacity-40)` in `styles/themes/dark.css`
- `var(--glass-opacity-50)` in `styles/themes/light.css`

---

### DUPLICATE_CLASS - medium

Class .glass-glow is defined in 2 different files

**Class**: `.glass-glow`

**Files**:

- `styles/animations.css`
- `styles/glass.css`

---

### DUPLICATE_CLASS - medium

Class .glass-border is defined in 2 different files

**Class**: `.glass-border`

**Files**:

- `styles/glass.css`
- `styles/theme-transitions.css`

---

### DUPLICATE_CLASS - medium

Class .glass-text-primary is defined in 2 different files

**Class**: `.glass-text-primary`

**Files**:

- `styles/glass.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-text-secondary is defined in 2 different files

**Class**: `.glass-text-secondary`

**Files**:

- `styles/glass.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-text-tertiary is defined in 2 different files

**Class**: `.glass-text-tertiary`

**Files**:

- `styles/glass.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-text-disabled is defined in 2 different files

**Class**: `.glass-text-disabled`

**Files**:

- `styles/glass.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-button is defined in 2 different files

**Class**: `.glass-button`

**Files**:

- `styles/glass.css`
- `styles/premium-typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-input is defined in 2 different files

**Class**: `.glass-input`

**Files**:

- `styles/glass.css`
- `styles/premium-typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-heading is defined in 3 different files

**Class**: `.glass-heading`

**Files**:

- `styles/premium-typography.css`
- `styles/storybook-enhancements.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-subheading is defined in 2 different files

**Class**: `.glass-subheading`

**Files**:

- `styles/premium-typography.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-body is defined in 2 different files

**Class**: `.glass-body`

**Files**:

- `styles/premium-typography.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .glass-caption is defined in 2 different files

**Class**: `.glass-caption`

**Files**:

- `styles/premium-typography.css`
- `styles/typography.css`

---

### DUPLICATE_CLASS - medium

Class .text-2xl is defined in 2 different files

**Class**: `.text-2xl`

**Files**:

- `styles/storybook-enhancements.css`
- `styles/storybook-utility-shim.css`

---

