// registry/blocks/settings — PLAT-359. Settings surface: sectioned tabs +
// the MAT GlassPreferencesPanel (S-24) wired to usePreferenceActions, plus
// plain CMP controls for app-level settings rows (replaces the 4.x
// settings-billing/settings-and-billing-suite recipes).
import { useState } from 'react';
import { Card, SegmentedControl, Switch, Tabs, Text } from 'aura-glass';
import { GlassPreferencesPanel, usePreferenceActions } from 'aura-glass/theme';
import type { UserSettableKey } from 'aura-glass/theme';

export interface SettingsSection {
  id: string;
  label: string;
  /** 'preferences' renders GlassPreferencesPanel; 'rows' renders `rows`. */
  kind: 'preferences' | 'rows';
  /** Which preference keys the panel exposes (defaults to all user-settable). */
  preferenceKeys?: readonly UserSettableKey[];
  rows?: SettingsRow[];
}

export interface SettingsRow {
  id: string;
  label: string;
  description?: string;
  control: 'switch' | 'segmented';
  value: boolean | string;
  options?: readonly { value: string; label: string }[];
}

export interface SettingsPanelProps {
  sections: readonly SettingsSection[];
  section?: string;
  defaultSection?: string;
  onSectionChange?: (id: string) => void;
  onRowChange?: (rowId: string, value: boolean | string) => void;
  onPreferenceChange?: (key: UserSettableKey, value: unknown) => void;
}

function useControlled<T>(value: T | undefined, fallback: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [internal, setInternal] = useState(fallback);
  const current = value ?? internal;
  return [current, (v) => { setInternal(v); onChange?.(v); }];
}

export function SettingsPanel({ sections, section, defaultSection, onSectionChange, onRowChange, onPreferenceChange }: SettingsPanelProps) {
  const actions = usePreferenceActions();
  const [current, setCurrent] = useControlled(section, defaultSection ?? sections[0]?.id ?? '', onSectionChange);
  const active = sections.find((s) => s.id === current) ?? sections[0];

  return (
    <Card.Root data-ag-part="root" className="@container">
      <Card.Header data-ag-part="header">
        <Card.Title>Settings</Card.Title>
      </Card.Header>
      <Card.Body data-ag-part="body">
        <Tabs.Root data-ag-part="sections" value={current} onValueChange={(v) => setCurrent(String(v))}>
          <Tabs.List>
            {sections.map((s) => <Tabs.Tab key={s.id} value={s.id}>{s.label}</Tabs.Tab>)}
          </Tabs.List>
          {sections.map((s) => (
            <Tabs.Panel key={s.id} value={s.id} data-ag-part="panel">
              {s.kind === 'preferences' ? (
                <GlassPreferencesPanel
                  keys={s.preferenceKeys}
                  onChange={(key, value) => { actions.set(key as UserSettableKey, value as never); onPreferenceChange?.(key, value); }}
                />
              ) : (
                <div data-ag-part="rows" className="grid gap-4 @md:grid-cols-2">
                  {(s.rows ?? []).map((row) => (
                    <div key={row.id} data-ag-part="row" className="grid gap-1">
                      <Text weight="medium">{row.label}</Text>
                      {row.description ? <Text size="sm" muted>{row.description}</Text> : null}
                      {row.control === 'switch' ? (
                        <Switch checked={Boolean(row.value)} onCheckedChange={(v) => onRowChange?.(row.id, v)} />
                      ) : (
                        <SegmentedControl.Root value={String(row.value)} onValueChange={(v) => onRowChange?.(row.id, String(v))}>
                          {(row.options ?? []).map((o) => (
                            <SegmentedControl.Item key={o.value} value={o.value}>{o.label}</SegmentedControl.Item>
                          ))}
                        </SegmentedControl.Root>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </Card.Body>
    </Card.Root>
  );
}
