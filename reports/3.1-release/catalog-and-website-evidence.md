# 3.1 Catalog And Website Evidence

This package repo records the website evidence requirements from `auraglass31PRD.md`, but website implementation is owned outside this package-repo artifact pass.

## Required Website Evidence

| Evidence | Required artifact | Status | Link |
| --- | --- | --- | --- |
| Inventory reconciliation | `reports/website-3.1/inventory-reconciliation.json` | Pending website repo evidence |  |
| Catalog summary | `reports/website-3.1/catalog-summary.md` | Pending website repo evidence |  |
| Full catalog runtime sweep | Website verification output | Pending website repo evidence |  |
| Full catalog contrast sweep | Website verification output | Pending website repo evidence |  |
| Full catalog geometry/overflow sweep | Website verification output | Pending website repo evidence |  |
| Empty-preview sweep | Website verification output | Pending website repo evidence |  |
| Visual-density sweep | Website verification output | Pending website repo evidence |  |
| Screenshot contact sheets | Website-generated image/contact-sheet artifacts | Pending website repo evidence |  |
| Featured component section | `/components/featured` or equivalent | Pending website repo evidence |  |
| SEO/GEO route coverage | Website metadata and sitemap evidence | Pending website repo evidence |  |

## Catalog Acceptance Criteria

The 3.1 launch should not claim catalog completion until evidence shows:

- website preview count matches the certified inventory count, or every intentional non-card item is documented
- every certified component is represented or intentionally excluded with a reason
- no hidden preview errors
- no unexpected "Preview unavailable" cards
- no empty "No data" states unless the component is an empty-state component
- no text-only previews for visual or interactive components
- no obvious clipping, overlap, washed-out slabs, unreadable text, harsh white outlines, blank canvases, or uncontained fixed-position overlays
- provider-dependent and compound components are represented correctly

## Package Handoff Notes

Package-side work that supports the website evidence:

- README now uses 3.1 positioning and links this evidence directory.
- npm metadata now targets React Liquid Glass, Next.js, dashboards, AI UI, media UI, accessibility, motion, Tailwind, and shadcn-alternative discovery.
- GitHub issue templates include a visual regression path for catalog and Storybook issues.

## Website Repo Boundary

Do not edit `/Users/gurbakshchahal/auraglasswebsite` from this package-repo launch-artifact pass. Link website artifacts here after they are produced by website work.
