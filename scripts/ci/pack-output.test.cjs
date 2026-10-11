const assert = require('node:assert/strict');
const { test } = require('node:test');
const { parsePackJson } = require('./lib/npm-pack.cjs');

const metadata = { filename: 'aura-glass-5.0.0.tgz', files: [{ path: 'package.json' }] };

for (const [name, value] of [
  ['array', [metadata]],
  ['package-keyed object', { 'aura-glass': metadata }],
  ['direct metadata', metadata],
]) {
  test(`npm pack parser accepts ${name}`, () => {
    assert.deepEqual(parsePackJson(JSON.stringify(value)), metadata);
  });
  test(`npm pack parser accepts ${name} after lifecycle output`, () => {
    assert.deepEqual(parsePackJson(`npm lifecycle output\n${JSON.stringify(value)}`), metadata);
  });
}

test('npm pack parser rejects invalid metadata before using a tarball path', () => {
  const invalid = [null, false, 42, 'text', [], {}, [null], { 'aura-glass': null },
    { filename: '' }, { filename: '   ' }, { filename: 123 },
    { filename: '', files: [] }, { filename: '   ', files: [] },
    [{ filename: {} }], { 'aura-glass': { files: [] } },
    { filename: metadata.filename }, { filename: metadata.filename, files: {} }];
  for (const value of invalid) {
    assert.throws(() => parsePackJson(JSON.stringify(value)));
  }
  assert.throws(() => parsePackJson('not JSON'));
});

test('npm pack parser rejects ambiguous multi-package output', () => {
  assert.throws(() => parsePackJson(JSON.stringify([metadata, metadata])), /expected exactly 1/);
  assert.throws(() => parsePackJson(JSON.stringify({ a: metadata, b: metadata })), /expected exactly 1/);
});
