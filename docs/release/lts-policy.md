# AuraGlass LTS policy (4.x)

AuraGlass 4.x enters long-term support when 5.0.0 reaches GA.

## Terms

- **Duration**: 12 months of LTS starting at the 5.0.0 GA date.
- **Scope**: change classes **C-I** (fixes) and **security fixes only**. No new
  features, no additive changes, no deprecations, no breaking changes of any
  kind. The C-E/C-D classes do not apply to 4.x post-GA (the 4.x minor/minor
  lanes close at GA).
- **Cadence**: fixes batch into `4.x.y` patches released on the normal patch
  train; security fixes may release out-of-band.
- **Tooling**: the 4.x line keeps its own CI lanes on `release/4.x`; nothing
  from `next` is cherry-picked except fixes explicitly labelled C-I.

## EOL notices

| Milestone | Notice |
| --- | --- |
| GA | Blog/release note announcing the LTS window and end date |
| T-90 days | Deprecation notice in the docs banner + `llms.txt` |
| T-0 | `npm deprecate 'aura-glass@<5'` with the message "4.x is EOL; migrate to aura-glass@5 via `npx @auraglass/cli migrate 4to5`" |

## EOL command (release owner, at T-0)

```bash
npm deprecate 'aura-glass@<5' \
  'aura-glass 4.x has reached end of life. Migrate to aura-glass 5.x: npx @auraglass/cli migrate 4to5'
```

The command is operator-only (needs the owner's 2FA npm session); it is listed
here as committed policy, executed by the release owner at EOL.
