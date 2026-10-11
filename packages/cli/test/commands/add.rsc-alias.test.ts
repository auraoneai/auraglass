/** add.rsc-alias */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { registryItemSchema } from '../../src/registry/schema.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('add rsc alias', () => {
  it('meta.auraglass.client controls use-client', () => {
    const item = registryItemSchema.parse({ name: 'x', type: 'components', files: [{ path: 'x.tsx', content: 'x' }], meta: { auraglass: { client: true } } });
    expect(item.meta?.auraglass?.client).toBe(true);
  });
});
