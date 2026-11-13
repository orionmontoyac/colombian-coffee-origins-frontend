import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
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

test.describe("first-hit 404 for unknown detail slugs", () => {
  for (const path of ["/en/coffees/zzz-999", "/es/productores/nadie", "/en/shop/nope", "/es/cafes/zzz-999", "/es/tienda/nope", "/en/producers/nobody", "/en/journal/nope", "/es/blog/nada", "/en/zzz", "/es/zzz"]) {
    test(`${path} returns 404 on the first request`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(404);
    });
  }
  test("known slugs still return 200", async ({ request }) => {
    for (const path of ["/en/coffees/urr-024", "/es/cafes/urr-024", "/en/shop/sell", "/en/journal/what-is-chiroso-coffee", "/es/blog/que-es-el-cafe-chiroso"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });
});

test("every PlaceholderImage assetId is listed in ASSETS.md", () => {
  const assets = readFileSync(join(process.cwd(), "ASSETS.md"), "utf8");
  const listed = (id: string) =>
    assets.includes(id) ||
    assets.split("\n").some((line) => {
      const cell = line.split("|")[2]?.trim().replace(/`/g, "");
      if (!cell) return false;
      const prefix = cell.split(/\*|\.\./)[0];
      return prefix.length > 4 && prefix !== cell && id.startsWith(prefix);
    });
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith(".tsx")) files.push(full);
    }
  };
  walk(join(process.cwd(), "src"));
  const missing: string[] = [];
  for (const file of files) {
    for (const m of readFileSync(file, "utf8").matchAll(/assetId=(?:"([^"]+)"|\{`([^`$]+)|\{"([^"]+)"\})/g)) {
      const id = m[1] ?? m[2] ?? m[3];
      if (!listed(id)) missing.push(`${file}: ${id}`);
    }
  }
  expect(missing).toEqual([]);
});
