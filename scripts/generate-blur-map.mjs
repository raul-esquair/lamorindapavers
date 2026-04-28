// Generates lib/blur-map.json — a path → base64-blurDataURL lookup used by
// next/image throughout the site. Run after adding/changing images:
//   npm run blur:gen
// Also runs automatically before `npm run build` via the `prebuild` script.

import { getPlaiceholder } from "plaiceholder";
import fs from "node:fs/promises";
import path from "node:path";

const PUBLIC = path.join(process.cwd(), "public");

// Folders to scan (non-recursive). Skips icons (small / often transparent —
// blur looks weird) and any subfolder we haven't explicitly listed.
const FOLDERS = [
  "images",
  "images/services",
  "images/projects",
  "images/areas",
  "images/process",
];

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function findImages() {
  const result = [];
  for (const folder of FOLDERS) {
    const dir = path.join(PUBLIC, folder);
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      continue; // folder doesn't exist; that's fine
    }
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!EXTS.has(path.extname(entry.name).toLowerCase())) continue;
      result.push(path.join(folder, entry.name));
    }
  }
  return result;
}

async function main() {
  const files = await findImages();
  const map = {};

  for (const file of files) {
    const buffer = await fs.readFile(path.join(PUBLIC, file));
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    const webPath = "/" + file.split(path.sep).join("/");
    map[webPath] = base64;
    console.log(`  ${webPath}`);
  }

  const outPath = path.join(process.cwd(), "lib", "blur-map.json");
  await fs.writeFile(outPath, JSON.stringify(map, null, 2) + "\n");
  console.log(`\n  → wrote ${files.length} entries to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  console.error("blur:gen failed:", err);
  process.exit(1);
});
