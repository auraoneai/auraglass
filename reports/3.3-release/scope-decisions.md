# 3.3 Scope Decisions

This file records the decisions required before AuraGlass 3.3 can make product, runtime, accessibility, and release claims. It is a decision ledger, not a final sign-off document.

## Current Decision Status

| Decision | Status | Current repository evidence | Required owner action |
| --- | --- | --- | --- |
| Package-only baseline remains supported without hosted infrastructure | [x] Recorded as required | `GoLiveCheckList.md` says AuraGlass is primarily a public library/package and hosted server completeness is optional unless marketed as hosted product. | Keep this boundary in README/release notes. |
| 3.3 includes optional hosted-runtime cleanup work | [x] Recorded as 3.3 scope | `auraglass33PRD.md` Pillars 1-6 define hosted runtime, auth, Redis, AI routes, and collaboration scope. README/docs describe it as optional self-hosted infrastructure, not required for package-only installs. | Keep production claims tied to the local/staging evidence actually recorded. |
| Canonical local API/WebSocket contract | [x] Decided and enforced locally | API `3002` / WebSocket `3001` is reflected in `src/lib/ai-client.ts`, `.env.example`, Docker/Compose, deploy script, README, server README, and AI/deployment docs. | Keep this contract through final release gates. |
| Legacy mock API server disposition | [x] Kept demo-only | Production entrypoints use `dist/server/server/index.js`; `server/api-server.js` remains present only as a demo-disabled legacy path and is guarded by `ENABLE_DEMO_API=true` outside production. | Consider renaming or deleting in a future cleanup if desired. |
| Provider-unconfigured contract | [x] Implemented and tested | `src/services/ai/config.ts` defines `ProviderUnconfiguredError`; hosted-runtime tests pass for route/client contract behavior. | Keep docs and tests aligned through final release. |
| Hosted collaboration editing scope | [x] Presence/cursor/selection only | `server/websocket-server.js` always emits `COLLABORATION_EDIT_UNSUPPORTED` for collaborative edit events; there is no 3.3 env flag that enables hosted editing. | Do not market collaborative editing as supported in 3.3. |
| Manual accessibility certification | [ ] Pending external | `reports/3.3-release/accessibility-certification.md` and runbook exist; no human results recorded. | Execute and record screen-reader and physical-device passes. |
| Live provider/Sentry evidence | [ ] Pending external/runtime | Env/docs mention providers and Sentry; local Redis/Compose evidence is recorded, but no live provider-account or Sentry event evidence is recorded. | Run staging or live smoke with approved credentials and record results before making live-hosted production claims. |

## Scope Boundaries For 3.3 Claims

- Package/library usage can be claimed only to the extent package gates pass for the 3.3 candidate.
- Hosted API/server usage can be described as optional self-hosted runtime code with local integration evidence. It must not be called live-production-certified until live deployment evidence exists for required providers, Sentry, TLS/proxy/CORS, and the final deployment environment.
- Collaboration can be claimed as presence/cursor/selection only. Collaborative document editing is unsupported by default in 3.3.
- Accessibility can be described as automated-covered until human screen-reader and physical-device results are recorded.

## Decisions To Resolve Before Final 3.3

- [x] Hosted runtime is optional infrastructure, not required for package-only installs.
- [x] `server/api-server.js` is kept as a demo-only path behind `ENABLE_DEMO_API=true` outside production.
- [x] API client defaults moved to `http://localhost:3002` and `ws://localhost:3001`.
- [x] Hosted collaboration editing uses explicit unsupported errors by default in 3.3.
- [x] JWT is the primary hosted auth path; API key middleware remains available and tested for header-only extraction, but no API-key hosted route is made first-class in `server/index.ts`.
- [x] Live provider/Sentry smoke tests are separate staging evidence for hosted-production claims, not blockers for the package-only 3.3 release.

## Completed In This Evidence Pass

- [x] Scope-decision ledger created.
- [x] Current code/docs state mapped to each major decision.
- [x] Core runtime and collaboration-scope code decisions recorded.
- [x] Open manual/external work kept unchecked.
