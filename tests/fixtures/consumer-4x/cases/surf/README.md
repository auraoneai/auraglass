# consumer-4x SURF migration cases

Per REQ-SURF-15 and the consumer-4x fixture index: each `cases/surf/<area>/`
holds frozen 4.x usage that the codemod + compat adapters must still compile
against the 5.0 build. Cases are real code — pinned snapshots of actual 4.x
call-sites — and the check asserts the codemod's mapping lands on the new
entry point and prop grammar.

| case | exercises | expected |
| --- | --- | --- |
| `ai/` | `import { GlassChat, GlassChatInput, GlassMessageList, GlassTypingIndicator } from 'aura-glass'` | redirected to `aura-glass/compat` + `// TODO(aura-glass 5)` marker; JSX untouched; adapters warn once |

Adding a case:

1. `cases/surf/<area>/input.tsx` — the frozen 4.x source.
2. `cases/surf/<area>/expected.tsx` — the codemod output under test.
3. `cases/surf/<area>/notes.md` — props renamed/dropped, flags consulted.
