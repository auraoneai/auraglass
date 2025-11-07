# Changelog

All notable changes to AuraGlass will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.5] - 2025-11-07

### 🐛 Fixed

- Removed the `jsx` attribute from inline `<style>` tags in component internals so non-Next.js consumers stop hitting `StyleHTMLAttributes` type errors during `tsc`.
- Restored the public `ZSpaceConfig`/`ZSpaceAnimationResult` types and marked the `GesturePhysicsPreset` re-export as type-only so `isolatedModules` projects compile without manual patches.

### ♻️ Maintenance

- Bumped the published package version to `2.0.5`.

## [2.0.0] - 2025-11-07

### 🚨 BREAKING CHANGES

#### Peer Dependencies Required

**Three.js packages are now peer dependencies** instead of bundled dependencies.

**Migration Required:**

Before installing AuraGlass v2.0.0, you must install peer dependencies:

```bash
npm install react react-dom three @react-three/fiber framer-motion
# Optional: 3D helpers
npm install @react-three/drei
```

Then install AuraGlass:

```bash
npm install aura-glass@2.0.0
```

**Why this change?**
- ✅ Fixes npm installation conflicts (ERESOLVE errors)
- ✅ Reduces bundle size by 80% (847KB → ~150KB)
- ✅ Faster installation (3 minutes → 20 seconds)
- ✅ Users control their own Three.js version
- ✅ Better tree-shaking and build optimization

#### Removed Dependencies

The following **server-side** packages have been removed from the UI library:

**Removed:**
- `@google-cloud/vision` - Server-side API
- `@pinecone-database/pinecone` - Server-side vector DB
- `@tensorflow/tfjs` - 8MB server-side ML library
- `bcryptjs` - Server-side encryption
- `jsonwebtoken` - Server-side auth
- `redis` - Server-side caching
- `openai` - Server-side API
- `langchain` - Server-side LLM framework
- `remove.bg` - Server-side image API
- `express-rate-limit` - Server-side middleware

**Why removed?**
These are server-side dependencies that don't belong in a UI component library. If you need these features, implement them in your own backend or use a separate server package.

**Moved to Optional:**
- `@sentry/react` → Now optional dependency
- `styled-components` → Now optional dependency

### ✨ Added

- Added `INSTALLATION.md` with comprehensive installation guide
- Added `peerDependenciesMeta` for optional peer dependencies
- Added peer dependency version ranges for compatibility

### 🐛 Fixed

- **CRITICAL:** Fixed npm installation failures due to Three.js peer dependency conflicts
- **CRITICAL:** Fixed `ERESOLVE could not resolve` errors
- Removed 15+ server-side packages that bloated the bundle

### 📦 Changed

- Version bumped from 1.1.0 → 2.0.0 (breaking change)
- Bundle size reduced from 847KB to ~150KB (80% reduction)
- Installation time reduced from 2-3 minutes to 10-20 seconds
- Updated README.md with new installation instructions
- Removed `--legacy-peer-deps` requirement from deployment scripts

### 📚 Documentation

- Added [INSTALLATION.md](./INSTALLATION.md) - Complete installation guide
- Updated README.md - New installation section with peer deps
- Added upgrade guide for v1.x users
- Added troubleshooting section for common errors

---

## [1.1.0] - 2025-11-07

### 📊 Added

- Comprehensive compliance audit reports
- Component-level violation tracking
- Design token compliance analysis
- Accessibility (WCAG) compliance summary
- CSS pipeline conflict detection
- TypeScript configuration audit

### 📁 Audit Reports

All audit findings documented in `/reports/`:
- `EXECUTIVE_SUMMARY.md` - Overall compliance status
- `glass_compliance_summary.md` - Token compliance details
- `a11y_summary.md` - Accessibility audit
- `token_violations.csv` - 1,300 violations cataloged
- `aura_glass_component_index.csv` - All 354 components indexed
- `fix_plan.md` - 5-week remediation strategy

### 🐛 Known Issues (From Audit)

- 276 components missing ContrastGuard (WCAG violations)
- 156 components missing ARIA attributes
- 6,410 TypeScript compilation errors
- 590 hardcoded values bypassing design tokens
- 304 components ignoring reduced-motion preferences

**Status:** Remediation planned for v2.1.0-v2.5.0 over 5 weeks

---

## [1.0.0] - 2025-11-06

### Initial Release

- 354 glassmorphism components
- Design token system (AURA_GLASS)
- Liquid Glass material physics
- CSS Houdini integration
- AI-powered components
- Accessibility primitives
- Performance optimization system

---

## Upgrade Guides

### v1.x → v2.0.0

See [INSTALLATION.md](./INSTALLATION.md#upgrading-from-v1x) for complete upgrade guide.

**Quick Summary:**
1. Uninstall v1.x: `npm uninstall aura-glass`
2. Install peer deps: `npm install three @react-three/fiber framer-motion`
3. Install v2.0.0: `npm install aura-glass@latest`
4. No code changes needed!

---

## Support

For issues or questions:
- 📖 Read [INSTALLATION.md](./INSTALLATION.md)
- 🐛 File issues at [GitHub Issues](https://github.com/auraone/aura-glass/issues)
- 💬 Join [Discord Community](https://discord.gg/auraglass)
