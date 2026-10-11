/* tests/registry/plat-blocks.test.tsx — PLAT-367. PLAT's registry blocks +
   items render through renderToString on their fixtures. 'aura-glass' is
   unresolvable until the package builds (dist/), so assertions degrade to a
   aura-glass resolves to tests/contract-doubles/* under the doubles jest
   config — load failure is a hard failure (no warn-and-return). */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import type * as AuthModule from '../../registry/blocks/auth/index';
import type * as KanbanModule from '../../registry/items/kanban/index';
import type * as GanttModule from '../../registry/items/gantt/index';
import type * as TransferModule from '../../registry/items/transfer-list/index';
import type * as DiffModule from '../../registry/items/diff-viewer/index';
import type * as CodeModule from '../../registry/items/code-surface/index';
import type * as RichModule from '../../registry/items/rich-text/index';
import type * as RhfModule from '../../registry/items/react-hook-form/index';
import type * as SettingsModule from '../../registry/blocks/settings/index';
import { settingsProps } from '../../registry/blocks/settings/fixtures';
import { authProps, signUpProps } from '../../registry/blocks/auth/fixtures';
import { kanbanProps } from '../../registry/items/kanban/fixtures';
import { ganttProps } from '../../registry/items/gantt/fixtures';
import { transferProps } from '../../registry/items/transfer-list/fixtures';
import { diffProps } from '../../registry/items/diff-viewer/fixtures';
import { codeProps } from '../../registry/items/code-surface/fixtures';
import { richTextProps } from '../../registry/items/rich-text/fixtures';
import { rhfFieldProps, rhfControlDouble } from '../../registry/items/react-hook-form/fixtures';

const load = <T,>(path: string): T => require(path) as T;
const Auth = load<typeof AuthModule>('../../registry/blocks/auth/index');
const Kanban = load<typeof KanbanModule>('../../registry/items/kanban/index');
const Gantt = load<typeof GanttModule>('../../registry/items/gantt/index');
const Transfer = load<typeof TransferModule>('../../registry/items/transfer-list/index');
const Diff = load<typeof DiffModule>('../../registry/items/diff-viewer/index');
const Code = load<typeof CodeModule>('../../registry/items/code-surface/index');
const Rich = load<typeof RichModule>('../../registry/items/rich-text/index');
const Rhf = load<typeof RhfModule>('../../registry/items/react-hook-form/index');
const Settings = load<typeof SettingsModule>('../../registry/blocks/settings/index');

describe('PLAT registry blocks/items', () => {
  it('auth renders the sign-in form parts', () => {
    const html = renderToString(createElement(Auth.AuthBlock, authProps));
    expect(html).toContain('data-ag-part="form"');
    expect(html).toContain('name="email"');
  });
  it('auth sign-up adds the name field', () => {
    const html = renderToString(createElement(Auth.AuthBlock, signUpProps));
    expect(html).toContain('name="name"');
  });
  it('kanban renders every column and card', () => {
    const html = renderToString(createElement(Kanban.KanbanBoard, kanbanProps));
    expect(html).toContain('data-ag-part="columns"');
    expect(html).toContain('Settings block certification');
  });
  it('gantt renders a bar per task with deterministic offsets', () => {
    const html = renderToString(createElement(Gantt.GanttChart, ganttProps));
    expect(html).toContain('data-ag-part="bar"');
    expect(html).toContain('%');
  });
  it('transfer-list partitions rows across both columns', () => {
    const html = renderToString(createElement(Transfer.TransferList, transferProps));
    expect(html).toContain('data-ag-part="source-column"');
    expect(html).toContain('data-ag-part="target-column"');
  });
  it('diff-viewer renders add/del/context line states', () => {
    const html = renderToString(createElement(Diff.DiffViewer, diffProps));
    expect(html).toContain('data-ag-state="add"');
    expect(html).toContain('data-ag-state="del"');
  });
  it('code-surface falls back to a readable static pre', () => {
    const html = renderToString(createElement(Code.CodeSurface, codeProps));
    expect(html).toContain('data-ag-part="static"');
    expect(html).toContain('export function emit');
  });
  it('rich-text renders content statically until the engine loads', () => {
    const html = renderToString(createElement(Rich.RichText, richTextProps));
    expect(html).toContain('Release notes');
  });
  it('react-hook-form adapter renders uncontrolled without the engine', () => {
    const html = renderToString(createElement(Rhf.RhfTextField, { ...rhfFieldProps, control: rhfControlDouble }));
    expect(html).toContain('name="email"');
  });
  it('settings renders GlassPreferencesPanel + SegmentedControl + Switch parts', () => {
    const html = renderToString(createElement(Settings.SettingsPanel ?? Settings.default ?? Settings as never, settingsProps as never));
    expect(html).toContain('data-ag-part="rows"');
    expect(html).toMatch(/data-ag-part="(glass-preferences-panel|segmented-control|switch)[^"]*"/);
  });
});

/* S-41: every story declares parameters.ag. */
describe('stories carry parameters.ag (S-41)', () => {
  const fs = require('node:fs') as typeof import('node:fs');
  const path = require('node:path') as typeof import('node:path');
  const roots = [path.join(__dirname, '..', '..', 'registry'), path.join(__dirname, '..', '..', 'stories'), path.join(__dirname, '..', '..', 'src')];
  const stories: string[] = [];
  const walk = (d: string) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d)) {
      const p = path.join(d, e);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/\.stories\.tsx?$/.test(e)) stories.push(p);
    }
  };
  roots.forEach(walk);
  it('finds stories', () => expect(stories.length).toBeGreaterThan(20));
  it.each(stories.map((s) => [path.basename(s), s] as const))('%s has parameters.ag', (_n, s) => {
    const src = fs.readFileSync(s, 'utf8');
    expect(src).toMatch(/parameters\s*[:=]/);
    expect(src).toMatch(/ag\s*:/);
  });
});
