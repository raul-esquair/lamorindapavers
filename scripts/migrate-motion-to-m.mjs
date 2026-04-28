// One-off script: rewrites `motion.X` → `m.X` in JSX and renames `motion`
// to `m` in framer-motion imports across all .tsx/.ts files.
// Skips lines that look like comments so doc references to `motion.div` stay intact.
//
// Usage: node scripts/migrate-motion-to-m.mjs
// Dry-run: node scripts/migrate-motion-to-m.mjs --dry

import fs from "node:fs";
import path from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTS = [".tsx", ".ts"];
const DRY_RUN = process.argv.includes("--dry");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      out.push(...walk(full));
    } else if (entry.isFile() && EXTS.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function migrate(content) {
  // 1) Replace `motion.X` with `m.X` per-line, skipping comment-only lines.
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(\/\/|\*)/.test(lines[i])) continue; // comment-only line
    lines[i] = lines[i].replace(/\bmotion\./g, "m.");
  }
  let updated = lines.join("\n");

  // 2) Rename the `motion` import specifier to `m` inside any framer-motion import block.
  //    Handles single-line and multi-line imports.
  updated = updated.replace(
    /import\s*\{([^}]+)\}\s*from\s*(["'])framer-motion\2/g,
    (match, names, quote) => {
      const newNames = names
        .split(",")
        .map((n) => {
          const trimmed = n.trim();
          if (trimmed === "motion") return n.replace("motion", "m");
          return n;
        })
        .join(",");
      return `import {${newNames}} from ${quote}framer-motion${quote}`;
    },
  );

  return updated;
}

const files = ROOTS.flatMap((r) => {
  const dir = path.join(process.cwd(), r);
  return fs.existsSync(dir) ? walk(dir) : [];
});

let changed = 0;
let scanned = 0;
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("framer-motion")) continue;
  scanned++;
  const next = migrate(content);
  if (next !== content) {
    if (!DRY_RUN) fs.writeFileSync(file, next);
    changed++;
    console.log(`  ${DRY_RUN ? "[dry] " : ""}${path.relative(process.cwd(), file)}`);
  }
}

console.log(`\n  scanned ${scanned} framer-motion files, ${changed} changed${DRY_RUN ? " (dry-run)" : ""}.`);
