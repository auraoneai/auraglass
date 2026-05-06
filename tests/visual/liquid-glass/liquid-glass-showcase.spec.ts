import { test, expect } from "@playwright/test";

test("liquid glass showcase story renders", async ({ page }) => {
  await page.goto("/iframe.html?id=showcase-liquidglassshowcase--app-experience");
  const title = page.getByText("Aura Liquid Glass").first();
  const openButton = page.getByRole("button", { name: "Open" });
  await expect(title).toBeVisible();
  await expect(openButton).toBeVisible();
  await expect(page.getByRole("button", { name: "Play" }).first()).toBeVisible();

  const boxes = await Promise.all([title.boundingBox(), openButton.boundingBox()]);
  expect(boxes[0]).toBeTruthy();
  expect(boxes[1]).toBeTruthy();
  if (boxes[0] && boxes[1]) {
    const overlap =
      boxes[0].x < boxes[1].x + boxes[1].width &&
      boxes[0].x + boxes[0].width > boxes[1].x &&
      boxes[0].y < boxes[1].y + boxes[1].height &&
      boxes[0].y + boxes[0].height > boxes[1].y;
    expect(overlap).toBe(false);
  }

  const visibleLiquidSurfaces = await page.locator('[data-liquid-glass-material="true"]').count();
  expect(visibleLiquidSurfaces).toBeGreaterThan(3);
});
