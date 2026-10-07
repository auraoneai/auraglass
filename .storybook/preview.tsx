/* @ag-contract-seed: S-41/S-42. Owner QUAL replaces internals; global names and values frozen. */
import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import { SCENES } from '../src/contracts/testing';
import.meta.glob('../src/**/*.css', { eager: true });           // every source sheet is self-layered (§4.3), so order does not matter
const item = (v: readonly string[]) => ({ toolbar: { items: [...v], dynamicTitle: true } });
const preview: Preview = {
  globalTypes: {
    scheme: { defaultValue: 'light', ...item(['light', 'dark']) },
    contrast: { defaultValue: 'standard', ...item(['standard', 'more']) },
    transparency: { defaultValue: 'glass', ...item(['glass', 'tinted', 'solid']) },
    motion: { defaultValue: 'full', ...item(['full', 'calm', 'none']) },
    density: { defaultValue: 'regular', ...item(['compact', 'regular', 'spacious']) },
    tier: { defaultValue: 'standard', ...item(['lightweight', 'standard', 'enhanced']) },
    scene: { defaultValue: 'photo', ...item(SCENES) },
  },
  decorators: [(Story, ctx) => {
    React.useEffect(() => { document.documentElement.setAttribute('data-ag-cert-ready', ''); }, []);
    const g = ctx.globals;
    return <div data-ag-root="" data-ag-scheme={g.scheme} data-ag-contrast={g.contrast} data-ag-transparency={g.transparency}
      data-ag-motion={g.motion} data-ag-density={g.density} data-ag-tier={g.tier} data-ag-story-kind={ctx.parameters.ag?.kind}><Story /></div>;
  }],
};
export default preview;
