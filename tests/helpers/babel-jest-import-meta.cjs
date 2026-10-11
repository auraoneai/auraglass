// babel-jest wrapper: .mjs helpers use `import.meta.url` for ROOT paths, which
// survives preset-env's CJS conversion and makes the module unevaluatable in
// jest's CJS loader (createRequireEsmError). Rewrite import.meta.url /
// import.meta.dirname to their __filename equivalents so transformed .mjs
// sources run as plain CJS. import.meta.glob (Vite) resolves to an empty match.
const babelJest = require('babel-jest');

// Rewrite real `import.meta.*` member expressions on the AST (not by text), so
// string literals and comments that merely mention them are left untouched.
// Under `node --experimental-vm-modules` (the `npm test` script) jest loads
// every .mjs file as a native ES module (it asks babel with caller
// supportsStaticESM: true). Such modules must stay ESM — converting them to CJS
// leaves `exports`/`require` undefined in jest's module wrapper — and
// import.meta.url/dirname are then native, so only the Vite glob is rewritten.
function importMetaPlugin({ template, caller }) {
  const esm = caller((c) => Boolean(c && c.supportsStaticESM));
  const replacements = esm ? {
    glob: () => template.expression.ast`((..._args) => ({}))`,
  } : {
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
        // Only CJS output needs wrapper bindings. Preserve native ESM shims.
        if (!esm) {
          for (const name of ['require', '__filename', '__dirname']) {
            if (path.scope.hasOwnBinding(name)) path.scope.rename(name, path.scope.generateUid(name.replace(/^_+/, '')));
          }
        }
        path.traverse(rewrite);
      },
    },
  };
}

const presets = (modules) => [
  ['@babel/preset-env', { targets: { node: '20.19' }, modules }],
  ['@babel/preset-react', { runtime: 'automatic' }],
  '@babel/preset-typescript',
];

// Select the output format explicitly for Jest's loader. Both modes retain the
// AST plugin: CJS rewrites URL bindings, ESM keeps native metadata, and both
// replace Vite-only glob calls without changing source strings or comments.
const cjs = babelJest.default.createTransformer({ plugins: [importMetaPlugin], presets: presets('commonjs') });
const esm = babelJest.default.createTransformer({ plugins: [importMetaPlugin], presets: presets(false) });
const pick = (options) => (options && options.supportsStaticESM ? esm : cjs);

module.exports = {
  canInstrument: cjs.canInstrument,
  process(sourceText, sourcePath, options) {
    return pick(options).process(sourceText, sourcePath, options);
  },
  processAsync(sourceText, sourcePath, options) {
    return pick(options).processAsync(sourceText, sourcePath, options);
  },
  // The import.meta rewrite and the ESM/CJS split are part of the transform output: key the cache on them.
  getCacheKey(sourceText, sourcePath, options) {
    const mode = options && options.supportsStaticESM ? 'esm' : 'cjs';
    return `${pick(options).getCacheKey(sourceText, sourcePath, options)}:import-meta-ast-v5-combined:${mode}`;
  },
};
