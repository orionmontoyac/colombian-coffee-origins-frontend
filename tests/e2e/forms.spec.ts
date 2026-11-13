import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const forms = [
  { name: "samples", en: "/en/samples", es: "/es/muestras" },
  { name: "contact", en: "/en/contact", es: "/es/contacto" },
  { name: "sell", en: "/en/shop/sell", es: "/es/tienda/vender" },
] as const;

async function fillValid(page: Page, name: string) {
  const f = (field: string) => page.locator(`#${name}-${field}`);
  await f("name").fill("Ana Roaster");
  await f("email").fill("ana@roastery.test");
  if (name === "samples") {
    await f("company").fill("Test Roastery");
    await f("country").fill("Norway");
    await f("address").fill("Storgata 1, Oslo, Norway");
  }
  if (name === "contact") {
    await f("topic").selectOption("buying");
    await f("message").fill("Do you have a washed lot?");
  }
  if (name === "sell") {
    await f("farm").fill("Finca Test");
    await f("region").fill("Urrao, Antioquia");
    await f("way").selectOption("green");
  }
}

for (const form of forms) {
  for (const path of [form.en, form.es]) {
    test.describe(path, () => {
      test("has one H1 and a main landmark", async ({ page }) => {
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("main#main")).toHaveCount(1);
      });

      test("empty submit shows errors and focuses the first invalid field", async ({ page }) => {
        await page.goto(path);
        await page.locator(`#${form.name}-form button[type=submit], form#${form.name} button[type=submit]`).first().click();
        await expect(page.getByTestId("error-summary")).toBeVisible();
        const first = page.locator(`#${form.name}-name`);
        await expect(first).toBeFocused();
        await expect(first).toHaveAttribute("aria-invalid", "true");
        const describedBy = await first.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        await expect(page.locator(`#${describedBy}`)).toBeVisible();
        // consent is required too
        const consent = page.locator(`#${form.name}-consent`);
        await expect(consent).toHaveAttribute("aria-invalid", "true");
      });

      test("consent is required even when everything else is valid", async ({ page }) => {
        await page.goto(path);
        await fillValid(page, form.name);
        await page.locator(`form#${form.name} button[type=submit]`).click();
        await expect(page.getByTestId("error-summary")).toBeVisible();
        await expect(page.locator(`#${form.name}-consent`)).toBeFocused();
        await expect(page.getByTestId("form-success")).toHaveCount(0);
      });

      test("valid data shows the success state", async ({ page }) => {
        await page.goto(path);
        await fillValid(page, form.name);
        await page.locator(`#${form.name}-consent`).check();
        await page.locator(`form#${form.name} button[type=submit]`).click();
        await expect(page.getByTestId("form-success")).toBeVisible();
        await expect(page.getByTestId("form-success")).toBeFocused();
      });

      test("a filled honeypot is silently rejected (no errors, no processing)", async ({ page }) => {
        await page.goto(path);
        // Not valid on purpose: a person would see errors, a bot gets the same quiet success.
        await page.locator(`#${form.name}-website`).evaluate((el: HTMLInputElement) => {
          el.value = "http://spam.test";
        });
        await page.locator(`form#${form.name} button[type=submit]`).click();
        await expect(page.getByTestId("form-success")).toBeVisible();
        await expect(page.getByTestId("error-summary")).toHaveCount(0);
      });

      test("has no serious or critical axe violations", async ({ page }) => {
        await page.goto(path);
        const clean = await new AxeBuilder({ page }).disableRules(["label-content-name-mismatch"]).analyze();
        const errorsState = async () => {
          await page.locator(`form#${form.name} button[type=submit]`).click();
          await expect(page.getByTestId("error-summary")).toBeVisible();
          return new AxeBuilder({ page }).disableRules(["label-content-name-mismatch"]).analyze();
        };
        const withErrors = await errorsState();
        for (const results of [clean, withErrors]) {
          const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
          expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
        }
      });
    });
  }
}

test.describe("samples lot prefill", () => {
  test("?lot=URR-024 selects the lot", async ({ page }) => {
    await page.goto("/en/samples?lot=URR-024");
    await expect(page.locator("#samples-lot")).toHaveValue("URR-024");
    await page.goto("/es/muestras?lot=urr-024");
    await expect(page.locator("#samples-lot")).toHaveValue("URR-024");
  });

  test("an unknown lot code is ignored", async ({ page }) => {
    await page.goto("/en/samples?lot=NOPE-999");
    await expect(page.locator("#samples-lot")).toHaveValue("");
  });

  test("the prefilled lot is kept after an error", async ({ page }) => {
    await page.goto("/en/samples?lot=URR-024");
    await page.locator("form#samples button[type=submit]").click();
    await expect(page.getByTestId("error-summary")).toBeVisible();
    await expect(page.locator("#samples-lot")).toHaveValue("URR-024");
  });
});

test("contact shows WhatsApp and email", async ({ page }) => {
  await page.goto("/en/contact");
  await expect(page.locator('main a[href^="https://wa.me/"]').first()).toBeVisible();
  await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
});

test("sell page explains both ways to sell", async ({ page }) => {
  await page.goto("/en/shop/sell");
  await expect(page.getByRole("heading", { name: "Green coffee lots", level: 3, exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Roasted bags", level: 3, exact: true })).toBeVisible();
});
