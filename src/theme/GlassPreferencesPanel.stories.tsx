/* MAT-321: Theme/GlassPreferencesPanel — default, floor-locked (forced
   contrast=more via globals), show-subset, dark scheme and RTL variants.
   Remote screenshots are taken for human review. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassPreferencesPanel } from './preferences-panel/GlassPreferencesPanel';
import { AuraGlassProvider } from './AuraGlassProvider';
import type { StoryAgParameters } from '../contracts/testing';

const meta: Meta<typeof GlassPreferencesPanel> = {
  title: 'Theme/GlassPreferencesPanel',
  component: GlassPreferencesPanel,
  decorators: [(Story) => <AuraGlassProvider><Story /></AuraGlassProvider>],
  parameters: {
    ag: {
      subject: 'GlassPreferencesPanel', kind: 'component',
      scenes: ['flat-white', 'flat-black', 'photo'],
    } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj<typeof GlassPreferencesPanel> = {};

export const FloorLocked: StoryObj<typeof GlassPreferencesPanel> = {
  globals: { contrast: 'more' },
};

export const Subset: StoryObj<typeof GlassPreferencesPanel> = {
  args: { keys: ['transparency', 'contrast'] },
};

export const Dark: StoryObj<typeof GlassPreferencesPanel> = {
  globals: { scheme: 'dark' },
};

export const RTL: StoryObj<typeof GlassPreferencesPanel> = {
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};
