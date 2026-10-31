// Builds responsive WebP variants + manifest from the Pixieset export. Originals are never modified.
import { createRequire } from "node:module"; const sharp = createRequire(import.meta.url)("/opt/npm-tools/node_modules/sharp"); import fs from "node:fs"; import path from "node:path";
const SRC = process.argv[2]; const OUT = "public/portfolio";
const SETS = { "YV_PORTRAITS":["yv-portraits","YV Portraits"], "WEDDINGS":["weddings","Weddings"], "STUDIO_WORK":["studio-work","Studio Work"], "BRANDS":["brands","Brands"], "ASO-EBI_LOOK":["aso-ebi-look","Aso-ebi Look"], "LIFESTYLE":["lifestyle","Lifestyle"] };
const manifest = { sets: [], assets: [] };
for (const [dir,[slug,name]] of Object.entries(SETS)) {
  const files = fs.readdirSync(path.join(SRC,dir)).filter(f=>/\.(jpe?g|png)$/i.test(f)).sort();
  manifest.sets.push({ slug, name, original: dir, count: files.length });
  let i = 0;
  for (const f of files) {
    i++; const id = `${slug}-${String(i).padStart(3,"0")}`;
    const img = sharp(path.join(SRC,dir,f)).rotate();
    const meta = await img.metadata(); const w = meta.autoOrient?.width ?? meta.width, h = meta.autoOrient?.height ?? meta.height;
    const [W,H] = (meta.orientation||1) > 4 ? [meta.height, meta.width] : [meta.width, meta.height];
    for (const size of [800,1600]) await sharp(path.join(SRC,dir,f)).rotate().resize({ width: size, withoutEnlargement: true }).webp({ quality: size===800?72:78 }).toFile(`${OUT}/${id}-${size}.webp`);
    const blur = (await sharp(path.join(SRC,dir,f)).rotate().resize(16).webp({quality:40}).toBuffer()).toString("base64");
    manifest.assets.push({ id, set: slug, original: f, w: W, h: H, ratio: +(W/H).toFixed(4), blur: `data:image/webp;base64,${blur}`, focal: [0.5,0.4], status: "pending-approval" });
  }
}
fs.writeFileSync("src/content/portfolio.manifest.json", JSON.stringify(manifest));
console.log(manifest.assets.length, "assets");
