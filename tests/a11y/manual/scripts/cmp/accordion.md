# Accordion — manual screen-reader script (flagship 18, L13)

Component under test: **Accordion** (story `flagships-overlays-accordion--playground`) — APG
accordion pattern: each header is a heading containing a `button` with
`aria-expanded` and `aria-controls`; each open panel is a `region` labelled by
its header button.
Run each row of the SR matrix below. Record results in `tests/a11y/manual/records/cmp/` using the same file name.

## Matrix

| Assistive tech | Browser | Focus check |
|---|---|---|
| VoiceOver + Safari (macOS) | latest stable | see steps |
| VoiceOver (iOS, touch) | latest stable | see steps |
| NVDA + Chrome (Windows) | latest stable | see steps |
| TalkBack + Chrome (Android) | latest stable | see steps |
| Physical keyboard only (no SR) | latest stable | see steps |

## Steps

| Step | Action | Expected announcement/behavior |
|---|---|---|
| Reach | Tab to the first header (touch: swipe right) | header label, "button", "collapsed" (or "expanded"), heading level |
| Expand | Enter / Space (touch: double-tap) | "expanded"; the panel content follows the button in reading order |
| Panel | Read past the button (VO: VO+Right; NVDA: Down Arrow) | panel announced as a region named by its header, then its content |
| Collapse | Enter / Space on the expanded header | "collapsed"; panel content is no longer reachable |
| Next header | Tab (and Down Arrow / Up Arrow / Home / End where enabled) | focus moves header to header in order; each announces its own state |
| Single mode | Without `multiple` (the default story), expand a second item | the previously open item announces "collapsed" when revisited |
| Disabled | Reach a disabled item, if the story has one | "dimmed"/"unavailable"; Enter / Space does nothing |

## Pass criteria

- Every step announces the expected name/role/state in at least VoiceOver+Safari and NVDA+Chrome.
- No focus is ever lost to the document body; collapsing never moves focus off the header.
- Touch cells: expand/collapse works by double-tap alone (no drag gesture).
- Record findings even for passes; a fail row links a Linear/GitHub issue id.
