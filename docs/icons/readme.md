# Icons

First-party icons live on `aura-glass/icons` and the category subpaths. They replace Lucide for core app chrome. Do not add a separate icon package for symbols that already exist here.

## Entrypoints

```txt
aura-glass/icons
aura-glass/icons/action
aura-glass/icons/navigation
aura-glass/icons/status
aura-glass/icons/media
aura-glass/icons/data
aura-glass/icons/commerce
aura-glass/icons/collaboration
aura-glass/icons/ai
```

Use a category entrypoint when a surface only needs one family. Use `aura-glass/icons` when convenience matters more than a smaller import graph.

## API

Icons are React components created by `createGlassIcon`. They forward a ref and accept SVG props plus:

| Prop | Default | Notes |
| --- | --- | --- |
| `size` | `24` | Number of pixels, or a CSS length string such as `"1.25rem"` |
| `color` | `currentColor` | Stroke color |
| `strokeWidth` | `2` | SVG stroke width |
| `absoluteStrokeWidth` | unset | When set, stroke scales against a 24px viewBox |
| `aria-hidden` | `true` | Decorative by default |

There is no `tone` prop and no `sm` / `md` / `lg` size token. Set color with `color` or `className`.

```tsx
import { GlassIcon, SearchIcon, SettingsIcon } from 'aura-glass/icons';

<SearchIcon aria-hidden="true" size={16} />
<SettingsIcon aria-hidden="true" />
<GlassIcon name="search" size={16} />
```

`GlassIcon` looks up a small name registry and falls back to a circle if the name is unknown:

`activity`, `alert`, `archive`, `calendar`, `check`, `close`, `command`, `data`, `filter`, `home`, `loading`, `menu`, `notification`, `search`, `settings`, `spark`, `user`, `users`, `warning`.

## Named `*Icon` exports

These aliases are exported from `aura-glass/icons` (`src/icons/components.tsx`):

`ActivityIcon`, `AlertCircleIcon`, `AlertTriangleIcon`, `ArrowDownIcon`, `ArrowRightIcon`, `ArrowUpIcon`, `BellIcon`, `CalendarIcon`, `CheckIcon`, `ChevronDownIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronUpIcon`, `ClockIcon`, `CloseIcon`, `CommandIcon`, `CopyIcon`, `DashboardIcon`, `DatabaseIcon`, `DownloadIcon`, `ErrorIcon`, `FileIcon`, `FilterIcon`, `FolderIcon`, `GridIcon`, `HomeIcon`, `ImageIcon`, `InfoIcon`, `ListIcon`, `LoaderIcon`, `MediaIcon`, `MenuIcon`, `MicIcon`, `MoreHorizontalIcon`, `MoreVerticalIcon`, `NotificationIcon`, `PaletteIcon`, `PlayIcon`, `PlusIcon`, `RefreshIcon`, `SaveIcon`, `SearchIcon`, `SendIcon`, `SettingsIcon`, `SparkIcon`, `SuccessIcon`, `UserIcon`, `UsersIcon`, `VideoIcon`, `WarningIcon`, `XIcon`, `ZapIcon`.

The same file also exports the unsuffixed `createGlassIcon` names (`Search`, `Settings`, `ArrowLeft`, `CreditCard`, and others). Prefer the `*Icon` aliases in product code.

## Category subsets

| Subpath | `*Icon` exports |
| --- | --- |
| `aura-glass/icons/action` | `ArrowDownIcon`, `ArrowRightIcon`, `ArrowUpIcon`, `CheckIcon`, `CloseIcon`, `CopyIcon`, `DownloadIcon`, `FilterIcon`, `LoaderIcon`, `PlusIcon`, `RefreshIcon`, `SaveIcon`, `SearchIcon`, `SendIcon`, `XIcon` |
| `aura-glass/icons/navigation` | `CalendarIcon`, `ChevronDownIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `ChevronUpIcon`, `DashboardIcon`, `FolderIcon`, `GridIcon`, `HomeIcon`, `ListIcon`, `MenuIcon`, `MoreHorizontalIcon`, `MoreVerticalIcon`, `SearchIcon`, `SettingsIcon`, `UserIcon`, `UsersIcon` |
| `aura-glass/icons/status` | `AlertCircleIcon`, `AlertTriangleIcon`, `BellIcon`, `ErrorIcon`, `InfoIcon`, `LoaderIcon`, `NotificationIcon`, `SuccessIcon`, `WarningIcon` |
| `aura-glass/icons/media` | `ImageIcon`, `MediaIcon`, `MicIcon`, `PlayIcon`, `VideoIcon` |
| `aura-glass/icons/data` | `ActivityIcon`, `DashboardIcon`, `DatabaseIcon`, `FileIcon`, `FilterIcon`, `GridIcon`, `ListIcon`, `SearchIcon` |
| `aura-glass/icons/commerce` | `CheckIcon`, `DashboardIcon`, `ErrorIcon`, `PlusIcon`, `SuccessIcon`, `WarningIcon` |
| `aura-glass/icons/collaboration` | `BellIcon`, `CopyIcon`, `MicIcon`, `NotificationIcon`, `SendIcon`, `UserIcon`, `UsersIcon` |
| `aura-glass/icons/ai` | `CommandIcon`, `LoaderIcon`, `SearchIcon`, `SendIcon`, `SparkIcon`, `ZapIcon` |

## Accessibility

Icons default to `aria-hidden="true"`. For icon-only controls, put the accessible name on the control:

```tsx
<button type="button" aria-label="Open settings">
  <SettingsIcon aria-hidden="true" />
</button>
```

`GlassIconButton` from `aura-glass/app-shell` requires a `label` and sets `aria-label` for you.

## Migration

Rewrite known Lucide named imports with the package CLI:

```bash
npx aura-glass migrate icons --from lucide --dry-run
npx aura-glass migrate icons --from lucide --write
```

The CLI only rewrites names it can map. Review the report before committing. See [Lucide migration](../migration/lucide-to-auraglass-icons.md) and [CLI](https://auraglass-48859d.gitlab.io/plat/cli).
