/** doctor.v5 */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runV5 } from '../../src/doctor/v5.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('doctor --v5', () => {
  it('reports per-codemod findings', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'a.tsx'), "import { GlassButton } from 'aura-glass';\nconst x=<GlassButton/>;\n");
    const { findings, byCodemod } = runV5(dir);
    expect(byCodemod['canonical-names']).toHaveLength(2);
    expect(findings.map(({ symbol, automation }) => ({ symbol, automation }))).toEqual([
      { symbol: 'GlassButton', automation: 'automatic' },
      { symbol: 'GlassButton', automation: 'automatic' },
    ]);
  });
});
