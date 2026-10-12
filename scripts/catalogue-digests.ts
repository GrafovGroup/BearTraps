import { readFileSync } from "node:fs";
import { csvIntake } from "../lib/catalog-csv.ts";
import { productDigest } from "../lib/catalog-import.ts";
const [source] = process.argv.slice(2);
if (!source) throw Error("Usage: pnpm catalogue:digests INPUT.json|csv");
const raw = readFileSync(source);
if (raw.length > 10_000_000) throw Error("Import exceeds 10 MB");
const entries = source.endsWith(".csv")
  ? csvIntake(raw.toString())
  : JSON.parse(raw.toString());
if (!Array.isArray(entries)) throw Error("Expected intake array");
console.log(
  JSON.stringify(
    entries.map((r) => ({
      internalId: r.internalId,
      productSha256: productDigest(r.product),
    })),
    null,
    2,
  ),
);
