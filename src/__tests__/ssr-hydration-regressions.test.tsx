import React from "react";
import { act } from "react-dom/test-utils";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server.node";
import { GlassButton } from "@/components/button/GlassButton";
import { GlassCard } from "@/components/card/GlassCard";

async function expectHydratesCleanly(element: React.ReactElement) {
  const container = document.createElement("div");
  const errors: string[] = [];
  const errorSpy = jest
    .spyOn(console, "error")
    .mockImplementation((...args) => {
      errors.push(args.map(String).join(" "));
    });

  container.innerHTML = renderToString(element);
  document.body.appendChild(container);

  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, element);
    await Promise.resolve();
  });

  await act(async () => {
    await Promise.resolve();
  });

  root?.unmount();
  errorSpy.mockRestore();
  container.remove();

  expect(errors.join("\n")).not.toMatch(
    /hydration|hydrate|did not match|Minified React error #418|useLayoutEffect does nothing on the server/i
  );
}

describe("SSR hydration regressions", () => {
  it("hydrates GlassCard without server/client markup mismatch", async () => {
    await expectHydratesCleanly(
      <GlassCard variant="feature" hoverable>
        <h2>Aurora surface</h2>
        <p>SSR-safe glass card.</p>
      </GlassCard>
    );
  });

  it("hydrates GlassButton without server/client markup mismatch", async () => {
    await expectHydratesCleanly(
      <GlassButton variant="aurora" rightIcon={<span aria-hidden>→</span>}>
        Start building
      </GlassButton>
    );
  });
});
