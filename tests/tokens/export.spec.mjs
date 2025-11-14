import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolve = (file) => path.join(__dirname, "..", "..", "dist", file);

const tokens = await import(resolve("tokens/index.mjs"));
assert.ok(tokens.default);
assert.ok((tokens.personas || []).length > 0);

const tailwind = await import(resolve("tokens/tailwind.theme.mjs"));
assert.ok(tailwind.default?.extend?.colors?.primary);
