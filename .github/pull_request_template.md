## Summary

<!-- what changed and why; link the task ids (PLAT-___, REQ-___) -->

## GitLab pipeline URL for head SHA

<!-- REQUIRED: paste the URL printed by `node scripts/ci/gitlab-status.mjs --sha <head>`
     once it reports `success`. The mirror lags ~a day (W-6) — see
     docs/release/branch-policy.md. -->

## Checklist

- [ ] `node scripts/ci/gitlab-status.mjs --sha <head>` → success (pipeline URL above)
- [ ] changeset added (`.changeset/plat-<lane>-<topic>.md`) for user-visible changes
- [ ] line-neutral lane files landed on both `next` and `release/4.x` (when applicable)
- [ ] no `.github/workflows/*` additions; `mirror-to-gitlab.yml` untouched
- [ ] tests updated: `npx jest <touched>` and `npm run typecheck` pass

## Trailers (only when applicable)

- `Multi-Family: yes` — when the change spans multiple ownership families
- `Perf-Budget-Raise: <reason>` — when a perf/size budget is raised

[Written by Devin](https://app.devin.ai/sessions/64e809634f8349d9b91f7ea4ec03fec3)
