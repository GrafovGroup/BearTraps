import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { csvIntake, parseCsv, intakeColumns } from "../lib/catalog-csv.ts";
import { importCatalogue, productDigest } from "../lib/catalog-import.ts";
import { validateCatalog } from "../lib/product-schema.ts";
import { fixtureProduct } from "./fixtures/products.ts";
const quote = (v: string) => '"' + v.replaceAll('"', '""') + '"';
test("CSV handles BOM, commas, quotes, CRLF and multiline JSON/text; rejects malformed files", () => {
  assert.deepEqual(
    parseCsv('\uFEFFa,b\r\n"line 1\nline 2","say ""hi"", here"\r\n'),
    [
      ["a", "b"],
      ["line 1\nline 2", 'say "hi", here'],
    ],
  );
  for (const source of [
    "a,a\nx,y",
    "internalId,status,unknown\nx,draft,x",
    "internalId,status\nx",
    'internalId,status\n"x,draft',
    'internalId,status\n"x"x,draft',
  ])
    assert.throws(() => csvIntake(source));
  const product = fixtureProduct();
  const review = {
    reviewer: "TEST ONLY",
    reviewedAt: "2026-01-01T00:00:00Z",
    productSha256: productDigest(product),
    supplier: true,
    modelSpecifications: true,
    imageRightsAndUniqueness: true,
    regulatoryReview: true,
    documentsAndClaims: true,
  };
  const fields: Record<string, unknown> = {
    internalId: "test",
    status: "publishable",
    review_json: JSON.stringify(review),
  };
  for (const [k, v] of Object.entries(product))
    fields[typeof v === "object" && v !== null ? k + "_json" : k] =
      typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
  const csv =
    Object.keys(fields).join(",") +
    "\n" +
    Object.values(fields)
      .map((v) => quote(String(v)))
      .join(",");
  assert.equal(importCatalogue(csvIntake(csv))[0].sku, product.sku);
  assert.ok(intakeColumns.includes("compatibilityEvidence_json"));
});
test("CLI preserves existing outputs, writes private audit and detects removals", () => {
  const dir = mkdtempSync(join(tmpdir(), "beartraps-intake-"));
  try {
    writeFileSync(
      join(dir, "intake.json"),
      JSON.stringify([
        { internalId: "archive", status: "archived", product: {} },
      ]),
    );
    writeFileSync(
      join(dir, "previous.json"),
      JSON.stringify([fixtureProduct()]),
    );
    const args = [
      "--experimental-strip-types",
      "scripts/import-catalogue.ts",
      join(dir, "intake.json"),
      join(dir, "release"),
      join(dir, "previous.json"),
    ];
    execFileSync(process.execPath, args, { stdio: "pipe" });
    assert.deepEqual(
      JSON.parse(readFileSync(join(dir, "release/products.json"), "utf8")),
      [],
    );
    const manifest = JSON.parse(
      readFileSync(join(dir, "release/review-manifest.json"), "utf8"),
    );
    assert.deepEqual(manifest.changes.removed, ["internal-fixture"]);
    assert.equal(manifest.records[0].status, "archived");
    assert.throws(() =>
      execFileSync(process.execPath, args, { stdio: "pipe" }),
    );
    assert.deepEqual(
      JSON.parse(readFileSync(join(dir, "release/products.json"), "utf8")),
      [],
    );
  } finally {
    rmSync(dir, { recursive: true });
  }
});
test("model-scoped documents, accessory evidence and regulated classifications fail closed", () => {
  const p = fixtureProduct(),
    accessory = fixtureProduct("accessory");
  assert.throws(() =>
    validateCatalog([
      {
        ...p,
        documents: [
          {
            title: "Manual",
            kind: "manual",
            url: p.source.url,
            model: "WRONG",
            evidence: p.source,
          },
        ],
      },
    ]),
  );
  assert.throws(() =>
    validateCatalog([
      { ...p, relatedAccessories: [accessory.slug] },
      accessory,
    ]),
  );
  assert.equal(
    validateCatalog([
      {
        ...p,
        relatedAccessories: [accessory.slug],
        compatibilityEvidence: [
          {
            accessorySlug: accessory.slug,
            accessoryModel: accessory.model,
            evidence: p.source,
          },
        ],
      },
      accessory,
    ]).length,
    2,
  );
  assert.throws(() =>
    validateCatalog([
      { ...p, category: "bear-traps", regulatoryClassification: "general" },
    ]),
  );
  assert.throws(() =>
    validateCatalog([{ ...p, features: ["Certified bear-resistant"] }]),
  );
  assert.equal(
    validateCatalog([
      { ...p, category: "bear-traps", regulatoryClassification: "regulated" },
    ])[0].jurisdictions[0].status,
    "unknown",
  );
});
