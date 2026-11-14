import { expect, test } from "@playwright/test";

/**
 * Entity consistency: the canonical facts (src/lib/ai/facts.ts) must read the same in
 * /llms.txt, /md/*, and the server-rendered /en and /es pages. Constants below are the
 * contract; the price ranges are read from the Markdown home and must appear on the HTML home.
 */
const NAME = "Colombian Coffee Origins";
const ORIGIN = "Urrao, Antioquia, Colombia";

const langs = [
  { lang: "en", home: "/en", md: "/md/en", colombiaOnly: "Colombia only", range: /USD \d[\d.,]* to \d[\d.,]* per kg/, cop: /COP [\d.,]+ to [\d.,]+/, min: "35 kg", sample: "200 g", fob: "FOB" },
  { lang: "es", home: "/es", md: "/md/es", colombiaOnly: "Solo en Colombia", range: /USD \d[\d.,]* a \d[\d.,]* por kg/, cop: /COP [\d.,]+ a [\d.,]+/, min: "35 kg", sample: "200 g", fob: "FOB" },
] as const;

test.describe("canonical facts match across llms.txt, Markdown and HTML", () => {
  test("llms.txt follows the llmstxt.org format and states the facts", async ({ request }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/plain");
    const body = await res.text();
    expect(body.split("\n")[0]).toBe(`# ${NAME}`);
    expect(body).toMatch(/^> /m);
    for (const h of ["## Green coffee", "## Roasted coffee shop (Colombia only)", "## Producers", "## For buyers", "## Optional"]) {
      expect(body).toContain(h);
    }
    for (const fact of [ORIGIN, "USD per kg FOB", "free samples", "inside Colombia only", "COP", "35 kg", "200 g"]) {
      expect(body, fact).toContain(fact);
    }
    expect(body).toMatch(/\]\(https?:\/\/[^)]+\/md\/en\/coffees\/urr-024\)/);
  });

  for (const l of langs) {
    test(`${l.lang}: home HTML and Markdown agree`, async ({ page, request }) => {
      const md = await (await request.get(l.md)).text();
      await page.goto(l.home);
      const html = (await page.locator("body").innerText()).replace(/\s+/g, " ");
      const mdText = md.replace(/\s+/g, " ");
      for (const fact of [NAME, ORIGIN, l.min, l.sample, l.fob, l.colombiaOnly]) {
        expect(html, `html ${fact}`).toContain(fact);
        expect(mdText, `md ${fact}`).toContain(fact);
      }
      const usd = mdText.match(l.range)?.[0];
      const cop = mdText.match(l.cop)?.[0];
      expect(usd, "USD range in markdown").toBeTruthy();
      expect(cop, "COP range in markdown").toBeTruthy();
      expect(html).toContain(usd!);
      expect(html).toContain(cop!);
    });

    test(`${l.lang}: answer-first block is in the server-rendered HTML`, async ({ request }) => {
      const html = await (await request.get(l.home)).text();
      expect(html).toContain('data-testid="answer-first"');
      expect(html).toContain("Urrao");
    });
  }

  test("home FAQ teaser questions exist in the buyers FAQ markdown (EN)", async ({ request }) => {
    const md = await (await request.get("/md/en/for-buyers")).text();
    for (const q of ["How do I import green coffee from Colombia?", "What is the minimum order?", "Are samples really free?"]) {
      expect(md).toContain(q);
    }
  });
});
