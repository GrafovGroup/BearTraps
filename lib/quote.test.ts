import test from "node:test";
import assert from "node:assert/strict";
import { quoteSchema } from "./quote.ts";
import { assessEligibility } from "./compliance.ts";
const valid = {
  name: "Test Buyer",
  organization: "Test Organization",
  email: "buyer@example.com",
  phone: "+1 416 555 0123",
  province: "Ontario",
  destination: "Test destination, Ontario",
  desiredDate: "",
  tenderReference: "",
  closingDate: "",
  requirements: "",
  notes: "",
  eligibility: true,
  website: "",
  items: [{ slug: "bear-traps", quantity: 2 }],
};
test("accepts an RFQ without optional dates", () =>
  assert.equal(quoteSchema.safeParse(valid).success, true));
test("rejects invalid contact and empty equipment", () => {
  for (const change of [
    { email: "invalid" },
    { phone: "letters" },
    { items: [] },
    { province: "invalid" },
    { name: "" },
    { destination: "" },
  ])
    assert.equal(quoteSchema.safeParse({ ...valid, ...change }).success, false);
});
test("rejects unknown items and unsafe quantities", () => {
  for (const item of [
    { slug: "unknown", quantity: 1 },
    { slug: "bear-traps", quantity: 0 },
    { slug: "bear-traps", quantity: 1.5 },
    { slug: "bear-traps", quantity: 10000 },
  ])
    assert.equal(
      quoteSchema.safeParse({ ...valid, items: [item] }).success,
      false,
    );
});
test("requires acknowledgement and rejects spam", () => {
  assert.equal(
    quoteSchema.safeParse({ ...valid, eligibility: false }).success,
    false,
  );
  assert.equal(
    quoteSchema.safeParse({ ...valid, website: "https://spam.example" })
      .success,
    false,
  );
});
test("rejects impossible dates and oversized notes", () => {
  assert.equal(
    quoteSchema.safeParse({ ...valid, desiredDate: "2026-02-30" }).success,
    false,
  );
  assert.equal(
    quoteSchema.safeParse({ ...valid, notes: "x".repeat(2001) }).success,
    false,
  );
});
test("unknown legality blocks, and quote readiness never enables purchase", () => {
  assert.deepEqual(
    assessEligibility({
      legalStatus: "unknown",
      buyerVerified: true,
      jurisdictionVerified: true,
      evidenceVerified: true,
    }),
    { purchaseAllowed: false, reviewStatus: "blocked" },
  );
  assert.deepEqual(
    assessEligibility({
      legalStatus: "permitted",
      buyerVerified: true,
      jurisdictionVerified: true,
      evidenceVerified: true,
    }),
    { purchaseAllowed: false, reviewStatus: "ready-for-quote" },
  );
});
