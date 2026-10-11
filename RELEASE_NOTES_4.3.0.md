# aura-glass 4.3.0 release notes

## Moved dependencies (install them yourself)

These packages were `dependencies` in v4.1.0 and are now
`peerDependencies`; npm no longer installs them for you. Install the ones
whose feature you use. Without the package, the feature throws at call
time; importing `aura-glass` itself does not.

| Package | Range in v4.1.0 | Peer range | Optional | Deprecation |
| --- | --- | --- | --- | --- |
| `@google-cloud/vision` | `^5.3.4` | `^5.3.4` | yes | `DEP-P0035` (since 4.2.0, removed in 5.0.0) |
| `@pinecone-database/pinecone` | `^7.2.0` | `^7.2.0` | yes | `DEP-P0034` (since 4.2.0, removed in 5.0.0) |
| `@sentry/node` | `^10.56.0` | `^10.56.0` | yes | `DEP-P0036` (since 4.2.0, removed in 5.0.0) |
| `bcryptjs` | `^3.0.3` | `^3.0.3` | yes | `DEP-P0031` (since 4.2.0, removed in 5.0.0) |
| `chart.js` | `^4.5.0` | `^4.5.0` | yes | `DEP-P0037` (since 4.2.0, removed in 5.0.0) |
| `compression` | `^1.8.1` | `^1.8.1` | yes | `DEP-P0025` (since 4.2.0, removed in 5.0.0) |
| `cors` | `^2.8.6` | `^2.8.6` | yes | `DEP-P0024` (since 4.2.0, removed in 5.0.0) |
| `date-fns` | `^4.1.0` | `^4.1.0` | yes | `DEP-P0039` (since 4.2.0, removed in 5.0.0) |
| `dotenv` | `^17.4.2` | `^17.4.2` | yes | `DEP-P0032` (since 4.2.0, removed in 5.0.0) |
| `express` | `^5.2.1` | `^5.2.1` | yes | `DEP-P0021` (since 4.2.0, removed in 5.0.0) |
| `express-rate-limit` | `^8.5.2` | `^8.5.2` | yes | `DEP-P0022` (since 4.2.0, removed in 5.0.0) |
| `framer-motion` | `^11.18.2` | `^11.18.2` | yes | `DEP-P0041` (since 4.2.0, removed in 5.0.0) |
| `helmet` | `^8.2.0` | `^8.2.0` | yes | `DEP-P0023` (since 4.2.0, removed in 5.0.0) |
| `ioredis` | `^5.11.1` | `^5.11.1` | yes | `DEP-P0028` (since 4.2.0, removed in 5.0.0) |
| `jsonwebtoken` | `^9.0.3` | `^9.0.3` | yes | `DEP-P0030` (since 4.2.0, removed in 5.0.0) |
| `openai` | `^6.10.0` | `^6.10.0` | yes | `DEP-P0033` (since 4.2.0, removed in 5.0.0) |
| `react-chartjs-2` | `^5.3.0` | `^5.3.0` | yes | `DEP-P0038` (since 4.2.0, removed in 5.0.0) |
| `react-hook-form` | `^7.54.0` | `^7.0.0` | yes | `DEP-P0072` (since 4.2.0, removed in 5.0.0) |
| `redis` | `^5.10.0` | `^5.10.0` | yes | `DEP-P0029` (since 4.2.0, removed in 5.0.0) |
| `socket.io` | `^4.8.3` | `^4.8.3` | yes | `DEP-P0026` (since 4.2.0, removed in 5.0.0) |
| `socket.io-client` | `^4.8.3` | `^4.8.3` | yes | `DEP-P0027` (since 4.2.0, removed in 5.0.0) |
| `zod` | `^3.22.0` | `^3.22.0` | yes | `DEP-P0040` (since 4.2.0, removed in 5.0.0) |

## Changelog

From `CHANGELOG.md` `[4.3.0] - Unreleased`.

Minor release on `release/4.x`: the bridge to 5.0. The 5.0 entry points can be used next to the 4.x API, the remaining 5.0 removals start warning in development, and `@auraglass/cli@0.x` ships with the `migrate 4to5` codemods.

### Deprecated

- 190 new DEP entries with `since: 4.3.0`, generated from `fragments/deprecations/*.ts`; `RELEASE_NOTES_4.3.0.md` lists each one. 54 have `removeIn: 5.0.0`. The other 136 are component renames that keep a compat export through 5.x (`removeIn: 6.0.0`):
  - components: 146 `DEP-C*` entries (144 exports, one subpath, one prop value), e.g. `GlassButton`, `GlassToolbar` and `GlassCommandBar`;
  - material and theme: 29 `DEP-M*` entries (`DEP-M0948`–`DEP-M0976`): the `--glass-*`, `--aura-*`, `--persona-*` and `--glass-theme-*` variables, the `data-theme`/`data-persona`/`data-bg` and `.dark`/`.light` hooks, the persona and theme helpers (`PersonaPicker`, `usePersonaTheme`, `createBrandGlassTheme`, `createGlassThemeCssVars`, `glassMaterialPresets`, `auraTokens`), the `COLORS`/`BORDER_RADIUS`/`BOX_SHADOW` constants and the `glass-*` slash utilities;
  - platform: 12 `DEP-P*` entries (`DEP-P0060`–`DEP-P0071`): the bundled `aura-glass` bin, `./styles`, `./tokens/{css,tailwind,json,manifest}`, `./utils/env`, deep `./primitives/*` and `./icons/*` imports, the CommonJS entry, React 18 and Node < 20.19;
  - surfaces: 3 `DEP-S*` entries (`DEP-S0614`–`DEP-S0616`): `ImageList`, `ImageListItem` and `ImageListItemBar`.

### Added

- 5.0 bridge entry points, emitted at `prepack` by `scripts/ci/prune-bridge-exports.mjs` when their sources exist: `aura-glass/material`, `aura-glass/styles/v5.css`, `aura-glass/compat/tokens.css` and `aura-glass/compat/globals.css` (REQ-PLAT-156/157).
- `@auraglass/cli@0.x`: `init`, `add`/`diff`/`update`, `doctor --v5` and the `migrate 4to5` codemods. It is published by the v4.3.0 tag pipeline after `scripts/release/verify-codemods-gate.mjs` passes: non-empty `fragments/codemods/{mat,cmp,surf}.ts` and a clean `migrate 4to5 --dry-run` on the `consumer-4x` fixture (REQ-PLAT-62).
- The bundled `aura-glass` bin prints `aura-glass CLI moved: use npx @auraglass/cli <command>` once per run; `doctor --v5` reports undeclared imports.

### Internal (no change to the published package)

- `consumer-4x` fixture (Next 15 + React 19, Vite + React 18.3) frozen as the migration target; `verify-codemods-gate.mjs` tag gate; release notes accept DEP entries from an untagged minor inside the tag range.

## Downstream grep record

_Not committed yet: `docs/release/decisions/downstream-4.3.0.json` (operator run OP-2 at the cut). The tag pipeline refuses to render these notes without it._

## Deprecations added

The 22 dependency entries are in the table above.

- `DEP-C0001` (export . GlassButton, removed in 6.0.0): 'GlassButton' is renamed to 'Button' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0003` (export . EnhancedGlassButton, removed in 6.0.0): 'EnhancedGlassButton' is renamed to 'Button' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0004` (export . RippleButton, removed in 6.0.0): 'RippleButton' is renamed to 'Button' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0005` (export . GlassLinkButton, removed in 6.0.0): 'GlassLinkButton' is renamed to 'Button' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0006` (export . ToggleButton, removed in 6.0.0): 'ToggleButton' is renamed to 'ToggleGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0007` (export . MagneticButton, removed in 6.0.0): 'MagneticButton' is renamed to 'Button' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0008` (export . GlassFab, removed in 6.0.0): 'GlassFab' is renamed to 'IconButton' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0009` (export . LiquidGlassButtonStyle, removed in 6.0.0): 'LiquidGlassButtonStyle' style presets are gone; Button variants cover them. Compat export warns on first read.
- `DEP-C0010` (export . GlassIconButton, removed in 6.0.0): 'GlassIconButton' is renamed to 'IconButton' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0011` (export . LiquidGlassControlGroup, removed in 6.0.0): 'LiquidGlassControlGroup' is renamed to 'ButtonGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0012` (export . LiquidGlassToolbar, removed in 6.0.0): 'LiquidGlassToolbar' is renamed to 'Toolbar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0013` (export . GlassToolbar, removed in 6.0.0): 'GlassToolbar' is renamed to 'Toolbar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0014` (export . ToggleButtonGroup, removed in 6.0.0): 'ToggleButtonGroup' is renamed to 'ToggleGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0015` (export . GlassToggle, removed in 6.0.0): 'GlassToggle' is renamed to 'ToggleGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0016` (export . GlassCommandBar, removed in 6.0.0): 'GlassCommandBar' is renamed to 'Toolbar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0017` (export . LiquidGlassMapControls, removed in 6.0.0): 'LiquidGlassMapControls' is renamed to 'Toolbar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0018` (export . GlassActionBar, removed in 6.0.0): 'GlassActionBar' is renamed to 'Toolbar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0019` (export . GlassSegmentedControl, removed in 6.0.0): 'GlassSegmentedControl' is renamed to 'SegmentedControl' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0020` (export . LiquidGlassSegmentedControl, removed in 6.0.0): 'LiquidGlassSegmentedControl' is renamed to 'SegmentedControl' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0021` (export . GlassSwitch, removed in 6.0.0): 'GlassSwitch' is renamed to 'Switch' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0022` (export . GlassSlider, removed in 6.0.0): 'GlassSlider' is renamed to 'Slider' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0023` (export . GlassCheckbox, removed in 6.0.0): 'GlassCheckbox' is renamed to 'Checkbox' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0024` (export . GlassCheckboxGroup, removed in 6.0.0): 'GlassCheckboxGroup' is renamed to 'CheckboxGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0025` (export . GlassRadioGroup, removed in 6.0.0): 'GlassRadioGroup' is renamed to 'RadioGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0026` (export . GlassInput, removed in 6.0.0): 'GlassInput' is renamed to 'TextField' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0027` (export . GlassTextarea, removed in 6.0.0): 'GlassTextarea' is renamed to 'TextField' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0028` (export . GlassFieldGroup, removed in 6.0.0): 'GlassFieldGroup' is renamed to 'Fieldset' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0029` (export . GlassValidationMessage, removed in 6.0.0): 'GlassValidationMessage' is renamed to 'Field.Error' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0030` (export . GlassFormField, removed in 6.0.0): 'GlassFormField' is renamed to 'Field' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0031` (export . LiquidGlassSearchField, removed in 6.0.0): 'LiquidGlassSearchField' is renamed to 'SearchField' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0032` (export . GlassSearchField, removed in 6.0.0): 'GlassSearchField' is renamed to 'SearchField' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0033` (export . GlassSearchInterface, removed in 6.0.0): 'GlassSearchInterface' results pane has no 5.0 equivalent; the input maps to SearchField, the pane to Combobox/registry faceted-search.
- `DEP-C0034` (export . GlassIntelligentSearch, removed in 6.0.0): 'GlassIntelligentSearch' AI features were 4.x speculation; the input maps to SearchField.
- `DEP-C0035` (export . GlassSelect, removed in 6.0.0): 'GlassSelect' is renamed to 'Select' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0036` (export . GlassSelectCompound, removed in 6.0.0): 'GlassSelectCompound' is renamed to 'Select' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0037` (export . GlassCombobox, removed in 6.0.0): 'GlassCombobox' is renamed to 'Combobox' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0038` (export . GlassMultiSelect, removed in 6.0.0): 'GlassMultiSelect' is renamed to 'Combobox' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0039` (export . GlassTagInput, removed in 6.0.0): 'GlassTagInput' is renamed to 'Combobox' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0040` (export . GlassMentionList, removed in 6.0.0): 'GlassMentionList' trigger detection is consumer code in 5.0; the list maps to Combobox.
- `DEP-C0041` (export . GlassMagneticButton, removed in 6.0.0): 'GlassMagneticButton' is renamed to 'Button' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0101` (export . GlassModal, removed in 6.0.0): 'GlassModal' is renamed to 'Dialog' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0102` (export . GlassDialog, removed in 6.0.0): 'GlassDialog' is renamed to 'Dialog' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0103` (export . GlassDrawer, removed in 6.0.0): 'GlassDrawer' is renamed to 'Sheet' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0104` (export . GlassBottomSheet, removed in 6.0.0): 'GlassBottomSheet' is renamed to 'Sheet' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0105` (export . GlassActionSheet, removed in 6.0.0): 'GlassActionSheet' is renamed to 'Sheet' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0106` (export . LiquidGlassAdaptiveSheet, removed in 6.0.0): 'LiquidGlassAdaptiveSheet' is renamed to 'Sheet' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0107` (export . GlassPopover, removed in 6.0.0): 'GlassPopover' is renamed to 'Popover' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0108` (export . GlassHoverCard, removed in 6.0.0): 'GlassHoverCard' is renamed to 'Popover' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0109` (export . GlassTooltip, removed in 6.0.0): 'GlassTooltip' is renamed to 'Tooltip' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0110` (export . Positioner, removed in 6.0.0): 'Positioner' is renamed to 'Popover.Positioner' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0111` (export . GlassDropdownMenu, removed in 6.0.0): 'GlassDropdownMenu' is renamed to 'Menu' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0112` (export . GlassContextMenu, removed in 6.0.0): 'GlassContextMenu' is renamed to 'ContextMenu' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0113` (export . GlassMenubar, removed in 6.0.0): 'GlassMenubar' is renamed to 'Menubar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0114` (export . LiquidGlassPopoverMenu, removed in 6.0.0): 'LiquidGlassPopoverMenu' is renamed to 'Menu' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0115` (export . GlassToast, removed in 6.0.0): 'GlassToast' declarative mounts map to useToast().add; keep markup only for bespoke layouts.
- `DEP-C0116` (export . GlassToastProvider, removed in 6.0.0): 'GlassToastProvider' is renamed to 'Toast.Provider' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0117` (export . GlassToastViewport, removed in 6.0.0): 'GlassToastViewport' is renamed to 'Toast.Viewport' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0118` (export . useToast, removed in 6.0.0): 4.x useToast returns {toast,addToast,dismiss,removeToast}; 5.0 useToast returns {add,close,update,promise,history,toasts}.
- `DEP-C0119` (export . GlassNotificationCenter, removed in 6.0.0): 'GlassNotificationCenter' is renamed to 'Popover' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0120` (export . GlassPositioner, removed in 6.0.0): 'GlassPositioner' is renamed to 'Popover.Positioner' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0121` (export . GlassNotificationProvider, removed in 6.0.0): 'GlassNotificationProvider' is renamed to 'Toast.Provider' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0122` (export . useNotifications, removed in 6.0.0): 'useNotifications' is renamed to 'useToast' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0123` (subpath ./overlays *, removed in 5.0.0): The 'aura-glass/overlays' subpath is gone; overlay exports live on the root entry.
- `DEP-C0130` (export . GlassAchievementNotifications, removed in 5.0.0): 'GlassAchievementNotifications' is removed; feed achievements through useToast().add.
- `DEP-C0131` (export . GlassTransitions.GlassModal, removed in 5.0.0): 'GlassTransitions.GlassModal' is removed; use Dialog (transitions are built in).
- `DEP-C0132` (export . MobileGlassBottomSheet, removed in 5.0.0): 'MobileGlassBottomSheet' is removed; use Sheet with side='bottom'.
- `DEP-C0208` (prop-value . GlassButton.material, removed in 5.0.0): GlassButton material='liquid' maps to variant='prominent' in 5.0 (the default material changed).
- `DEP-C0231` (export . GlassCard, removed in 6.0.0): 'GlassCard' is renamed to 'Card' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0232` (export . GlowingCard, removed in 6.0.0): 'GlowingCard' is renamed to 'Card' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0233` (export . WidgetGlass, removed in 6.0.0): 'WidgetGlass' is renamed to 'Card' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0234` (export . GlassWorkspacePanel, removed in 6.0.0): 'GlassWorkspacePanel' is renamed to 'Card' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0235` (export . GlassBadge, removed in 6.0.0): 'GlassBadge' is renamed to 'Badge' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0236` (export . LiquidGlassBadgeCluster, removed in 6.0.0): 'LiquidGlassBadgeCluster' is renamed to 'Badge' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0237` (export . GlassStatusDot, removed in 6.0.0): 'GlassStatusDot' is renamed to 'Badge' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0238` (export . GlassConnectionStatus, removed in 6.0.0): 'GlassConnectionStatus' is renamed to 'Badge' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0239` (export . GlassAvatar, removed in 6.0.0): 'GlassAvatar' is renamed to 'Avatar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0240` (export . GlassAvatarGroup, removed in 6.0.0): 'GlassAvatarGroup' is renamed to 'AvatarGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0241` (export . GlassAlert, removed in 6.0.0): 'GlassAlert' is renamed to 'Alert' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0242` (export . GlassProgress, removed in 6.0.0): 'GlassProgress' is renamed to 'Progress' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0243` (export . CircularProgress, removed in 6.0.0): 'CircularProgress' is renamed to 'Progress' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0244` (export . GlassSkeleton, removed in 6.0.0): 'GlassSkeleton' is renamed to 'Skeleton' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0245` (export . GlassLoadingSkeleton, removed in 6.0.0): 'GlassLoadingSkeleton' is renamed to 'Skeleton' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0246` (export . GlassSeparator, removed in 6.0.0): 'GlassSeparator' is renamed to 'Separator' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0247` (export . GlassDivider, removed in 6.0.0): 'GlassDivider' is renamed to 'Separator' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0248` (export . GlassEmptyState, removed in 6.0.0): 'GlassEmptyState' is renamed to 'EmptyState' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0249` (export . GlassErrorState, removed in 6.0.0): 'GlassErrorState' is renamed to 'ErrorState' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0250` (export . GlassLoadingState, removed in 6.0.0): 'GlassLoadingState' is renamed to 'LoadingState' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0251` (export . GlassAccordion, removed in 6.0.0): 'GlassAccordion' is renamed to 'Accordion' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0252` (export . GlassScrollArea, removed in 6.0.0): 'GlassScrollArea' is renamed to 'ScrollArea' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0253` (export . GlassRating, removed in 6.0.0): 'GlassRating' is renamed to 'Rating' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0254` (export . GlassInlineEdit, removed in 6.0.0): 'GlassInlineEdit' is renamed to 'InlineEdit' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0255` (export . GlassFileUpload, removed in 6.0.0): 'GlassFileUpload' is renamed to 'FileUpload' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0256` (export . GlassColorPicker, removed in 6.0.0): 'GlassColorPicker' is renamed to 'ColorPicker' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0257` (export . GlassColorWheel, removed in 6.0.0): 'GlassColorWheel' is renamed to 'ColorPicker' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0258` (export . GlassGradientPicker, removed in 6.0.0): 'GlassGradientPicker' is renamed to 'ColorPicker' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0259` (export . ImageList, removed in 6.0.0): 'ImageList' is renamed to 'ImageList' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0260` (export . ImageListItem, removed in 6.0.0): 'ImageListItem' is renamed to 'ImageList.Item' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0261` (export . ImageListItemBar, removed in 6.0.0): 'ImageListItemBar' is renamed to 'ImageList.ItemBar' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0262` (export . GlassGallery, removed in 6.0.0): 'GlassGallery' is renamed to 'ImageList' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0263` (export . GlassCoachmarks, removed in 6.0.0): 'GlassCoachmarks' is renamed to 'Tour' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0264` (export . GlassSpotlight, removed in 6.0.0): 'GlassSpotlight' is renamed to 'Tour' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0265` (export . Typography, removed in 6.0.0): 'Typography' is renamed to 'Text' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0266` (export . DisplayText, removed in 6.0.0): 'DisplayText' is renamed to 'Heading' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0267` (export . GlassStack, removed in 6.0.0): 'GlassStack' is renamed to 'Stack' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0268` (export . GlassFlex, removed in 6.0.0): 'GlassFlex' is renamed to 'Stack' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0269` (export . Box, removed in 6.0.0): 'Box' is renamed to 'Stack' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0270` (export . GlassGrid, removed in 6.0.0): 'GlassGrid' is renamed to 'Grid' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0271` (export . GlassMasonry, removed in 6.0.0): 'GlassMasonry' is renamed to 'Grid' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0272` (export . GlassMasonryGrid, removed in 6.0.0): 'GlassMasonryGrid' is renamed to 'Grid' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0273` (export . GlassContainer, removed in 6.0.0): 'GlassContainer' is renamed to 'Container' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0274` (export . createGlassIcon, removed in 6.0.0): 'createGlassIcon' is renamed to 'createIcon' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0275` (export . GlassSlot, removed in 6.0.0): 'GlassSlot' is renamed to 'Slot' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0276` (export . GlassPortal, removed in 6.0.0): 'GlassPortal' is renamed to 'Portal' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0277` (export . GlassFocusScope, removed in 6.0.0): 'GlassFocusScope' is renamed to 'FocusScope' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0278` (export . GlassDismissableLayer, removed in 6.0.0): 'GlassDismissableLayer' is renamed to 'DismissableLayer' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0279` (export . GlassLabelPrimitive, removed in 6.0.0): 'GlassLabelPrimitive' is renamed to 'Label' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0280` (export . GlassLabel, removed in 6.0.0): 'GlassLabel' is renamed to 'Label' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0281` (export . LabelRoot, removed in 6.0.0): 'LabelRoot' is renamed to 'Label' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0282` (export . GlassStepper, removed in 6.0.0): 'GlassStepper' is renamed to 'GlassStepper' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0283` (export . GlassForm, removed in 6.0.0): 'GlassForm' is renamed to 'Form' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0284` (export . GlassNotificationItem, removed in 6.0.0): 'GlassNotificationItem' is renamed to 'Toast' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0285` (export . GlassDropdownMenuTrigger, removed in 6.0.0): 'GlassDropdownMenuTrigger' is renamed to 'Menu.Trigger' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0286` (export . GlassDropdownMenuContent, removed in 6.0.0): 'GlassDropdownMenuContent' is renamed to 'Menu.Popup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0287` (export . GlassDropdownMenuItem, removed in 6.0.0): 'GlassDropdownMenuItem' is renamed to 'Menu.Item' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0288` (export . GlassDropdownMenuCheckboxItem, removed in 6.0.0): 'GlassDropdownMenuCheckboxItem' is renamed to 'Menu.CheckboxItem' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0289` (export . GlassDropdownMenuRadioGroup, removed in 6.0.0): 'GlassDropdownMenuRadioGroup' is renamed to 'Menu.RadioGroup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0290` (export . GlassDropdownMenuRadioItem, removed in 6.0.0): 'GlassDropdownMenuRadioItem' is renamed to 'Menu.RadioItem' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0291` (export . GlassDropdownMenuLabel, removed in 6.0.0): 'GlassDropdownMenuLabel' is renamed to 'Menu.GroupLabel' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0292` (export . GlassDropdownMenuSeparator, removed in 6.0.0): 'GlassDropdownMenuSeparator' is renamed to 'Menu.Separator' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0293` (export . GlassDropdownMenuGroup, removed in 6.0.0): 'GlassDropdownMenuGroup' is renamed to 'Menu.Group' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0294` (export . GlassDropdownMenuPortal, removed in 6.0.0): 'GlassDropdownMenuPortal' is renamed to 'Menu.Portal' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0295` (export . GlassDropdownMenuSub, removed in 6.0.0): 'GlassDropdownMenuSub' is renamed to 'Menu.SubmenuRoot' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0296` (export . GlassDropdownMenuSubTrigger, removed in 6.0.0): 'GlassDropdownMenuSubTrigger' is renamed to 'Menu.SubmenuTrigger' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0297` (export . GlassDropdownMenuArrow, removed in 6.0.0): 'GlassDropdownMenuArrow' is renamed to 'Menu.Arrow' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0298` (export . GlassSelectTrigger, removed in 6.0.0): 'GlassSelectTrigger' is renamed to 'Select.Trigger' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0299` (export . GlassSelectValue, removed in 6.0.0): 'GlassSelectValue' is renamed to 'Select.Value' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0300` (export . GlassSelectContent, removed in 6.0.0): 'GlassSelectContent' is renamed to 'Select.Popup' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0301` (export . GlassSelectItem, removed in 6.0.0): 'GlassSelectItem' is renamed to 'Select.Item' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0302` (export . GlassSelectLabel, removed in 6.0.0): 'GlassSelectLabel' is renamed to 'Select.GroupLabel' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0303` (export . GlassSelectGroup, removed in 6.0.0): 'GlassSelectGroup' is renamed to 'Select.Group' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0304` (export . GlassSelectSeparator, removed in 6.0.0): 'GlassSelectSeparator' is renamed to 'Select.Separator' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).
- `DEP-C0305` (export . HStack, removed in 5.0.0): 'HStack' is removed in aura-glass 5.0; use 'Stack' instead.
- `DEP-C0306` (export . VStack, removed in 5.0.0): 'VStack' is removed in aura-glass 5.0; use 'Stack' instead.
- `DEP-C0307` (export . RovingFocusGroup, removed in 5.0.0): 'RovingFocusGroup' is removed in aura-glass 5.0.
- `DEP-C0308` (export . FocusTrap, removed in 5.0.0): 'FocusTrap' is removed in aura-glass 5.0.
- `DEP-C0309` (export . SkipLinks, removed in 5.0.0): 'SkipLinks' is removed in aura-glass 5.0.
- `DEP-M0948` (css-global . .high-contrast, removed in 5.0.0): the .high-contrast hook is removed in 5.0; use data-ag-contrast="more".
- `DEP-M0949` (css-global . .large-text, removed in 5.0.0): the .large-text hook is removed in 5.0; use data-ag-text="large" (5.x preference attribute).
- `DEP-M0950` (data-attr . data-color-blindness, removed in 5.0.0): the data-color-blindness hook is removed in 5.0; color-vision modes are dropped — contrast floors apply.
- `DEP-M0951` (css-global . glass-contrast-guard, removed in 5.0.0): the glass-contrast-guard hook is removed in 5.0; use solved contrast floors (no CSS hook).
- `DEP-M0952` (css-global . glass-focus, removed in 5.0.0): the glass-focus hook is removed in 5.0; use focus.css focus styles.
- `DEP-M0953` (css-global . glass-touch-target, removed in 5.0.0): the glass-touch-target hook is removed in 5.0; use the 5.x target-size floor (built into components).
- `DEP-M0954` (css-var . --glass-*, removed in 5.0.0): the --glass-* variables are removed in 5.0; use --ag-* — compat/tokens.css aliases reads only (codemod: css-vars).
- `DEP-M0955` (css-var . --aura-*, removed in 5.0.0): the --aura-* variables are removed in 5.0; use --ag-* — compat/tokens.css aliases reads only (codemod: css-vars).
- `DEP-M0956` (css-var . --persona-*, removed in 5.0.0): the --persona-* variables are removed in 5.0; use --ag-* — compat/tokens.css aliases reads only (codemod: css-vars).
- `DEP-M0957` (css-var . --glass-theme-*, removed in 5.0.0): the --glass-theme-* variables are removed in 5.0; use --ag-* — compat/tokens.css aliases reads only (codemod: css-vars).
- `DEP-M0958` (data-attr . data-theme, removed in 5.0.0): the data-theme hook is removed in 5.0; use data-ag-scheme (compat/tokens.css aliases the scheme hooks only).
- `DEP-M0959` (data-attr . data-aura-theme, removed in 5.0.0): the data-aura-theme hook is removed in 5.0; use data-ag-scheme.
- `DEP-M0960` (data-attr . data-aura-*, removed in 5.0.0): the data-aura-* hook is removed in 5.0; use data-ag-* attributes.
- `DEP-M0961` (data-attr . data-persona, removed in 5.0.0): the data-persona hook is removed in 5.0; use data-ag-preset.
- `DEP-M0962` (data-attr . data-bg, removed in 5.0.0): the data-bg hook is removed in 5.0; use data-ag-backdrop.
- `DEP-M0963` (css-global . .dark / .light, removed in 5.0.0): the .dark / .light hook is removed in 5.0; use data-ag-scheme="dark|light" (compat aliases the scheme hooks only).
- `DEP-M0964` (css-global . .glass-on-light / .glass-on-dark, removed in 5.0.0): the .glass-on-light / .glass-on-dark hook is removed in 5.0; use data-ag-scheme-scoped selectors.
- `DEP-M0965` (export ./tokens auraTokens, removed in 5.0.0): auraTokens is removed in 5.0; use tokens (the only aura-glass/tokens export in 5.0) (codemod: providers).
- `DEP-M0966` (export . PersonaPicker, removed in 5.0.0): PersonaPicker is removed in 5.0; use presets + createBrandTheme (no picker ships in 5.x) (codemod: providers).
- `DEP-M0967` (export . usePersonaTheme, removed in 5.0.0): usePersonaTheme is removed in 5.0; use createBrandTheme + usePreference (codemod: providers).
- `DEP-M0968` (export ./theme glassMaterialPresets, removed in 5.0.0): glassMaterialPresets is removed in 5.0; use the 5.x presets table / MaterialSpec (codemod: providers).
- `DEP-M0969` (export ./theme createBrandGlassTheme, removed in 5.0.0): createBrandGlassTheme is deprecated; use createBrandTheme (codemod: providers). A compat re-export ships at aura-glass/compat.
- `DEP-M0970` (export ./theme createGlassThemeCssVars, removed in 5.0.0): createGlassThemeCssVars is deprecated; use createGlassTheme(...).vars (codemod: providers).
- `DEP-M0971` (prop-value . GlassThemeMode "high-contrast", removed in 5.0.0): the "high-contrast" GlassThemeMode is removed in 5.0; high contrast is the contrast="more" preference (codemod: providers).
- `DEP-M0972` (prop-value . GlassDensity "comfortable", removed in 5.0.0): the "comfortable" GlassDensity is removed in 5.0; density maps onto the 5.x scale (codemod: providers; see §21 OI-03).
- `DEP-M0973` (export ./tokens COLORS, removed in 5.0.0): the COLORS design constant is removed in 5.0; values ship as tokens (codemod: removed).
- `DEP-M0974` (export ./tokens BORDER_RADIUS, removed in 5.0.0): the BORDER_RADIUS design constant is removed in 5.0; values ship as tokens (codemod: removed).
- `DEP-M0975` (export ./tokens BOX_SHADOW, removed in 5.0.0): the BOX_SHADOW design constant is removed in 5.0; values ship as tokens (codemod: removed).
- `DEP-M0976` (css-global . glass-* slash utilities, removed in 5.0.0): the glass-* slash utilities are removed in 5.0; utility output is generated from --ag-* tokens (codemod: css-vars).
- `DEP-P0060` (subpath bin/aura-glass.cjs aura-glass bin, removed in 5.0.0): the bundled aura-glass CLI moved to @auraglass/cli in 5.0.0.
- `DEP-P0061` (subpath ./styles styles subpath, removed in 5.0.0): the ./styles subpath is replaced by ./styles/v5.css in 5.0.0.
- `DEP-P0062` (subpath ./tokens/css tokens css subpath, removed in 5.0.0): the ./tokens/css subpath moves to the 5.0 token table.
- `DEP-P0063` (subpath ./tokens/tailwind tailwind theme subpath, removed in 5.0.0): the ./tokens/tailwind subpath moves to the 5.0 preset.
- `DEP-P0064` (subpath ./tokens/json tokens json subpath, removed in 5.0.0): the ./tokens/json subpath moves to the 5.0 manifest.
- `DEP-P0065` (subpath ./tokens/manifest tokens manifest subpath, removed in 5.0.0): the ./tokens/manifest subpath moves to the 5.0 manifest.
- `DEP-P0066` (export ./primitives/* per-primitive deep imports, removed in 5.0.0): deep ./primitives/<name> imports move to the root export in 5.0.0.
- `DEP-P0067` (export ./icons/* per-category icon imports, removed in 5.0.0): deep ./icons/<category> imports move to ./icons in 5.0.0.
- `DEP-P0068` (export ./utils/env utils env subpath, removed in 5.0.0): the ./utils/env subpath is removed in 5.0.0.
- `DEP-P0069` (behavior . CJS/require entry, removed in 5.0.0): the CommonJS require() entry is removed in 5.0.0; consume the ESM build.
- `DEP-P0070` (peer . react@18, removed in 5.0.0): React 18 support ends with 5.0.0; React 19 is the floor.
- `DEP-P0071` (engine . node < 20.19, removed in 5.0.0): Node < 20.19 support ends with 5.0.0.
- `DEP-S0614` (export . ImageList, removed in 5.0.0): ImageList is removed in 5.0; CMP Grid + native img.
- `DEP-S0615` (export . ImageListItem, removed in 5.0.0): ImageListItem is removed in 5.0; CMP Grid + native img.
- `DEP-S0616` (export . ImageListItemBar, removed in 5.0.0): ImageListItemBar is removed in 5.0; CMP Grid + native img.

## Commits since v4.1.0

### Added

- v4.3.x codemods + @auraglass/cli@0.x publish gate (REQ-PLAT-62)
- 4.x minor notes carry the downstream-grep record (REQ-PLAT-35)
- 4.x release notes open with moved dependencies (REQ-PLAT-56)
- port sync-fragments to release/4.x (REQ-FIN-13)
- port #126 FIN-B CI plumbing to release/4.x (REQ-FIN-20/21/22/23/25/26, R1)
- CMP fragment — 166 DEP-C rows for all §7 names (REQ-CMP-132)
- drop useGalileoStateSpring + consent lifecycle + remote reduce spec (PLAT-103/104/105)
- real App Router + Vite apps, all subpaths, wired (REQ-PLAT-63)
- breaking-register coverage + release-notes + tag gates (REQ-PLAT-62)
- doctor --v5 built on checks.ts + add prints replacement once (REQ-PLAT-61)
- missing DEP-P rows + warnDeprecated callsites (REQ-PLAT-58)
- real forms/data entries + gzip budget ratchet + side-effect report (REQ-PLAT-57)
- react-hook-form to optional peer only; diet gate + classify cases (REQ-PLAT-56)
- assertJwtSecret(process.env) first in server/index.ts (REQ-PLAT-53)
- hydration-safe init + Slot ref by React.version (REQ-PLAT-46)
- client-entries.json generated + RSC canary (REQ-PLAT-45)
- enabled param on useOptionalInteractionRecorder + hooks-order test (REQ-PLAT-44)
- ContrastGuard honest 'unverified' status only (REQ-PLAT-43)
- GlassCanvas string-action dev warning + isStorybookDataMedia removal (REQ-PLAT-42)
- jsdom import side-effect gate — shrink-only {effects:[{symbol,kind}]} baseline (REQ-PLAT-41)
- opt-in tracking lifecycle — start()/disable(), capped buffers, disposer (REQ-PLAT-40)
- REQ-FIN-10 classify-change — visual-class report reach + missing-report error on 4x>=4.2.0
- 4.3.0 surface + CLI move + frozen consumer-4x fixture (PLAT-156..167)
- 4.2.0 optional-peer diet + deprecation warnings (PLAT-141..155,163)
- cherry-pick @auraglass/cli for the 4.3 @auraglass/cli@0.x publish (PLAT-349)
- line-neutral release tooling on 4.x (1c-REL port)
- 1a-CI — full §4.2 GitLab job set, pages, npm OIDC publishing toolchain
- bridge-4x tokens + bridge H cells on release/4.x (MAT-327/362)
- complete DEP-S0600..S0632 rows — compat + removed media/backdrop names
- deprecate absorbed 4.x media/backdrop exports (DEP-S0600..S0628)
- deprecate absorbed 4.x AI/chat exports (DEP-S0400..S0422)
- 4.x motion-no-empty-animate lint rule at error severity (MAT-186)
- deprecate absorbed 4.x data/date/charts exports (DEP-S0200..S0248)
- preview-v5 css scoped under [data-ag-preview=v5] (MAT-177/178)
- deprecate absorbed 4.x shell/navigation exports (DEP-S0001..S0026)
- deprecations fragment skeleton + W5 rows DEP-S0800..0809
- deprecations fragment skeleton + 187 rows DEP-M0800..0986

### Fixed

- moved-dependency DEP lookup covers the whole tag range (REQ-PLAT-56)
- no optional-peer access at module load (GlassForm, Chart.js registration); root jest skips workspaces
- optional peers as devDeps, CLI workspace, workers/ artifact, verify-pack client-entries path
- workspace import merge break, npm ci without iltorb, react19 legs on React 19, pack-matrix runs verify half
- quote verify-codemods echo (plain scalar with ': ')
- valid 4.x batch CI YAML; contract/*4x* runs the 4x line; CLI publish under plat:publish:npm
- PerformanceMonitor samples FPS on demand instead of a perpetual rAF loop
- visual-fixes contrast pending on plat:test:visual-4x; behavioural PLAT-59 tests
- PLAT-41 gate runs on Node >=21 and its test ships its fixtures
- default persona system font stack on 4.x (REQ-PLAT-54 font hunk)
- 4.x specifics for the FIN-B port (REQ-FIN-21/25/26)
- MAT 4.x fragment passes contract:ci-fragments (D.3-02 4.x)
- flag + convert empty-object reduced-motion branches (REQ-PLAT-48)
- trim FIN-A classify-change hunks from PLAT-56; portable diet test
- workspace destructure, FPS loops, prefers-contrast, on-surface, switch shimmer (REQ-PLAT-59)
- remove Aeonik — full system stack everywhere (REQ-PLAT-54)
- 4.1.1 patch-scope surface + deprecation set + publish guard (PLAT-133..138)
- remove destructive autofix, restore base surface styles
- reduced-motion visibility for all 84 sites + cookie/palette fixes (PLAT-097..107)
- hoist all conditional hook calls + useOptional context readers (PLAT-085..091)
- client entry directives, hydration helpers, GlassInput hook order
- adaptive AI opt-in, no string-code execution, honest contrast states
- parse npm>=11 pack --json output
- line-aware CI test guards; pin playwright image to 4.x install
- quote lazy loading attr in DEP-S0617
- quote preset names in DEP-S0600 rows
- consumer-4x cases — controls/overlays/registry usage (CMP-426)
- correct W5 deprecation rows to real 4.x exports
- deprecations fragment rows audited against real 4.1 exports
- bootstrap CI + fragments on release/4.x

