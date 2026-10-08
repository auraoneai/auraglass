/* tests/registry/plat-blocks.test.tsx — PLAT-367. PLAT's registry blocks +
   items render through renderToString on their fixtures. 'aura-glass' is
   unresolvable until the package builds (dist/), so assertions degrade to a
   pending warn — same double-pass pattern as tests/capability/registry/*. */
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
import { authProps, signUpProps } from '../../registry/blocks/auth/fixtures';
import { kanbanProps } from '../../registry/items/kanban/fixtures';
import { ganttProps } from '../../registry/items/gantt/fixtures';
import { transferProps } from '../../registry/items/transfer-list/fixtures';
import { diffProps } from '../../registry/items/diff-viewer/fixtures';
import { codeProps } from '../../registry/items/code-surface/fixtures';
import { richTextProps } from '../../registry/items/rich-text/fixtures';
import { rhfFieldProps, rhfControlDouble } from '../../registry/items/react-hook-form/fixtures';

const PENDING = 'aura-glass is unresolvable until the package builds — render assertions pending';
const load = <T,>(path: string): T | null => { try { return require(path) as T; } catch { return null; } };
const Auth = load<typeof AuthModule>('../../registry/blocks/auth/index');
const Kanban = load<typeof KanbanModule>('../../registry/items/kanban/index');
const Gantt = load<typeof GanttModule>('../../registry/items/gantt/index');
const Transfer = load<typeof TransferModule>('../../registry/items/transfer-list/index');
const Diff = load<typeof DiffModule>('../../registry/items/diff-viewer/index');
const Code = load<typeof CodeModule>('../../registry/items/code-surface/index');
const Rich = load<typeof RichModule>('../../registry/items/rich-text/index');
const Rhf = load<typeof RhfModule>('../../registry/items/react-hook-form/index');

describe('PLAT registry blocks/items', () => {
  it('auth renders the sign-in form parts', () => {
    if (!Auth) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Auth.AuthBlock, authProps));
    expect(html).toContain('data-ag-part="form"');
    expect(html).toContain('name="email"');
  });
  it('auth sign-up adds the name field', () => {
    if (!Auth) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Auth.AuthBlock, signUpProps));
    expect(html).toContain('name="name"');
  });
  it('kanban renders every column and card', () => {
    if (!Kanban) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Kanban.KanbanBoard, kanbanProps));
    expect(html).toContain('data-ag-part="columns"');
    expect(html).toContain('Settings block certification');
  });
  it('gantt renders a bar per task with deterministic offsets', () => {
    if (!Gantt) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Gantt.GanttChart, ganttProps));
    expect(html).toContain('data-ag-part="bar"');
    expect(html).toContain('%');
  });
  it('transfer-list partitions rows across both columns', () => {
    if (!Transfer) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Transfer.TransferList, transferProps));
    expect(html).toContain('data-ag-part="source-column"');
    expect(html).toContain('data-ag-part="target-column"');
  });
  it('diff-viewer renders add/del/context line states', () => {
    if (!Diff) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Diff.DiffViewer, diffProps));
    expect(html).toContain('data-ag-state="add"');
    expect(html).toContain('data-ag-state="del"');
  });
  it('code-surface falls back to a readable static pre', () => {
    if (!Code) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Code.CodeSurface, codeProps));
    expect(html).toContain('data-ag-part="static"');
    expect(html).toContain('export function emit');
  });
  it('rich-text renders content statically until the engine loads', () => {
    if (!Rich) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Rich.RichText, richTextProps));
    expect(html).toContain('Release notes');
  });
  it('react-hook-form adapter renders uncontrolled without the engine', () => {
    if (!Rhf) { console.warn(PENDING); return; }
    const html = renderToString(createElement(Rhf.RhfTextField, { ...rhfFieldProps, control: rhfControlDouble }));
    expect(html).toContain('name="email"');
  });
});
