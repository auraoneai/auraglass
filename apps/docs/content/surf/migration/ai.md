# Migrating to the 5.0 AI surface

4.x `GlassChat`, `GlassChatInput`, `GlassMessageList`, and
`GlassTypingIndicator` move to `aura-glass/ai` as `Thread`, `Message`,
`Composer`, and friends — a provider-agnostic surface with a real
message-part model, streaming, tool calls, and citations (AI SDK v6
devDeps; contracts in `src/contracts/ai`). `GlassVoiceInput` has no 5.0
component; the `ai-voice-input` registry item lands in 5.1.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassChat` | `Thread` + `Message` (`aura-glass/ai`), via the `GlassChat` compat adapter |
| `GlassChatInput` | `Composer` (`aura-glass/ai`), via the `GlassChatInput` compat adapter |
| `GlassMessageList` | `Message` + `StreamingText` (`aura-glass/ai`), via the `GlassMessageList` compat adapter |
| `GlassTypingIndicator` | `Message` typing state (`aura-glass/ai`), via the `GlassTypingIndicator` compat adapter |
| `GlassVoiceInput` | registry item `ai-voice-input` (5.1); no component successor |

The `ai-chat` codemod only rewrites the four chat imports to
`aura-glass/compat` and inserts
`// TODO(aura-glass 5): migrate to aura-glass/ai Thread/Message/Composer, see <doc>` —
it never touches JSX structure. The adapters keep the 4.x names working on
top of the 5.0 components, warn once via `warnDeprecated(id)`, and retire at
`6.0` (`AG_COMPAT_AI=1` silences the warning).

## Message shape

`ChatMessage` maps onto the 5.0 part model: `content` → one `text` part,
`attachments` → `file` parts, `type: 'system'` → role `system`,
`sender.id === currentUserId` → role `user` else `assistant`, and
`timestamp` → `metadata.createdAt`. `reactions`, `replyTo`, `edited`,
`predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `consciousness`,
`trackAchievements`, `virtualScroll`, and `onVoiceRecording` are dropped —
each is named in the adapter's deprecation warning.

## Provider wiring

`Thread`/`Composer` take a `chat` config `{ provider, model, transport }`.
There is no hard-coded vendor call in `src/ai/**` — transport is injected
and the shipped fixtures use a deterministic stub (no-network is a lint
rule, not a convention). See `src/contracts/ai` for the message envelope
(REQ-SURF-85..97).

Codemod: `aura-glass-codemod ai-chat` — see the consumer-4x `surf/ai`
fixture for an exact before/after.
