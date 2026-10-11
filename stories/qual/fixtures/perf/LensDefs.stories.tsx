/* stories/qual/fixtures/perf/LensDefs.stories.tsx — REQ-QUAL-43 (2) fixtures (QUAL, L10; FIN-446).
   Consumed by tests/perf/qual/lens-defs.spec.ts.
     Enhanced10  AuraGlassProvider tier="enhanced" + 10 refraction-eligible chrome surfaces. The provider's LensDefs slot
                 must mount exactly one svg[data-ag-lens-defs]; Gecko/WebKit must apply 0 url() backdrops. The root
                 carries data-lens-registered (whether src/material registered LensDefs with the provider mount
                 registry), so the spec can tell a missing producer from a broken invariant.
     Duplicate   two LensDefs mounted directly, a root that claims data-ag-engine="chromium" on every engine (engine
                 mis-detection) and an inline url() backdrop  → lens-defs-duplicate everywhere, lens-url-backdrop on
                 Gecko/WebKit.
   Tagged no-cert: never certification subjects. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../../../../src/material/index';
import { LensDefs } from '../../../../src/material/lens/LensDefs';
import { AuraGlassProvider } from '../../../../src/theme/index';
import { getProviderMounts } from '../../../../src/theme/providerMounts';
import type { StoryAgParameters } from '../../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Perf/Lens Defs',
  tags: ['no-cert'],
  parameters: { layout: 'fullscreen', ag: { subject: 'fixture:perf-lens-defs', kind: 'lab', scenes: ['photo'], tier: 'enhanced', refraction: true } satisfies StoryAgParameters },
  globals: { tier: 'enhanced' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const page: React.CSSProperties = { minHeight: '100vh', boxSizing: 'border-box', padding: 48, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' };

function Enhanced10Fixture() {
  const registered = Boolean(getProviderMounts().lensDefs);
  return (
    <AuraGlassProvider tier="enhanced">
      <div data-fixture="lens-enhanced-10" data-lens-registered={String(registered)} style={page}>
        {Array.from({ length: 10 }, (_, i) => (
          <Surface key={i} layer="chrome" shape="capsule" refraction interactive style={{ padding: '12px 24px' }}>Lens {i + 1}</Surface>
        ))}
      </div>
    </AuraGlassProvider>
  );
}

function DuplicateFixture() {
  React.useLayoutEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute('data-ag-engine');
    html.setAttribute('data-ag-engine', 'chromium');
    return () => { if (prev === null) html.removeAttribute('data-ag-engine'); else html.setAttribute('data-ag-engine', prev); };
  }, []);
  return (
    <div data-fixture="lens-duplicate" data-ag-tier="enhanced" style={page}>
      <LensDefs />
      <LensDefs />
      <Surface layer="chrome" shape="capsule" refraction interactive style={{ padding: '12px 24px' }}>Lens</Surface>
      <div
        data-fixture="lens-inline-url"
        style={{ inlineSize: 200, blockSize: 80, backdropFilter: 'url(#ag-lens-fixed-control) blur(4px)', WebkitBackdropFilter: 'url(#ag-lens-fixed-control) blur(4px)' }}
      />
    </div>
  );
}

export const Enhanced10: Story = { render: () => <Enhanced10Fixture /> };
export const Duplicate: Story = { render: () => <DuplicateFixture /> };
