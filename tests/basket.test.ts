import test from "node:test";
import assert from "node:assert/strict";
import { parseBasket } from "../lib/basket.ts";
import { categoryLine, mergeLines } from "../lib/line-items.ts";
import { rfqSummary } from "../lib/rfq-summary.ts";
import { validQuote } from "./fixtures/quote.ts";
test("migrates legacy category basket and rejects corrupted or unrecognized entries", () => {
  const lines = parseBasket(
    JSON.stringify([
      { slug: "bear-traps", quantity: 3 },
      { slug: "unknown", quantity: 1 },
    ]),
  );
  assert.equal(lines.length, 1);
  assert.equal(lines[0].category, "bear-traps");
  assert.equal(lines[0].quantity, 3);
  assert.equal(parseBasket("{bad").length, 0);
  assert.equal(
    parseBasket(
      JSON.stringify([null, { kind: "product", productSlug: "unknown" }]),
    ).length,
    0,
  );
});
test("merges package quantities without losing custom specs, handles overflow", () => {
  const original = {
    ...categoryLine("bear-traps"),
    specifications: "User requirement",
    quantity: 2,
  };
  const result = mergeLines(
    [original],
    [categoryLine("bear-traps"), categoryLine("warning-signage")],
  );
  assert.equal(result[0].quantity, 3);
  assert.equal(result[0].specifications, "User requirement");
  assert.equal(result.length, 2);
  assert.equal(original.quantity, 2);
  assert.equal(
    mergeLines([{ ...original, quantity: 99999 }], [original])[0].quantity,
    99999,
  );
});
test("multiple custom sourcing lines and bulk quantities survive persistence", () => {
  const lines = [
    {
      ...categoryLine("bear-traps"),
      id: "custom:1",
      kind: "custom",
      title: "Special requirement A",
      quantity: 2000,
    },
    {
      ...categoryLine("bear-traps"),
      id: "custom:2",
      kind: "custom",
      title: "Special requirement B",
    },
  ];
  assert.equal(parseBasket(JSON.stringify(lines)).length, 2);
  assert.equal(parseBasket(JSON.stringify([...lines, lines[0]])).length, 2);
});
test("summary includes line specifications, recipient, tender zone and delivery details", () => {
  const q = validQuote();
  q.items[0].specifications = "Custom door dimensions";
  const text = rfqSummary({
    ...q,
    tenderReference: "TEST",
    closingDate: "2099-06-01",
    closingTime: "14:30",
    closingTimezone: "America/Toronto",
    procurementReference: "Document 12",
    freightNeeds: "Liftgate required",
  });
  for (const phrase of [
    "info@beartraps.ca",
    "Custom door dimensions",
    "America/Toronto",
    "Document 12",
    "Liftgate required",
    "Not submitted",
  ])
    assert.ok(text.includes(phrase));
});
