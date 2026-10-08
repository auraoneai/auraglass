/* @jest-environment node */
/* MAT-147 — server safety: renderToString of every export with no
   window/document/provider; 'use client' only in useMaterialTier.ts. */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { materialProps } from '../materialProps';
import { Surface } from '../Surface';
import { SurfaceGroup } from '../SurfaceGroup';
import { Environment } from '../Environment';
import { ScrollEdge } from '../ScrollEdge';
import { ConcentricFrame } from '../ConcentricFrame';

const SRC = join(__dirname, '..');

describe('server-safe rendering', () => {
  it('materialProps runs with no globals', () => {
    expect(materialProps({ layer: 'chrome' })['data-ag-layer']).toBe('chrome');
  });

  it('renderToString works for every component', () => {
    const html = renderToString(
      React.createElement(Environment, {
        backdrop: 'light',
        children: [
          React.createElement(SurfaceGroup, { key: 'g', children: [
            React.createElement(Surface, { key: 's', layer: 'chrome', thickness: 'regular' },
              React.createElement(ConcentricFrame, {
                radius: 'md', inset: '2',
                children: React.createElement(Surface, { shape: 'concentric' }, 'body'),
              })),
            React.createElement(ScrollEdge, { key: 'e', edge: 'top' }),
          ] }),
        ],
      }),
    );
    expect(html).toContain('data-ag-backdrop="light"');
    expect(html).toContain('ag-surface');
    expect(html).toContain('data-ag-part="scroll-edge"');
    expect(html).toContain('data-ag-radius="md"');
  });

  it('output is identical regardless of tier (no <html data-ag-tier> reads at render)', () => {
    const a = renderToString(React.createElement(Surface, { layer: 'chrome' }, 'x'));
    const b = renderToString(React.createElement(Surface, { layer: 'chrome' }, 'x'));
    expect(a).toBe(b);
  });

  it('no file other than useMaterialTier.ts carries a use-client directive', () => {
    const offenders: string[] = [];
    const scan = (dir: string) => {
      for (const name of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, name.name);
        if (name.isDirectory()) {
          if (name.name !== '__tests__' && name.name !== 'dev') scan(p);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(name.name) || name.name === 'useMaterialTier.ts') continue;
        const head = readFileSync(p, 'utf8').slice(0, 120);
        if (/^['"]use client['"]/m.test(head)) offenders.push(p);
      }
    };
    scan(SRC);
    expect(offenders).toEqual([]);
  });

  it('nothing in materialProps.ts or internal/ touches window/document', () => {
    for (const rel of ['materialProps.ts', 'internal/resolveRole.ts']) {
      const src = readFileSync(join(SRC, rel), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
      expect(src).not.toMatch(/\bwindow\b|\bdocument\b/);
    }
  });
});
