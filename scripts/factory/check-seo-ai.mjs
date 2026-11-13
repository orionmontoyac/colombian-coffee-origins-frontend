#!/usr/bin/env node
// Factory checker: SEO + AI-discoverability rules for every page in pages.json.
// No dependencies (Node 20+). Run against a started production build:
//   npm run build && npm run start -- -p 3100 &
//   node scripts/factory/check-seo-ai.mjs [--base http://localhost:3100] [--only /en,/es] [--country CO] [--ai]
// Exit code 0 = all checks pass, 1 = failures (listed), 2 = server not reachable.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);

const base = arg("base", process.env.FACTORY_BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const onlyArg = arg("only", null);
const countryArg = arg("country", null);
const aiOnly = flag("ai");

const pagesFile = JSON.parse(readFileSync(join(here, "pages.json"), "utf8"));
let pages = pagesFile.pages;
if (onlyArg) {
  const wanted = onlyArg.split(",").map((p) => p.trim());
  pages = wanted.map((path) => pages.find((p) => p.path === path) ?? { path, country: countryArg ?? undefined });
}

const failures = [];
const warnings = [];
const fail = (where, msg) => failures.push(`✗ ${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`! ${where}: ${msg}`);

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const strip = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const meta = (html, attr, value) => {
  const re = new RegExp(`<meta[^>]*${attr}=["']${value}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? decode(tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "") : null;
};
const links = (html, rel) =>
  [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((t) => new RegExp(`rel=["'][^"']*\\b${rel}\\b[^"']*["']`, "i").test(t))
    .map((t) => ({
      href: t.match(/href=["']([^"']+)["']/i)?.[1],
      hreflang: t.match(/hreflang=["']([^"']+)["']/i)?.[1],
      type: t.match(/type=["']([^"']+)["']/i)?.[1],
    }));

async function get(path, country) {
  const headers = { "user-agent": "factory-checker/1.0" };
  if (country) headers["x-country"] = country;
  const res = await fetch(base + path, { headers, redirect: "manual" });
  return { status: res.status, type: res.headers.get("content-type") ?? "", body: await res.text() };
}

const BANNED_TEXT = [/lorem ipsum/i, /\bTODO\b/, /\bTBD\b/, /\bundefined\b/, /\bNaN\b/];

async function checkPage({ path, country, noindex }) {
  const where = `${path}${country ? ` [${country}]` : ""}`;
  const { status, body: html } = await get(path, country);
  if (status !== 200) return fail(where, `HTTP ${status} (expected 200)`);

  // Language
  const lang = html.match(/<html[^>]*\blang=["']([^"']+)["']/i)?.[1];
  const expectedLang = path.startsWith("/es") ? "es" : "en";
  if (!lang || !lang.startsWith(expectedLang)) fail(where, `<html lang> is "${lang}" (expected ${expectedLang})`);

  if (!aiOnly) {
    // Title and description
    const title = strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    if (!title) fail(where, "missing <title>");
    else if (title.length < 30 || title.length > 65) fail(where, `title length ${title.length} (30–65): "${title}"`);
    const desc = meta(html, "name", "description");
    if (!desc) fail(where, "missing meta description");
    else if (desc.length < 70 || desc.length > 160) fail(where, `description length ${desc.length} (70–160)`);

    // Robots
    const robots = meta(html, "name", "robots") ?? "";
    if (!noindex && /noindex/i.test(robots)) fail(where, `unexpected noindex ("${robots}")`);

    // Canonical and hreflang
    const canonical = links(html, "canonical")[0]?.href;
    if (!canonical) fail(where, "missing canonical");
    else if (!/^https?:\/\//.test(canonical)) fail(where, `canonical not absolute: ${canonical}`);
    const alternates = links(html, "alternate").filter((l) => l.hreflang);
    for (const hl of ["en", "es", "x-default"]) {
      if (!alternates.some((l) => l.hreflang === hl)) fail(where, `missing hreflang="${hl}"`);
    }

    // Open Graph
    for (const p of ["og:title", "og:description", "og:image", "og:url"]) {
      if (!meta(html, "property", p)) fail(where, `missing ${p}`);
    }

    // Headings
    const h1s = [...html.matchAll(/<h1\b[\s\S]*?<\/h1>/gi)];
    if (h1s.length !== 1) fail(where, `${h1s.length} <h1> elements (expected exactly 1)`);

    // Images
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    const noAlt = imgs.filter((t) => !/\balt=/.test(t));
    if (noAlt.length) fail(where, `${noAlt.length} <img> without alt`);

    // Main landmark and skip link
    if (!/<main\b/i.test(html)) fail(where, "missing <main> landmark");
    if (!/href=["']#main["']/i.test(html)) warn(where, "no skip link to #main");
  }

  // Structured data
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!blocks.length) fail(where, "no JSON-LD");
  const types = new Set();
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw);
      const collect = (node) => {
        if (Array.isArray(node)) return node.forEach(collect);
        if (node && typeof node === "object") {
          if (node["@type"]) [].concat(node["@type"]).forEach((t) => types.add(t));
          if (node["@graph"]) collect(node["@graph"]);
        }
      };
      collect(data);
      if (/aggregateRating|"review"/.test(raw)) warn(where, "JSON-LD has ratings/reviews — only allowed with real reviews");
    } catch (e) {
      fail(where, `invalid JSON-LD: ${e.message}`);
    }
  }
  if (!types.has("Organization") && !types.has("WebSite")) fail(where, "JSON-LD lacks Organization/WebSite");
  if (path.split("/").filter(Boolean).length > 1 && !types.has("BreadcrumbList")) fail(where, "sub-page lacks BreadcrumbList JSON-LD");

  // AI discoverability: markdown alternate for key pages
  const mdAlt = links(html, "alternate").find((l) => l.type === "text/markdown");
  if (pagesFile.markdownPages?.includes(path)) {
    if (!mdAlt?.href) fail(where, 'missing <link rel="alternate" type="text/markdown">');
    else {
      const md = await get(new URL(mdAlt.href, base).pathname);
      if (md.status !== 200) fail(where, `markdown version ${mdAlt.href} → HTTP ${md.status}`);
      else if (!/^#\s+\S/m.test(md.body)) fail(where, "markdown version has no H1");
    }
  }

  // Visible text sanity
  const text = strip(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " "));
  for (const re of BANNED_TEXT) if (re.test(text)) fail(where, `visible text contains ${re}`);
}

async function checkSiteFiles() {
  // robots.txt
  const robots = await get("/robots.txt");
  if (robots.status !== 200) fail("/robots.txt", `HTTP ${robots.status}`);
  else {
    if (!/sitemap:\s*https?:\/\//i.test(robots.body)) fail("/robots.txt", "no absolute Sitemap line");
    for (const bot of pagesFile.aiCrawlers ?? []) {
      if (!new RegExp(`user-agent:\\s*${bot}`, "i").test(robots.body)) warn("/robots.txt", `no explicit rule for ${bot}`);
    }
    if (/user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*$/im.test(robots.body)) fail("/robots.txt", "blocks everything (Disallow: /)");
  }
  // sitemap.xml
  const sitemap = await get("/sitemap.xml");
  if (sitemap.status !== 200) fail("/sitemap.xml", `HTTP ${sitemap.status}`);
  else {
    const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (locs.length < 2) fail("/sitemap.xml", `only ${locs.length} URLs`);
    if (!/xhtml:link[^>]*hreflang/.test(sitemap.body)) warn("/sitemap.xml", "no hreflang alternates");
    if (locs.some((u) => /\?|\/md\//.test(u))) fail("/sitemap.xml", "contains filtered or /md/ URLs");
  }
  // llms.txt (llmstxt.org format)
  const llms = await get("/llms.txt");
  if (llms.status !== 200) fail("/llms.txt", `HTTP ${llms.status}`);
  else {
    const lines = llms.body.replace(/^﻿/, "").split("\n");
    if (!/^#\s+\S/.test(lines[0])) fail("/llms.txt", "first line must be an H1 (# Name)");
    if (!/^>\s+\S/m.test(llms.body)) fail("/llms.txt", "missing blockquote summary");
    if (!/^##\s+\S/m.test(llms.body)) fail("/llms.txt", "missing H2 link sections");
    const urls = [...llms.body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    if (urls.length < 5) fail("/llms.txt", `only ${urls.length} absolute links`);
    for (const u of urls.slice(0, 40)) {
      const local = u.replace(/^https?:\/\/[^/]+/, "");
      const r = await get(local);
      if (r.status !== 200) fail("/llms.txt", `link ${u} → HTTP ${r.status}`);
    }
  }
  const full = await get("/llms-full.txt");
  if (full.status !== 200) fail("/llms-full.txt", `HTTP ${full.status}`);
  else if (full.body.length > 200_000) fail("/llms-full.txt", `${full.body.length} bytes (max 200 KB)`);
}

try {
  await fetch(base, { method: "HEAD" });
} catch {
  console.error(`Server not reachable at ${base}. Build and start it first (npm run build && npm run start -- -p 3100).`);
  process.exit(2);
}

for (const page of pages) await checkPage(page);
if (!onlyArg) await checkSiteFiles();

for (const w of warnings) console.log(w);
if (failures.length) {
  console.log(failures.join("\n"));
  console.log(`\n${failures.length} failure(s), ${warnings.length} warning(s) across ${pages.length} page(s).`);
  process.exit(1);
}
console.log(`✓ SEO/AI checks passed for ${pages.length} page(s)${onlyArg ? "" : " + site files"} (${warnings.length} warning(s)).`);
