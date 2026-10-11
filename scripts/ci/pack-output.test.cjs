const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Execute each script's actual parsing and validation without packing, building,
// installing dependencies, or launching its browser integration workload.
for (const filename of ['run-next-integration.js', 'run-vite-integration.js', 'verify-pack.js']) {
  const source = fs.readFileSync(path.join(__dirname, filename), 'utf8');
  const verification = filename === 'verify-pack.js';
  const start = source.indexOf(verification ? 'const jsonStart =' : 'const packParsed =');
  const end = source.indexOf('const tarballPath =', start);
  assert.ok(start >= 0 && end > start, `${filename}: parser block must exist`);
  const resultName = verification ? 'packResult' : 'packInfo';
  const parser = new vm.Script(`${source.slice(start, end)}\n${resultName};`);
  const parse = (output) => parser.runInNewContext({ packOutput: output });
  const metadata = { filename: 'aura-glass-5.0.0.tgz', files: [{ path: 'package.json' }] };

  test(`${filename} accepts array, keyed object, and direct metadata`, () => {
    for (const value of [[metadata], { 'aura-glass': metadata }, metadata]) {
      const result = parse(JSON.stringify(value));
      assert.equal(result.filename, metadata.filename);
      assert.equal(result.files[0].path, 'package.json');
    }
  });

  test(`${filename} rejects invalid output before using a tarball path`, () => {
    const values = [null, false, 42, 'text', [], {}, [null], { 'aura-glass': null },
      { filename: '' }, { filename: '   ' }, { filename: 123 },
      [{ filename: {} }], { 'aura-glass': { files: [] } }];
    for (const value of values) {
      assert.throws(() => parse(JSON.stringify(value)), /Unexpected npm pack output|Failed to generate npm pack tarball/);
    }
    assert.throws(() => parse('not JSON'));
  });

  if (verification) {
    test(`${filename} validates files and preserves support for leading npm output`, () => {
      for (const value of [[metadata], { 'aura-glass': metadata }, metadata]) {
        assert.equal(parse(`npm lifecycle output\n${JSON.stringify(value)}`).filename, metadata.filename);
      }
      assert.throws(() => parse(JSON.stringify({ filename: metadata.filename })), /Unexpected npm pack output/);
      assert.throws(() => parse(JSON.stringify({ ...metadata, files: {} })), /Unexpected npm pack output/);
    });
  }
}
