# SURF/ai case notes

The `ai-chat` area transform (REQ-SURF-14) only rewrites the four chat imports
and inserts the marker; it never touches JSX structure. All four names are
real 4.x root exports. `ChatMessage` is not a root export of
`aura-glass@4.1.0`, so the page derives it from `GlassChat`'s `messages`
prop, and `GlassChat` takes `currentUser` (`GlassMessageList` takes
`currentUserId`). This is a `report` case in `../canary.json` (compat-only
names: TODOs recorded, not asserted).

| 4.x (root) | 5.0 |
| --- | --- |
| `GlassChat` | `GlassChat` from `aura-glass/compat` (adapter maps `ChatMessage.content` → one `text` part, `sender.id === currentUser.id` → `user` else `assistant`, `timestamp` → `metadata.createdAt`) |
| `GlassChatInput` | `GlassChatInput` from `aura-glass/compat` |
| `GlassMessageList` | `GlassMessageList` from `aura-glass/compat` (dropped `virtualScroll`/`onClick` props named in the warning) |
| `GlassTypingIndicator` | `GlassTypingIndicator` from `aura-glass/compat` |

The compat adapter keeps the component working through `aura-glass/ai`
internally (`Thread`, `Message`, `Composer`) and warns once via
`warnDeprecated(id)`. Compat flag consulted: `AG_COMPAT_AI=1` silences the
deprecation warning. Adapter `retireAt: '6.0'`.
