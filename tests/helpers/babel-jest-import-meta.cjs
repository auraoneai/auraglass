// babel-jest wrapper: .mjs helpers use `import.meta.url` for ROOT paths, which
// survives preset-env's CJS conversion and makes the module unevaluatable in
// jest's CJS loader (createRequireEsmError). Rewrite import.meta.url /
// import.meta.dirname to their __filename equivalents so transformed .mjs
// sources run as plain CJS.
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
    .replace(/import\.meta\.url/g, '(__filename.startsWith("file://") ? __filename : require("url").pathToFileURL(__filename).href)');
}

module.exports = {
  ...base,
  process(sourceText, sourcePath, options) {
    const out = base.process(sourceText, sourcePath, options);
    return { ...out, code: fixImportMeta(out.code) };
  },
};
