# Storybook Exhaustive QA

Generated: 2026-05-08T00:07:36.198Z
Storybook: http://127.0.0.1:6016
Public stories inspected: 1595
High-risk mobile stories inspected: 1595
Checks: desktop-liquid, desktop-dark, mobile-liquid

## Summary

- Pass: 1595
- Risk: 0
- Fail: 0
- Total audit findings: 0
- Audit-run errors, excluded from ranking: 0
- False-positive/noise events: 71
- Affected files/groups: 0

## Flag Counts

| Flag | Count |
| --- | ---: |
| - | 0 |

## Top Ranked Failures

| Score | Status | Prefix | Story | File | Flags |
| ---: | --- | --- | --- | --- | --- |
| - | pass | - | - | - | - |

## Audit-Run Errors

These are crawler or infrastructure failures. They are excluded from story ranking.

| Kind | Check | Story | File | Message |
| --- | --- | --- | --- | --- |
| - | - | - | - | - |

## False-Positive/Noise

Ignored console messages, benign warnings, font/favicon misses, and known crawler artifacts are summarized here instead of being counted as story failures.

| Kind | Count | Sample |
| --- | ---: | --- |
| console-warning | 71 | Addon controls: Control of type color only supports string, received "other" instead ; Addon controls: Control of type color only supports string, received "other" instead ; Addon controls: Control of type color only supports string, received "other" instead ; |

## Ranked Groups By File/Title Prefix

No findings.

## Rerun

```bash
STORYBOOK_URL=http://127.0.0.1:6016 STORYBOOK_QA_CONCURRENCY=12 node scripts/storybook-exhaustive-qa.js
```

Useful options: `--filter text`, `--broad-limit N`, `--limit N`, `--mobile-all`, `--fail-on-findings`.
