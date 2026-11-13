import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const articles = [
  ["/en/journal/what-is-chiroso-coffee", "/es/blog/que-es-el-cafe-chiroso"],
  ["/en/journal/how-to-buy-green-coffee-from-colombia", "/es/blog/como-comprar-cafe-verde-de-colombia"],
  ["/en/journal/urrao-antioquia-coffee-region-guide", "/es/blog/urrao-antioquia-guia-region-cafetera"],
].flat();

const pages = [
  "/en/regions", "/es/regiones",
  "/en/regions/urrao", "/es/regiones/urrao",
  "/en/our-story", "/es/nuestra-historia",
  "/en/journal", "/es/blog",
  "/en/privacy", "/es/privacidad",
  "/en/terms", "/es/terminos",
  ...articles,
];

async function jsonLdNodes(page: Page) {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  return raw.flatMap((r) => JSON.parse(r)["@graph"] ?? []) as Array<Record<string, unknown>>;
}

async function noSeriousAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    // Shared header language switcher (foundation, fixed in T1.8).
    .disableRules(["label-content-name-mismatch"])
    .analyze();
  const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
}

for (const path of pages) {
  test.describe(path, () => {
    test("renders one H1, one main landmark and no horizontal scroll", async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test("has no serious or critical axe violations", async ({ page }) => {
      await page.goto(path);
      await noSeriousAxe(page);
    });
  });
}

for (const path of articles) {
  test(`${path} has Article JSON-LD and at least 3 internal links in the body`, async ({ page }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    const article = nodes.find((n) => n["@type"] === "Article");
    expect(article).toBeTruthy();
    for (const key of ["headline", "datePublished", "dateModified", "author", "image"]) {
      expect(article![key], key).toBeTruthy();
    }
    expect((article!.author as { "@type": string })["@type"]).toBe("Organization");
    const lang = path.startsWith("/es") ? "es" : "en";
    const links = await page.locator(`article a[href^="/${lang}/"]`).evaluateAll((as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute("href")),
    );
    expect(new Set(links).size).toBeGreaterThanOrEqual(3);
    const text = await page.locator("article").first().innerText();
    const words = text.split(/\s+/).length;
    expect(words).toBeGreaterThan(600);
  });
}

for (const path of ["/en/regions/urrao", "/es/regiones/urrao"]) {
  test(`${path} has a Place with geo and Antioquia, with producers, lots, facts and calendar`, async ({ page }) => {
    await page.goto(path);
    const place = (await jsonLdNodes(page)).find((n) => n["@type"] === "Place") as { geo?: { latitude?: number }; containedInPlace?: unknown } | undefined;
    expect(place?.geo?.latitude).toBeTruthy();
    expect(JSON.stringify(place?.containedInPlace)).toContain("Antioquia");
    await expect(page.locator("table").first().locator("tbody tr")).toHaveCount(6);
    await expect(page.locator("main article h3")).not.toHaveCount(0);
    await expect(page.locator('[data-asset-id="urrao-region-map"]')).toHaveCount(1);
    await expect(page.locator("table").nth(1).locator("tbody tr")).toHaveCount(2);
  });
}

for (const path of ["/en/regions", "/es/regiones"]) {
  test(`${path} shows Urrao live and four regions coming`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("main ul > li")).toHaveCount(4);
    await expect(page.locator(`main a[href$="/urrao"]`)).toHaveCount(1);
  });
}

for (const path of ["/en/privacy", "/es/privacidad", "/en/terms", "/es/terminos"]) {
  test(`${path} is marked as a draft and names the PQRS contact`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("main")).toContainText(/draft for legal review|borrador para revisión legal/i);
    await expect(page.locator("main a[href^='mailto:pqrs@']")).toHaveCount(1);
  });
}

for (const path of ["/en/terms", "/es/terminos"]) {
  test(`${path} covers the right of withdrawal`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("main h2", { hasText: /retracto/i })).toHaveCount(1);
  });
}

for (const [lang, path] of [["en", "/en/journal/does-not-exist"], ["es", "/es/blog/does-not-exist"]]) {
  test(`${path} shows the branded 404 with links to lots, shop and home`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    const shop = lang === "en" ? "shop" : "tienda";
    const lots = lang === "en" ? "coffees" : "cafes";
    await expect(page.locator(`main a[href="/${lang}/${lots}"]`)).toHaveCount(1);
    await expect(page.locator(`main a[href="/${lang}/${shop}"]`)).toHaveCount(1);
    await expect(page.locator(`main a[href="/${lang}"]`)).toHaveCount(1);
    await noSeriousAxe(page);
  });
}
