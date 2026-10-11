# AuraGlass LTS policy (4.x)

AuraGlass 4.x enters long-term support when 5.0.0 reaches GA.

## Terms

- **Duration**: 12 months of LTS starting at the 5.0.0 GA date.
- **Scope**: change class **C-I** (fixes) plus **`exception: 'security'`**
  security fixes — nothing else. No new features, no additive changes, no
  deprecations, no breaking changes of any kind. The C-E/C-D classes do not
  apply to 4.x post-GA (the 4.x minor lanes close at GA).
- **Runtime matrix frozen**: the Node/React support matrix is frozen at the
  matrix verified by the **4.3 canaries** (Node >= 20.19, React 18.2/19). A
  later Node or React release never widens the 4.x matrix; a fix that only
  holds on a newer runtime is out of scope and documented as such.
- **Backports**: every backported fix lands behind the **`backport-4.x`**
  label. Each backport PR links the original `next`/`main` PR it backports —
  or records an **"unaffected"** statement when the defect never reached 5.0
  (e.g. a 4.x-only regression). Unlinked backports are rejected by review,
  not by CI.
- **Cadence**: fixes batch into `4.x.y` patches released on the normal patch
  train; security fixes may release out-of-band.
- **Tooling**: the 4.x line keeps its own CI lanes on `release/4.x`; nothing
  from `next` is cherry-picked except fixes explicitly labelled C-I.

## EOL notices

| Milestone | Notice |
| --- | --- |
| GA | Blog/release note announcing the LTS window and end date |
| EOL-90 days | Deprecation notice in the docs banner + `llms.txt` |
| EOL-30 days | Final warning: the docs banner switches to the EOL-30 copy |
| EOL-0 | `npm deprecate 'aura-glass@<5'` with the exact EOL message below |

## EOL command (release owner, at T-0)

The deprecation message is verbatim — it includes the migration-doc URL and
is the only text the EOL run may use:

```bash
npm deprecate 'aura-glass@<5' \
  'aura-glass 4.x is end of life. Migrate: <DOCS_BASE_URL>/migrate/5 (or npx @auraglass/cli migrate 4to5)'
```

**`npm deprecate` is used only for bad versions and EOL** — never as a
suppression signal, a popularity nudge, or a rollout throttle.

The command is operator-only (needs the owner's 2FA npm session); it is listed
here as committed policy, executed by the release owner at EOL.


## Per-train-stop comms

| Stop | Comms owed |
| --- | --- |
| 4.1.1 | Patch notes + trust-patch retraction block |
| 4.2.0 | Deprecation wave note (what 5.0 removes), migration-guide link |
| 4.3.0 | Final 4.x deprecation list, "last minor" banner text |
| 4.4.0 | Late C-D only; LTS-prep notice |
| 5.0.0-alpha/beta | `next` tag notice; docs banner already carries it |
| 5.0.0-rc.1 | LTS start date preview; dist-tag plan |
| 5.0.0 GA | `v4-lts` tag set; LTS window + end date published; banner flips |
| EOL-90 | Docs banner + `llms.txt` deprecation notice |
| EOL-30 | Banner EOL-30 copy |
| EOL-0 | `npm deprecate` with the exact EOL message |
