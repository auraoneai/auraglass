/* MAT-288: A11y/Floors — renders useResolvedPreferences().floors live so the
   floor rules (forced colors, prefers-contrast, reduced transparency, reduced
   motion, unsupported backdrop-filter) are inspectable per engine/global. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useResolvedPreferences, usePreference } from '../../theme/preferences/usePreference';
import type { StoryAgParameters } from '../../contracts/testing';

function Floors() {
  const r = useResolvedPreferences();
  const forcedColors = usePreference('forcedColors');
  const contrastMoreOS = usePreference('contrastMoreOS');
  const reducedTransparencyOS = usePreference('reducedTransparencyOS');
  const reducedMotionOS = usePreference('reducedMotionOS');
  return (
    <div data-ag-surface="" data-ag-variant="regular" style={{ padding: 16, fontSize: 13 }}>
      <h3 style={{ marginTop: 0 }}>Resolved floors</h3>
      <dl>
        <dt>floors.transparency</dt><dd data-floor="transparency">{r.floors.transparency}</dd>
        <dt>floors.motion</dt><dd data-floor="motion">{r.floors.motion}</dd>
        <dt>resolved transparency / contrast / motion</dt>
        <dd>{r.transparency} / {r.contrast} / {r.motion}</dd>
        <dt>os signals</dt>
        <dd>
          forcedColors={String(forcedColors)} · contrastMore={String(contrastMoreOS)} ·
          reducedTransparency={String(reducedTransparencyOS)} · reducedMotion={String(reducedMotionOS)}
        </dd>
      </dl>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/Floors',
  component: Floors,
  parameters: {
    ag: { subject: 'A11yFloors', kind: 'component', scenes: 'all' } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj = {};
export const ForcedColorsAxes: StoryObj = {
  globals: { transparency: 'glass', contrast: 'standard' },
};
