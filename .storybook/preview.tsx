/* QUAL (REQ-QUAL-09, -10, -11; REQ-FIN-106; REQ-FIN-05 transfer; FIN-449). Global names and values are frozen (S-20/S-42).
   One decorator: AuraGlassProvider (props from the globals; it applies the OS motion floor, D-11) → Environment
   (backdrop = SCENE_BACKDROP[scene], image /scenes/<file>) → StoryRoot. No parameters.backgrounds, no extra toolbars,
   no direct data-ag-* writes. Stylesheets load through the single loader: `?ag-cert=1` loads only dist/styles.css. */
import * as React from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import { SCENES } from '../src/contracts/testing';
import type { StoryAgParameters } from '../src/contracts/testing';
import { StoryFrame } from './contract/StoryFrame';
import { loadStoryStyles } from './contract/styles';

const item = (v: readonly string[]) => ({ toolbar: { items: [...v], dynamicTitle: true } });
const decorator: Decorator = (Story, ctx) => (
  <StoryFrame storyId={ctx.id} globals={ctx.globals} ag={ctx.parameters.ag as Partial<StoryAgParameters> | undefined}>
    <Story />
  </StoryFrame>
);

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
  loaders: [async () => { await loadStoryStyles(); return {}; }],
  decorators: [decorator],
};
export default preview;
