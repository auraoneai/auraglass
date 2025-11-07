# AuraGlass Documentation

## Overview

Welcome to the comprehensive AuraGlass documentation. This design system provides a complete glassmorphism component library with token-first architecture and production-ready components.

## 🚀 Quick Start

### Installation & Setup
```bash
# Install AuraGlass
npm install @aura/aura-glass

# Run initial setup and validation
npm run glass:full-check

# Start development with live validation
npm run dev
```

### 🏭 Production AI Deployment (NEW!)
```bash
# Configure API keys
cp .env.example .env
# Add: OPENAI_API_KEY, PINECONE_API_KEY, JWT_SECRET

# Quick deployment
npm install --legacy-peer-deps
./scripts/deploy.sh

# Or use Docker
docker-compose up -d
```

### Basic Usage
```tsx
import { OptimizedGlass, GlassButton, GlassCard } from '@aura/aura-glass';
import '@aura/aura-glass/styles/tokens.css';
import '@aura/aura-glass/styles/glass.css';

function App() {
  return (
    <OptimizedGlass elevation="level2" className="glass-p-6">
      <GlassCard>
        <h1>Welcome to AuraGlass</h1>
        <GlassButton variant="primary">Get Started</GlassButton>
      </GlassCard>
    </OptimizedGlass>
  );
}
```

## 📚 Core Documentation

### 🎯 Essential Guides
| Guide | Purpose | When to Read |
|-------|---------|--------------|
| **[Component Standards](./guides/component-standards.md)** | Learn proper usage patterns for all components | Before building components |
| **[Glass Utilities Guide](./utilities/glass-utilities.md)** | Complete reference for glass utilities vs Tailwind | When styling with utilities |
| **[Design Token Reference](./tokens/design-tokens.md)** | All design tokens and their usage patterns | When customizing or theming |
| **[Elevation Guidelines](./guides/elevation-guidelines.md)** | Semantic elevation system with visual hierarchy | When implementing shadows |

### 🔧 Implementation & Enforcement
| Guide | Purpose | When to Read |
|-------|---------|--------------|
| **[Design System Enforcement](./guides/design-system-enforcement.md)** | Automated tools that maintain 100/100 score | Setting up development workflow |
| **[Migration Guide](./guides/migration.md)** | Migrate from raw values to token-first system | Upgrading existing projects |
| **[Button Spacing Guide](./guides/button-spacing.md)** | Specific spacing patterns for buttons and layouts | When implementing button layouts |
| **[Accessibility Guide](./guides/accessibility.md)** | WCAG compliance and accessibility patterns | When ensuring inclusive design |
| **[AI-Powered Components](./ai/ai-components.md)** | Complete guide to 15 production-ready AI-powered systems | When implementing AI features |
| **[Production AI Infrastructure](./ai/production-infrastructure.md)** | Real AI service integrations with OpenAI, Pinecone, Google Vision | When deploying to production |

## 🎨 Design System Architecture

### Token-First Approach
AuraGlass uses a comprehensive design token system:

```css
/* ❌ Old way: Hardcoded values */
.component {
  backdrop-filter: blur(16px);
  background: rgba(255,255,255,0.1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.16);
}

/* ✅ New way: Token-based */
.component {
  backdrop-filter: blur(var(--glass-blur-lg));
  background: rgba(var(--glass-color-white) / var(--glass-opacity-10));
  box-shadow: var(--glass-elev-2);
}
```

### Semantic Elevation System
Use meaningful elevation levels instead of arbitrary values:

| Level | Purpose | Components | Token |
|-------|---------|------------|-------|
| level0 | Flat surfaces | Disabled buttons, backgrounds | `--glass-elev-0` |
| level1 | Subtle elements | Badges, chips, skeletons | `--glass-elev-1` |
| level2 | Interactive elements | Buttons, cards, inputs | `--glass-elev-2` |
| level3 | Overlay elements | Dropdowns, popovers | `--glass-elev-3` |
| level4 | Floating elements | FABs, tooltips, toasts | `--glass-elev-4` |
| level5 | Top-level overlays | Modals, headers | `--glass-elev-5` |
| level6 | Maximum elevation | Fullscreen overlays, alerts | `--glass-elev-6` |

### Glass Utilities vs Tailwind
AuraGlass extends Tailwind with glass-specific utilities:

```html
<!-- Tailwind: Generic utilities -->
<div class="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4">

<!-- AuraGlass: Glass-specific utilities -->
<div class="glass glass-elev-level2 glass-p-4 glass-radius-lg">
```



## 🎭 Component Patterns

### Standard Button Pattern
```tsx
<GlassButton
  variant="primary"          // primary | secondary | ghost | danger
  size="md"                  // sm | md | lg
  elevation="level2"         // Semantic elevation
  className="glass-focus"    // Required for accessibility
  disabled={isDisabled}
  onClick={handleClick}
  aria-label="Descriptive label"
>
  Button Text
</GlassButton>
```

### Interactive Card Pattern
```tsx
<GlassCard
  elevation="level2"
  className="glass-focus glass-cursor-pointer glass-p-6"
  onClick={handleCardClick}
  role="button"              // Required for clickable cards
  tabIndex={0}               // Keyboard navigation
  onKeyDown={handleKeyDown}  // Handle keyboard events
  aria-label="Open item details"
>
  <GlassCard.Header>
    <h3 className="glass-text-lg glass-font-semibold">Card Title</h3>
  </GlassCard.Header>
  <GlassCard.Content>
    Card content goes here
  </GlassCard.Content>
</GlassCard>
```

### Modal Pattern
```tsx
<GlassModal
  open={isOpen}
  onClose={handleClose}
  elevation="level5"         // Top-level overlays use level5
  backdrop="blur"
  closeOnBackdropClick={true}
  aria-labelledby="modal-title"
>
  <GlassModal.Header>
    <h2 id="modal-title">Modal Title</h2>
  </GlassModal.Header>
  <GlassModal.Content>
    Modal content
  </GlassModal.Content>
  <GlassModal.Footer>
    <GlassButton variant="secondary" onClick={handleClose}>
      Cancel
    </GlassButton>
    <GlassButton variant="primary" onClick={handleConfirm}>
      Confirm
    </GlassButton>
  </GlassModal.Footer>
</GlassModal>
```

## ♿ Accessibility Standards

### Required Attributes
All interactive elements must include:

```tsx
// Interactive button
<GlassButton
  className="glass-focus"           // Focus styles
  aria-label="Descriptive label"   // Screen reader label
  onClick={handleClick}
>
  Button
</GlassButton>

// Interactive div (use button instead when possible)
<div
  className="glass-focus glass-touch-target"
  role="button"                     // Semantic role
  tabIndex={0}                      // Keyboard navigation
  aria-label="Descriptive label"
  onClick={handleClick}
  onKeyDown={handleKeyDown}         // Keyboard handling
>
  Interactive content
</div>

// Form field
<GlassInput
  id="field-id"                     // Unique ID
  label="Field Label"               // Associated label
  aria-describedby="field-help"     // Helper text reference
  aria-invalid={hasError}           // Error state
  required={isRequired}
/>
```

### Focus Management
```css
.glass-focus:focus-visible {
  outline: var(--glass-focus-width) solid var(--glass-focus-color-primary);
  outline-offset: var(--glass-focus-offset);
}
```

## 🎬 Motion & Animation

### Glass Animations
```css
.glass-animate-float     /* Subtle floating animation */
.glass-animate-shimmer   /* Light sweep effect */
.glass-animate-ambient   /* Breathing opacity effect */
.glass-animate-press     /* Click feedback animation */
.glass-animate-pulse     /* Loading pulse */
```

### Reduced Motion Support
All animations automatically respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .glass-animate-float {
    animation: none !important;
  }
}
```

## 🔄 Migration Workflow

### From Raw Values to Tokens
1. **Install latest version**
   ```bash
   npm install @aura/aura-glass@latest
   ```

2. **Run automated migration**
   ```bash
   npm run codemod:all
   ```

3. **Validate results**
   ```bash
   npm run glass:full-check
   ```

4. **Fix any remaining issues**
   ```bash
   npm run lint:tokens
   npm run lint:styles
   ```

### Common Migrations
```tsx
// Before: Hardcoded elevation
<OptimizedGlass elevation={2} />

// After: Semantic elevation  
<OptimizedGlass elevation="level2" />

// Before: Raw blur values
<div style={{ backdropFilter: 'blur(16px)' }} />

// After: Token-based blur
<div className="glass-blur-lg" />

// Before: Missing accessibility
<div onClick={handleClick}>Clickable</div>

// After: Proper accessibility
<button 
  onClick={handleClick}
  className="glass-focus"
  aria-label="Action description"
>
  Clickable
</button>
```


## 🆕 Recently Added (v2.0.3+)

### New Hooks & Utilities

#### Performance & Device Optimization
- **`useDeviceCapabilities`** - React hook for device detection and capability assessment
  - Returns `{ deviceInfo, reload }` with complete device information
  - SSR-safe with proper initialization
  - Automatically detects performance tier, GPU capabilities, and input methods

- **`useEnhancedReducedMotion`** - Enhanced reduced motion preference detection
  - SSR-safe with lazy initialization
  - Reactive updates when user changes system preferences
  - Fully documented with JSDoc and usage examples

- **`useQualityTier`** - Chart quality tier management for optimal performance
  - Automatically adjusts chart rendering based on device capabilities
  - Returns current quality tier ('low' | 'medium' | 'high' | 'ultra')

- **`getQualityBasedPhysicsParams`** - Get optimal physics parameters for device
- **`getQualityBasedGlassParams`** - Get optimal glass effect parameters for device

#### Theme & Animation Management
- **`useTheme`** - Access and control the current theme
- **`useThemeVariant`** - Access specific theme variant (light/dark/auto)
- **`useThemeProviderPresence`** - Check if ThemeProvider is available
- **`AnimationProvider`** - Context provider for animation configuration
- **`useAnimation`** - Access animation context and global animation controls

#### Chart Interactions
- **`useChartPhysicsInteraction`** - Physics-based zoom/pan for Chart.js charts
  - Complete implementation with scale manipulation
  - Configurable zoom bounds and pan modes ('x', 'y', 'xy')
  - Inertia-based smooth interactions
  - Respects reduced motion preferences

#### 3D & Spatial Animations
- **`useZSpaceAnimation`** - Z-space layer management and 3D animations
- **`useParallaxZSpace`** - Parallax effects with mouse/scroll tracking
- **`useCardStackZSpace`** - 3D card stacking with hover interactions
- **`useDepthNavigation`** - Depth-based navigation system

#### Accessible Animations
- **`prefersReducedMotion`** - SSR-safe reduced motion detection
- **`createAccessibleAnimation`** - Create animations respecting user preferences
- Automatic reduced motion support across all components

### New Type Exports

All component types are now properly exported for TypeScript users:

```tsx
import type {
  GlassCardProps,
  DateRange,
  ChartDataset,
  ColumnDefinition,
  SortState,
  MultiSelectOption,
  Step,
  MasonryItem,
  ChartQualityTier,
  PhysicsParams,
} from '@aura/aura-glass';
```

### Usage Examples

```tsx
import {
  useDeviceCapabilities,
  useEnhancedReducedMotion,
  useChartPhysicsInteraction,
  useZSpaceAnimation,
  useTheme,
  AnimationProvider,
  getQualityBasedPhysicsParams,
} from '@aura/aura-glass';

function MyComponent() {
  // Device optimization
  const { deviceInfo, reload } = useDeviceCapabilities();
  const prefersReducedMotion = useEnhancedReducedMotion();

  // Chart interactions
  const chartRef = useRef(null);
  const wrapperRef = useRef(null);
  const { isPanning, zoomLevel, resetZoom } = useChartPhysicsInteraction(
    chartRef,
    wrapperRef,
    { enabled: true, mode: 'xy' }
  );

  // Quality optimization
  const qualityTier = deviceInfo.performance.tier;
  const physicsParams = getQualityBasedPhysicsParams(qualityTier);

  // Theme management
  const { currentTheme, setTheme } = useTheme();

  return (
    <AnimationProvider config={{ duration: prefersReducedMotion ? 0 : 300 }}>
      {/* Your components */}
    </AnimationProvider>
  );
}
```

## 🌟 Advanced Features

### 🤖 AI-Powered Component Systems

AuraGlass includes production-ready AI-powered systems with real API integrations:

#### **🤖 Smart Form Builder**
- **AI-Assisted Validation**: Intelligent field validation with contextual error messages
- **Field Suggestions**: AI recommends optimal field types and configurations
- **Accessibility Scoring**: Real-time WCAG compliance scoring and optimization
- **Auto-Layout**: Intelligent form layout generation based on field relationships

#### **👥 Real-Time Collaboration System**
- **Live Cursors**: Real-time collaborative cursor tracking with user identification
- **WebSocket Infrastructure**: Complete collaboration backend with conflict resolution
- **Comment System**: Contextual commenting with replies and resolution tracking
- **Multi-User Editing**: Simultaneous editing with operational transformation

#### **🔍 Intelligent Search Interface**
- **NLP Processing**: Natural language query understanding with intent detection
- **Entity Extraction**: Smart extraction of entities, dates, and keywords from queries
- **Voice Recognition**: Hands-free voice search with wake word detection
- **Smart Filters**: AI-powered filter suggestions based on search patterns

#### **📊 Advanced Data Visualization**
- **Interactive Drill-Down**: Deep data exploration with progressive disclosure
- **SVG Rendering**: High-performance charts with zoom, pan, and export capabilities
- **Real-Time Updates**: Live data synchronization with smooth animations
- **Smart Insights**: AI-powered data insights and trend detection

#### **🏗️ Content Management System**
- **Drag-and-Drop Builder**: Visual page builder with component library
- **Layout Intelligence**: AI-suggested layouts based on content type
- **Component Management**: Reusable component system with version control
- **Visual Editor**: WYSIWYG editor with real-time preview

#### **🎬 Media Processing Suite**
- **AI Transcription**: Automatic speech-to-text with speaker identification
- **Smart Chapters**: Automatic chapter detection and navigation
- **Playlist Management**: Intelligent playlist generation and management
- **Audio Visualization**: Real-time audio waveforms and spectrum analysis

#### **🛒 E-commerce Components**
- **AI Recommendations**: Machine learning-powered product recommendations
- **Smart Cart**: Intelligent cart optimization with pricing algorithms
- **Inventory Analytics**: Real-time inventory tracking and demand forecasting
- **Customer Insights**: Advanced analytics dashboard with behavioral tracking

#### **🖼️ Intelligent Image Processing**
- **AI Optimization**: Automatic image compression and format optimization
- **Face Detection**: Smart face detection for automatic cropping and focus
- **Background Removal**: Professional background removal with edge refinement
- **Batch Processing**: Efficient processing of multiple images with progress tracking

### 🚀 Production AI Infrastructure

#### **Real AI Service Integrations**
- **OpenAI GPT-4**: Smart form generation, content summarization, semantic search
- **Pinecone Vector DB**: Production semantic search with embeddings
- **Google Vision API**: Face detection, OCR, object recognition
- **Remove.bg API**: Professional background removal
- **Redis Caching**: High-performance caching with fallback
- **Sentry Monitoring**: Comprehensive error tracking

#### **Enterprise Security**
- **JWT Authentication**: Secure token-based auth with refresh tokens
- **Role-Based Access**: User, Developer, Admin roles with permissions
- **API Key Management**: Secure API key generation and validation
- **Rate Limiting**: Configurable limits for all AI endpoints
- **Input Sanitization**: Protection against prompt injection

#### **Production Infrastructure**
- **WebSocket Server**: Real-time collaboration with Socket.io
- **Docker Deployment**: Complete containerization
- **Nginx Reverse Proxy**: Load balancing and SSL
- **PM2 Process Management**: Auto-restart and monitoring
- **Kubernetes Ready**: Helm charts and configs

#### **Cost Optimization**
- **Intelligent Model Selection**: Automatic cheaper model selection
- **Request Batching**: Efficient API usage
- **Smart Caching**: LRU cache with TTL
- **Fallback Mechanisms**: Graceful degradation
- **Usage Analytics**: API consumption tracking

### Token-First Architecture
- **4px Grid System**: Consistent spacing throughout
- **Semantic Elevation**: 7 levels of visual hierarchy
- **Glass Utilities**: 100+ utility classes
- **Motion System**: Animations with reduced motion support
- **Accessibility First**: WCAG compliance built-in

## 🎯 Best Practices

### DO ✅
- Use semantic elevation (`elevation="level2"`)
- Apply glass utilities (`glass-p-4`, `glass-radius-lg`)
- Include focus management (`className="glass-focus"`)
- Run validation before commits (`npm run glass:full-check`)
- Follow component patterns from the documentation

### DON'T ❌
- Use hardcoded values (`backdrop-filter: blur(16px)`)
- Mix numeric and semantic formats (`elevation={2}`)
- Skip accessibility attributes
- Ignore linting violations
- Use arbitrary elevation levels

## 📞 Getting Help

### Resources
- **[Storybook](http://localhost:6006)**: Interactive component explorer
- **[GitHub Issues](https://github.com/auraone/aura-glass/issues)**: Report bugs and request features
- **[Discord Community](https://discord.gg/auraglass)**: Community support and discussions

### Common Issues
- **Low Design System Score**: Run `npm run glass:full-check` for detailed violations
- **Migration Problems**: Check the [Migration Guide](./guides/migration.md)
- **Accessibility Issues**: Review [Accessibility Guide](./guides/accessibility.md)
- **Elevation Confusion**: Reference [Elevation Guidelines](./guides/elevation-guidelines.md)


---

**Welcome to the future of glassmorphism design systems!** 🌟
