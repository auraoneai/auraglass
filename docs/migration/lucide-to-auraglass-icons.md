# Migrating From Lucide To AuraGlass Icons

AuraGlass 3.2 moves core app chrome to first-party icons. The goal is that product surfaces can use `aura-glass` without adding `lucide-react` for common controls, navigation, status, media, data, commerce, collaboration, or AI symbols.

## Install Shape

Core UI should only need AuraGlass:

```bash
npm install aura-glass
```

Then import icons from the public icon entrypoint:

```tsx
import { GlassButton } from 'aura-glass';
import { SearchIcon, SettingsIcon, SparkIcon } from 'aura-glass/icons';

export function Toolbar() {
  return (
    <div>
      <GlassButton leftIcon={<SparkIcon aria-hidden="true" />}>Generate</GlassButton>
      <SearchIcon aria-hidden="true" />
      <SettingsIcon title="Settings" />
    </div>
  );
}
```

## Before And After

Before:

```tsx
import { Search, Settings, X } from 'lucide-react';

export function HeaderActions() {
  return (
    <>
      <Search aria-hidden="true" />
      <Settings aria-hidden="true" />
      <X aria-hidden="true" />
    </>
  );
}
```

After:

```tsx
import { CloseIcon, SearchIcon, SettingsIcon } from 'aura-glass/icons';

export function HeaderActions() {
  return (
    <>
      <SearchIcon aria-hidden="true" />
      <SettingsIcon aria-hidden="true" />
      <CloseIcon aria-hidden="true" />
    </>
  );
}
```

## CLI Assistance

Use the migration command in report mode first:

```bash
aura-glass migrate icons --from lucide --dry-run
aura-glass migrate icons --from lucide --json
```

Apply safe named-import rewrites with:

```bash
aura-glass migrate icons --from lucide --write
```

The rewrite aliases AuraGlass icon names back to the existing local component names so JSX usage can remain stable during the first pass:

```tsx
import { SearchIcon as Search, CloseIcon as X } from 'aura-glass/icons';
```

After the app compiles, rename local JSX usages to the canonical `*Icon` names where useful.

## Mapping Guidance

| Lucide usage | AuraGlass icon |
| --- | --- |
| `Search` | `SearchIcon` |
| `Settings` | `SettingsIcon` |
| `X` | `CloseIcon` |
| `Check` | `CheckIcon` |
| `AlertCircle` | `AlertCircleIcon` |
| `AlertTriangle` | `AlertTriangleIcon` |
| `Info` | `InfoIcon` |
| `Loader2` | `LoaderIcon` |
| `Plus` | `AddIcon` |
| `Minus` | `MinusIcon` |
| `Trash2` | `TrashIcon` |
| `Download` | `DownloadIcon` |
| `Upload` | `UploadIcon` |
| `ChevronLeft` | `ChevronLeftIcon` |
| `ChevronRight` | `ChevronRightIcon` |
| `ChevronUp` | `ChevronUpIcon` |
| `ChevronDown` | `ChevronDownIcon` |
| `Home` | `HomeIcon` |
| `Menu` | `MenuIcon` |
| `Sparkles` | `SparkIcon` |
| `Bot` | `BotIcon` |

## Accessibility

Decorative icons should keep `aria-hidden="true"`. Icons that are the only visible label for an action need an accessible name on the button, not only on the icon:

```tsx
<button aria-label="Search">
  <SearchIcon aria-hidden="true" />
</button>
```

Use `title` only when the icon itself is meaningful content. Do not rely on hover titles as the only label for controls.

## Verification

Run these checks after migration:

```bash
aura-glass audit imports
aura-glass audit deps
node scripts/ci/verify-no-core-ui-deps.js
```

The 3.2 release target is zero production imports from `lucide-react`.
