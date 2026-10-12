import test from "node:test";
import assert from "node:assert/strict";
import { importCatalogue } from "../lib/catalog-import.ts";
import { fixtureProduct } from "./fixtures/products.ts";
const review = {
  reviewer: "TEST REVIEWER",
  reviewedAt: "2026-01-01T00:00:00Z",
  supplier: true,
  modelSpecifications: true,
  imageRightsAndUniqueness: true,
  regulatoryReview: true,
  documentsAndClaims: true,
};
const record = () => ({
  internalId: "test",
  status: "publishable",
  review,
  product: fixtureProduct(),
});
test("only reviewed publishable records enter production output", () => {
  for (const status of ["draft", "pending-review", "archived"])
    assert.deepEqual(
      importCatalogue([{ internalId: status, status, product: {} }]),
      [],
    );
  assert.equal(importCatalogue([record()]).length, 1);
  assert.throws(() => importCatalogue([{ ...record(), review: undefined }]));
  assert.throws(() =>
    importCatalogue([
      { ...record(), review: { ...review, regulatoryReview: false } },
    ]),
  );
  assert.throws(() =>
    importCatalogue([
      { ...record(), product: { ...fixtureProduct(), verification: "draft" } },
    ]),
  );
});
test("imports reject duplicate IDs, broken relationships and unsupported claims", () => {
  assert.throws(() => importCatalogue([record(), record()]));
  assert.throws(() =>
    importCatalogue([
      {
        ...record(),
        product: { ...fixtureProduct(), relatedAccessories: ["missing"] },
      },
    ]),
  );
  assert.throws(() =>
    importCatalogue([
      {
        ...record(),
        product: { ...fixtureProduct(), title: "Certified trap" },
      },
    ]),
  );
});
