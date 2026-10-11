"use client";
/**
 * PLAT-107 — fuzzy-search metacharacter escape coverage.
 * Each of ( [ * + ? \ ^ $ | { } must neither throw nor empty a list
 * containing it; an item containing '(' matches '('; results for 'abc'
 * equal the 4.1.0 fixture (ordered labels below).
 */
import { filterCommandItem, type CommandItem } from "./GlassCommandPalette";

const items: CommandItem[] = [
  { id: "paren", label: "Open (file)", keywords: [] },
  { id: "star", label: "Star * item", keywords: [] },
  { id: "plain", label: "abc def", keywords: [] },
  { id: "zebra", label: "zebra", keywords: [] },
] as CommandItem[];

const METACHARS = ["(", "[", "*", "+", "?", "\\", "^", "$", "|", "{", "}"];

describe("filterCommandItem fuzzy escaping (PLAT-107)", () => {
  for (const ch of METACHARS) {
    it(`'${ch}' neither throws nor empties`, () => {
      let out: CommandItem[] = [];
      expect(() => {
        out = items.filter((i) => filterCommandItem(i, ch, true));
      }).not.toThrow();
      /* an item literally containing the char must still match */
      const literal = {
        id: "lit",
        label: `has ${ch} char`,
        keywords: [],
      } as CommandItem;
      expect(filterCommandItem(literal, ch, true)).toBe(true);
    });
  }

  it("an item containing '(' matches '('", () => {
    const out = items.filter((i) => filterCommandItem(i, "(", true));
    expect(out.map((i) => i.id)).toContain("paren");
  });

  it("'abc' fuzzy result equals the 4.1.0 fixture", () => {
    const out = items.filter((i) => filterCommandItem(i, "abc", true));
    /* 4.1.0 fixture: 'abc def' matches (a.*b.*c subsequence); the rest don't. */
    expect(out.map((i) => i.id)).toEqual(["plain"]);
  });

  it("non-fuzzy mode is literal substring", () => {
    expect(
      filterCommandItem(
        { id: "x", label: "a*b", keywords: [] } as CommandItem,
        "*",
        false
      )
    ).toBe(true);
    expect(filterCommandItem(items[0], "abc", false)).toBe(false);
  });
});
