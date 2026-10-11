# Manual script — data & date surfaces (SURF-532)

Manual matrix rows for the L13 lane. This file seeds QUAL's living manual
matrix — when `tests/a11y/manual/scripts/` gains QUAL's canonical matrix,
use that file and retire this one (SURF-532 defers to it if it exists).

Surfaces: Table (table mode and grid mode), TreeView, FilterBar,
DatePicker, DateRangePicker, Calendar, ChartFrame.

## Matrix

Run each row; record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema: `contracts/schemas/sr-record.schema.json`).

| surface | AT combo | path to exercise | pass when |
| --- | --- | --- | --- |
| Table (table mode) | VoiceOver macOS + Safari | header → sort control → rows | sort state announced (ascending/descending/none); column headers read with scope; no layout table announcements |
| Table (grid mode) | NVDA + Chrome | one Tab stop → arrows → Home/End → Ctrl+Home/End | single tab stop; arrow-key movement announced; numeric column starts ascending |
| Table | TalkBack + Chrome | swipe through rows + sort | same announcements as NVDA row; explore-by-touch lands on cells |
| Table | physical touch | resize/sort/paginate controls | all controls ≥44×44 px at pointer:coarse; sticky header doesn't occlude focus |
| TreeView | VoiceOver macOS + iOS | one Tab stop; Right expands, Left collapses, '*' expands all siblings | level/expanded/selected state announced; collapsed parents skipped |
| TreeView | NVDA + Chrome | same path | same announcements; no double-reading of treeitem label |
| FilterBar | NVDA + Chrome | chip → Enter opens editor → Escape | editor opens as role=dialog with focus on first field; Escape returns focus to chip; quick filter toggles aria-pressed |
| DatePicker | VoiceOver iOS | trigger → dialog → gridcell → Escape | trigger announced "Choose date"; dialog labelled by field label; gridcell selected state announced; Escape restores focus |
| DateRangePicker | NVDA + Chrome | start → end selection flow | range endpoints announced; preset listbox reachable by keyboard |
| Calendar | TalkBack + Chrome | day grid + month paging | ±1/±7 day moves announced; PageUp/Down changes month once |
| ChartFrame | VoiceOver macOS | chart region → data table fallback | chart has text alternative (table fallback reachable); adapter not announced as image-only |

## Notes

- Run against the story IDs in `parameters.ag.id`; subjects absent from the
  index are skipped (data-driven matrix — do not record rows for stories
  that do not exist).
- `result` values are `pass`/`fail` only; partial coverage is recorded in
  `notes`, never as a third state.
