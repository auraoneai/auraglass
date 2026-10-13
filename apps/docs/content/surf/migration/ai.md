# Migrating to the 5.0 AI surface

4.x `GlassChat`, `GlassChatInput`, `GlassMessageList`, and
`GlassTypingIndicator` move to `aura-glass/ai` as `Thread`, `Message`,
`Composer`, and friends — a provider-agnostic surface with a real
message-part model, streaming, tool calls, and citations. `GlassVoiceInput`
has no 5.0 component; install the `ai-voice-input` registry item instead.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassChat` | `Thread` + `Composer` (`aura-glass/ai`), via the `GlassChat` compat adapter |
| `GlassChatInput` | `Composer` (`aura-glass/ai`), via the `GlassChatInput` compat adapter |
| `GlassMessageList` | `Thread` (`aura-glass/ai`), via the `GlassMessageList` compat adapter |
| `GlassTypingIndicator` | a streaming-status message or `AgentSteps` (`aura-glass/ai`), via the `GlassTypingIndicator` compat adapter |
| `GlassVoiceInput` | registry item `ai-voice-input`; no component successor |

The `ai-chat` codemod only rewrites the four chat imports to
`aura-glass/compat` and inserts
`// TODO(aura-glass 5): migrate to aura-glass/ai Thread/Message/Composer, see <doc>` —
it never touches JSX structure. The adapters keep the 4.x names working on
top of the 5.0 components, warn once via `warnDeprecated(id)`, and retire at
`6.0` (`<AuraGlassProvider deprecations="silent">` silences the warnings).

## Message shape

`ChatMessage` maps onto the 5.0 part model: `content` → one `text` part,
`attachments` → `file` parts, `type: 'system'` → role `system`,
`sender.id === currentUserId` → role `user` else `assistant`, and
`timestamp` → `metadata.createdAt`. `reactions`, `replyTo`, `edited`,
`predictive`, `eyeTracking`, `adaptive`, `spatialAudio`, `consciousness`,
`trackAchievements`, `virtualScroll`, and `onVoiceRecording` are dropped —
each is named in the adapter's deprecation warning.

## Provider wiring

`Thread` takes `messages` (`AgMessage[]`); `Composer` takes `onSubmit`,
`status` and `onStop`. The library never calls a model or the network —
your app owns the transport (see Routing models through Kiro Prism for the
reference route). The message envelope is the `AgMessage` /
`AgMessageMetadata` types exported from `aura-glass/ai`.

Codemod: `npx aura-glass-cli migrate 4to5 --transform ai-chat`.
