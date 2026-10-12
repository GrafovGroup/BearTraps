import test from "node:test";
import assert from "node:assert/strict";
import { reviewProduct } from "../lib/compliance.ts";
import { fixtureProduct } from "./fixtures/products.ts";
test("province and buyer eligibility default to blocked without evidenced review", () => {
  const p = fixtureProduct();
  for (const province of ["Ontario", "Quebec"])
    assert.equal(
      reviewProduct(p, province, "Authorized buyer", true).status,
      "blocked",
    );
  const reviewed = {
    ...p,
    jurisdictions: [
      {
        ...p.jurisdictions[0],
        status: "permitted" as const,
        buyerTypes: ["Authorized buyer"],
        evidence: p.source,
      },
    ],
  };
  assert.equal(
    reviewProduct(reviewed, "Ontario", "Authorized buyer").status,
    "blocked",
  );
  const result = reviewProduct(reviewed, "Ontario", "Authorized buyer", true);
  assert.equal(result.status, "review-required");
  assert.equal(result.purchaseAllowed, false);
  assert.equal(result.humanReviewRequired, true);
  assert.equal(
    reviewProduct(
      {
        ...reviewed,
        jurisdictions: [{ ...reviewed.jurisdictions[0], status: "prohibited" }],
      },
      "Ontario",
      "Authorized buyer",
      true,
    ).status,
    "blocked",
  );
});
