# Security Policy

AuraGlass is a React and Next.js component package. Security reports should focus on package behavior, build artifacts, server helpers, auth-sensitive utilities, dependency exposure, generated outputs, and documentation that could lead users to unsafe integration patterns.

## Supported Versions

| Version | Status |
| --- | --- |
| 3.1.x | Active launch line |
| 3.0.x | Maintenance fixes as needed |
| < 3.0 | Not supported |

## Reporting A Vulnerability

Do not open a public GitHub issue for suspected vulnerabilities.

Use GitHub private vulnerability reporting for this repository:

https://github.com/auraoneai/auraglass/security/advisories/new

Include:

- affected AuraGlass version
- package entrypoint or file path involved
- minimal reproduction or proof of concept
- impact assessment
- whether the issue affects browser-only code, SSR, server helpers, workers, AI services, websocket services, or documentation
- known mitigations, if any

## Response Expectations

Maintainers should acknowledge valid reports, triage severity, and coordinate a fix before public disclosure when the report is actionable. Fixes should include focused tests or audit coverage when practical.

## Security-Relevant Release Gates

Security-sensitive changes should consider these checks before release:

```bash
npm run audit:runtime
npm run audit:exports
npm run typecheck
npm run lint:check
npm run verify:pack
npm run test:integration:next -- --skip-build
```

For full release readiness, use the 3.1 package-gate ledger:

- [reports/3.1-release/package-gates.md](./reports/3.1-release/package-gates.md)

## Scope Notes

AuraGlass includes optional integrations for AI, media, websocket collaboration, Sentry, and 3D/AR feature families. Optional peers should stay optional, React should not be bundled into package outputs, and server/helper entrypoints should avoid leaking credentials, tokens, or sensitive diagnostics.
