/* react-dom/server.browser needs MessageChannel and TextEncoder; jest's node
   testEnvironment strips them. Install them from node builtins before
   react-dom loads (module is imported first by the test file). */
import { MessageChannel } from 'node:worker_threads';
import { TextEncoder, TextDecoder } from 'node:util';

const g = globalThis as Record<string, unknown>;
if (typeof g.MessageChannel === 'undefined') g.MessageChannel = MessageChannel;
if (typeof g.TextEncoder === 'undefined') g.TextEncoder = TextEncoder;
if (typeof g.TextDecoder === 'undefined') g.TextDecoder = TextDecoder;
export {};
