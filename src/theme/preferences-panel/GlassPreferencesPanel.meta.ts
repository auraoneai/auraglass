/* MAT-326: T2 certification row for GlassPreferencesPanel — the only
   implementation of the preferences panel (spec's PRD-05 reference resolved
   to this directory via rg; PRD-05 has shipped no competing component to
   date, so no edits there and no missing data-ag-part to report). */
import type { ComponentMeta } from '../../contracts/components';

export const GlassPreferencesPanelMeta: ComponentMeta = {
  name: 'GlassPreferencesPanel',
  owner: 'MAT',
  entry: './theme',
  tier: 'T2',
  rsc: 'client',
  parts: ['root', 'legend', 'group', 'options', 'option', 'radio', 'slider', 'switch', 'floor-note', 'output'],
  states: ['checked', 'disabled', 'floor-locked'],
  variants: {},
  material: { layer: 'chrome' },
  migration: [
    {
      from: 'PreferencesPanel',
      // onChange keeps its name: no prop rename, so no codemod props row (S-39).
      props: {},
      automation: 'full',
      compat: true,
    },
  ],
};

export default GlassPreferencesPanelMeta;
