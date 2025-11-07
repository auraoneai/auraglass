# AuraGlass v2.0.0 - Installation Guide

## 📦 Installation

AuraGlass v2.0.0 introduces **peer dependencies** for better bundle size and compatibility.

### Quick Start

**Step 1:** Install peer dependencies

```bash
npm install react react-dom three @react-three/fiber framer-motion
```

**Step 2:** Install AuraGlass

```bash
npm install aura-glass
```

### Complete Installation (with optional dependencies)

```bash
# Required peer dependencies
npm install react react-dom three @react-three/fiber framer-motion

# Optional: 3D helpers (recommended if using 3D components)
npm install @react-three/drei

# Install AuraGlass
npm install aura-glass
```

---

## 🎯 Peer Dependencies Explained

AuraGlass requires these peer dependencies to be installed in your project:

| Package | Version | Required | Purpose |
|---------|---------|----------|---------|
| `react` | >=18.0.0 | ✅ Yes | Core framework |
| `react-dom` | >=18.0.0 | ✅ Yes | React rendering |
| `three` | >=0.137.0 | ✅ Yes | 3D graphics (used by 3D components) |
| `@react-three/fiber` | >=8.0.0 | ✅ Yes | React Three.js integration |
| `framer-motion` | >=10.0.0 | ✅ Yes | Animation system |
| `@react-three/drei` | >=9.40.0 | ⚠️ Optional | 3D helpers (recommended) |

---

## 🔄 Upgrading from v1.x

### Breaking Changes in v2.0.0

**Three.js packages are now peer dependencies**

**Before (v1.x):**
```bash
npm install aura-glass
# Everything bundled - easy but bloated (847KB bundle)
```

**After (v2.0.0):**
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
   npm install three @react-three/fiber framer-motion
   # Add @react-three/drei if you use 3D helpers
   npm install @react-three/drei
   ```

3. **Install v2.0.0:**
   ```bash
   npm install aura-glass@latest
   ```

4. **No code changes needed!** Your existing AuraGlass components will work as-is.

### Benefits of v2.0.0

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

**Solution:** You're likely trying to install v1.x. Upgrade to v2.0.0:

```bash
npm install aura-glass@latest
```

If you're on v2.0.0 and still see this error, try:

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

**Version:** 2.0.0
**Last Updated:** November 7, 2025
