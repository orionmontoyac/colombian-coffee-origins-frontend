import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/en/producers",
  "/es/productores",
  "/en/producers/luz-mery-higuita",
  "/es/productores/luz-mery-higuita",
];
const profile = "/en/producers/luz-mery-higuita";

for (const path of pages) {
  test(`${path} has one H1 and a main landmark`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
  });
}

test("directory lists every producer and links to the profile", async ({ page }) => {
  await page.goto("/es/productores");
  const cards = page.getByRole("link", { name: "Ver perfil" });
  await expect(cards).toHaveCount(3);
  await cards.first().click();
  await expect(page).toHaveURL(/\/es\/productores\/luz-mery-higuita$/);
});

test("profile banner has exactly three stats", async ({ page }) => {
  await page.goto(profile);
  await expect(page.locator("section.hero-banner .grid-cols-3 > div")).toHaveCount(3);
});

test("roasted panel is visible to every visitor (no country header)", async ({ page }) => {
  await page.goto(profile);
  await expect(page.locator("#roasted")).toBeVisible();
  await expect(page.locator('nav[aria-label="On this page"] a[href="#roasted"]')).toBeVisible();
});

test("in-page nav anchors point at sections that exist and scroll to them", async ({ page }) => {
  await page.goto(profile);
  const nav = page.locator('nav[aria-label="On this page"]');
  for (const id of ["story", "lots", "farm"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
    await nav.locator(`a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test("unknown producer slug is a 404", async ({ request }) => {
  // With partialPrefetching on, the first request to an unlisted path is served as a streamed
  // shell (HTTP 200) whose body is already the not-found page (noindex, no profile H1); the
  // result is then cached and every later request gets a real 404. See DECISIONS.md.
  for (const base of ["/en/producers", "/es/productores"]) {
    const url = `${base}/nobody-${Date.now()}`;
    const first = await request.get(url);
    expect(await first.text()).toContain("noindex");
    expect([200, 404]).toContain(first.status());
    expect((await request.get(url)).status()).toBe(404);
  }
});

for (const path of pages) {
  test(`${path} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(path);
    // "label-content-name-mismatch" flags the shared header's language button (aria-label
    // does not start with the visible "EN"); that component belongs to foundation-builder.
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}
