# Button Spacing Guide for Intelligence Pages

This guide shows how to add proper padding to push down button sections on your trending intelligence and latest pages using AuraGlass glassmorphism styling.

## Key CSS Classes for Spacing

### Margin Top (Push Down from Above)
```css
.glass-mt-6   /* 24px top margin - good for regular spacing */
.glass-mt-8   /* 32px top margin - recommended for button sections */
.glass-mt-10  /* 40px top margin - more dramatic spacing */
.glass-mt-12  /* 48px top margin - maximum recommended */
```

### Margin Bottom (Space Below)
```css
.glass-mb-6   /* 24px bottom margin - good for regular spacing */
.glass-mb-8   /* 32px bottom margin - recommended for button sections */
```

### Padding (Internal Spacing)
```css
.glass-p-6    /* 24px padding - good for button containers */
.glass-pt-8   /* 32px top padding only */
.glass-py-8   /* 32px vertical padding (top & bottom) */
```

## Solution for Trending Intelligence Page

### HTML Structure
```html
<!-- Main hero section -->
<div class="hero-section">
  <h1>Trending Intelligence</h1>
  <p>Real-time tracking...</p>
</div>

<!-- Navigation buttons with proper spacing -->
<div class="glass-mt-8 glass-mb-6">
  <div class="glass-p-6 glass-radius-xl glass glass-elev-1">
    <div class="flex flex-wrap items-center gap-4 justify-center">
      <button class="glass-button">📈 Trending Stories</button>
      <button class="glass-button">🔥 Hot Topics</button>
      <button class="glass-button">⭐ Rising Entities</button>
      <button class="glass-button">🌐 Story Clusters</button>
    </div>
  </div>
</div>
```

### CSS Classes Applied
- `glass-mt-8`: Adds 32px margin-top to push buttons down from hero section
- `glass-mb-6`: Adds 24px margin-bottom for spacing before content
- `glass-p-6`: Adds 24px internal padding around button group
- `glass-radius-xl`: Glassmorphism rounded corners
- `glass-elev-1`: Glass elevation/shadow effect

## Solution for Latest Page

### HTML Structure
```html
<!-- Main hero section -->
<div class="hero-section">
  <h1>Latest Intelligence</h1>
  <p>Real-time news across...</p>
</div>

<!-- Filter buttons with proper spacing -->
<div class="glass-mt-8 glass-mb-6">
  <div class="glass-p-6 glass-radius-xl glass glass-elev-1">
    <div class="flex flex-wrap items-center gap-3 justify-center">
      <span class="glass-text-sm text-white/70">Filter by:</span>
      <button class="glass-button glass-surface-primary">All Categories</button>
      <button class="glass-button">AI</button>
      <button class="glass-button">MARKETS</button>
      <button class="glass-button">CLIMATE</button>
      <button class="glass-button">GEOPOLITICS</button>
      <button class="glass-button">HEALTH</button>
    </div>
  </div>
</div>
```

### CSS Classes Applied
- `glass-mt-8`: Adds 32px margin-top to push filter buttons down
- `glass-mb-6`: Adds 24px margin-bottom for spacing before content
- `glass-p-6`: Internal padding for the filter container
- `gap-3`: 12px gap between filter buttons

## Alternative Spacing Options

### More Dramatic Spacing (More Space Above)
```html
<div class="glass-mt-12 glass-mb-8">
  <!-- button container -->
</div>
```

### Tighter Spacing (Less Space)
```html
<div class="glass-mt-6 glass-mb-4">
  <!-- button container -->
</div>
```

### Custom Spacing (If you need specific values)
```css
.custom-button-spacing {
  margin-top: 40px;    /* Equivalent to glass-mt-10 */
  margin-bottom: 24px; /* Equivalent to glass-mb-6 */
}
```

## Implementation Steps

1. **Find your page components** (trending and latest pages)
2. **Locate the button container divs** 
3. **Add the spacing classes**:
   ```html
   <!-- Before -->
   <div class="button-container">
   
   <!-- After -->
   <div class="button-container glass-mt-8 glass-mb-6">
   ```

## React/JSX Implementation

If using React components:

```jsx
// Trending Intelligence Page
<div className="glass-mt-8 glass-mb-6">
  <OptimizedGlass
    elevation="level1"
    className="glass-p-6 glass-radius-xl"
  >
    <div className="flex flex-wrap items-center gap-4 justify-center">
      <GlassButton>📈 Trending Stories</GlassButton>
      <GlassButton>🔥 Hot Topics</GlassButton>
      <GlassButton>⭐ Rising Entities</GlassButton>
      <GlassButton>🌐 Story Clusters</GlassButton>
    </div>
  </OptimizedGlass>
</div>

// Latest Page  
<div className="glass-mt-8 glass-mb-6">
  <OptimizedGlass
    elevation="level1"
    className="glass-p-6 glass-radius-xl"
  >
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <span className="glass-text-sm text-white/70">Filter by:</span>
      <GlassButton variant="primary">All Categories</GlassButton>
      <GlassButton>AI</GlassButton>
      <GlassButton>MARKETS</GlassButton>
      <GlassButton>CLIMATE</GlassButton>
      <GlassButton>GEOPOLITICS</GlassButton>
      <GlassButton>HEALTH</GlassButton>
    </div>
  </OptimizedGlass>
</div>
```

## Visual Result

The spacing will create a clear visual separation:
- **Hero section** (title + description)
- **32px gap** ⬇️
- **Button section** (with internal padding)  
- **24px gap** ⬇️
- **Content area**

This creates the professional, spacious layout you're looking for while maintaining the glassmorphism aesthetic.
