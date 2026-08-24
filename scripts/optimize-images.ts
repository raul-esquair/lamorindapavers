import sharp from "sharp";
import { readdir, stat, mkdir, copyFile } from "node:fs/promises";
import { join, extname } from "node:path";

const IMAGES_DIR = join(process.cwd(), "public/images");
const BACKUP_DIR = join(process.cwd(), "..", "lamorindapaving-image-originals");
const MAX_WIDTH = 1920;
const JPG_QUALITY = 82;
const SKIP = new Set(["logo.png", "logo-white.png"]);

async function run() {
  await mkdir(BACKUP_DIR, { recursive: true });
  const files = await readdir(IMAGES_DIR);
  const results: { name: string; before: number; after: number }[] = [];

  for (const name of files) {
    if (SKIP.has(name)) continue;
    const ext = extname(name).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const src = join(IMAGES_DIR, name);
    const srcStat = await stat(src);
    if (!srcStat.isFile()) continue;

    const backupPath = join(BACKUP_DIR, name);
    await copyFile(src, backupPath);

    const img = sharp(src, { failOn: "none" });
    const meta = await img.metadata();
    const width = meta.width ?? MAX_WIDTH;
    const resize = width > MAX_WIDTH ? { width: MAX_WIDTH, withoutEnlargement: true } : null;

    let pipeline = sharp(src, { failOn: "none" }).rotate();
    if (resize) pipeline = pipeline.resize(resize);

    const buffer =
      ext === ".png"
        ? await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true, quality: 85 }).toBuffer()
        : await pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true }).toBuffer();

    await sharp(buffer).toFile(src);
    const after = (await stat(src)).size;

    results.push({ name, before: srcStat.size, after });
    const pct = Math.round((1 - after / srcStat.size) * 100);
    console.log(
      `${name.padEnd(45)} ${fmt(srcStat.size).padStart(8)} → ${fmt(after).padStart(8)}  (-${pct}%)`
    );
  }

  const totalBefore = results.reduce((s, r) => s + r.before, 0);
  const totalAfter = results.reduce((s, r) => s + r.after, 0);
  console.log("");
  console.log(
    `Total: ${fmt(totalBefore)} → ${fmt(totalAfter)}  (saved ${fmt(totalBefore - totalAfter)}, -${Math.round(
      (1 - totalAfter / totalBefore) * 100
    )}%)`
  );
  console.log(`Originals backed up to: ${BACKUP_DIR}`);
}

function fmt(bytes: number): string {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${bytes}B`;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
