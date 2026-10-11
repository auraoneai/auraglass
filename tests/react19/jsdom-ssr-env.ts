/**
 * jsdom does not expose TextEncoder/TextDecoder, which react-dom/server's
 * browser build needs at import time. Import this module before
 * `react-dom/server` in the react19 legs.
 */
import { TextDecoder, TextEncoder } from 'util';

const g = globalThis as unknown as Record<string, unknown>;
if (typeof g.TextEncoder === 'undefined') g.TextEncoder = TextEncoder;
if (typeof g.TextDecoder === 'undefined') g.TextDecoder = TextDecoder;
