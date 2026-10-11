/** PLAT-323: deps transform on package.json. */
import { describe, expect, it } from '@jest/globals';
import { runOnSource, selectTransforms, loadCompiledMappings } from '../src/migrate/4to5/index.js';
const m = loadCompiledMappings();
const run = (src: string) => runOnSource({ path: 'package.json', abs: 'x', kind: 'json', source: src }, selectTransforms(['deps']), { mappings: m, docBase: 'docs' });
describe('deps', () => {
  it('bumps aura-glass to ^5.0.0', () => {
    const r = run('{"dependencies":{"aura-glass":"4.9.0"}}');
    expect(JSON.parse(r.final).dependencies['aura-glass']).toBe('^5.0.0');
  });
  it('removes deps whose when says remove', () => {
    const r = run('{"dependencies":{"aura-glass":"4.9.0","date-fns":"^3.0.0"}}');
    expect(JSON.parse(r.final).dependencies['date-fns']).toBeUndefined();
  });
});
