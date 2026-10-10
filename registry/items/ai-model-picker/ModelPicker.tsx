'use client';
import * as React from 'react';
import { Combobox, Badge } from 'aura-glass';

export interface ModelOption {
  id: string;
  label: string;
  provider: string;
  capabilities?: readonly string[] | undefined;
  contextWindow?: number | undefined;
}

export interface ModelPickerProps {
  options: readonly ModelOption[];
  value?: string | undefined;
  onValueChange?: ((id: string) => void) | undefined;
  /** True while the app's models route (see fixtures.ts `loadModels`) is
   * pending: the trigger and the empty list announce the load instead of
   * "No models". */
  loading?: boolean | undefined;
  'aria-label'?: string | undefined;
}

/** ai-model-picker (SURF-370, REQ-SURF-173): model Combobox grouped by
 * provider, capability Badges and context-window counts. Options come from
 * the app's route that proxies Kiro Prism GET /v1/models — see fixtures.ts. */
export function ModelPicker({ options, value, onValueChange, loading = false, 'aria-label': ariaLabel = 'Model' }: ModelPickerProps) {
  const byProvider = React.useMemo(() => {
    const groups = new Map<string, ModelOption[]>();
    for (const o of options) {
      const list = groups.get(o.provider) ?? [];
      list.push(o);
      groups.set(o.provider, list);
    }
    return groups;
  }, [options]);
  const items = React.useMemo(() => options.map((o) => o.id), [options]);
  return (
    <Combobox.Root
      value={value}
      onValueChange={(v: unknown) => onValueChange?.(String(v))}
      items={items}
    >
      <Combobox.Input aria-label={ariaLabel} placeholder={loading ? 'Loading models…' : 'Search models'} />
      <Combobox.Trigger aria-label={ariaLabel}>
        {loading ? <span data-ag-part="model-loading" role="status">Loading models…</span>
          : options.find((o) => o.id === value)?.label ?? 'Select model'}
      </Combobox.Trigger>
      <Combobox.Content data-ag-part="model-picker">
        <Combobox.Empty>{loading ? 'Loading models…' : 'No models'}</Combobox.Empty>
        {Array.from(byProvider.entries()).map(([provider, opts]) => (
          <React.Fragment key={provider}>
            <div role="presentation" data-ag-part="model-provider">{provider}</div>
            {opts.map((o) => (
              <Combobox.Item key={o.id} value={o.id} data-ag-part="model-option">
                <span>{o.label}</span>
                {o.contextWindow !== undefined ? (
                  <span data-ag-part="model-context">{Math.round(o.contextWindow / 1000)}k</span>
                ) : null}
                {(o.capabilities ?? []).map((c) => <Badge key={c}>{c}</Badge>)}
              </Combobox.Item>
            ))}
          </React.Fragment>
        ))}
      </Combobox.Content>
    </Combobox.Root>
  );
}
