import { sampleLiquidGlassBackdrop } from "./useLiquidGlassBackdrop";

it("returns a safe fallback sample without an element", () => {
  const sample = sampleLiquidGlassBackdrop(null);
  expect(sample.luminance).toBe(0.5);
  expect(sample.source).toBe("fallback");
});

it("samples a grid of backdrop elements when available", () => {
  const surface = document.createElement("div");
  document.body.appendChild(surface);
  surface.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  Object.defineProperty(surface, "offsetWidth", { value: 100 });
  Object.defineProperty(surface, "offsetHeight", { value: 100 });

  const backdrop = document.createElement("div");
  backdrop.style.backgroundColor = "rgb(255, 255, 255)";
  const original = document.elementsFromPoint;
  const originalElementFromPoint = document.elementFromPoint;
  (document as any).elementsFromPoint = () => [surface, backdrop];
  (document as any).elementFromPoint = () => backdrop;

  const sample = sampleLiquidGlassBackdrop(surface, { variant: "clear" });
  expect(sample.source).toBe("dom-grid");
  expect(sample.contrastHint).toBe("light");
  expect(sample.requiresDimming).toBe(true);

  (document as any).elementsFromPoint = original;
  (document as any).elementFromPoint = originalElementFromPoint;
  surface.remove();
});
