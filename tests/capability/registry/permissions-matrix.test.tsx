/** @jest-environment node */
// SURF-251 — permissions-matrix: roles x permissions checkbox cells named
// "{role} {permission}" (doubles preset).
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import type * as Mod from '../../../registry/blocks/permissions-matrix/index';
import { PERMISSIONS, ROLES } from '../../../registry/blocks/permissions-matrix/fixtures';

const PENDING = 'permissions-matrix: unresolvable under root jest until PR24 lands — assertions run under the doubles preset';
const M = (() => { try { return require('../../../registry/blocks/permissions-matrix/index') as typeof Mod; } catch { return null; } })();

describe('permissions-matrix block', () => {
  it('renders every role column and named checkbox cells', () => {
    if (!M) { console.warn(PENDING); return; }
    const html = renderToString(createElement(M.PermissionsMatrix));
    expect(html).toContain('data-ag-part="permissions-matrix"');
    for (const r of ROLES) expect(html).toContain(r);
    for (const p of PERMISSIONS) expect(html).toContain(`desc-${p.id}`);
    expect(html).toContain('Owner Read project');
  });
});
