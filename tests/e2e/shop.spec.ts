import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const CO = { "x-country": "CO" };

async function ready(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState("networkidle");
}

test.describe("shop in Colombia", () => {
  test.use({ extraHTTPHeaders: CO });

  for (const path of ["/en/shop", "/es/tienda", "/en/shop/el-mirador-chiroso", "/es/tienda/el-mirador-chiroso"]) {
    test(`${path} renders with one H1 and is indexable`, async ({ page }) => {
      await ready(page, path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
      await expect(page.locator('script[type="application/ld+json"]')).not.toHaveCount(0);
    });
  }

  test("prices use the Colombian format in Spanish and COP in English", async ({ page }) => {
    await ready(page, "/es/tienda");
    await expect(page.getByText("$68.000").first()).toBeVisible();
    await ready(page, "/en/shop");
    await expect(page.getByText("COP 68,000").first()).toBeVisible();
    await ready(page, "/es/tienda/el-mirador-chiroso");
    await expect(page.getByTestId("product-price")).toHaveText("$68.000");
    await expect(page.getByTestId("product-per-kg")).toHaveText("$200.000 / kg");
  });

  test("product page JSON-LD has an Offer in COP with shipping and return policy", async ({ page }) => {
    await ready(page, "/en/shop/el-mirador-chiroso");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const json = blocks.join("");
    expect(json).toContain('"priceCurrency":"COP"');
    expect(json).toContain("OfferShippingDetails");
    expect(json).toContain("MerchantReturnPolicy");
  });

  test("filters narrow the grid", async ({ page }) => {
    await ready(page, "/en/shop");
    await page.getByRole("button", { name: "Under COP 50,000" }).click();
    await expect(page.getByText("Showing 4 of 8 coffees")).toBeVisible();
    await page.getByRole("button", { name: "Dark roast" }).click();
    await expect(page.getByText("Showing 1 of 8 coffees")).toBeVisible();
  });

  test("cart: add, quantity, progress, escape, persistence, remove and WhatsApp text", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "header cart button is in the menu on small screens");
    await ready(page, "/en/shop");
    const add = page.getByTestId("add-to-cart").first();
    await add.click();

    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId("cart-subtotal")).toHaveText("COP 68,000");
    await expect(page.getByTestId("free-shipping-text")).toHaveText("COP 82,000 more for free shipping");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "45");

    await page.getByRole("button", { name: /Increase quantity/ }).click();
    await expect(page.getByTestId("cart-qty")).toHaveText("2");
    await expect(page.getByTestId("cart-subtotal")).toHaveText("COP 136,000");

    const href = (await page.getByTestId("cart-checkout").getAttribute("href")) ?? "";
    expect(href).toContain("https://wa.me/");
    const text = decodeURIComponent(href.split("text=")[1]);
    expect(text).toContain("2 x Chiroso Washed");
    expect(text).toContain("Subtotal: COP 136,000");

    // Escape closes the drawer and focus goes back to the button that opened it.
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(add).toBeFocused();

    // The cart survives a reload and shows in the header.
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: /^Cart.*2/ })).toBeVisible();
    await page.getByRole("button", { name: /^Cart.*2/ }).click();
    await expect(page.getByTestId("cart-subtotal")).toHaveText("COP 136,000");

    await page.getByRole("button", { name: /Remove Chiroso Washed/ }).click();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });

  test("product page adds the selected grind to the cart", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "desktop flow");
    await ready(page, "/es/tienda/el-mirador-chiroso");
    await page.getByText("Molido para moka").click();
    await page.getByTestId("product-add").click();
    await expect(page.getByTestId("cart-drawer")).toContainText("Molido para moka");
    await expect(page.getByTestId("cart-subtotal")).toHaveText("$68.000");
  });

  test("no serious or critical axe violations on the shop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "one axe run is enough");
    await ready(page, "/en/shop");
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(bad.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
});

test.describe("shop outside Colombia", () => {
  test.use({ extraHTTPHeaders: { "x-country": "US" } });

  for (const path of ["/en/shop", "/es/tienda", "/en/shop/el-mirador-chiroso"]) {
    test(`${path} says the shop ships inside Colombia only (200, noindex)`, async ({ page }) => {
      // noindex comes from the proxy's X-Robots-Tag header (DECISIONS.md "T3.x-proxy"), not a meta tag.
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      expect(response?.headers()["x-robots-tag"]).toBe("noindex, follow");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toContainText("Colombia");
      await expect(page.locator('main a[href$="/coffees"], main a[href$="/cafes"]')).toHaveCount(1);
      await expect(page.getByTestId("add-to-cart")).toHaveCount(0);
    });
  }
});
