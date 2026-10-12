/* REQ-MAT-61: scripts/mat/verify-focus-single-owner.mjs — each rule fires on
   its fail case and stays silent on the allowed shapes; the real src/ tree is
   clean (src/a11y/css/focus.css is the only focus implementation). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scanCss, scanJs, verifyFocusSingleOwner } from '../../scripts/mat/verify-focus-single-owner.mjs';

const rules = (fs: Array<{ rule: string }>) => fs.map((f) => f.rule);

describe('verify-focus-single-owner (REQ-MAT-61)', () => {
  it('flags a component focus ring (outline / box-shadow on a focus state)', () => {
    expect(rules(scanCss('.a:focus-visible { outline: 2px solid red; }', 'src/x.css'))).toEqual(['focus-indicator']);
    expect(rules(scanCss('.a:focus-within { box-shadow: 0 0 0 2px red; }', 'src/x.css'))).toEqual(['focus-indicator']);
    expect(rules(scanCss('.a:focus { outline-offset: 2px; }', 'src/x.css'))).toEqual(['focus-indicator']);
    expect(rules(scanCss('.a[data-focused] { outline: 1px solid; }', 'src/x.css'))).toEqual(['focus-indicator']);
    expect(rules(scanCss('.b, .a[data-focus-visible] { outline: 1px solid; }', 'src/x.css'))).toEqual(['focus-indicator']);
  });

  it('flags outline removal in any state, including rest', () => {
    expect(rules(scanCss('.a { outline: none; }', 'src/x.css'))).toEqual(['outline-removal']);
    expect(rules(scanCss('.a { outline: 0; }', 'src/x.css'))).toEqual(['outline-removal']);
    expect(rules(scanCss('.a { outline-style: none; }', 'src/x.css'))).toEqual(['outline-removal']);
    expect(rules(scanCss('.a { outline-width: 0px; }', 'src/x.css'))).toEqual(['outline-removal']);
    expect(rules(scanCss('.a:focus-visible { outline: none; }', 'src/x.css'))).toEqual(['outline-removal']);
  });

  it('allows reveal-on-focus rules and non-focus outlines', () => {
    expect(scanCss('.skip:focus-visible { position: static; clip-path: none; }', 'src/x.css')).toEqual([]);
    expect(scanCss('.m:focus-within .actions { opacity: 1; }', 'src/x.css')).toEqual([]);
    expect(scanCss("[data-dragging='true'] { outline: 2px dashed currentColor; }", 'src/x.css')).toEqual([]);
  });

  it('the owner file itself is exempt', () => {
    expect(scanCss('.a:focus-visible { outline: 2px solid red; }', 'src/a11y/css/focus.css')).toEqual([]);
  });

  it('flags focus:outline-none classes and inline outline removal in shipped code', () => {
    expect(rules(scanJs('<button className="px-2 focus:outline-none" />', 'src/x.tsx'))).toEqual(['tailwind-outline-none']);
    expect(rules(scanJs("cn('focus-visible:outline-none')", 'src/x.tsx'))).toEqual(['tailwind-outline-none']);
    expect(rules(scanJs("<div style={{ outline: 'none' }} />", 'src/x.tsx'))).toEqual(['inline-outline-removal']);
    expect(scanJs("<div style={{ outline: '2px solid red' }} />", 'src/x.tsx')).toEqual([]);
  });

  it('the src/ tree has 0 findings', () => {
    expect(verifyFocusSingleOwner(process.cwd())).toEqual([]);
  });

  it('focus.css covers every focusable part, text shells and the inset opt-in from ag.a11y', () => {
    const css = readFileSync(join(process.cwd(), 'src/a11y/css/focus.css'), 'utf8');
    const body = css.slice(css.indexOf('@layer ag.a11y {'));
    expect(body).toContain('[data-ag-focusable]');
    expect(body).toContain('.ag-focusable');
    expect(body).toMatch(/\[data-ag-part\]:not\(/);
    expect(body).toMatch(/:where\(\[data-ag-part='control-shell'\], \[data-ag-part='input-shell'\]\):focus-within/);
    expect(body).toMatch(/outline: var\(--ag-focus-width\) solid var\(--ag-focus-outer\);/);
    expect(body).toMatch(/outline-offset: var\(--ag-focus-width\);/);
    expect(body).toMatch(/box-shadow: 0 0 0 var\(--ag-focus-width\) var\(--ag-focus-inner\), var\(--_ag-shadow, 0 0 transparent\);/);
    expect(body).toMatch(/:where\(\[data-ag-focus-inset\]\):focus-visible \{\s*outline-offset: calc\(var\(--ag-focus-width\) \* -1\);/);
    expect(body).toMatch(/@media \(forced-colors: active\)[\s\S]*outline: 2px solid Highlight;/);
    expect(body).not.toMatch(/outline:\s*(none|0)\b/);
    expect(body).not.toMatch(/transition|animation/);
  });
});
