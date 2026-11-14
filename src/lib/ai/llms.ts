import { absoluteUrl } from "@/lib/site";
import { href } from "@/lib/routes";
import { CONTENT_UPDATED, facts, phrases } from "./facts";
import { absMd, mdPages, type MdPage } from "./pages";

const item = (p: MdPage) => `- [${p.title}](${absoluteUrl(p.mdPath)}): ${p.description.replace(/\s+/g, " ").trim()}`;

export function llmsTxt(): string {
  const en = mdPages("en");
  const es = mdPages("es");
  const p = phrases("en");
  const by = (g: MdPage["group"]) => en.filter((x) => x.group === g);
  const coffees = href("en", "coffees");
  const green = [
    ...en.filter((x) => x.path === coffees),
    ...en.filter((x) => x.path.startsWith(`${coffees}/`)),
    ...en.filter((x) => x.path === href("en", "urrao")),
  ];
  return [
    `# ${facts.name}`,
    "",
    `> ${p.summary}`,
    `> ${p.exampleNote} Updated ${CONTENT_UPDATED}.`,
    "",
    `Trust levels: every lot shows what we checked ourselves. Registered means the producer is on our platform, Farm verified means we visited the farm, and Coffee verified means we also cupped the exact lot and confirmed its kilos. Cupping scores (SCA) appear only on lots we have cupped. Minimum order is ${facts.minOrderKg} kg (one box); the first ${facts.sampleGrams} g sample is free for verified buyers. Prices are USD per kg FOB Colombia. The roasted coffee shop delivers inside Colombia only, in COP. Spanish versions are listed under Optional.`,
    "",
    "## Green coffee",
    ...green.map(item),
    "",
    "## Roasted coffee shop (Colombia only)",
    ...by("shop").map(item),
    "",
    "## Producers",
    ...by("producers").map(item),
    "",
    "## For buyers",
    ...by("buyers").map(item),
    ...by("home").map(item),
    "",
    "## Optional",
    ...by("optional").map(item),
    `- [Privacy](${absoluteUrl(href("en", "privacy"))}): privacy policy (HTML, draft for legal review)`,
    `- [Terms](${absoluteUrl(href("en", "terms"))}): terms of sale (HTML, draft for legal review)`,
    ...es
      .filter((x) => x.group !== "optional")
      .map((x) => `- [${x.title} (Español)](${absoluteUrl(x.mdPath)}): ${x.description.replace(/\s+/g, " ").trim()}`),
    "",
  ].join("\n");
}

const demote = (md: string) => md.replace(/^(#{1,5}) /gm, "#$1 ");

export function llmsFullTxt(): string {
  const out = [`# ${facts.name}: full content`, "", `> ${phrases("en").summary}`, "", `Updated: ${CONTENT_UPDATED}`, ""];
  for (const lang of ["en", "es"] as const) {
    out.push(`# ${lang === "en" ? "English" : "Español"}`, "");
    for (const pg of mdPages(lang).filter((x) => x.group !== "optional")) out.push(demote(pg.body), "---", "");
  }
  return out.join("\n");
}

/** For page builders: the Markdown alternate of a public page path, and the describedby target. */
export function markdownAlternate(path: string) {
  return { type: "text/markdown", href: absMd(path) };
}
export const describedBy = () => absoluteUrl("/llms.txt");
