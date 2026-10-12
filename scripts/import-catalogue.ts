import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import {
  importCatalogue,
  intakeSchema,
  catalogueChanges,
  productDigest,
} from "../lib/catalog-import.ts";
import { csvIntake } from "../lib/catalog-csv.ts";
import { validateCatalog } from "../lib/product-schema.ts";
const [source, destination, previousFile, ...extra] = process.argv.slice(2);
if (!source || !destination || extra.length)
  throw Error(
    "Usage: pnpm import:catalogue INPUT.json|csv NEW_OUTPUT_DIRECTORY [PREVIOUS_PRODUCTS.json]",
  );
const raw = readFileSync(source);
if (raw.length > 10_000_000) throw Error("Import exceeds 10 MB");
const input = source.toLowerCase().endsWith(".csv")
  ? csvIntake(raw.toString("utf8"))
  : JSON.parse(raw.toString("utf8"));
const entries = intakeSchema.parse(input),
  products = importCatalogue(entries);
const previous = previousFile
  ? validateCatalog(JSON.parse(readFileSync(previousFile, "utf8")))
  : [];
const output = JSON.stringify(products, null, 2) + "\n";
const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  sourceSha256: createHash("sha256").update(raw).digest("hex"),
  outputSha256: createHash("sha256").update(output).digest("hex"),
  baselineProvided: Boolean(previousFile),
  changes: catalogueChanges(previous, products),
  records: entries.map((r) => ({
    internalId: r.internalId,
    status: r.status,
    notes: r.notes,
    review: r.review,
    productSha256: productDigest(r.product),
  })),
};
// An exclusive private directory prevents overwriting a catalogue or prior audit.
mkdirSync(destination, { mode: 0o700 });
try {
  writeFileSync(join(destination, "products.json"), output, {
    flag: "wx",
    mode: 0o600,
  });
  writeFileSync(
    join(destination, "review-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    { flag: "wx", mode: 0o600 },
  );
} catch (error) {
  rmSync(destination, { recursive: true });
  throw error;
}
console.log(
  `Validated ${products.length} publishable records. Review products.json and the private review-manifest.json before publication; ${manifest.changes.removed.length} removals.`,
);
