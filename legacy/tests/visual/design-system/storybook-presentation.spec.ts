import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const screenshotDir = path.join(
  repoRoot,
  "test-results/storybook-presentation"
);

const read = (relativePath: string) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test.beforeAll(() => {
  fs.mkdirSync(screenshotDir, { recursive: true });
});

const overlaps = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

test.describe("Storybook presentation quality", () => {
  test("global preview uses controlled surfaces instead of the old forced wrapper", () => {
    const preview = read(".storybook/preview.tsx");
    const surface = read(".storybook/StorySurface.tsx");

    expect(preview).toContain("globalTypes");
    expect(preview).toContain("previewMode");
    expect(preview).toContain("StorySurface");
    expect(preview).not.toContain("CursorGlow");
    expect(preview).not.toContain('forceColorMode="dark"');
    expect(preview).not.toContain("radial-gradient(circle, rgba(59,130,246,0.8)");

    expect(surface).toContain('data-storybook-preview-mode={mode}');
    expect(surface).toContain('data-storybook-surface={kind}');
    expect(surface).toContain('"light"');
    expect(surface).toContain('"dark"');
    expect(surface).toContain('"liquid"');
    expect(surface).toContain('"high-contrast"');
  });

  test("navigation separates curated, reference, and certification stories", async ({
    request,
  }) => {
    const response = await request.get("/index.json");
    expect(response.ok()).toBe(true);

    const index = (await response.json()) as {
      entries: Record<string, { id: string; title: string; name: string }>;
    };
    const entries = Object.values(index.entries);
    const titles = entries.map((entry) => entry.title);

    expect(titles).toContain("Curated/Start Here");
    expect(titles).toContain("Reference/Generated Component Inventory");
    expect(titles).toContain("Reference/Category Galleries/Button");
    expect(titles).toContain("Certification/Glassmorphism Coverage");
    expect(titles).toContain("Certification/Missing Inventory Components");

    expect(titles).not.toContain("AuraGlass/Component Gallery");
    expect(titles.some((title) => title.startsWith("Categories/"))).toBe(false);
    expect(titles.some((title) => title.startsWith("Audits/"))).toBe(false);
  });

  test("curated start page gives developers a composed inventory entry point", async ({
    page,
  }) => {
    await page.goto("/iframe.html?id=curated-start-here--guide");
    await expect(page.getByText("AuraGlass 3.0 Storybook")).toBeVisible();
    await expect(
      page.locator("header").getByText("356", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Developer Paths" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Component Families" })
    ).toBeVisible();

    const screenshot = await page.screenshot({
      path: path.join(screenshotDir, "curated-start-here.png"),
      fullPage: true,
    });
    expect(screenshot.length).toBeGreaterThan(100_000);

    const heading = await page.getByRole("heading", { level: 1 }).boundingBox();
    const firstTile = await page
      .getByText("Certified Components", { exact: true })
      .boundingBox();
    expect(heading).toBeTruthy();
    expect(firstTile).toBeTruthy();
    if (heading && firstTile) {
      expect(overlaps(heading, firstTile)).toBe(false);
      expect(heading.width).toBeGreaterThan(420);
      expect(firstTile.y).toBeGreaterThan(heading.y + heading.height);
    }
  });

  test("liquid showcase composition does not clip or overlap primary chrome", async ({
    page,
  }) => {
    await page.goto(
      "/iframe.html?id=showcase-liquidglassshowcase--app-experience&globals=previewMode:liquid"
    );

    const root = page.locator('[data-liquid-glass-showcase="true"]');
    await expect(root).toBeVisible();
    await expect(page.locator(".liquid-glass-debug")).toHaveCount(0);
    await expect(page.getByText("Aura Liquid Glass")).toBeVisible();
    await expect(page.getByRole("button", { name: "Open" })).toBeVisible();
    await expect(page.getByText("Surface intelligence")).toBeVisible();

    const screenshot = await page.screenshot({
      path: path.join(screenshotDir, "liquid-glass-showcase.png"),
      fullPage: true,
    });
    expect(screenshot.length).toBeGreaterThan(150_000);

    const title = await page.getByText("Aura Liquid Glass").boundingBox();
    const open = await page.getByRole("button", { name: "Open" }).boundingBox();
    const search = await page.getByPlaceholder("Search surfaces").boundingBox();
    const sidebar = await page.getByText("Home").first().boundingBox();
    const tabBar = await page.getByText("Liquid Study").boundingBox();

    for (const box of [title, open, search, sidebar, tabBar]) {
      expect(box).toBeTruthy();
      if (box) {
        expect(box.width).toBeGreaterThan(20);
        expect(box.height).toBeGreaterThan(12);
      }
    }

    if (title && open) expect(overlaps(title, open)).toBe(false);
    if (search && open) expect(overlaps(search, open)).toBe(false);
    if (sidebar && search) expect(overlaps(sidebar, search)).toBe(false);
    if (tabBar && search) expect(tabBar.y).toBeGreaterThan(search.y + search.height);

    const visibleLiquidSurfaces = await page
      .locator('[data-liquid-glass-material="true"]')
      .count();
    expect(visibleLiquidSurfaces).toBeGreaterThan(3);
  });

  test("default component stories render on a neutral light surface", async ({
    page,
  }) => {
    await page.goto("/iframe.html?id=components-button-glassbutton--default");
    const surface = page.locator("[data-storybook-preview-mode]");
    await expect(surface).toHaveAttribute("data-storybook-preview-mode", "light");
    await expect(surface).toHaveAttribute("data-storybook-surface", "component");

    const button = page.getByRole("button").first();
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      expect(box.width).toBeGreaterThan(40);
      expect(box.height).toBeGreaterThanOrEqual(24);
      expect(box.x).toBeGreaterThan(200);
      expect(box.y).toBeGreaterThan(160);
    }

    const screenshot = await page.screenshot({
      path: path.join(screenshotDir, "glass-button-default.png"),
      fullPage: true,
    });
    expect(screenshot.length).toBeGreaterThan(10_000);
  });
});
