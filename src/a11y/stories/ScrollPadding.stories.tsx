/* MAT-308: A11y/ScrollPadding — long form under a sticky top bar + bottom
   tab bar + composer inside a [data-ag-scroll-container]; useStickyScrollPadding
   writes --ag-scroll-padding-top/-bottom on the container so Tab never lands
   a focus ring beneath the chrome. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useStickyScrollPadding } from '../useStickyScrollPadding';
import type { StoryAgParameters } from '../../contracts/testing';

function Chrome({ edge, children }: { edge: 'top' | 'bottom'; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useStickyScrollPadding({ ref, edge });
  return (
    <div
      ref={ref}
      data-ag-part={edge === 'top' ? 'top-bar' : 'tab-bar'}
      style={{
        position: 'sticky', [edge]: 0, zIndex: 10, padding: 12,
        background: 'var(--ag-color-canvas, Canvas)', borderBlockEnd: edge === 'top' ? '1px solid' : undefined,
        borderBlockStart: edge === 'bottom' ? '1px solid' : undefined,
      }}
    >
      {children}
    </div>
  );
}

function ScrollPaddingDemo() {
  return (
    <div
      data-ag-scroll-container=""
      style={{ height: 320, overflow: 'auto', border: '1px dashed', position: 'relative' }}
    >
      <Chrome edge="top"><b>Sticky TopBar</b></Chrome>
      <div style={{ padding: 16 }}>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{ paddingBlock: 4 }}>
            <label>
              Field {i + 1}: <input data-ag-part="text-input" />
            </label>
          </div>
        ))}
      </div>
      <Chrome edge="bottom">
        <b>TabBar</b> <button type="button">Composer send</button>
      </Chrome>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/ScrollPadding',
  component: ScrollPaddingDemo,
  parameters: {
    ag: { subject: 'A11yScrollPadding', kind: 'component', scenes: ['flat-white'] } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj = {};
