import { readFileSync, writeFileSync } from "node:fs";
import { importCatalogue } from "../lib/catalog-import.ts";
const [source, destination] = process.argv.slice(2);
if (!source || !destination)
  throw new Error("Usage: pnpm import:catalogue INPUT.json NEW_OUTPUT.json");
const raw = readFileSync(source);
if (raw.length > 10_000_000) throw new Error("Import exceeds 10 MB");
const products = importCatalogue(JSON.parse(raw.toString("utf8")));
// Exclusive creation prevents accidental replacement of the production catalogue.
writeFileSync(destination, JSON.stringify(products, null, 2) + "\n", {
  flag: "wx",
  mode: 0o600,
});
console.log(
  `Validated ${products.length} publishable records. Review the output before copying into content/products.json.`,
);
