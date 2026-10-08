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
    expect(runV5(dir).byCodemod).toBeDefined();
  });
});
