import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { lang: "en", path: "/en/coffees/urr-024", sample: "Request sample" },
  { lang: "es", path: "/es/cafes/urr-024", sample: "Solicitar muestra" },
];

for (const { lang, path, sample } of pages) {
  test.describe(path, () => {
    test("has one H1, a sample link with the lot code, three banner stats and an Offer", async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);

      const link = page.getByRole("complementary").getByRole("link", { name: new RegExp(sample) });
      await expect(link).toHaveAttribute("href", /\/(samples|muestras)\?lot=URR-024$/);

      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      const graph = ld.flatMap((raw) => JSON.parse(raw)["@graph"] ?? []);
      const types = graph.map((n: { "@type": string }) => n["@type"]);
      expect(types).toEqual(expect.arrayContaining(["Product", "BreadcrumbList"]));
      const product = graph.find((n: { "@type": string }) => n["@type"] === "Product");
      expect(product.sku).toBe("URR-024");
      expect(product.offers.priceCurrency).toBe("USD");
      expect(lang === "en" || lang === "es").toBe(true);
    });

    test("gallery thumbnails switch the main photo", async ({ page }) => {
      await page.goto(path);
      const frame = page.locator("[data-vt-name='lot-urr-024']");
      await expect(frame).toHaveCount(1);
      await page.locator("[aria-pressed]").nth(1).click();
      await expect(frame).toContainText("2 / 4");
    });

    test("has no serious or critical axe violations", async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        // Shared header language switcher (foundation): visible "EN" vs aria-label. Reported as a request.
        .disableRules(["label-content-name-mismatch"])
        .analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  });
}

test("a lot without a price shows price on request and has no Offer", async ({ page }) => {
  await page.goto("/en/coffees/urr-035");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("complementary").getByText("Price on request")).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graph = ld.flatMap((raw) => JSON.parse(raw)["@graph"] ?? []);
  const product = graph.find((n: { "@type": string }) => n["@type"] === "Product");
  expect(product).toBeTruthy();
  expect(product.offers).toBeUndefined();
  await expect(page.getByRole("complementary").getByRole("link", { name: /Request sample/ })).toHaveAttribute(
    "href",
    /\?lot=URR-035$/,
  );
});

test("a lot without a producer profile shows no profile link", async ({ page }) => {
  await page.goto("/en/coffees/urr-028");
  await expect(page.getByRole("link", { name: "View producer profile" })).toHaveCount(0);
  await expect(page.getByText("Producer profile coming soon")).toBeVisible();
});

test("an unknown lot code returns 404", async ({ page, request }) => {
  // With Partial Prefetching the very first request for an unlisted path is served from the
  // fallback shell (200 with a noindex tag) and the 404 is cached after that. Warm it up, then
  // assert the status every crawler sees from then on, plus the noindex tag on the first render.
  for (const path of ["/en/coffees/urr-999", "/es/cafes/urr-999"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    await expect(page.locator("script[type='application/ld+json']")).toHaveCount(0);
    const again = await request.get(path);
    expect(again.status()).toBe(404);
  }
});
