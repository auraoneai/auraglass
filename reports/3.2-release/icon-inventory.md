# 3.2 Icon Inventory

This ledger tracks the move from Lucide imports to first-party AuraGlass icons.

## Icon Families

| Family | Required examples | Status | Evidence |
| --- | --- | --- | --- |
| Action | `AddIcon`, `CloseIcon`, `CheckIcon`, `SaveIcon`, `TrashIcon`, `DownloadIcon`, `UploadIcon` | Pass | `aura-glass/icons/action` export and package export tests |
| Navigation | `ChevronLeftIcon`, `MenuIcon`, `HomeIcon`, `SearchIcon`, `SettingsIcon` | Pass | `aura-glass/icons/navigation` export and tree-shaking gate |
| Status | `InfoIcon`, `WarningIcon`, `ErrorIcon`, `SuccessIcon`, `LoaderIcon`, `ShieldIcon` | Pass | `aura-glass/icons/status` export |
| Media | `PlayIcon`, `PauseIcon`, `VolumeIcon`, `ImageIcon`, `VideoIcon`, `MusicIcon` | Pass | `aura-glass/icons/media` export |
| Data | `ChartIcon`, `TableIcon`, `FilterIcon`, `CalendarIcon`, `DatabaseIcon` | Pass | `aura-glass/icons/data` export |
| AI | `SparkIcon`, `WandIcon`, `CommandIcon`, `BotIcon`, `BrainIcon` | Pass | `aura-glass/icons/ai` export |
| Commerce | `CartIcon`, `CreditCardIcon`, `ReceiptIcon`, `PackageIcon`, `TagIcon` | Pass | `aura-glass/icons/commerce` export |
| Collaboration | `UserIcon`, `UsersIcon`, `CommentIcon`, `BellIcon`, `PresenceIcon` | Pass | `aura-glass/icons/collaboration` export |

## Migration Inventory

| Command | Result |
| --- | --- |
| `node scripts/ci/verify-no-core-ui-deps.js --json` | Pass; zero production Lucide imports |
| `aura-glass migrate icons --from lucide --dry-run --json` | Pass; dry-run returns zero changed files for this checkout |
| `node scripts/ci/verify-tree-shaking.js --strict --json` | Pass; icon import scenario stays under budget |
| `npm run test:exports:cjs` and `npm run test:exports:esm` | Pass; icon subpaths load |

## Acceptance Targets

- Zero production imports from `lucide-react`: verified.
- No Lucide re-exports: verified by source and export audit.
- No copied Lucide source paths: no Lucide package import or source dependency remains in package metadata/source.
- Icons render in SSR: icon components are React SVG components without browser globals.
- Icons support accessible naming and decorative usage: shared icon factory supports title/ARIA behavior.
- Icons tree-shake by named import: strict tree-shaking scenario passed.

## Notes

The first-party icon system covers the app-surface needs of 3.2. Future expansion should add brand-specific iconography and more specialty workflow symbols without reintroducing a third-party icon runtime dependency.
