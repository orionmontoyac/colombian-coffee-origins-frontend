#!/usr/bin/env node
// Fails when components or pages use raw hex colors instead of DESIGN.md tokens.
// Allowed: src/data/** (producer bag colors are content), globals.css (where tokens are defined),
// and lines ending with `// token-exempt: <reason>`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["src/components", "src/app"];
const hex = /#[0-9a-fA-F]{3,8}\b/g;
const findings = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts|jsx|js)$/.test(name)) check(p);
  }
}
function check(file) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (/token-exempt:/.test(line)) return;
    if (/^\s*(\/\/|\*)/.test(line)) return; // comments
    const hits = line.match(hex);
    if (hits) findings.push(`${file}:${i + 1}  ${hits.join(", ")}  →  use a DESIGN.md token`);
  });
}
for (const r of roots) { try { walk(r); } catch { /* folder may not exist yet */ } }

if (findings.length) {
  console.log(findings.join("\n"));
  console.log(`\n${findings.length} raw color(s) found. Add the color to DESIGN.md + globals.css as a token, or mark the line // token-exempt: <reason>.`);
  process.exit(1);
}
console.log("✓ No raw hex colors in components or pages.");
