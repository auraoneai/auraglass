# AI Cost Optimization

AuraGlass AI integrations should be deployed with explicit cost controls.

## Controls

- Cache repeatable prompts and embedding results through Redis.
- Set per-user and per-organization rate limits.
- Route simple tasks to lower-cost models where product quality allows it.
- Batch embedding work when indexing large datasets.
- Track token usage, image-processing volume, and vector query count in telemetry.

## Operational Review

Review provider dashboards weekly during rollout and after major feature launches. Treat unusually high retry rates as both reliability and cost issues.
