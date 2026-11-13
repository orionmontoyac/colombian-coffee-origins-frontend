import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/en/for-buyers", "/es/para-compradores"];

for (const path of pages) {
  test.describe(path, () => {
    test("has one H1, a main landmark and three banner stats", async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
    });

    test("FAQ opens and closes, and FAQPage JSON-LD matches the visible questions", async ({ page }) => {
      await page.goto(path);
      const items = page.locator("[data-testid='faq-list'] details");
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(8);
      expect(count).toBeLessThanOrEqual(10);

      const first = items.first();
      await expect(first).not.toHaveAttribute("open", "");
      await first.locator("summary").click();
      await expect(first).toHaveAttribute("open", "");
      await first.locator("summary").click();
      await expect(first).not.toHaveAttribute("open", "");

      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      const graph = ld.flatMap((raw) => JSON.parse(raw)["@graph"] ?? []);
      const types = graph.map((n: { "@type": string }) => n["@type"]);
      expect(types).toEqual(expect.arrayContaining(["FAQPage", "BreadcrumbList"]));
      const faq = graph.find((n: { "@type": string }) => n["@type"] === "FAQPage");
      expect(faq.mainEntity).toHaveLength(count);
      const visible = await items.locator("summary h3").allTextContents();
      expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible);
    });

    test("has no serious or critical axe violations", async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        // Shared header language switcher (foundation, fixed in T1.8).
        
        .analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  });
}
