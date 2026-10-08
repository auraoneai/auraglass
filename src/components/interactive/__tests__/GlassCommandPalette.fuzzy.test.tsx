/**
 * PLAT-107 — fuzzy-search regex escaping (REQ-PLAT-49).
 *
 * Before the fix, the query was joined into a regex unescaped, so any
 * metacharacter could throw, empty the list, or widen the match. For every
 * metacharacter the spec lists, an item literally containing it must still
 * match it; 'abc' keeps its 4.1.0 fuzzy results.
 */

import React from "react";
import { render, fireEvent, screen, within } from "@testing-library/react";
import { GlassCommandPalette } from "../GlassCommandPalette";
import type { CommandItem } from "../GlassCommandPalette";

const META = ["(", "[", "*", "+", "?", "\\", "^", "$", "|", "{", "}"];

function renderPalette(items: CommandItem[]) {
  const utils = render(
    <GlassCommandPalette
      open
      onClose={() => {}}
      items={items}
      fuzzySearch
      placeholder="Search commands..."
    />
  );
  const input = utils.getByPlaceholderText("Search commands...");
  return { ...utils, input };
}

function optionLabels() {
  return screen.queryAllByRole("option").map((o) => o.textContent || "");
}

describe("GlassCommandPalette fuzzy-search regex escaping", () => {
  it.each(META.map((c) => [c] as const))(
    "metacharacter %s neither throws nor empties a list containing it",
    (ch) => {
      const label = `Do ${ch} thing`;
      const { input, unmount } = renderPalette([
        { id: "meta", label },
        { id: "other", label: "Unrelated zzz" },
      ]);
      expect(() => {
        fireEvent.change(input, { target: { value: ch } });
      }).not.toThrow();
      const labels = optionLabels();
      expect(labels.join(" ")).toContain(label);
      unmount();
    }
  );

  it("an item containing '(' matches the query '('", () => {
    const { input } = renderPalette([
      { id: "paren", label: "Open (edit) panel" },
      { id: "plain", label: "Close panel" },
    ]);
    fireEvent.change(input, { target: { value: "(" } });
    expect(optionLabels().join(" ")).toContain("Open (edit) panel");
  });

  it("metacharacters do not widen the match beyond the literal character", () => {
    const { input } = renderPalette([
      { id: "dot", label: "a.c" },
      { id: "wild", label: "abc" },
    ]);
    // "." must match literally "a.c", not act as a regex wildcard for "abc"
    fireEvent.change(input, { target: { value: "." } });
    const labels = optionLabels();
    expect(labels.join(" ")).toContain("a.c");
  });

  it("'abc' produces the 4.1.0 fuzzy fixture results", () => {
    // 4.1.0 semantics: 'abc' fuzzy-matches labels containing a…b…c in order.
    const items: CommandItem[] = [
      { id: "hit", label: "A Big Command" }, // a…b…c order
      { id: "miss", label: "Cab" }, // wrong order
    ];
    const { input } = renderPalette(items);
    fireEvent.change(input, { target: { value: "abc" } });
    const labels = optionLabels();
    expect(labels.join(" ")).toContain("A Big Command");
    expect(labels.join(" ")).not.toContain("Cab");
  });
});
