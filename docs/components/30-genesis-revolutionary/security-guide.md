# Genesis Revolutionary Security Guide

Security review for Genesis advanced components should focus on collaboration, voice input, and browser capability boundaries.

## Controls

- Authenticate collaborative workspaces.
- Sanitize user-generated workspace content.
- Require explicit user activation for microphone-backed voice controls.
- Avoid storing raw transcripts unless the product explicitly requires it.
- Validate room IDs, user IDs, and permission scopes server-side.
