import { expect, test } from "@playwright/test";

for (const path of ["/en", "/es"]) {
  test(`${path} renders with one H1 and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      // Resource failures are reported with URLs by the response listener below.
      if (msg.type() === "error" && !msg.text().startsWith("Failed to load resource")) {
        errors.push(msg.text());
      }
    });
    page.on("response", (res) => {
      // Link prefetches (?_rsc=) of pages not built yet are not page failures.
      if (res.status() >= 400 && !res.url().includes("_rsc=")) errors.push(`${res.status()} ${res.url()}`);
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}
