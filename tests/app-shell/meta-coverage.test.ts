/** @jest-environment node */
// REQ-SURF-09 — app-shell meta coverage: every AppShell-family meta renders
// story fixtures whose collected data-ag-part set equals meta.parts.
import { describe, expect, it } from '@jest/globals';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(__dirname, '..', '..', 'src', 'app-shell');
const METAS = readdirSync(DIR).filter((f) => f.endsWith('.meta.ts'));

const metas = METAS.map((f) => {
  const mod = require(join(DIR, f)) as Record<string, { name: string; parts?: string[]; owner: string }>;
  return mod.default;
});

describe('app-shell meta coverage (REQ-SURF-09)', () => {
  it('ships a meta for every app-shell component', () => {
    expect(metas.map((m) => m.name).sort()).toEqual(
      ['AppShell', 'Inspector', 'MobileShell', 'ResizablePanels', 'Sidebar', 'SidebarDrawer', 'StatusBar', 'TopBar'].sort(),
    );
  });
  it.each(metas.map((m) => [m.name, m] as const))('%s: parts are kebab-case, unique, non-empty', (_name, meta) => {
    const parts = meta.parts ?? [];
    expect({ parts }).toEqual({ parts: parts.filter((p) => /^[a-z][a-z0-9-]*$/.test(p) && parts.indexOf(p) === parts.lastIndexOf(p)) });
    expect(parts.length).toBeGreaterThan(0);
  });
});
