/* QUAL fixtures (G-18, REQ-QUAL-22): the WebKit backdrop probe's negative
   and positive controls, each painting its own high-frequency pattern so
   the probe has a backdrop whatever scene the preview paints.

   - MissingWebkitPrefix: the panel ships only the unprefixed declaration,
     guarded by `@supports not (-webkit-backdrop-filter: none)` — i.e. a
     material without a -webkit-backdrop-filter path. Engines that resolve
     the prefixed property (WebKit) get no blur, so the 32×32 interior probe
     does not cut σ(L) by ≥60 % and engine.spec.ts must fail it on WebKit.
     Chromium/Gecko (no prefixed property) apply the blur.
   - WithWebkitPrefix: literal `-webkit-backdrop-filter` plus the unprefixed
     property; the probe must pass in every engine.
   Tagged no-cert: never certification subjects. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Webkit Backdrop',
  tags: ['no-cert'],
  parameters: { ag: { subject: 'fixture:webkit-backdrop', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;

const css = `
.qual-fixture-hf { position: relative; inline-size: 480px; block-size: 320px; padding: 40px;
  background: repeating-conic-gradient(#000 0 25%, #fff 0 50%) 0 0 / 4px 4px; }
.qual-fixture-panel { inline-size: 400px; block-size: 240px; border-radius: 16px;
  background: rgb(255 255 255 / 0.2); }
.qual-fixture-panel[data-variant='prefixed'] {
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  backdrop-filter: blur(20px) saturate(1.2);
}
@supports not (-webkit-backdrop-filter: none) {
  .qual-fixture-panel[data-variant='unprefixed-only'] { backdrop-filter: blur(20px) saturate(1.2); }
}
`;

const Panel = ({ variant }: { variant: 'prefixed' | 'unprefixed-only' }) => (
  <>
    <style>{css}</style>
    <div className="qual-fixture-hf" data-ag-part="backdrop">
      <div className="qual-fixture-panel" data-ag-surface="" data-ag-part="root" data-variant={variant} />
    </div>
  </>
);

export const MissingWebkitPrefix: StoryObj<typeof meta> = { render: () => <Panel variant="unprefixed-only" /> };
export const WithWebkitPrefix: StoryObj<typeof meta> = { render: () => <Panel variant="prefixed" /> };
