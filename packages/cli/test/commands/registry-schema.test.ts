/** PLAT-87: vendored shadcn registry-item schema — sha256 pinned + zod parity. */
import { describe, expect, it } from '@jest/globals';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { registryItemSchema } from '../../src/registry/schema.js';

const schemaPath = path.join(process.cwd(), 'schema', 'registry-item.json');

describe('vendored registry-item schema', () => {
  it('sha256 matches schema/SOURCE.md', () => {
    const sha = createHash('sha256').update(fs.readFileSync(schemaPath)).digest('hex');
    const src = fs.readFileSync(path.join(process.cwd(), 'schema', 'SOURCE.md'), 'utf8');
    const m = src.match(/sha256:\s*([0-9a-f]{64})/);
    expect(m).not.toBeNull();
    expect(sha).toBe(m![1]);
  });

  it('is a draft-07 JSON schema object', () => {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    expect(schema.$schema).toContain('draft-07');
    expect(schema.type).toBe('object');
    expect(schema.properties.name).toBeTruthy();
    expect(schema.properties.registryDependencies).toBeTruthy();
  });

  it('zod validator accepts a canonical item incl. meta.auraglass', () => {
    const ok = registryItemSchema.safeParse({
      name: 'button', type: 'registry:ui',
      files: [{ path: 'button.tsx', content: 'x' }],
      cssVars: { ':root': { '--ag-x': '1' } },
      meta: { auraglass: { certified: true, client: false, minVersion: '5.0.0', components: ['button'] } },
    });
    expect(ok.success).toBe(true);
  });

  it('zod validator rejects items missing required fields', () => {
    expect(registryItemSchema.safeParse({ type: 'registry:ui' }).success).toBe(false);
    expect(registryItemSchema.safeParse({ name: 'x' }).success).toBe(false);
  });
});
