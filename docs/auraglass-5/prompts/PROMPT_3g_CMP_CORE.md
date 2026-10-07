# PROMPT-3g (CMP lane T): Core T0 and T2

Stream index: `docs/auraglass-5/prompts/PROMPT_3_CMP.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_CORE_COMPONENTS_PRD.md` (PRD-3, key CMP) §20 lane **T**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/CMP.json`, field `lane = "3g-T"` (33 tasks: CMP-295..321, 420..425).

This lane starts on **day 0**, runs at the same time as every other CMP lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside CMP):** `src/components/{text,heading,stack,grid,container,icon,card,badge,avatar,alert,progress,meter,skeleton,separator,kbd,accordion,collapsible,link,scroll-area,rating,inline-edit,file-upload,color-picker,description-list,image-list,tour,state-view}/**`

**Order inside the lane:** server-safe set first (T0, Card, Badge, Separator, Kbd, Link, DescriptionList, state views, ImageList), then Base UI-backed (Accordion, Collapsible, Progress, Meter, ScrollArea, Avatar), then composites (Rating, InlineEdit, FileUpload, ColorPicker, Tour)

**Requirements closed by this lane:** REQ-CMP-01, REQ-CMP-03, REQ-CMP-06, REQ-CMP-11, REQ-CMP-12, REQ-CMP-17, REQ-CMP-22, REQ-CMP-111, REQ-CMP-112, REQ-CMP-113, REQ-CMP-114, REQ-CMP-115, REQ-CMP-116, REQ-CMP-117, REQ-CMP-118, REQ-CMP-119, REQ-CMP-121, REQ-CMP-122, REQ-CMP-123, REQ-CMP-124, REQ-CMP-125, REQ-CMP-126, REQ-CMP-127, REQ-CMP-128, REQ-CMP-129.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/cmp-t -b next-cmp/t-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/cmp-<slug>.md` and refreshes the CMP-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/CMP.json")) if (t.lane === "3g-T") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| CMP-295 | CREATE | `NEW:src/components/text/Text.tsx` | T0 Text seeded from src/components/data-display/Typography.tsx: render prop, size xs\|sm\|md\|lg, muted (boolean) + status intent neutral\|success\|warning\|danger (SC-24), … |  |  |
| CMP-296 | CREATE | `NEW:src/components/heading/Heading.tsx` | T0 Heading: required level 1–6 renders h1..h6; size sm\|md\|lg\|xl\|display independent of level (display absorbs src/components/marketing/DisplayText.tsx); parts [root]; … |  | REQ-CMP-17 |
| CMP-297 | CREATE | `NEW:src/components/stack/Stack.tsx` | T0 Stack seeded from src/components/layout/GlassStack.tsx: direction row\|column (logical, RTL-aware), gap (space tokens), align, justify, wrap, separator node … |  | REQ-CMP-12 |
| CMP-298 | CREATE | `NEW:src/components/grid/Grid.tsx` | T0 Grid seeded from src/components/layout/GlassGrid.tsx + GlassMasonry.tsx: columns number \| {base,sm,md,lg} on container breakpoints 480/768/1024px, minItemWidth, gap, … |  | REQ-CMP-112 |
| CMP-299 | CREATE | `NEW:src/components/container/Container.tsx` | T0 Container seeded from src/components/layout/GlassContainer.tsx: size sm\|md\|lg\|xl\|full → max-inline-size tokens, padding, container-type:inline-size named … |  | REQ-CMP-11 |
| CMP-300 | REDESIGN | `src/components/card/Card.tsx` | Rebuild as Card compound in src/components/card/Card.tsx (Header, Title, Description, Content, Footer, Actions; parts root, header, title, description, body, footer, … |  | REQ-CMP-113, REQ-CMP-116, REQ-CMP-118 |
| CMP-301 | CREATE | `NEW:src/components/badge/Badge.tsx` | Badge seeded from src/components/data-display/GlassBadge.tsx: status intent neutral\|info\|success\|warning\|danger (SC-24, data-ag-intent), dot, count + max (99+), label … |  | REQ-CMP-17 |
| CMP-302 | CREATE | `NEW:src/components/separator/Separator.tsx` | Separator seeded from src/components/layout/GlassSeparator.tsx: orientation, decorative → role='none', else role='separator' + aria-orientation + data-orientation; … |  | REQ-CMP-01 |
| CMP-303 | CREATE | `NEW:src/components/kbd/Kbd.tsx` | Kbd renders <kbd>; keys?: string[] renders nested <kbd> per key with '+' separators; content-sunken material; parts [root, item, separator]; server. (Cross-lane input … |  |  |
| CMP-304 | CREATE | `NEW:src/components/description-list/DescriptionList.tsx` | <dl> with DescriptionList.Item (<div>), .Term (<dt>), .Details (<dd>); layout stacked\|inline; term stacks above details below a 400px container; parts [root, item, … |  | REQ-CMP-17 |
| CMP-305 | CREATE | `NEW:src/components/link/Link.tsx` | <a> with render for router links; target='_blank' adds rel='noopener noreferrer' and VisuallyHidden ' (opens in new tab)'; status intent neutral\|danger (SC-24); … |  |  |
| CMP-306 | CREATE | `NEW:src/components/alert/Alert.tsx` | Alert seeded from src/components/data-display/GlassAlert.tsx: Alert.Title/Description/Actions, status intent info\|success\|warning\|danger (SC-24, data-ag-intent), urgent … |  | REQ-CMP-113, REQ-CMP-116, REQ-CMP-118 |
| CMP-307 | CREATE | `NEW:src/components/skeleton/Skeleton.tsx` | Skeleton seeded from src/components/data-display/GlassSkeleton.tsx (absorbs GlassLoadingSkeleton): aria-hidden='true', shape text\|rect\|circle, lines; shimmer keyframes … |  | REQ-CMP-118, REQ-CMP-113, REQ-CMP-116 |
| CMP-308 | POLISH | `src/components/image-list/ImageList.tsx` | Rebuild ImageList with ImageList.Item and ImageList.ItemBar: cols is a maximum reduced by container width (minItemWidth default 160px), variant standard\|quilted\|masonry … | CMP-298 | REQ-CMP-03 |
| CMP-309 | CREATE | `NEW:src/components/card/Card.stories.tsx` | For every component in FND-043..061 write <Name>.stories.tsx (Core/ or Foundation/ titles) importing only public entries: Default, generated variant matrix from … | CMP-295, CMP-296, CMP-297, CMP-298, CMP-299, CMP-300, CMP-301, CMP-302, CMP-303, CMP-304, CMP-305, CMP-306, CMP-307, CMP-308 | REQ-CMP-06 |
| CMP-310 | CREATE | `NEW:src/components/avatar/Avatar.client.tsx` | Avatar seeded from src/components/data-display/GlassAvatar.tsx on BU Avatar Root/Image/Fallback: src + required alt, name → initials with aria-label, fallback after BU … |  | REQ-CMP-01 |
| CMP-311 | CREATE | `NEW:src/components/progress/Progress.client.tsx` | Progress and ProgressRing (first public export, from CircularProgress in data-display/GlassProgress.tsx) on BU Progress: role='progressbar' with aria-valuemin/max/now; … |  | REQ-CMP-117 |
| CMP-312 | CREATE | `NEW:src/components/meter/Meter.client.tsx` | Meter (NEW) on BU Meter: role='meter', low/high/optimum → data-ag-intent, label required; content-sunken track; parts [root, track, indicator, label, value]. Own markup … |  | REQ-CMP-117 |
| CMP-313 | REDESIGN | `NEW:src/components/accordion/Accordion.client.tsx` | Accordion seeded from src/components/data-display/GlassAccordion.tsx (tab roles at :338/:401 removed) on BU Accordion: Item, Header (<h3> default, headingLevel 2–6), … |  | REQ-CMP-121 |
| CMP-314 | CREATE | `NEW:src/components/collapsible/Collapsible.client.tsx` | Collapsible (NEW) on BU Collapsible, APG Disclosure: Root/Trigger/Panel, open/defaultOpen/onOpenChange(open, details), data-state expanded\|collapsed; parts [root, … |  | REQ-CMP-01 |
| CMP-315 | CREATE | `NEW:src/components/scroll-area/ScrollArea.client.tsx` | ScrollArea seeded from src/components/layout/GlassScrollArea.tsx on BU ScrollArea: viewport tabIndex=0 only while overflowing (ResizeObserver ref callback returning … |  | REQ-CMP-122 |
| CMP-316 | REDESIGN | `src/components/rating/Rating.tsx` | Rebuild as src/components/rating/Rating.client.tsx: own role='radiogroup' over BU Radio items, roving tabindex, Arrow keys (RTL-aware), Home/End, readOnly → … |  | REQ-CMP-123 |
| CMP-317 | CREATE | `NEW:src/components/inline-edit/InlineEdit.client.tsx` | InlineEdit seeded from src/components/interactive/GlassInlineEdit.tsx: <button data-ag-part='trigger'> showing the value; Enter/click switches to BU Input textbox with … |  | REQ-CMP-124 |
| CMP-318 | REDESIGN | `NEW:src/components/file-upload/FileUpload.client.tsx` | FileUpload seeded from src/components/interactive/GlassFileUpload.tsx (R-07; its setInterval progress at :341 is not ported): button opens hidden <input type=file>, … |  | REQ-CMP-126 |
| CMP-319 | REDESIGN | `NEW:src/components/color-picker/ColorPicker.client.tsx` | ColorPicker seeded from src/components/input/GlassColorPicker.tsx: Trigger + PRD-09 Popover content; ColorPicker.Area single focusable role='slider' with … |  | REQ-CMP-125 |
| CMP-320 | REDESIGN | `NEW:src/components/tour/Tour.client.tsx` | Tour seeded from src/components/interactive/GlassCoachmarks.tsx (absorbs GlassSpotlight): steps [{target: selector\|RefObject, title, description}], each a non-modal … |  | REQ-CMP-128 |
| CMP-321 | CREATE | `NEW:src/components/accordion/Accordion.stories.tsx` | For every FND-071..085 component write Core/<Name> stories from public entries only: Default, variant matrix, States, ReducedTransparency, ForcedColors, ContrastMore, … | CMP-310, CMP-311, CMP-312, CMP-313, CMP-314, CMP-315, CMP-316, CMP-317, CMP-318, CMP-319, CMP-320 | REQ-CMP-22 |
| CMP-420 | CREATE | `NEW:src/components/text/Text.tsx; NEW:src/components/heading/Heading.tsx` | Text renders the S-03 --ag-type-<role>-* roles (body default, callout, caption, label, mono); Heading takes level 1-6 and size display\|title-1\|title-2\|title-3 (absorbs … |  | REQ-CMP-111 |
| CMP-421 | CREATE | `NEW:src/components/badge/Badge.tsx` | Flat server Badge with intent, dot and count (max renders "99+"); opaque tint with contrast-color() text and no material; absorbs LiquidGlassBadgeCluster, … |  | REQ-CMP-114 |
| CMP-422 | CREATE | `NEW:src/components/avatar/AvatarGroup.tsx` | Avatar (Root, Image, Fallback; root SizeProps) on Base UI Avatar (img with alt, or initials + aria-label; fallback timing client-side); flat server AvatarGroup with max … |  | REQ-CMP-115 |
| CMP-423 | CREATE | `NEW:src/components/link/Link.tsx; NEW:src/components/kbd/Kbd.tsx` | Separator on Base UI Separator (hairline token; role=separator + orientation only when semantic, decorative otherwise); Kbd renders <kbd> content-sunken; Link renders … |  | REQ-CMP-119 |
| CMP-424 | CREATE | `NEW:src/components/image-list/ImageList.css` | Item bar chrome thin and declares data-ag-backdrop="media"; cols is a maximum reduced by container width via minItemWidth (default 160px); one ResizeObserver only for … |  | REQ-CMP-127 |
| CMP-425 | CREATE | `NEW:src/components/state-view/StateView.tsx` | One shared flat server layout for EmptyState and ErrorState (title, description, icon, actions; no material); ErrorState is role="alert" only when urgent. |  | REQ-CMP-129 |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
CMP LANE T REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
