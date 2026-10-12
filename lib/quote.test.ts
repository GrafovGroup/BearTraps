import test from "node:test";
import assert from "node:assert/strict";
import { quoteSchema, deadlineInstants } from "./quote.ts";
import { assessEligibility } from "./compliance.ts";
import { validQuote } from "../tests/fixtures/quote.ts";
const valid = validQuote();
test("accepts complete RFQ and rejects invalid contacts", () => {
  assert.equal(quoteSchema.safeParse(valid).success, true);
  for (const change of [
    { email: "bad" },
    { phone: "letters" },
    { province: "invalid" },
    { name: "" },
    { buyerType: "unknown" },
    { destination: "" },
    { items: [] },
  ])
    assert.equal(quoteSchema.safeParse({ ...valid, ...change }).success, false);
});
test("rejects unsafe quantities, stale products and duplicate lines", () => {
  for (const quantity of [0, 1.5, 100000])
    assert.equal(
      quoteSchema.safeParse({
        ...valid,
        items: [{ ...valid.items[0], quantity }],
      }).success,
      false,
    );
  assert.equal(
    quoteSchema.safeParse({
      ...valid,
      items: [
        { ...valid.items[0], kind: "product", productSlug: "unpublished" },
      ],
    }).success,
    false,
  );
  assert.equal(
    quoteSchema.safeParse({ ...valid, items: [valid.items[0], valid.items[0]] })
      .success,
    false,
  );
});
test("requires consent and acknowledgement, blocks honeypot and oversized notes", () => {
  for (const change of [
    { consent: false },
    { eligibility: false },
    { website: "spam" },
    { notes: "x".repeat(2001) },
    { desiredDate: "2099-02-30" },
  ])
    assert.equal(quoteSchema.safeParse({ ...valid, ...change }).success, false);
});
test("tenders require complete future unambiguous local deadline", () => {
  const tender = {
    ...valid,
    tenderReference: "TEST-1",
    closingDate: "2099-06-01",
    closingTime: "14:30",
    closingTimezone: "America/Toronto",
  };
  assert.equal(quoteSchema.safeParse(tender).success, true);
  for (const change of [
    { closingTime: "" },
    { closingTimezone: "" },
    { closingDate: "2000-01-01" },
    { closingTime: "25:00" },
    { desiredDate: "2099-05-30" },
  ])
    assert.equal(
      quoteSchema.safeParse({ ...tender, ...change }).success,
      false,
    );
});
test("deadline conversion handles offsets and rejects DST gaps and repeated times", () => {
  assert.equal(
    new Date(
      deadlineInstants("2099-06-01", "14:30", "America/Toronto")[0],
    ).toISOString(),
    "2099-06-01T18:30:00.000Z",
  );
  assert.equal(
    deadlineInstants("2026-03-08", "02:30", "America/Toronto").length,
    0,
  );
  assert.equal(
    deadlineInstants("2026-11-01", "01:30", "America/Toronto").length,
    2,
  );
  assert.equal(
    new Date(
      deadlineInstants("2099-01-01", "12:00", "America/St_Johns")[0],
    ).toISOString(),
    "2099-01-01T15:30:00.000Z",
  );
});
test("unknown legal status blocks and verified review never enables checkout", () => {
  assert.deepEqual(
    assessEligibility({
      legalStatus: "unknown",
      buyerVerified: true,
      jurisdictionVerified: true,
      evidenceVerified: true,
    }),
    { purchaseAllowed: false, reviewStatus: "blocked" },
  );
  assert.equal(
    assessEligibility({
      legalStatus: "permitted",
      buyerVerified: true,
      jurisdictionVerified: true,
      evidenceVerified: true,
    }).purchaseAllowed,
    false,
  );
});
