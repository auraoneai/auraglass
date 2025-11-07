# AuraGlass Token Migration Guide

## 🎯 **Overview**

This guide provides comprehensive mapping from hardcoded Tailwind classes to AuraGlass design tokens, documenting the completed systematic migration of all 341 components achieving 100% token compliance.

## 🔄 **Migration Mapping**

### **Background & Surface Styles**

#### **Background Colors**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `bg-white/10` | `glass-surface-primary` | Primary backgrounds |
| `bg-black/50` | `glass-surface-overlay` | Modal overlays |
| `bg-gray-100` | `glass-surface-secondary` | Secondary backgrounds |
| `bg-blue-500` | `glass-surface-accent` | Accent backgrounds |
| `bg-red-500` | `glass-surface-danger` | Error states |
| `bg-green-500` | `glass-surface-success` | Success states |
| `bg-yellow-500` | `glass-surface-warning` | Warning states |

#### **Backdrop Effects**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `backdrop-blur-sm` | `glass-blur-sm` | Subtle blur |
| `backdrop-blur-md` | `glass-blur-md` | Medium blur |
| `backdrop-blur-lg` | `glass-blur-lg` | Strong blur |
| `backdrop-blur-xl` | `glass-blur-xl` | Maximum blur |
| Combined bg + blur | `glass-foundation-complete` | Complete glass effect |

### **Text & Typography**

#### **Text Colors**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `text-white` | `glass-text-primary` | Primary text |
| `text-white/80` | `glass-text-secondary` | Secondary text |
| `text-white/60` | `glass-text-muted` | Muted text |
| `text-gray-900` | `glass-text-primary-dark` | Dark theme primary |
| `text-red-500` | `glass-text-danger` | Error text |
| `text-green-500` | `glass-text-success` | Success text |
| `text-blue-500` | `glass-text-accent` | Accent text |

#### **Typography Scale**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `text-xs` | `glass-text-xs` | Extra small text |
| `text-sm` | `glass-text-sm` | Small text |
| `text-base` | `glass-text-base` | Base text size |
| `text-lg` | `glass-text-lg` | Large text |
| `text-xl` | `glass-text-xl` | Extra large text |
| `text-2xl` | `glass-text-2xl` | 2X large text |

#### **Font Weights**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `font-normal` | `glass-font-normal` | Normal weight |
| `font-medium` | `glass-font-medium` | Medium weight |
| `font-semibold` | `glass-font-semibold` | Semibold weight |
| `font-bold` | `glass-font-bold` | Bold weight |

### **Spacing & Layout**

#### **Padding**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `p-1` | `glass-p-xs` | Extra small padding |
| `p-2` | `glass-p-sm` | Small padding |
| `p-4` | `glass-p-md` | Medium padding |
| `p-6` | `glass-p-lg` | Large padding |
| `p-8` | `glass-p-xl` | Extra large padding |
| `px-4` | `glass-px-md` | Horizontal padding |
| `py-2` | `glass-py-sm` | Vertical padding |

#### **Margin**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `m-1` | `glass-m-xs` | Extra small margin |
| `m-2` | `glass-m-sm` | Small margin |
| `m-4` | `glass-m-md` | Medium margin |
| `m-6` | `glass-m-lg` | Large margin |
| `mx-auto` | `glass-mx-auto` | Centered element |
| `mb-4` | `glass-mb-md` | Bottom margin |

#### **Spacing Between Elements**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `space-x-2` | `glass-space-x-sm` | Horizontal spacing |
| `space-x-4` | `glass-space-x-md` | Medium horizontal spacing |
| `space-y-2` | `glass-space-y-sm` | Vertical spacing |
| `space-y-4` | `glass-space-y-md` | Medium vertical spacing |

### **Borders & Shape**

#### **Border Styles**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `border` | `glass-border` | Default border |
| `border-white/20` | `glass-border-subtle` | Subtle border |
| `border-white/40` | `glass-border-primary` | Primary border |
| `border-red-500` | `glass-border-danger` | Error border |
| `border-green-500` | `glass-border-success` | Success border |
| `border-2` | `glass-border-2` | Thick border |

#### **Border Radius**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `rounded` | `glass-radius` | Default radius |
| `rounded-sm` | `glass-radius-sm` | Small radius |
| `rounded-md` | `glass-radius-md` | Medium radius |
| `rounded-lg` | `glass-radius-lg` | Large radius |
| `rounded-xl` | `glass-radius-xl` | Extra large radius |
| `rounded-full` | `glass-radius-full` | Full/circle radius |

### **Positioning & Layout**

#### **Position**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `absolute` | `glass-position-absolute` | Absolute positioning |
| `relative` | `glass-position-relative` | Relative positioning |
| `fixed` | `glass-position-fixed` | Fixed positioning |
| `inset-0` | `glass-inset-0` | Full coverage |

#### **Display & Flexbox**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `flex` | `glass-flex` | Flexbox container |
| `inline-flex` | `glass-inline-flex` | Inline flex |
| `grid` | `glass-grid` | Grid container |
| `block` | `glass-display-block` | Block display |
| `items-center` | `glass-items-center` | Center items |
| `justify-center` | `glass-justify-center` | Center justify |
| `justify-between` | `glass-justify-between` | Space between |

#### **Sizing**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `w-4` | `glass-w-4` | Width 1rem |
| `w-full` | `glass-w-full` | Full width |
| `h-4` | `glass-h-4` | Height 1rem |
| `h-full` | `glass-h-full` | Full height |
| `max-w-md` | `glass-max-w-md` | Max width medium |
| `min-h-screen` | `glass-min-h-screen` | Minimum screen height |

### **Interactive States**

#### **Focus States**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `focus:outline-none` | `glass-focus` | Focus management |
| `focus:ring-2` | `glass-focus-ring` | Focus ring |
| `focus-visible:outline` | `glass-focus-visible` | Visible focus only |

#### **Hover States**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `hover:bg-white/10` | `glass-hover-surface` | Hover background |
| `hover:scale-105` | `glass-hover-scale` | Hover scale |
| `hover:shadow-lg` | `glass-hover-shadow` | Hover shadow |

#### **Transitions**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `transition-all` | `glass-transition` | All properties |
| `transition-colors` | `glass-transition-colors` | Color transitions |
| `duration-300` | `glass-duration-300` | 300ms duration |

### **Effects & Shadows**

#### **Box Shadows**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `shadow-sm` | `glass-shadow-sm` | Small shadow |
| `shadow-md` | `glass-shadow-md` | Medium shadow |
| `shadow-lg` | `glass-shadow-lg` | Large shadow |
| `shadow-xl` | `glass-shadow-xl` | Extra large shadow |
| `shadow-2xl` | `glass-shadow-2xl` | 2X large shadow |

#### **Opacity**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `opacity-0` | `glass-opacity-0` | Invisible |
| `opacity-50` | `glass-opacity-50` | Half opacity |
| `opacity-75` | `glass-opacity-75` | 75% opacity |
| `opacity-100` | `glass-opacity-100` | Full opacity |

### **Animations**
| Hardcoded Style | Glass Token | Usage |
|-----------------|-------------|--------|
| `animate-pulse` | `glass-animate-pulse` | Pulse animation |
| `animate-spin` | `glass-animate-spin` | Spin animation |
| `animate-bounce` | `glass-animate-bounce` | Bounce animation |

## 🛠️ **Migration Examples**

### **Example 1: Button Component**
```tsx
// ❌ Before: Hardcoded styles
<button 
  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
>
  Click me
</button>

// ✅ After: Glass tokens
<button 
  className={cn(
    "glass-px-md glass-py-sm glass-surface-primary glass-text-primary-contrast",
    "glass-radius-lg glass-hover-surface glass-focus glass-transition"
  )}
>
  Click me
</button>
```

### **Example 2: Card Component**
```tsx
// ❌ Before: Hardcoded styles
<div className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg">
  <h2 className="text-xl font-semibold text-white mb-4">Card Title</h2>
  <p className="text-white/80">Card content goes here.</p>
</div>

// ✅ After: Glass tokens
<div className={cn(
  "glass-p-lg glass-foundation-complete glass-border-subtle",
  "glass-radius-xl glass-shadow-lg"
)}>
  <h2 className={cn("glass-text-xl glass-font-semibold glass-text-primary glass-mb-md")}>
    Card Title
  </h2>
  <p className={cn("glass-text-secondary")}>
    Card content goes here.
  </p>
</div>
```

### **Example 3: Modal Component**
```tsx
// ❌ Before: Hardcoded styles
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-md w-full">
    <h3 className="text-lg font-medium text-white mb-4">Modal Title</h3>
    <p className="text-white/70 mb-6">Modal content</p>
    <div className="flex space-x-3 justify-end">
      <button className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10">
        Cancel
      </button>
      <button className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600">
        Confirm
      </button>
    </div>
  </div>
</div>

// ✅ After: Glass tokens
<div className={cn(
  "glass-position-fixed glass-inset-0 glass-surface-overlay glass-z-50",
  "glass-flex glass-items-center glass-justify-center glass-p-md"
)}>
  <div className={cn(
    "glass-foundation-complete glass-border-subtle glass-radius-xl",
    "glass-p-lg glass-max-w-md glass-w-full"
  )}>
    <h3 className={cn("glass-text-lg glass-font-medium glass-text-primary glass-mb-md")}>
      Modal Title
    </h3>
    <p className={cn("glass-text-secondary glass-mb-lg")}>
      Modal content
    </p>
    <div className={cn("glass-flex glass-space-x-sm glass-justify-end")}>
      <button className={cn(
        "glass-px-md glass-py-sm glass-border-subtle glass-radius-lg",
        "glass-text-primary glass-hover-surface"
      )}>
        Cancel
      </button>
      <button className={cn(
        "glass-px-md glass-py-sm glass-surface-primary glass-radius-lg",
        "glass-text-primary-contrast glass-hover-surface"
      )}>
        Confirm
      </button>
    </div>
  </div>
</div>
```

## 📋 **Migration Checklist**

### **Pre-Migration Analysis** ☐
- [ ] Identify all hardcoded Tailwind classes
- [ ] Map each class to appropriate glass token
- [ ] Check for missing cn utility import
- [ ] Document current component behavior

### **Style Migration** ☐
- [ ] Add cn utility import
- [ ] Replace background/surface styles
- [ ] Update text and typography
- [ ] Convert spacing and layout
- [ ] Update borders and shapes
- [ ] Handle interactive states

### **Quality Validation** ☐
- [ ] Test component functionality
- [ ] Verify visual consistency
- [ ] Run token compliance check
- [ ] Validate accessibility
- [ ] Update documentation

## 🚨 **Common Migration Challenges**

### **Challenge 1: Complex Conditional Styling**
```tsx
// Problem: Complex string interpolation
className={`p-4 ${variant === 'primary' ? 'bg-blue-500 text-white' : variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-transparent'} ${size === 'lg' ? 'text-lg' : 'text-sm'}`}

// Solution: Structured cn approach
className={cn(
  "glass-p-md",
  variant === 'primary' && "glass-surface-primary glass-text-primary-contrast",
  variant === 'secondary' && "glass-surface-secondary glass-text-secondary-contrast",
  variant === 'ghost' && "glass-surface-transparent",
  size === 'lg' ? "glass-text-lg" : "glass-text-sm"
)}
```

### **Challenge 2: Missing Glass Token Equivalent**
```tsx
// Problem: No direct glass token equivalent
className="bg-gradient-to-r from-purple-500 to-pink-500"

// Solution: Use CSS custom properties or create new token
className={cn("glass-gradient-purple-pink")}
// OR
style={{ background: 'linear-gradient(to right, var(--glass-color-purple), var(--glass-color-pink))' }}
```

### **Challenge 3: Animation Conflicts**
```tsx
// Problem: Animation not working with tokens
className="animate-pulse hover:animate-none"

// Solution: Use glass animation tokens
className={cn("glass-animate-pulse hover:glass-animate-none")}
```

## 🎯 **Migration Success Metrics**

### **Before Migration**
- Hardcoded styles present
- No cn utility usage
- Inconsistent styling patterns
- Lower design system score

### **After Migration**
- 100% glass token usage
- Proper cn utility implementation
- Consistent styling patterns
- Perfect design system score

## 📚 **Additional Resources**

- **[Design Token Reference](../tokens/design-tokens.md)** - Complete token documentation
- **[Component Standards](../guides/component-standards.md)** - Usage guidelines
- **[Enhancement Methodology](./enhancement-methodology.md)** - Detailed process guide
- **[Quality Validation](../testing/quality-validation.md)** - Testing standards

---

**This migration guide ensures systematic and consistent conversion of all hardcoded styles to glass design tokens, maintaining visual fidelity while achieving 100% token compliance across the AuraGlass component library.**
