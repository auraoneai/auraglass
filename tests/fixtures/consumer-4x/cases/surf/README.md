# consumer-4x SURF migration cases

Per REQ-SURF-15 and the consumer-4x fixture index: each `cases/surf/<area>/`
holds frozen 4.x usage that the codemod + compat adapters must still compile
against the 5.0 build. Cases are real code — pinned snapshots of actual 4.x
call-sites — and the check asserts the codemod's mapping lands on the new
entry point and prop grammar. Input pages are named `<Family>.page.tsx`
(SURF-642): one page per absorbed family, none for rejected families.

| case | exercises | expected |
| --- | --- | --- |
| `ai/` | `import { GlassChat, GlassChatInput, GlassMessageList, GlassTypingIndicator } from 'aura-glass'` | redirected to `aura-glass/compat` + `// TODO(aura-glass 5)` marker; JSX untouched; adapters warn once |
| `app-shell/` | root `GlassAppShell` + `GlassSidebar` page (`AppShellRoot.page.tsx`) and `aura-glass/app-shell` page (`AppShellSub.page.tsx`), both with handler-only rail items | 0 TODOs after `migrate 4to5`; `expected.tsx` lands with W1's app-shell-slots area codemod (slot API is W1's contract work) |
| `data/` | GlassDataTable, GlassDataGrid, GlassVirtualTable, GlassSearchBar family | 0 TODOs on the flagship subset; one removed TODO per chart page — authored by W2 |
| `media/` | LiquidGlassMediaControls, GlassCarousel, AuroraBackdrop family | authored by W4 |

Adding a case:

1. `cases/surf/<area>/<Family>.page.tsx` — the frozen 4.x source page.
2. `cases/surf/<area>/expected.tsx` — the codemod output under test (lands
   with the owning lane's area codemod).
3. `cases/surf/<area>/notes.md` — props renamed/dropped, flags consulted.
