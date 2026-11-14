import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** T5.1 coverage the page specs skipped: mobile cart pill, axe on every project, first-hit 404 for unknown product slugs. */

const CO = { "x-country": "CO" };

async function ready(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState("networkidle");
}

test.describe("shop cart on small screens (Colombia)", () => {
  test.use({ extraHTTPHeaders: CO });

  test("floating cart pill: appears after add, shows count and subtotal, opens the drawer, Escape returns focus", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile viewport only");
    await ready(page, "/en/shop");
    await expect(page.getByTestId("floating-cart")).toHaveCount(0);

    const add = page.getByTestId("add-to-cart").first();
    await add.scrollIntoViewIfNeeded();
    await add.click();
    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId("cart-subtotal")).toHaveText("COP 68,000");

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();

    const pill = page.getByTestId("floating-cart");
    await expect(pill).toBeVisible();
    await expect(pill).toContainText("COP 68,000");
    const box = await pill.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);

    await pill.click();
    await expect(drawer).toBeVisible();
    await page.getByRole("button", { name: /Increase quantity/ }).click();
    await expect(page.getByTestId("cart-qty")).toHaveText("2");
    await expect(page.getByTestId("cart-subtotal")).toHaveText("COP 136,000");
    const href = (await page.getByTestId("cart-checkout").getAttribute("href")) ?? "";
    expect(href).toContain("https://wa.me/");
    expect(decodeURIComponent(href.split("text=")[1])).toContain("2 x Chiroso Washed");

    await page.getByRole("button", { name: /Remove Chiroso Washed/ }).click();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
    await page.getByRole("button", { name: /close/i }).first().click();
    await expect(page.getByTestId("floating-cart")).toHaveCount(0);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });

  test("the pill is hidden on wide screens", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "wide viewport only");
    await ready(page, "/en/shop");
    await page.getByTestId("add-to-cart").first().click();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("floating-cart")).toBeHidden();
  });
});

test.describe("axe on shop pages for every project", () => {
  test.use({ extraHTTPHeaders: CO });
  for (const path of ["/en/shop", "/es/tienda", "/en/shop/el-mirador-chiroso", "/es/tienda/el-mirador-chiroso"]) {
    test(`${path} has no serious or critical violations`, async ({ page }) => {
      await ready(page, path);
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).slice(0, 2).join(" | ")}`)).toEqual([]);
    });
  }
});

test.describe("axe on the non-Colombia notice", () => {
  test.use({ extraHTTPHeaders: { "x-country": "US" } });
  for (const path of ["/en/shop", "/es/tienda"]) {
    test(`${path} (US) has no serious or critical violations`, async ({ page }) => {
      await ready(page, path);
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});

test.describe("unknown product slugs are a real 404 on the first hit", () => {
  const stamp = Date.now().toString(36);
  for (const [country, label] of [["CO", "CO"], ["US", "non-CO"]] as const) {
    for (const base of ["/en/shop", "/es/tienda"]) {
      test(`${base}/<unknown> (${label}) returns 404 with no JSON-LD`, async ({ request }) => {
        const res = await request.get(`${base}/qa-${country.toLowerCase()}-${stamp}`, { headers: { "x-country": country } });
        expect(res.status()).toBe(404);
        expect(await res.text()).not.toContain("application/ld+json");
      });
    }
  }
});
