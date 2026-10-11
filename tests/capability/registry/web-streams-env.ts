// tests/capability/registry/web-streams-env.ts — imported FIRST by jsdom
// capability tests that load the AI SDK (`ai` / `@ai-sdk/react`). jest's jsdom
// environment does not expose Node's WHATWG stream / encoding globals, which
// the SDK uses at module scope, nor `structuredClone` (used by @ai-sdk/react's
// chat state; V8's serializer is the same structured-clone algorithm Node's
// global uses); this installs Node's own implementations (no
// fakes) only where the environment lacks them.
import { ReadableStream, TextDecoderStream, TextEncoderStream, TransformStream, WritableStream } from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';
import { deserialize, serialize } from 'node:v8';

const g = globalThis as Record<string, unknown>;
const install: Record<string, unknown> = {
  ReadableStream, WritableStream, TransformStream, TextDecoderStream, TextEncoderStream, TextEncoder, TextDecoder,
  structuredClone: <T,>(value: T): T => deserialize(serialize(value)) as T,
};
for (const [name, value] of Object.entries(install)) {
  if (typeof g[name] === 'undefined') g[name] = value;
}

export {};
