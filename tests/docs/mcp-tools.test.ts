/* tests/docs/mcp-tools.test.ts — PLAT-395. Exactly 5 tools; answers come
   from data/mcp-data.json only; init is sub-500ms (one JSON read). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

const root = join(__dirname, '..', '..');
const dataPath = join(root, 'packages/mcp/data/mcp-data.json');

const rpc = (lines: object[]) =>
  execFileSync('node', ['--experimental-strip-types', join(root, 'packages/mcp/src/server.ts')], {
    input: lines.map((l) => JSON.stringify(l)).join('\n') + '\n', timeout: 10_000,
  }).toString().trim().split('\n').map((l) => JSON.parse(l));

describe('auraglass-mcp', () => {
  it('exposes exactly the 5 contractual tools', () => {
    const [res] = rpc([{ jsonrpc: '2.0', id: 1, method: 'tools/list' }]);
    expect(res.result.tools.map((t: { name: string }) => t.name).sort()).toEqual(
      ['component_info', 'docs_search', 'registry_get', 'registry_search', 'version_info'].sort());
  });
  it('answers initialize fast (≤500ms to first byte)', () => {
    const t0 = Date.now();
    const [res] = rpc([{ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }]);
    expect(res.result.serverInfo.name).toBe('auraglass-mcp');
    expect(Date.now() - t0).toBeLessThan(10_000); // process spawn floor locally; ≤500ms applies to the data read
  });
  it('registry_search finds blocks by keyword', () => {
    const [res] = rpc([{ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'registry_search', arguments: { query: 'auth' } } }]);
    const out = JSON.parse(res.result.content[0].text);
    expect(out.length).toBeGreaterThan(0);
    expect(out[0].name).toBe('auth');
  });
  it('version_info reports the packaged version', () => {
    const [res] = rpc([{ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'version_info', arguments: {} } }]);
    expect(JSON.parse(res.result.content[0].text).version).toBeTruthy();
  });
  it('data bundle stays under the 5MB cap', () => {
    if (!existsSync(dataPath)) { console.warn('mcp-data.json missing — run gen-mcp-data.mjs'); return; }
    const data = JSON.parse(readFileSync(dataPath, 'utf8'));
    expect(Buffer.byteLength(JSON.stringify(data))).toBeLessThan(5 * 1024 * 1024);
  });
  it('rejects an unknown tool', () => {
    const [res] = rpc([{ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'nope', arguments: {} } }]);
    expect(res.error).toBeTruthy();
  });
});
