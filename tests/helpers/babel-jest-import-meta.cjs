// babel-jest wrapper: .mjs helpers use `import.meta.url` for ROOT paths, which
// survives preset-env's CJS conversion and makes the module unevaluatable in
// jest's CJS loader (createRequireEsmError). Rewrite import.meta.url /
// import.meta.dirname to their __filename equivalents so transformed .mjs
// sources run as plain CJS. import.meta.glob (Vite) resolves to an empty match.
const babelJest = require('babel-jest');

// Rewrite real `import.meta.*` member expressions on the AST (not by text), so
// string literals and comments that merely mention them are left untouched.
function importMetaPlugin({ template }) {
  const replacements = {
    dirname: () => template.expression.ast`__dirname`,
    // Vite-only import.meta.glob (Storybook story helpers): no bundler here, so
    // every glob matches nothing and callers take their absent-asset path.
    glob: () => template.expression.ast`((..._args) => ({}))`,
    url: () => template.expression.ast`(__filename.startsWith("file://") ? __filename : require("url").pathToFileURL(__filename).href)`,
  };
  const rewrite = {
    MemberExpression(path) {
      const { object, property, computed } = path.node;
      if (computed || object.type !== 'MetaProperty' || object.meta.name !== 'import' || object.property.name !== 'meta') return;
      const make = replacements[property.name];
      if (make) path.replaceWith(make());
    },
  };
  return {
    visitor: {
      Program(path) {
        // ESM sources may declare their own top-level `require` / `__filename` /
        // `__dirname` shims (prettier's index.mjs does: `const __filename =
        // fileURLToPath(import.meta.url)`). The rewrite below must reference the
        // CJS wrapper's bindings, not those shims, or the shim reads itself in
        // its own TDZ. Rename such program-scope bindings first, then rewrite.
        for (const name of ['require', '__filename', '__dirname']) {
          if (path.scope.hasOwnBinding(name)) path.scope.rename(name, path.scope.generateUid(name.replace(/^_+/, '')));
        }
        path.traverse(rewrite);
      },
    },
  };
}

const base = babelJest.default.createTransformer({
  plugins: [importMetaPlugin],
  presets: [
    ['@babel/preset-env', { targets: { node: '20.19' }, modules: 'commonjs' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
});

module.exports = {
  ...base,
  // The import.meta rewrite is part of the transform output: key the cache on it.
  getCacheKey(sourceText, sourcePath, options) {
    return `${base.getCacheKey(sourceText, sourcePath, options)}:import-meta-ast-v3`;
  },
};
