/* CMP-042: T2/leaf server components render to markup with renderToStaticMarkup
   (no effects, no 'use client' directive in their implementation files). */
/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as React from 'react';
import './ssr-polyfill';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmptyState, ErrorState, LoadingState } from '../../../src/components/state-view';
import { Steps } from '../../../src/components/steps';
import { AvatarGroup } from '../../../src/components/avatar';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SERVER_SOURCES = [
  'src/components/state-view/StateView.tsx',
  'src/components/steps/Steps.tsx',
  'src/components/avatar/AvatarGroup.tsx',
];

describe('T2 server components', () => {
  it('render to markup without DOM globals', () => {
    const html = renderToStaticMarkup(
      <>
        <EmptyState title="Empty" />
        <ErrorState title="Oops" urgent />
        <LoadingState description="Please wait" />
        <Steps>
          <Steps.Item status="current">Step</Steps.Item>
        </Steps>
        <AvatarGroup max={2}>
          <span>A</span>
          <span>B</span>
          <span>C</span>
        </AvatarGroup>
      </>,
    );
    expect(html).toContain('data-ag-part="root"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('+1');
  });
  it('implementation files carry no "use client" directive', () => {
    for (const f of SERVER_SOURCES) {
      const head = readFileSync(join(root, f), 'utf8').slice(0, 400);
      expect(head).not.toContain("'use client'");
      expect(head).not.toContain('"use client"');
    }
  });
});
