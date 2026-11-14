import { expect, test } from "@playwright/test";

test.describe("motion", () => {
  test("home hero: H1 visible at first paint, hero animates (normal motion)", async ({ page }, info) => {
    await page.goto("/en", { waitUntil: "commit" });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
    const name = await h1.evaluate((el) => getComputedStyle(el).animationName);
    if (info.project.name === "reduced-motion") expect(name).toBe("none");
    else expect(name).toBe("rise-16");
  });

  test("reduced motion: hero, banner and reveal do not animate", async ({ page }, info) => {
    test.skip(info.project.name !== "reduced-motion");
    await page.goto("/en");
    for (const sel of [".hero-h1", ".hero-word", ".hero-photo", ".hero-sub"]) {
      expect(await page.locator(sel).first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    }
    await page.goto("/en/coffees");
    expect(await page.locator(".banner-in-h1").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await page.goto("/en");
    const reveal = page.locator("[data-reveal]").last();
    await reveal.scrollIntoViewIfNeeded();
    const s = await reveal.evaluate((el) => {
      const c = getComputedStyle(el);
      return { t: c.transitionDuration, o: c.opacity, tr: c.transform, attr: el.getAttribute("data-reveal") };
    });
    expect(s.t).toBe("0s");
    expect(s.o).toBe("1");
    expect(s.tr).toBe("none");
    expect(s.attr).not.toBe("wait");
  });

  test("below-fold reveal shows content once scrolled (normal motion)", async ({ page }, info) => {
    test.skip(info.project.name === "reduced-motion");
    await page.goto("/en");
    const reveal = page.locator("[data-reveal]").last();
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveAttribute("data-reveal", /in|idle/);
    await expect(reveal).toBeVisible();
  });
});
