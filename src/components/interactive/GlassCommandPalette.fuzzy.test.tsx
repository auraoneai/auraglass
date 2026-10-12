"use client";
/**
 * PLAT-106/107 — fuzzy-search metacharacter escape coverage.
 * Each of ( [ * + ? \ ^ $ | { } must neither throw nor empty a list that
 * contains it; it matches only items that literally contain it; an item
 * containing '(' matches '('; results for 'abc' equal the 4.1.0 fixture.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  GlassCommandPalette,
  filterCommandItem,
  type CommandItem,
} from "./GlassCommandPalette";

const base: CommandItem[] = [
  { id: "paren", label: "Open (file)", keywords: [] },
  { id: "star", label: "Star * item", keywords: [] },
  { id: "plain", label: "abc def", keywords: [] },
  { id: "zebra", label: "zebra", keywords: [] },
] as CommandItem[];

const METACHARS = ["(", "[", "*", "+", "?", "\\", "^", "$", "|", "{", "}"];

const fuzzy = (list: CommandItem[], q: string) =>
  list.filter((i) => filterCommandItem(i, q, true)).map((i) => i.id);

describe("filterCommandItem fuzzy escaping (PLAT-107)", () => {
  it.each(METACHARS)("'%s' neither throws nor empties, and matches only literal holders", (ch) => {
    const list = [
      ...base,
      { id: "lit", label: `has ${ch} char`, keywords: [] } as CommandItem,
    ];
    let ids: string[] = [];
    expect(() => {
      ids = fuzzy(list, ch);
    }).not.toThrow();
    const expected = list
      .filter((i) => i.label.toLowerCase().includes(ch))
      .map((i) => i.id);
    expect(expected).toContain("lit");
    expect(ids).toEqual(expected);
  });

  it("an item containing '(' matches '('", () => {
    expect(fuzzy(base, "(")).toEqual(["paren"]);
  });

  it("'abc' fuzzy result equals the 4.1.0 fixture", () => {
    /* 4.1.0: 'abc def' matches the a.*b.*c subsequence; nothing else does. */
    expect(fuzzy(base, "abc")).toEqual(["plain"]);
  });

  it("fuzzy also searches description and keywords", () => {
    const item = {
      id: "d",
      label: "zzz",
      description: "x(y",
      keywords: ["k+w"],
    } as CommandItem;
    expect(filterCommandItem(item, "(", true)).toBe(true);
    expect(filterCommandItem(item, "+", true)).toBe(true);
    expect(filterCommandItem(item, "[", true)).toBe(false);
  });

  it("non-fuzzy mode is literal substring", () => {
    expect(
      filterCommandItem({ id: "x", label: "a*b", keywords: [] } as CommandItem, "*", false)
    ).toBe(true);
    expect(filterCommandItem(base[0], "abc", false)).toBe(false);
    expect(filterCommandItem(base[2], "abc", false)).toBe(true);
  });

  it("empty query matches every item", () => {
    expect(fuzzy(base, "")).toEqual(base.map((i) => i.id));
  });
});

describe("GlassCommandPalette default filter uses the escaped fuzzy filter", () => {
  it("typing '(' renders only the item containing '(' and does not throw", () => {
    render(
      <GlassCommandPalette
        open
        onOpenChange={() => {}}
        items={base}
        fuzzySearch
      />
    );
    const input = screen.getByPlaceholderText("Search commands...");
    expect(() => fireEvent.change(input, { target: { value: "(" } })).not.toThrow();
    expect(screen.getByText("Open (file)")).toBeTruthy();
    expect(screen.queryByText("zebra")).toBeNull();
    expect(screen.queryByText("abc def")).toBeNull();
  });
});
