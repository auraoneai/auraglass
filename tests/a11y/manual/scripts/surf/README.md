# SURF L13 manual a11y scripts

Human-run checklist index for the surfaces SURF owns (surf:* scope of
QUAL's manual a11y lane). Each entry names the subject, the assistive
technology to run, and what "pass" looks like. These complement — never
replace — the L12 automated matrices.

| script | subject | AT | pass when |
| --- | --- | --- | --- |
| app-shell-nav | AppShell/AppFrame | NVDA+Chrome, VoiceOver+Safari | skip-link jumps to main; landmark order announced; rail nav roves arrows |
| data-table | DataTable | NVDA, JAWS | sort is announced; header scope read; column resize keyboard-operable |
| ai-chat | Chat widget | NVDA, VoiceOver | streamed reply lands in a polite live region; focus not stolen |
| command | Command palette | VoiceOver | results count announced; ↑/↓ navigation reads each option |
| media-viewer | Media viewer | NVDA | captions track reachable by keyboard; CJK wrap toggles |

New surfaces: add a row when the subject's `surf:*` CI matrix lands; keep
the checklist runnable in under 30 minutes for the full table.
