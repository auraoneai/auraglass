# AuraGlass v2.1.0 - Installation Guide

## 📦 Installation

AuraGlass v2.1.0 ships lean by depending on your host app for core React, animation, analytics, and 3D libraries. Make sure these peer dependencies are installed before importing any AuraGlass components.

### Quick Start

**Step 1:** Install peer dependencies

```bash
npm install react react-dom react-hook-form react-chartjs-2 framer-motion lucide-react three @react-three/fiber
npm install @sentry/react          # optional unless monitoring is enabled
npm install @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-label @radix-ui/react-slot
```

**Step 2:** Install AuraGlass

```bash
npm install aura-glass
```

### Complete Installation (with optional dependencies)

```bash
# Required peer dependencies
npm install react react-dom react-hook-form react-chartjs-2 framer-motion lucide-react three @react-three/fiber
npm install @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-label @radix-ui/react-slot

# Optional: monitoring + 3D helpers
npm install @sentry/react
npm install @react-three/drei       # recommended if using AR/3D components

# Install AuraGlass
npm install aura-glass
```

---

## 🎯 Peer Dependencies Explained

AuraGlass requires these peer dependencies to be installed in your project:

| Package | Version | Required | Purpose |
|---------|---------|----------|---------|
| `react` | >=18.0.0 | ✅ | Core framework |
| `react-dom` | >=18.0.0 | ✅ | React rendering |
| `three` | ^0.150.0 or ^0.160.0 | ✅ | 3D graphics + shader surfaces |
| `@react-three/fiber` | ^8.15.0 | ✅ | React ↔ Three bridge used across AR/3D components |
| `framer-motion` | >=10.0.0 | ✅ | Animation + physics orchestration |
| `react-hook-form` | ^7.0.0 | ✅ | Form engines, AI builders, validation flows |
| `react-chartjs-2` | ^5.0.0 | ✅ | Chart + data visualization wrappers |
| `lucide-react` | ^0.400.0 | ✅ | Iconography + glyph system |
| `@sentry/react` | ^7.100.0 | ✅* | Production monitoring & error streaming (omit if unused) |
| Radix primitives (`@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-label`, `@radix-ui/react-slot`) | ^2.x / ^1.x | ⚠️ Optional | Required only if you use Radix-powered menus, selects, or slots |
| `@react-three/drei` | ^9.40.0 | ⚠️ Optional | 3D helpers for advanced scenes (recommended) |

> `@sentry/react` is only required if you turn on AuraGlass production monitoring. Install the Radix packages when you consume Radix-powered components (menus, selects, slots) exported by the design system.

---

## 🔄 Upgrading from v1.x

### Breaking Changes in v2.1.0

**Three.js packages are now peer dependencies**

**Before (v1.x):**
```bash
npm install aura-glass
# Everything bundled - easy but bloated (847KB bundle)
```

**After (v2.1.0):**
```bash
# Install peer dependencies first
npm install react react-dom three @react-three/fiber framer-motion
# Then install AuraGlass (now only ~150KB)
npm install aura-glass
```

### Migration Steps

1. **Uninstall old version:**
   ```bash
   npm uninstall aura-glass
   ```

2. **Install peer dependencies:**
   ```bash
   npm install react react-dom react-hook-form react-chartjs-2 framer-motion lucide-react three @react-three/fiber
   npm install @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-label @radix-ui/react-slot
   npm install @sentry/react          # optional unless you enable monitoring
   npm install @react-three/drei      # optional but recommended for 3D helpers
   ```

3. **Install v2.1.0:**
   ```bash
   npm install aura-glass@latest
   ```

4. **No code changes needed!** Your existing AuraGlass components will work as-is.

### Benefits of v2.1.0

✅ **80% smaller bundle** (847KB → ~150KB)
✅ **Faster installs** (3 minutes → 20 seconds)
✅ **No peer dependency conflicts**
✅ **User controls Three.js version**
✅ **Better tree-shaking**

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'three'"

**Solution:** Install peer dependencies

```bash
npm install three @react-three/fiber framer-motion
```

### Error: "ERESOLVE could not resolve"

**Solution:** You're likely trying to install v1.x. Upgrade to v2.1.0:

```bash
npm install aura-glass@latest
```

If you're on v2.1.0 and still see this error, try:

```bash
npm install --legacy-peer-deps
```

### TypeScript Errors

If you see TypeScript errors about Three.js types:

```bash
npm install --save-dev @types/three
```

---

## 📚 Next Steps

After installation:

1. **Read the Quick Start:** See `README.md` for basic usage
2. **Explore Components:** Check the component catalog
3. **Review Examples:** See example implementations in `/examples`
4. **Join Community:** Get help and share feedback

---

## 🆘 Support

**Still having issues?**

- Check our [GitHub Issues](https://github.com/auraone/aura-glass/issues)
- Review the [Troubleshooting Guide](./docs/troubleshooting.md)
- Join our [Discord Community](https://discord.gg/auraglass)

---

**Version:** 2.1.0
**Last Updated:** November 7, 2025
