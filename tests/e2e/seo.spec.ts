import { expect, test, type APIRequestContext } from "@playwright/test";

// Pure HTTP checks: run once, on the desktop project.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "HTTP-only checks run once");
});

const get = async (request: APIRequestContext, path: string, country?: string) =>
  request.get(path, { headers: country ? { "x-country": country } : {} });

const attr = (html: string, tag: string, match: RegExp, name: string) =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))]
    .map((m) => m[0])
    .filter((t) => match.test(t))
    .map((t) => t.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1]);

type Sample = { path: string; canonical: string; en: string; es: string; markdown?: string };
const origin = (html: string) => new URL(attr(html, "link", /rel="canonical"/, "href")[0]!).origin;

const samples: Sample[] = [
  { path: "/en", canonical: "/en", en: "/en", es: "/es", markdown: "/md/en" },
  { path: "/es", canonical: "/es", en: "/en", es: "/es", markdown: "/md/es" },
  { path: "/es/cafes", canonical: "/es/cafes", en: "/en/coffees", es: "/es/cafes" },
  { path: "/es/productores/luz-mery-higuita", canonical: "/es/productores/luz-mery-higuita", en: "/en/producers/luz-mery-higuita", es: "/es/productores/luz-mery-higuita", markdown: "/md/es/productores/luz-mery-higuita" },
  { path: "/en/for-buyers", canonical: "/en/for-buyers", en: "/en/for-buyers", es: "/es/para-compradores", markdown: "/md/en/for-buyers" },
  { path: "/es/regiones/urrao", canonical: "/es/regiones/urrao", en: "/en/regions/urrao", es: "/es/regiones/urrao", markdown: "/md/es/regiones/urrao" },
  { path: "/en/journal/what-is-chiroso-coffee", canonical: "/en/journal/what-is-chiroso-coffee", en: "/en/journal/what-is-chiroso-coffee", es: "/es/blog/que-es-el-cafe-chiroso" },
];

for (const s of samples) {
  test(`${s.path}: canonical, hreflang, Open Graph image${s.markdown ? ", markdown alternate" : ""}`, async ({ request }) => {
    const res = await get(request, s.path);
    expect(res.status()).toBe(200);
    const html = await res.text();
    const o = origin(html);
    expect(attr(html, "link", /rel="canonical"/, "href")).toEqual([o + s.canonical]);
    const alt = (lang: string) => attr(html, "link", new RegExp(`hrefLang="${lang}"`, "i"), "href")[0];
    expect(alt("en")).toBe(o + s.en);
    expect(alt("es")).toBe(o + s.es);
    expect(alt("x-default")).toBe(o + s.en);
    const md = attr(html, "link", /type="text\/markdown"/, "href");
    expect(md).toEqual(s.markdown ? [o + s.markdown] : []);
    const lang = s.path.startsWith("/es") ? "es" : "en";
    expect(html).toContain(`<html lang="${lang}"`);
    const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    expect(og).toBe(`${o}/${lang}/opengraph-image`);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });
}

test("lot page has a markdown alternate that follows /md/{lang}/<path after /{lang}>", async ({ request }) => {
  for (const [path, md] of [["/en/coffees/urr-024", "/md/en/coffees/urr-024"], ["/es/cafes/urr-024", "/md/es/cafes/urr-024"]]) {
    const html = await (await get(request, path)).text();
    expect(attr(html, "link", /type="text\/markdown"/, "href")).toEqual([origin(html) + md]);
  }
});

test("non-CO shop response carries X-Robots-Tag noindex; CO does not; meta robots stays index", async ({ request }) => {
  for (const path of ["/en/shop", "/es/tienda", "/en/shop/el-mirador-chiroso"]) {
    const other = await get(request, path, "US");
    expect(other.headers()["x-robots-tag"], path).toMatch(/noindex/);
    expect(await other.text()).not.toMatch(/name="robots" content="noindex/);
    const co = await get(request, path, "CO");
    expect(co.headers()["x-robots-tag"] ?? "", path).not.toMatch(/noindex/);
  }
  const html = await (await get(request, "/en/shop", "US")).text();
  expect(html.slice(0, html.indexOf("</head>"))).toContain('name="description"');
});

test("generated Open Graph images are 1200x630 PNGs", async ({ request }) => {
  for (const path of ["/en/opengraph-image", "/es/opengraph-image", "/en/og/lot/urr-024/opengraph-image", "/es/og/product/el-mirador-chiroso/opengraph-image"]) {
    const res = await get(request, path, "CO");
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
    const buf = await res.body();
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
  }
});

test("sitemap lists both languages with alternates and leaves out filtered, success and md URLs", async ({ request }) => {
  const xml = await (await get(request, "/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  for (const p of [
    "/en", "/es", "/en/coffees", "/es/cafes", "/en/coffees/urr-024", "/es/cafes/urr-024",
    "/en/producers/luz-mery-higuita", "/es/productores/luz-mery-higuita", "/en/shop", "/es/tienda",
    "/en/shop/el-mirador-chiroso", "/en/regions/urrao", "/es/regiones/urrao", "/en/for-buyers", "/es/para-compradores",
    "/en/journal/what-is-chiroso-coffee", "/es/blog/que-es-el-cafe-chiroso", "/en/privacy", "/es/privacidad", "/en/terms", "/es/terminos",
  ]) expect(locs, p).toContain(p);
  expect(new Set(locs).size).toBe(locs.length);
  expect(locs.filter((p) => p.startsWith("/md/") || p.includes("?") || p.includes("/og/"))).toEqual([]);
  expect(xml).toContain('hreflang="x-default"');
  expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);
});

test("robots.txt allows search and AI crawlers and names the sitemap", async ({ request }) => {
  const txt = await (await get(request, "/robots.txt")).text();
  for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"]) {
    expect(txt).toMatch(new RegExp(`User-Agent: ${bot}\\s+Allow: /`, "i"));
  }
  expect(txt).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
  expect(txt).not.toMatch(/Disallow:\s*\/\s*$/m);
});

test("layout renders Organization and WebSite once; pages do not repeat them", async ({ request }) => {
  const html = await (await get(request, "/en/producers/luz-mery-higuita")).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const types = blocks.flatMap((b) => (b["@graph"] ?? [b]).map((n: { "@type": string }) => n["@type"]));
  expect(types.filter((t) => t === "Organization").length).toBe(2); // site + farm
  expect(types.filter((t) => t === "WebSite").length).toBe(1);
  expect(types).toEqual(expect.arrayContaining(["BreadcrumbList", "Person", "Place"]));
});
