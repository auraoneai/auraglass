# AuraGlass Reports

This directory stores generated and hand-authored audit reports. The reports are evidence files; source documentation should link here instead of copying report contents into guides.

## Current Certification Evidence

- [Component inventory JSON](./component_inventory.json): 356 canonical inventory entries.
- [Storybook visual certification JSON](./glassmorphism-storybook-visual-certification.json): 356/356 passed entries.
- [Storybook visual certification Markdown](./glassmorphism-storybook-visual-certification.md): human-readable certification summary.
- [Certification screenshots](./glassmorphism-storybook-visual-certification/screenshots): 712 screenshot artifacts.

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
- [css_conflict_map.md](./css_conflict_map.md)
- [exports_types_check.md](./exports_types_check.md)
- [fix_plan.md](./fix_plan.md)
- [glass_compliance_summary.md](./glass_compliance_summary.md)
- [glassmorphism-storybook-visual-certification.md](./glassmorphism-storybook-visual-certification.md)
- [tailwind_audit.md](./tailwind_audit.md)
- [tsconfig_matrix.md](./tsconfig_matrix.md)

## Regeneration

- Component coverage audit: `npm run audit:components`.
- Full Storybook visual certification: start Storybook, then run `STORYBOOK_URL=http://localhost:6007 node scripts/audit/storybook-visual-certification.mjs`.
- Token checks: `npm run lint:tokens`.
- Style checks: `npm run lint:styles`.
