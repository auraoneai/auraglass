import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cssUrls } from '../../scripts/ci/lib/css-urls.mjs';

test('SVG filter fragments stay inside their enclosing data URL', () => {
  const data = "data:image/svg+xml,%3Csvg%3E%3Crect filter='url(%23n)'/%3E%3C/svg%3E";
  assert.deepEqual(cssUrls(`a{background:url("${data}");mask:url('./tile.png')}`), [data, './tile.png']);
});

test('relative assets with spaces, bare URLs and fragments remain visible', () => {
  assert.deepEqual(cssUrls('a{x:url("./tile 1.png");y:url(../grain.avif);z:url(#mask)}'), ['./tile 1.png', '../grain.avif', '#mask']);
});
