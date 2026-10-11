import { describe, expect, it } from '@jest/globals';
import { commandScore } from './score';

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('commandScore', () => {
  it('regex metacharacters are literals', () => {
    for (const ch of ['(', '[', '*', '+', '?', '\\', '^', '$', '|', ')', ']', '{', '}', '.']) {
      expect(() => commandScore(ch, `a${ch}b`)).not.toThrow();
      expect(commandScore(ch, `a${ch}b`)).toBeGreaterThan(0);
      // and it does NOT behave like a regex
      expect(commandScore('*', 'aaaaaaaaaa')).toBe(0);
    }
  });

  it('ranking: exact > prefix > word-start > subsequence', () => {
    const exact = commandScore('open', 'open');
    const prefix = commandScore('open', 'open settings');
    const wordStart = commandScore('os', 'open settings');
    const sub = commandScore('ons', 'open settings');
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(wordStart);
    expect(wordStart).toBeGreaterThan(sub);
    expect(sub).toBeGreaterThan(0);
  });

  it('case-insensitive', () => {
    expect(commandScore('Open', 'open')).toBe(1);
    expect(commandScore('OPEN', 'Open Settings')).toBeCloseTo(commandScore('open', 'Open Settings'), 10);
  });

  it('diacritic folding', () => {
    expect(commandScore('cafe', 'café menu')).toBeGreaterThan(0);
    expect(commandScore('resume', 'résumé')).toBeGreaterThan(commandScore('resume', 'unrelated'));
    expect(commandScore('naive', 'naïve')).toBe(1);
  });

  it('keywords participate but rank below the value', () => {
    const viaKeyword = commandScore('print', 'Export', ['print', 'pdf']);
    const viaValue = commandScore('print', 'Print', ['export']);
    expect(viaKeyword).toBeGreaterThan(0);
    expect(viaKeyword).toBeLessThan(viaValue);
  });

  it('empty and non-matching input', () => {
    expect(commandScore('', 'anything')).toBe(0);
    expect(commandScore('   ', 'anything')).toBe(0);
    expect(commandScore('xyz', 'nothing here')).toBe(0);
    expect(commandScore('longer', 'short')).toBe(0);
  });

  it('fuzz: 10,000 random printable-ASCII queries — 0 exceptions, output in [0,1]', () => {
    const rand = mulberry32(0xf00dcafe);
    const values = ['Open Settings', 'Save File As…', 'résumé review', 'go to line', 'new terminal', 'りえ'];
    for (let i = 0; i < 10000; i++) {
      const len = 1 + Math.floor(rand() * 12);
      let q = '';
      for (let j = 0; j < len; j++) q += String.fromCharCode(32 + Math.floor(rand() * 95));
      for (const v of values) {
        const s = commandScore(q, v, ['kw1', 'kw2']);
        if (!(s >= 0 && s <= 1)) throw new Error(`query ${JSON.stringify(q)} vs ${v} -> ${s}`);
      }
    }
  });
});

// REQ-SURF-61: camelCase word start ranks via raw-position boundary check.
it("score('oS','openSettings') treats 'S' as a word start", () => {
  const s = commandScore('oS', 'openSettings');
  expect(s).toBeGreaterThanOrEqual(0.6); // word-start band, not mid-word subsequence
  expect(s).toBeGreaterThan(commandScore("oS","optionsSave"));
});
