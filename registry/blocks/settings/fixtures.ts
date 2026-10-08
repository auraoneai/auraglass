// fixtures.ts — deterministic settings sections (contract §3.3).
import type { SettingsPanelProps } from './index';

export const settingsSections: SettingsPanelProps['sections'] = [
  {
    id: 'appearance',
    label: 'Appearance',
    kind: 'preferences',
    preferenceKeys: ['scheme', 'transparency', 'glassOpacity', 'density'],
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    kind: 'preferences',
    preferenceKeys: ['contrast', 'motion', 'allowContinuous'],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    kind: 'rows',
    rows: [
      { id: 'autosave', label: 'Autosave drafts', description: 'Save changes every few seconds.', control: 'switch', value: true },
      { id: 'default-view', label: 'Default view', control: 'segmented', value: 'board',
        options: [{ value: 'board', label: 'Board' }, { value: 'list', label: 'List' }, { value: 'calendar', label: 'Calendar' }] },
      { id: 'digest', label: 'Weekly digest', description: 'Email a Monday summary.', control: 'switch', value: false },
    ],
  },
];

export const settingsProps: SettingsPanelProps = {
  sections: settingsSections,
  defaultSection: 'appearance',
};
