/** PLAT-87: vendored shadcn registry-item schema — sha256 pinned + zod parity. */
import { describe, expect, it } from '@jest/globals';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { registryItemSchema, validateVendoredRegistryItem } from '../../src/registry/schema.js';

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

  it('vendored schema validator runs at runtime (REQ-PLAT-87)', () => {
    expect(validateVendoredRegistryItem({
      name: 'button', type: 'registry:ui',
      files: [{ path: 'button.tsx', type: 'registry:ui', content: 'x' }],
      meta: { auraglass: { certified: true } },
    })).toEqual([]);
    /* item type outside the vendored enum */
    expect(validateVendoredRegistryItem({ name: 'x', type: 'components', files: [] }).length).toBeGreaterThan(0);
    /* missing required name/type */
    expect(validateVendoredRegistryItem({ type: 'registry:ui' }).length).toBeGreaterThan(0);
    /* file entries require a type (and a target for registry:file/page) */
    expect(validateVendoredRegistryItem({
      name: 'x', type: 'registry:ui', files: [{ path: 'x.tsx', content: 'x' }],
    }).length).toBeGreaterThan(0);
    expect(validateVendoredRegistryItem({
      name: 'x', type: 'registry:ui',
      files: [{ path: 'x.md', type: 'registry:file', content: 'x' }],
    }).length).toBeGreaterThan(0);
    /* a font item must carry the font block (allOf conditional) */
    expect(validateVendoredRegistryItem({ name: 'f', type: 'registry:font' }).length).toBeGreaterThan(0);
    /* cssVars values must be strings under light/dark/theme */
    expect(validateVendoredRegistryItem({
      name: 'x', type: 'registry:ui', cssVars: { light: { '--a': 3 } },
    }).length).toBeGreaterThan(0);
  });

  it('zod validator rejects items missing required fields', () => {
    expect(registryItemSchema.safeParse({ type: 'registry:ui' }).success).toBe(false);
    expect(registryItemSchema.safeParse({ name: 'x' }).success).toBe(false);
  });
});
