import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CO = { "x-country": "CO" };
const pages = [
  { lang: "en", path: "/en", forBuyers: "/en/for-buyers", faqHeading: /Questions buyers/ },
  { lang: "es", path: "/es", forBuyers: "/es/para-compradores", faqHeading: /Preguntas que los compradores/ },
];

for (const p of pages) {
  test.describe(`${p.path} (Colombia)`, () => {
    test.use({ extraHTTPHeaders: CO });

    test("one H1, one main, JSON-LD with Organization, WebSite and FAQPage", async ({ page }) => {
      const response = await page.goto(p.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      // Organization + WebSite come from the layout graph and FAQPage from the page (T3.1, DECISIONS.md "JSON-LD validation" line).
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const types = blocks.flatMap((raw) => {
        const json = JSON.parse(raw);
        return ((json["@graph"] ?? [json]) as { "@type": string }[]).map((n) => n["@type"]);
      });
      expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite", "FAQPage"]));
    });

    test("every link inside main resolves to a 200 page", async ({ page, request }) => {
      await page.goto(p.path);
      const hrefs = await page.locator("main a[href]").evaluateAll((els) =>
        els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!).filter((h) => h.startsWith("/")),
      );
      const unique = [...new Set(hrefs.map((h) => h.split("#")[0]))];
      expect(unique.length).toBeGreaterThan(10);
      for (const href of unique) {
        const res = await request.get(href, { headers: CO });
        expect(res.status(), href).toBe(200);
      }
      // Cards link to real lot and product pages
      expect(unique.some((h) => /\/(coffees|cafes)\/urr-\d+$/.test(h))).toBe(true);
      expect(unique.some((h) => /\/(shop|tienda)\/[a-z-]+$/.test(h))).toBe(true);
    });

    test("FAQ teaser shows 3 questions linking to For buyers, before the closing CTA", async ({ page }) => {
      await page.goto(p.path);
      const items = page.getByTestId("home-faq").locator("li");
      await expect(items).toHaveCount(3);
      for (const link of await items.locator("h3 a").all()) {
        await expect(link).toHaveAttribute("href", p.forBuyers);
      }
      const faqY = (await page.getByRole("heading", { name: p.faqHeading }).boundingBox())!.y;
      const ctaY = (await page.locator("main section").last().boundingBox())!.y;
      expect(faqY).toBeLessThan(ctaY);
    });

    test("shop section is visible in Colombia", async ({ page }) => {
      await page.goto(p.path);
      await expect(page.locator('main a[href$="/el-mirador-chiroso"]').first()).toBeVisible();
    });

    test("axe finds no serious or critical violations", async ({ page }) => {
      await page.goto(p.path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page }).disableRules(["label-content-name-mismatch"]).analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
    });
  });

  test.describe(`${p.path} (outside Colombia)`, () => {
    test.use({ extraHTTPHeaders: { "x-country": "US" } });

    test("shop section and shop links are absent", async ({ page }) => {
      await page.goto(p.path);
      await expect(page.locator('main a[href$="/el-mirador-chiroso"]')).toHaveCount(0);
    });
  });
}
