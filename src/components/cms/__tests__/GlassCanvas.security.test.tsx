/** REQ-PLAT-42 (PLAT-073/074): page-level CMS `onClick` strings are never
    executed; clicks dispatch onComponentAction(componentId, 'click') and a
    string onClick warns once per component id in dev. */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlassCanvas } from "../GlassCanvas";

const WARNING =
  "[aura-glass] GlassCanvas no longer executes string onClick scripts (security). Pass a function via onComponentAction instead.";

const button = (id: string) => ({
  id,
  type: "button",
  props: {
    label: `Click ${id}`,
    onClick: "window.__pwned=1",
  },
  children: [],
  position: { x: 0, y: 0 },
  size: { width: 100, height: 40 },
});
// mutable so a test can swap the page's components
let components: any[] = [button("btn-1")];

jest.mock("../GlassDragDropProvider", () => {
  const actual = jest.requireActual("../GlassDragDropProvider");
  return {
    ...actual,
    useDragDrop: () => ({
      pageState: {
        get components() {
          return components;
        },
        selectedComponent: undefined,
        history: [[]],
        historyIndex: 0,
        previewMode: false,
        activeBreakpoint: "desktop",
        showGrid: false,
        snapToGrid: true,
      },
      dragDropState: { isDragging: false, draggedType: null },
      onDrop: jest.fn(),
      selectComponent: jest.fn(),
      getSelectedComponent: jest.fn(() => undefined),
      updateComponent: jest.fn(),
      onDragStart: jest.fn(),
    }),
  };
});

describe("GlassCanvas string onClick (REQ-PLAT-42)", () => {
  let warn: jest.SpyInstance;
  beforeEach(() => {
    components = [button("btn-1")];
    delete (window as any).__pwned;
    warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());
  // The once-per-id registry is module state: each test uses its own ids.
  const stringActionWarnings = () => warn.mock.calls.filter((c) => c[0] === WARNING);

  it('clicking "window.__pwned=1" leaves it undefined and calls onComponentAction("btn-1", "click")', () => {
    const onComponentAction = jest.fn();
    render(<GlassCanvas onComponentAction={onComponentAction} />);
    fireEvent.click(screen.getByRole("button"));
    expect((window as any).__pwned).toBeUndefined();
    expect(onComponentAction).toHaveBeenCalledTimes(1);
    expect(onComponentAction).toHaveBeenCalledWith("btn-1", "click");
  });

  it("renders no click handler from the string without onComponentAction", () => {
    render(<GlassCanvas />);
    fireEvent.click(screen.getByRole("button"));
    expect((window as any).__pwned).toBeUndefined();
  });

  it("warns once per component id with the exact message, across re-renders", () => {
    components = [button("w-1"), button("w-2")];
    const { rerender } = render(<GlassCanvas />);
    rerender(<GlassCanvas />);
    rerender(<GlassCanvas onComponentAction={jest.fn()} />);
    expect(stringActionWarnings()).toHaveLength(2);
    components = [button("w-1"), button("w-2"), button("w-3")];
    rerender(<GlassCanvas />);
    expect(stringActionWarnings()).toHaveLength(3);
  });

  it("does not warn in production", () => {
    const prev = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = "production";
    try {
      components = [button("prod-1")];
      render(<GlassCanvas />);
      expect(stringActionWarnings()).toHaveLength(0);
    } finally {
      (process.env as any).NODE_ENV = prev;
    }
  });

  it("contains no new Function / eval usage", () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../GlassCanvas.tsx"),
      "utf8"
    );
    expect(src).not.toMatch(/new Function/);
    expect(src).not.toMatch(/\beval\(/);
    expect(src).not.toMatch(/no-new-func|no-eval/);
  });

  it("never constructs Function during render + click (Function spy)", () => {
    const spy = jest.spyOn(global, "Function");
    spy.mockClear();
    render(<GlassCanvas onComponentAction={jest.fn()} />);
    fireEvent.click(screen.getByRole("button"));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("no-new-func / no-eval scope (REQ-PLAT-42)", () => {
  it("browserCompatibility.ts has no file-wide disable, only the three line disables", () => {
    const src: string = require("fs").readFileSync(
      require("path").join(__dirname, "../../../utils/browserCompatibility.ts"),
      "utf8"
    );
    expect(src).not.toMatch(/\/\*\s*eslint-disable(?!-next-line)[^*]*no-new-func/);
    expect(src.match(/eslint-disable-next-line no-new-func/g)).toHaveLength(3);
  });
});
