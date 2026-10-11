/* REQ-MAT-60 (S-24, MAT-319): GlassPreferencesPanel — native form controls
   styled through materialProps only (never CMP imports: ./theme must not
   depend on src/components/**). fieldset/legend groups per requested key,
   floors rendered as aria-disabled="true" (still focusable) with a note
   naming the floor, onChange + polite announce per change, single-column at
   coarse pointer, RTL-correct.
   REQ-MAT-60 / REQ-FIN-59 (FIN-D D.3-36): density offers Spacious; radio
   names are per-instance (React.useId) so two panels never share a group;
   each floor-locked input carries its own aria-describedby to the note; the
   contrast 'standard' option is floor-locked under forced colours or OS
   Increase Contrast (resolveContrast returns 'more' there). The panel CSS
   (GlassPreferencesPanel.css: coarse single column, logical properties) is
   transferred to REQ-FIN-05 (FIN-A). */
'use client';
import * as React from 'react';
import { materialProps } from '../../material';
import type {
  GlassPreferencesPanelProps, PreferenceValues, UserSettableKey,
} from '../../contracts/preferences';
import { usePreference, useResolvedPreferences, usePreferenceActions } from '../preferences/usePreference';
import { useAnnouncer } from '../announcer/useAnnouncer';

const ALL_KEYS: readonly UserSettableKey[] = [
  'transparency', 'glassOpacity', 'contrast', 'motion', 'scheme', 'density', 'allowContinuous',
];

const TITLES: Record<UserSettableKey, string> = {
  transparency: 'Transparency',
  glassOpacity: 'Glass opacity',
  contrast: 'Contrast',
  motion: 'Motion',
  scheme: 'Scheme',
  density: 'Density',
  allowContinuous: 'Allow continuous animation',
};

type Choice = { value: string; label: string };

const CHOICES: Partial<Record<UserSettableKey, readonly Choice[]>> = {
  transparency: [
    { value: 'system', label: 'System' },
    { value: 'glass', label: 'Glass' },
    { value: 'tinted', label: 'Tinted' },
    { value: 'solid', label: 'Solid' },
  ],
  contrast: [
    { value: 'system', label: 'System' },
    { value: 'standard', label: 'Standard' },
    { value: 'more', label: 'More' },
  ],
  motion: [
    { value: 'system', label: 'System' },
    { value: 'full', label: 'Full' },
    { value: 'calm', label: 'Calm' },
    { value: 'none', label: 'None' },
  ],
  scheme: [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ],
  density: [
    { value: 'regular', label: 'Regular' },
    { value: 'compact', label: 'Compact' },
    { value: 'spacious', label: 'Spacious' },
  ],
};

const RANK: Record<string, number> = { glass: 0, tinted: 1, solid: 2 };

const FLOOR_NOTES: Record<string, string> = {
  'forced-colors': "Your system's forced-colours mode requires Solid",
  'prefers-contrast-more': "Your system's Increase Contrast setting requires at least Tinted",
  'prefers-reduced-transparency': "Your system's Reduce Transparency setting requires at least Tinted",
  'no-backdrop-filter': 'This browser cannot apply glass, so Solid is required',
  'glass-opacity': 'Glass opacity above 70% requires at least Tinted',
  'forced-colors-contrast': "Your system's forced-colours mode requires More contrast",
  'prefers-contrast-more-contrast': "Your system's Increase Contrast setting requires More contrast",
  'prefers-reduced-motion': "Your system's Reduce Motion setting allows at most Calm",
  'save-data': 'Data Saver keeps the lightweight tier',
  'low-memory-coarse': 'This device renders the lightweight tier',
};

const MOTION_RANK: Record<string, number> = { none: 0, calm: 1, full: 2 };
const CONTRAST_RANK: Record<string, number> = { standard: 0, more: 1 };

export function GlassPreferencesPanel({
  keys, onChange, className,
}: GlassPreferencesPanelProps): React.ReactElement {
  const shown = keys ?? ALL_KEYS;
  const resolved = useResolvedPreferences();
  const forcedColors = usePreference('forcedColors');
  const contrastMoreOS = usePreference('contrastMoreOS');
  const reducedTransparencyOS = usePreference('reducedTransparencyOS');
  const glassOpacity = usePreference('glassOpacity');
  const { set } = usePreferenceActions();
  const { announce } = useAnnouncer();

  const apply = <K extends UserSettableKey>(key: K, value: PreferenceValues[K]): void => {
    set(key, value);
    onChange?.(key, value);
    const label = CHOICES[key]?.find((c) => c.value === value)?.label ?? String(value);
    announce(`${TITLES[key]} set to ${label}`);
  };

  const floorFor = (key: UserSettableKey): { floor: number; note: string | null } => {
    if (key === 'transparency') {
      const floor = resolved.floors.transparency;
      const note = floor === 'glass' ? null
        : forcedColors ? FLOOR_NOTES['forced-colors']!
        : contrastMoreOS ? FLOOR_NOTES['prefers-contrast-more']!
        : reducedTransparencyOS ? FLOOR_NOTES['prefers-reduced-transparency']!
        : glassOpacity >= 0.7 ? FLOOR_NOTES['glass-opacity']!
        : FLOOR_NOTES['no-backdrop-filter']!;
      return { floor: RANK[floor] ?? 0, note };
    }
    if (key === 'motion') {
      const cap = MOTION_RANK[resolved.floors.motion] ?? 2;
      return {
        floor: cap,
        note: cap < 2 ? FLOOR_NOTES['prefers-reduced-motion']! : null,
      };
    }
    if (key === 'contrast') {
      // resolveContrast: forced || contrastMore ? 'more' : max(app, user)
      const locked = forcedColors || contrastMoreOS;
      return {
        floor: locked ? CONTRAST_RANK.more! : -1,
        note: forcedColors ? FLOOR_NOTES['forced-colors-contrast']!
          : contrastMoreOS ? FLOOR_NOTES['prefers-contrast-more-contrast']!
          : null,
      };
    }
    return { floor: -1, note: null };
  };

  const belowFloor = (key: UserSettableKey, value: string): boolean => {
    const { floor } = floorFor(key);
    if (key === 'transparency') return RANK[value] !== undefined && RANK[value]! < floor;
    if (key === 'motion') return MOTION_RANK[value] !== undefined && MOTION_RANK[value]! > floor;
    if (key === 'contrast') return CONTRAST_RANK[value] !== undefined && CONTRAST_RANK[value]! < floor;
    return false;
  };

  return React.createElement(
    'fieldset',
    {
      'data-ag-preferences-panel': '',
      'data-ag-part': 'root',
      ...materialProps({ layer: 'chrome', variant: 'regular' }),
      className,
    },
    React.createElement('legend', { 'data-ag-part': 'legend' }, 'Preferences'),
    ...shown.map((key) => {
      const { note } = floorFor(key);
      return React.createElement(PanelField, {
        key, prefKey: key, note,
        belowFloor: (v: string) => belowFloor(key, v),
        apply,
      });
    }),
  );
}

interface PanelFieldProps {
  prefKey: UserSettableKey;
  note: string | null;
  belowFloor: (v: string) => boolean;
  apply: <K extends UserSettableKey>(key: K, value: PreferenceValues[K]) => void;
}

function PanelField({ prefKey, note, belowFloor, apply }: PanelFieldProps): React.ReactElement {
  const value = usePreference(prefKey);
  const id = React.useId();
  const noteId = note ? `${id}-floor` : undefined;
  const label = React.createElement('legend', { 'data-ag-part': 'legend' }, TITLES[prefKey]);

  if (prefKey === 'allowContinuous') {
    return React.createElement(
      'fieldset', { 'data-ag-pref': prefKey, 'data-ag-part': 'group' },
      label,
      React.createElement(
        'label', { 'data-ag-option': '', 'data-ag-part': 'option' },
        React.createElement('input', {
          type: 'checkbox', role: 'switch',
          checked: Boolean(value),
          'aria-describedby': noteId,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => apply(prefKey, e.target.checked),
        }),
        ' Allow continuous animation',
      ),
      note ? React.createElement('p', { id: noteId, 'data-ag-floor-note': '', 'data-ag-part': 'floor-note' }, note) : null,
    );
  }

  if (prefKey === 'glassOpacity') {
    const pct = Math.round(Number(value) * 100);
    return React.createElement(
      'fieldset', { 'data-ag-pref': prefKey, 'data-ag-part': 'group' },
      label,
      React.createElement('input', {
        type: 'range', min: 0, max: 100, step: 5,
        'data-ag-part': 'slider',
        value: pct,
        'aria-label': TITLES[prefKey],
        'aria-valuetext': `${pct}% more opaque`,
        'aria-describedby': noteId,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          apply(prefKey, Number(e.target.value) / 100),
      }),
      React.createElement('output', { 'data-ag-part': 'output' }, `${pct}%`),
      note ? React.createElement('p', { id: noteId, 'data-ag-floor-note': '', 'data-ag-part': 'floor-note' }, note) : null,
    );
  }

  const choices = CHOICES[prefKey] ?? [];
  return React.createElement(
    'fieldset', { 'data-ag-pref': prefKey, 'data-ag-part': 'group' },
    label,
    React.createElement(
      'div', { role: 'radiogroup', 'data-ag-options': '' },
      ...choices.map((c) => {
        const disabled = c.value !== 'system' && belowFloor(c.value);
        return React.createElement(
          'label', { 'data-ag-option': '', 'data-ag-part': 'option', key: c.value },
          React.createElement('input', {
            type: 'radio', name: `ag-pref-${prefKey}-${id}`, 'data-ag-part': 'radio',
            checked: value === c.value,
            'aria-disabled': disabled ? 'true' : undefined,
            'aria-describedby': disabled ? noteId : undefined,
            onChange: () => { if (!disabled) apply(prefKey, c.value as never); },
            onClick: (e: React.MouseEvent) => { if (disabled) e.preventDefault(); },
          }),
          ` ${c.label}`,
        );
      }),
    ),
    note ? React.createElement('p', { id: noteId, 'data-ag-floor-note': '', 'data-ag-part': 'floor-note' }, note) : null,
  );
}
