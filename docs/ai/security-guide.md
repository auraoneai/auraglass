# AI Security Guide

AI-backed features need the same security bar as other production backend routes, plus provider-specific controls.

## Required Controls

- Keep API keys in environment secrets.
- Authenticate all write, generation, upload, and search requests.
- Validate prompt inputs, file uploads, MIME types, and payload size.
- Strip secrets and private data from prompts before sending data to third-party providers.
- Log provider request IDs and failures without logging raw secrets or sensitive user content.
- Apply rate limits per user, IP, organization, and endpoint.

## Review Checklist

Before launch, review prompt injection risks, data retention settings, provider terms, and rollback behavior for each AI route.
