import test from "node:test";
import assert from "node:assert/strict";
import {
  validateCatalog,
  productStructuredData,
} from "../lib/product-schema.ts";
import { filterProducts, defaultFilters } from "../lib/catalog-search.ts";
import { fixtureProduct } from "./fixtures/products.ts";
import { publishedProducts } from "../lib/catalog.ts";
test("production catalogue never includes internal fixtures", () =>
  assert.equal(
    publishedProducts.some((p) => p.manufacturer.includes("INTERNAL TEST")),
    false,
  ));
test("only verified publication passes with complete supplier evidence", () => {
  const p = fixtureProduct();
  assert.equal(validateCatalog([p]).length, 1);
  assert.throws(() => validateCatalog([{ ...p, verification: "draft" }]));
  assert.throws(() =>
    validateCatalog([{ ...p, supplier: { ...p.supplier, verified: false } }]),
  );
  assert.throws(() => validateCatalog([{ ...p, source: null }]));
});
test("rejects duplicate SKU/slug and broken accessories", () => {
  const p = fixtureProduct();
  assert.throws(() => validateCatalog([p, p]));
  assert.throws(() =>
    validateCatalog([
      p,
      { ...fixtureProduct("two"), sku: p.sku.toLowerCase() },
    ]),
  );
  assert.throws(() =>
    validateCatalog([{ ...p, relatedAccessories: ["absent"] }]),
  );
});
test("requires evidence for claims, legal status and image rights; catches image reuse", () => {
  const p = fixtureProduct();
  assert.throws(() =>
    validateCatalog([
      {
        ...p,
        certificationsEvidence: [
          { claim: "Certified", scope: "TEST MODEL", evidence: null },
        ],
      },
    ]),
  );
  assert.throws(() =>
    validateCatalog([
      { ...p, jurisdictions: [{ ...p.jurisdictions[0], status: "permitted" }] },
    ]),
  );
  assert.throws(() =>
    validateCatalog([{ ...p, images: [{ src: "/images/test.png" }] }]),
  );
  const image = {
    src: "/images/test.png",
    alt: "Test image",
    source: "https://example.invalid/image",
    rights: "Test permission",
    rightsEvidence: "https://example.invalid/rights",
    sha256: "a".repeat(64),
  };
  assert.throws(() =>
    validateCatalog([
      { ...p, images: [image] },
      {
        ...fixtureProduct("two"),
        images: [{ ...image, src: "/images/renamed.png" }],
      },
    ]),
  );
});
test("filters keyword, category, application, supplier, dimensions, features and ordering", () => {
  const a = { ...fixtureProduct("a"), title: "Alpha" },
    b = { ...fixtureProduct("b"), title: "Beta", dimensions: null };
  const both = [b, a];
  assert.equal(
    filterProducts(both, { ...defaultFilters, query: "Alpha" })[0].slug,
    "a",
  );
  assert.equal(
    filterProducts(both, { ...defaultFilters, maxWidthMm: "1200" }).length,
    1,
  );
  for (const change of [
    { category: "bear-traps" },
    { application: "absent" },
    { supplier: "absent" },
    { feature: "absent" },
    { maxWidthMm: "500" },
  ])
    assert.equal(
      filterProducts(both, { ...defaultFilters, ...change }).length,
      0,
    );
  assert.equal(
    filterProducts(both, { ...defaultFilters, sort: "title-asc" })[0].title,
    "Alpha",
  );
  assert.equal(
    filterProducts([{ ...a, published: false }], defaultFilters).length,
    0,
  );
});
test("structured data only for verified products, without invented Offers", () => {
  const p = fixtureProduct();
  const data = productStructuredData(p, "https://example.invalid");
  assert.equal(data?.sku, p.sku);
  assert.equal("offers" in data!, false);
  assert.equal(
    productStructuredData(
      { ...p, published: false },
      "https://example.invalid",
    ),
    null,
  );
});

test("unsupported performance claims cannot publish without exact-model evidence", () => {
  const p = fixtureProduct();
  assert.throws(() =>
    validateCatalog([
      { ...p, title: "Certified bear-resistant test container" },
    ]),
  );
  assert.throws(() =>
    validateCatalog([
      {
        ...p,
        certificationsEvidence: [
          {
            claim: "Verified claim",
            scope: "different model",
            evidence: p.source,
          },
        ],
      },
    ]),
  );
});
