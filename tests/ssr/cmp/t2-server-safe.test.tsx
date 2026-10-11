/* CMP-042: T2/leaf server components render to markup with renderToStaticMarkup
   (no effects, no 'use client' directive in their implementation files). */
/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import './ssr-polyfill';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmptyState, ErrorState, LoadingState } from '../../../src/components/state-view';
import { Steps } from '../../../src/components/steps';
import { AvatarGroup } from '../../../src/components/avatar';
import { Separator } from '../../../src/components/separator';
import { Kbd } from '../../../src/components/kbd';
import { Link } from '../../../src/components/link';
import { DescriptionList } from '../../../src/components/description-list';
import { Badge } from '../../../src/components/badge';
import { Alert } from '../../../src/components/alert';
import { Skeleton } from '../../../src/components/skeleton';

const root = process.cwd();
const SERVER_SOURCES = [
  'src/components/state-view/StateView.tsx',
  'src/components/steps/Steps.tsx',
  'src/components/avatar/AvatarGroup.tsx',
  // CMP-423: flat server leaves added by lane 3g
  'src/components/separator/Separator.tsx',
  'src/components/kbd/Kbd.tsx',
  'src/components/link/Link.tsx',
  'src/components/description-list/DescriptionList.tsx',
  'src/components/badge/Badge.tsx',
  'src/components/alert/Alert.tsx',
  'src/components/skeleton/Skeleton.tsx',
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
  it('lane 3g server leaves render to markup (CMP-423)', () => {
    const html = renderToStaticMarkup(
      <>
        <Separator decorative={false} />
        <Kbd keys={['Ctrl', 'K']} />
        <Link href="/x">link</Link>
        <DescriptionList>
          <DescriptionList.Item><DescriptionList.Term>t</DescriptionList.Term><DescriptionList.Details>d</DescriptionList.Details></DescriptionList.Item>
        </DescriptionList>
        <Badge count={3} label="3 notifications" />
        <Alert title="hi">body</Alert>
        <Skeleton lines={2} />
      </>,
    );
    for (const part of ['separator', 'item', 'root', 'label', 'value', 'title', 'description', 'line']) {
      expect(html).toContain(`data-ag-part="${part}"`);
    }
    expect(html).toContain('role="separator"');
    expect(html).toContain('aria-hidden="true"');
  });
  it('implementation files carry no "use client" directive', () => {
    for (const f of SERVER_SOURCES) {
      const head = readFileSync(join(root, f), 'utf8').slice(0, 400);
      expect(head).not.toContain("'use client'");
      expect(head).not.toContain('"use client"');
    }
  });
});
