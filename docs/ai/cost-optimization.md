# AI Cost Optimization

AuraGlass AI integrations should be deployed with explicit cost controls.

Cost controls apply only to the optional hosted runtime. Package-only AuraGlass apps do not call AI providers unless the application wires those providers itself.

## Controls

- Cache repeatable prompts and embedding results through Redis.
- Set per-user and per-organization rate limits.
- Route simple tasks to lower-cost models where product quality allows it.
- Batch embedding work when indexing large datasets.
- Track token usage, image-processing volume, and vector query count in telemetry.
- Track provider-unconfigured responses separately from provider failures so missing credentials do not look like billable provider errors.
- Keep API and WebSocket runtime metrics aligned with the canonical ports: API `3002`, WebSocket `3001`.

## Operational Review

Review provider dashboards weekly during rollout and after major feature launches. Treat unusually high retry rates as both reliability and cost issues.
