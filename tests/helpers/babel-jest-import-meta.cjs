// babel-jest wrapper: .mjs helpers use `import.meta.url` for ROOT paths, which
// survives preset-env's CJS conversion and makes the module unevaluatable in
// jest's CJS loader (createRequireEsmError). Rewrite import.meta.url /
// import.meta.dirname to their __filename equivalents so transformed .mjs
// sources run as plain CJS. import.meta.glob (Vite) resolves to an empty match.
const babelJest = require('babel-jest');

const base = babelJest.default.createTransformer({
  presets: [
    ['@babel/preset-env', { targets: { node: '20.19' }, modules: 'commonjs' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
});

function fixImportMeta(code) {
  return code
    .replace(/import\.meta\.dirname/g, '__dirname')
    // Vite-only import.meta.glob (Storybook story helpers): no bundler here, so
    // every glob matches nothing and callers take their absent-asset path.
    .replace(/import\.meta\.glob\b/g, '((..._args) => ({}))')
    .replace(/import\.meta\.url/g, '(__filename.startsWith("file://") ? __filename : require("url").pathToFileURL(__filename).href)');
}

module.exports = {
  ...base,
  // The rewrite below is part of the transform output: key the cache on it.
  getCacheKey(sourceText, sourcePath, options) {
    return `${base.getCacheKey(sourceText, sourcePath, options)}:import-meta-glob-v1`;
  },
  process(sourceText, sourcePath, options) {
    const out = base.process(sourceText, sourcePath, options);
    return { ...out, code: fixImportMeta(out.code) };
  },
};
