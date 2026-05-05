# AI API Reference

This page summarizes the AuraGlass AI service surface used by the AI setup and quick-start guides.

## Runtime Services

- OpenAI service: imported from `aura-glass/services/ai/openai-service` for text generation, form generation, and prompt orchestration.
- Vision service: imported from `aura-glass/services/ai/vision-service` for image analysis workflows.
- Collaboration service: imported from `aura-glass/services/websocket/collaboration-service` for presence and realtime collaboration.

## Environment Inputs

- `OPENAI_API_KEY`: required for OpenAI-backed features.
- `PINECONE_API_KEY`: required for semantic search deployments that use Pinecone.
- `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS`: required for Google Vision deployments.
- `REDIS_URL`: recommended for caching and backend coordination.

## Verification

Use the AI quick start with `npm run build:server`, `npm run server:all`, and the documented cURL smoke checks before exposing AI routes in production.
