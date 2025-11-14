### GlassCheckboxUI

Backward compatibility wrapper for GlassCheckbox component.

```tsx
import { GlassCheckboxUI } from 'aura-glass';

<GlassCheckboxUI
  checked={isChecked}
  onChange={setIsChecked}
  label="Accept terms"
  disabled={false}
/>
```

**Props:**
- `checked?: boolean` - Checkbox state
- `onChange?: (checked: boolean) => void` - State change handler
- `label?: string` - Checkbox label
- `disabled?: boolean` - Disable interaction
- `required?: boolean` - Mark as required
