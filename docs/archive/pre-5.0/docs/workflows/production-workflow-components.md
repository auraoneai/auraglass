# Production workflow components

These first-party components cover high-frequency product screens: empty states, loading panels, filter bars, search, form fields, comboboxes, page tabs, and notifications.

Import them from `aura-glass`. They are not exported from `aura-glass/workflows` (that path is workspace chrome). See [workflows/readme.md](./readme.md).

## Components

| Component | Job | Accessibility contract |
| --- | --- | --- |
| `GlassEmptyState` | Empty table, search, card, and workflow panels | `role="status"` with polite live updates |
| `GlassErrorState` | Retryable load failures and warning panels | `role="alert"` for errors, retry button when actionable |
| `GlassLoadingState` | Spinner, skeleton, and progress loading states | `aria-busy`, `role="status"`, and progressbar attributes |
| `GlassFilterBar` | Active filter chips, clear actions, and filter toolbars | Named region, removable filter buttons |
| `GlassSearchField` | Search input with package-owned icon and clear action | Native `type="search"` and `role="searchbox"` |
| `GlassFormField` | Label, help text, validation, and required state wrapper | Semantic label and validation message pairing |
| `GlassFieldGroup` | Grouped form sections and settings panels | Semantic `fieldset` and direct `legend` |
| `GlassValidationMessage` | Error, warning, success, and info validation copy | `alert` for errors, `status` for non-error states |
| `GlassDateField` | Native date input with AuraGlass chrome | Native date input semantics |
| `GlassTimeField` | Native time input with AuraGlass chrome | Native time input semantics |
| `GlassCombobox` | Typeahead option selection with groups | `combobox`, `listbox`, grouped options, keyboard commit |
| `GlassPageTabs` | Page-level workflow tabs | `tablist`, `tab`, `tabpanel`, arrow-key activation |
| `GlassToastProvider` | Toast context and viewport entrypoint | Live-region behavior from `GlassToast` |
| `GlassNotificationCenter` | Notification list and center | Polite live-region notification stack |

## Example

```tsx
import {
  GlassCombobox,
  GlassDateField,
  GlassFieldGroup,
  GlassFilterBar,
  GlassFormField,
  GlassPageTabs,
  GlassSearchField,
  GlassTimeField,
} from 'aura-glass';
import 'aura-glass/styles';

export function OperationsWorkflow() {
  return (
    <GlassPageTabs
      tabs={[
        {
          value: 'filters',
          label: 'Filters',
          panel: (
            <>
              <GlassFilterBar
                filters={[{ id: 'status', label: 'Status', value: 'Open' }]}
              />
              <GlassSearchField label="Search workflows" />
              <GlassCombobox
                label="Owner"
                options={[
                  { value: 'design', label: 'Design', group: 'Teams' },
                  { value: 'support', label: 'Support', group: 'Teams' },
                ]}
              />
            </>
          ),
        },
        {
          value: 'schedule',
          label: 'Schedule',
          panel: (
            <GlassFieldGroup legend="Release window" columns={2}>
              <GlassFormField label="Date" htmlFor="release-date">
                <GlassDateField id="release-date" label="Date" />
              </GlassFormField>
              <GlassFormField label="Time" htmlFor="release-time">
                <GlassTimeField id="release-time" label="Time" />
              </GlassFormField>
            </GlassFieldGroup>
          ),
        },
      ]}
    />
  );
}
```

## Verification

- `npm test -- --runTestsByPath src/__tests__/production-workflow-components.test.tsx --runInBand`
- `npm run typecheck -- --pretty false`
- Storybook: `src/stories/ProductionWorkflowComponents.stories.tsx`

## Limits

`GlassCombobox` and `GlassMultiSelect` provide the current keyboard/typeahead foundation. Full screen-reader certification for every workflow route still belongs in the final release accessibility pass.
