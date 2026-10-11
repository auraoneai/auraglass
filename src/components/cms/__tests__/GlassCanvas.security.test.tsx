/** PLAT-073/074: page-level CMS `onClick` strings are surfaced via
    onComponentAction — never executed as code. */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlassCanvas } from "../GlassCanvas";

const component = {
  id: "btn-1",
  type: "button",
  props: {
    label: "Click",
    onClick: "globalThis.__agExecuted = true",
  },
  children: [],
  position: { x: 0, y: 0 },
  size: { width: 100, height: 40 },
};

jest.mock("../GlassDragDropProvider", () => {
  const actual = jest.requireActual("../GlassDragDropProvider");
  return {
    ...actual,
    useDragDrop: () => ({
      pageState: {
        components: [component],
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

describe("GlassCanvas onComponentAction", () => {
  it("exposes injected onClick as an action instead of executing it", () => {
    (globalThis as any).__agExecuted = false;
    const onComponentAction = jest.fn();
    render(<GlassCanvas onComponentAction={onComponentAction} />);
    fireEvent.click(screen.getByRole("button"));
    expect((globalThis as any).__agExecuted).toBe(false);
    expect(onComponentAction).toHaveBeenCalledWith(
      expect.objectContaining({ componentId: "btn-1", event: "click" })
    );
  });

  it("contains no new Function / eval usage", () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../GlassCanvas.tsx"),
      "utf8"
    );
    expect(src).not.toMatch(/new Function/);
    expect(src).not.toMatch(/\beval\(/);
  });
  it("never constructs Function during render + click (Function spy)", () => {
    const spy = jest.spyOn(global, "Function");
    spy.mockClear();
    const onComponentAction = jest.fn();
    render(<GlassCanvas onComponentAction={onComponentAction} />);
    fireEvent.click(screen.getByRole("button"));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
