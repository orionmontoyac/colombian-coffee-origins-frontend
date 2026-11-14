import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Keyboard walks (T5.1): header, mobile menu, lots filters, samples form, cart. */

const CO = { "x-country": "CO" };

async function ready(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState("networkidle");
}

/** Tab until `locator` has focus; fails after `max` presses. Returns the number of presses. */
async function tabTo(page: Page, locator: ReturnType<Page["locator"]>, max = 60) {
  for (let i = 1; i <= max; i++) {
    await page.keyboard.press("Tab");
    if (await locator.evaluate((el) => el === document.activeElement).catch(() => false)) return i;
  }
  throw new Error(`never focused ${locator} within ${max} Tab presses`);
}

async function hasVisibleFocus(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return false;
    const s = getComputedStyle(el);
    return (parseFloat(s.outlineWidth) > 0 && s.outlineStyle !== "none") || s.boxShadow !== "none";
  });
}

for (const lang of ["en", "es"] as const) {
  test.describe(`header keyboard walk /${lang}`, () => {
    test("skip link is first, visible on focus and moves focus to main", async ({ page }) => {
      await ready(page, `/${lang}`);
      await page.keyboard.press("Tab");
      const skip = page.locator("a[href='#main']").first();
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#main$/);
      await expect(page.locator("main#main")).toHaveCount(1);
    });

    test("header controls are reachable with a visible focus ring", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === "mobile", "desktop nav");
      await ready(page, `/${lang}`);
      await page.keyboard.press("Tab"); // skip link
      const seen: string[] = [];
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press("Tab");
        const inHeader = await page.evaluate(() => !!document.activeElement?.closest("header"));
        if (!inHeader) break;
        expect(await hasVisibleFocus(page), `no focus ring on header control #${i + 1}`).toBe(true);
        seen.push(await page.evaluate(() => document.activeElement?.tagName ?? ""));
      }
      expect(seen.length).toBeGreaterThanOrEqual(4);
    });

    test("mobile menu: open, items reachable, Escape closes and returns focus", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "mobile", "menu button only below the nav breakpoint");
      await ready(page, `/${lang}`);
      const button = page.locator("header button[aria-controls]").first();
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("aria-expanded", "false");
      const box = await button.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(button).toHaveAttribute("aria-expanded", "true");
      const panel = page.locator(`#${await button.getAttribute("aria-controls")}`);
      await expect(panel).toBeVisible();
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("nav"))).toBe(true);
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(button).toBeFocused();
      await expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });
}

test.describe("lots filters keyboard walk", () => {
  test("filter controls are reachable by keyboard and a keyboard change updates the URL", async ({ page }, testInfo) => {
    await ready(page, "/en/coffees");
    const toggle = page.locator("button[aria-controls=lot-filters]");
    if (await toggle.isVisible()) {
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }
    const select = page.getByLabel("Process", { exact: true });
    await select.focus();
    expect(await hasVisibleFocus(page)).toBe(true);
    await select.selectOption({ label: "Washed" });
    await expect(page).toHaveURL(/\?process=washed/);
    await expect(page.getByTestId("lot-grid").getByRole("article")).toHaveCount(3);
    void testInfo;
  });
});

test.describe("samples form keyboard walk", () => {
  test("Tab order reaches every field; empty submit by keyboard focuses the first invalid field", async ({ page }) => {
    await ready(page, "/en/samples");
    const name = page.locator("#samples-name");
    await tabTo(page, name);
    expect(await hasVisibleFocus(page)).toBe(true);
    await tabTo(page, page.locator("#samples-email"), 3);
    const submit = page.locator("form#samples button[type=submit]");
    await tabTo(page, submit, 30);
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("error-summary")).toBeVisible();
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    const describedBy = await name.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toBeVisible();
  });
});

test.describe("cart keyboard walk (Colombia)", () => {
  test.use({ extraHTTPHeaders: CO });

  test("drawer: open by keyboard, quantity by keyboard, focus stays inside, Escape returns focus", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "mobile uses the floating pill (see shop-mobile cart test)");
    await ready(page, "/en/shop");
    const add = page.getByTestId("add-to-cart").first();
    await add.focus();
    await page.keyboard.press("Enter");
    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-labelledby", /.+/);

    const inc = page.getByRole("button", { name: /Increase quantity/ });
    await inc.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("cart-qty")).toHaveText("2");

    // Focus is trapped in the modal dialog: Tab never lands on the page behind it
    // (past the last control it may go to the browser UI, which reports body).
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const where = await page.evaluate(() => {
        const el = document.activeElement;
        return !el || el === document.body ? "body" : el.closest("dialog") ? "dialog" : "page";
      });
      expect(where, `Tab #${i + 1}`).not.toBe("page");
    }
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(add).toBeFocused();
  });

  test("drawer has no serious or critical axe violations", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "covered by the mobile cart test");
    await ready(page, "/en/shop");
    await page.getByTestId("add-to-cart").first().click();
    await expect(page.getByTestId("cart-drawer")).toBeVisible();
    const results = await new AxeBuilder({ page }).disableRules(["label-content-name-mismatch"]).analyze();
    const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(bad.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
});
