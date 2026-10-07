/* schema-viewer fixtures — a fixed JSON-schema document, deterministic. */
export const SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Deployment',
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Deployment name' },
    replicas: { type: 'integer', minimum: 1, maximum: 64 },
    image: { type: 'string', pattern: '^[a-z0-9./:_-]+$' },
    env: { type: 'object', additionalProperties: { type: 'string' } },
    ports: { type: 'array', items: { type: 'integer' } },
  },
  required: ['name', 'image'],
} as const;
