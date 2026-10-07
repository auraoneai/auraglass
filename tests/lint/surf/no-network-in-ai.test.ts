/** @jest-environment node */
// tests/lint/surf/no-network-in-ai.test.ts — REQ-SURF-05 (SURF lane W3).
// RuleTester coverage for lint/rules/surf/no-network-in-ai.cjs.

import { describe, expect, it } from '@jest/globals';
import { RuleTester } from 'eslint';

const rule = require('../../../lint/rules/surf/no-network-in-ai.cjs');

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe('auraglass/no-network-in-ai', () => {
  it('is loaded via RuleTester', () => {
    expect(typeof rule.create).toBe('function');
  });
});

tester.run('auraglass/no-network-in-ai', rule, {
  valid: [
    'const env = process.env.NODE_ENV;',
    'const env = process.env["NODE_ENV"];',
    'import { Thread } from "aura-glass/ai";',
    'const x = ctx.fetch_local();',
    'navigator.clipboard.writeText(t);',
    'import { Button } from "react-aria-components";',
  ],
  invalid: [
    { code: 'await fetch("/api/chat");', errors: [{ messageId: 'network' }] },
    { code: 'const x = new XMLHttpRequest();', errors: [{ messageId: 'network' }] },
    { code: 'const s = new WebSocket("wss://x");', errors: [{ messageId: 'network' }] },
    { code: 'const e = new EventSource("/sse");', errors: [{ messageId: 'network' }] },
    { code: 'navigator.sendBeacon("/t", data);', errors: [{ messageId: 'sendBeacon' }] },
    { code: 'const key = process.env.OPENAI_API_KEY;', errors: [{ messageId: 'env' }] },
    { code: 'const key = import.meta.env.VITE_KEY;', errors: [{ messageId: 'importMetaEnv' }] },
    { code: 'import { useChat } from "@ai-sdk/react";', errors: [{ messageId: 'provider' }] },
    { code: 'import OpenAI from "openai";', errors: [{ messageId: 'provider' }] },
    { code: 'el.scrollIntoView();', errors: [{ messageId: 'scrollIntoView' }] },
    { code: 'const d = <div dangerouslySetInnerHTML={{ __html: s }} />;', errors: [{ messageId: 'dangerouslySetInnerHTML' }] },
  ],
});
