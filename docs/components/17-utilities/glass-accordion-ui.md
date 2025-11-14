### GlassAccordionUI

Backward compatibility wrapper for GlassAccordion component.

```tsx
import { GlassAccordionUI } from 'aura-glass';

<GlassAccordionUI>
  <GlassAccordionUI.Item title="Section 1">
    Content for section 1
  </GlassAccordionUI.Item>
  <GlassAccordionUI.Item title="Section 2">
    Content for section 2
  </GlassAccordionUI.Item>
</GlassAccordionUI>
```

**Props:**
- `children?: ReactNode` - Accordion items
- `multiple?: boolean` - Allow multiple expanded sections
- `defaultExpanded?: string[]` - Initially expanded items
