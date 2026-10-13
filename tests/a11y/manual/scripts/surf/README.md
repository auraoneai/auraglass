# SURF L13 manual a11y scripts

Human-run checklists for the 24 SURF flagships (14, 22–44; REQ-SURF-196).
Each flagship has one script in this directory, named by the subject slug
the generated SR matrix (`tests/a11y/manual/sr-matrix.template.json`) uses:

- 14 `date-field.md` · 22 `app-shell.md` · 23 `sidebar.md` · 24 `top-bar.md`
- 25 `tabs.md` · 26 `tab-bar.md` · 27 `breadcrumbs.md` · 28 `pagination.md`
- 29 `command-palette.md` · 30 `resizable-panels.md` · 31 `source-transition.md`
- 32 `table.md` · 33 `tree-view.md` · 34 `filter-bar.md` · 35 `stat-card.md`
- 36 `sparkline.md` · 37 `timeline.md` · 38 `ai-thread.md` · 39 `ai-message.md`
- 40 `ai-composer.md` · 41 `ai-tool-call.md` · 42 `ai-source-list.md`
- 43 `media-controls.md` · 44 `carousel-rail.md`

`data-date.md` is the earlier combined data/date script; the per-flagship
files above supersede its rows.

Each script names the subject stories, the path to exercise, the pass
criteria, and one row per AT combo (VoiceOver macOS, VoiceOver iOS,
NVDA/Chrome, TalkBack/Chrome, physical touch iOS/Android) with the exact
`sr-record` file to commit under `tests/a11y/manual/records/surf/`.
Records are written by human testers only — agents never author records
(issue #16). These scripts complement, never replace, the L12 automated
matrices and the APG specs under `tests/a11y/apg/surf/`.
