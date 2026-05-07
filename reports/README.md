# AuraGlass Reports

This directory stores generated and hand-authored audit reports. The reports are evidence files; source documentation should link here instead of copying report contents into guides.

## Current Certification Evidence

- [Component inventory JSON](./component_inventory.json): 356 canonical inventory entries.
- [Storybook visual certification JSON](./glassmorphism-storybook-visual-certification.json): 356/356 passed entries.
- [Storybook visual certification Markdown](./glassmorphism-storybook-visual-certification.md): human-readable certification summary.
- [Storybook exhaustive QA Markdown](./storybook-exhaustive-qa.md): 1,595 static Storybook stories crawled across desktop/mobile modes with zero hard failures and zero audit-run errors; remaining findings are visual heuristics retained for follow-up.
- Release notes: [3.0.1 final QA patch](../RELEASE_NOTES_3.0.1.md) and [3.0.0 major release](../RELEASE_NOTES_3.0.0.md).
- [Certification screenshots](./glassmorphism-storybook-visual-certification/screenshots): 712 screenshot artifacts.
- [Public export audit JSON](./public-export-audit.json): root export source and declaration evidence.
- [API surface audit JSON](./api-surface-audit.json): public declaration `any` and ref-forwarding follow-up evidence.
- [Runtime cleanliness audit JSON](./runtime-cleanliness-audit.json): production-source console/TODO/debugger evidence.
- [AI/server security review](./ai-server-security-review.md): auth, credential-transport, websocket, and remaining AI/server security evidence.

## Report Index

- [COMPONENTS_BY_CATEGORY.md](./COMPONENTS_BY_CATEGORY.md)
- [COMPONENT_INVENTORY_REPORT.md](./COMPONENT_INVENTORY_REPORT.md)
- [CRITICAL_ADDENDUM_installation_failure.md](./CRITICAL_ADDENDUM_installation_failure.md)
- [FOCUS_MANAGEMENT_SUMMARY.md](./FOCUS_MANAGEMENT_SUMMARY.md)
- [INVENTORY_INDEX.md](./INVENTORY_INDEX.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- [REDUCED_MOTION_100_COMPLETE.md](./REDUCED_MOTION_100_COMPLETE.md)
- [TOOLING_SETUP_COMPLETE.md](./TOOLING_SETUP_COMPLETE.md)
- [TYPESCRIPT_ESLINT_FIX_SUMMARY.md](./TYPESCRIPT_ESLINT_FIX_SUMMARY.md)
- [TYPESCRIPT_FIX_PROGRESS.md](./TYPESCRIPT_FIX_PROGRESS.md)
- [a11y_summary.md](./a11y_summary.md)
- [automated_probe_results.md](./automated_probe_results.md)
- [api-surface-audit.md](./api-surface-audit.md)
- [ai-server-security-review.md](./ai-server-security-review.md)
- [breaking-change-review.md](./breaking-change-review.md)
- [css_conflict_map.md](./css_conflict_map.md)
- [exports_types_check.md](./exports_types_check.md)
- [fix_plan.md](./fix_plan.md)
- [glass_compliance_summary.md](./glass_compliance_summary.md)
- [glassmorphism-storybook-visual-certification.md](./glassmorphism-storybook-visual-certification.md)
- [manual-browser-qa-checklist.md](./manual-browser-qa-checklist.md)
- [public-export-audit.md](./public-export-audit.md)
- [runtime-cleanliness-audit.md](./runtime-cleanliness-audit.md)
- [storybook-exhaustive-qa.md](./storybook-exhaustive-qa.md)
- [tailwind_audit.md](./tailwind_audit.md)
- [tsconfig_matrix.md](./tsconfig_matrix.md)

## Regeneration

- Component coverage audit: `npm run audit:components`.
- Public export audit: `npm run audit:exports`.
- API surface audit: `npm run audit:api`.
- Runtime cleanliness audit: `npm run audit:runtime`.
- Cross-browser visual matrix: `npm run test:visual:matrix`.
- Full Storybook visual certification: start Storybook, then run `STORYBOOK_URL=http://localhost:6007 node scripts/audit/storybook-visual-certification.mjs`.
- Static all-story Storybook QA: build Storybook, serve `storybook-static`, then run `STORYBOOK_URL=http://127.0.0.1:6016 STORYBOOK_QA_CONCURRENCY=8 STORYBOOK_QA_TIMEOUT_MS=10000 STORYBOOK_QA_SETTLE_MS=350 node scripts/storybook-exhaustive-qa.js http://127.0.0.1:6016 --mobile-all --fail-on-findings`.
- Token checks: `npm run lint:tokens`.
- Style checks: `npm run lint:styles`.
