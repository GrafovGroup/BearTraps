import test from "node:test";
import assert from "node:assert/strict";
import { phoneLink } from "../lib/business.ts";
import { productContactHref } from "../lib/contact.ts";
const phone = {
  e164: "+18336969996",
  display: "(833) 696-9996",
  confirmedAt: "2026-10-12T00:00:00Z",
  confirmationReference: "Owner conversation",
};
test("only confirmed matching business phone produces a call link", () => {
  assert.equal(phoneLink({ phone: null }), null);
  assert.deepEqual(phoneLink({ phone }), {
    href: "tel:+18336969996",
    label: phone.display,
    e164: phone.e164,
  });
  for (const change of [
    { e164: "8336969996" },
    { display: "(555) 555-5555" },
    { confirmationReference: "" },
    { confirmedAt: "2999-01-01T00:00:00Z" },
  ])
    assert.throws(() => phoneLink({ phone: { ...phone, ...change } }));
});
test("product contact context includes model, SKU and canonical URL with bounded subject", () => {
  const url = new URL(
    productContactHref({
      title: "A & B",
      model: "M/2",
      sku: "SKU-1",
      slug: "test",
    }),
    "https://beartraps.ca",
  );
  assert.equal(url.searchParams.get("interest"), "A & B / M/2 / SKU-1");
  assert.equal(
    url.searchParams.get("product"),
    "https://beartraps.ca/products/test/",
  );
  assert.equal(
    new URL(
      productContactHref({ title: "a".repeat(500), sku: "1", slug: "test" }),
      "https://beartraps.ca",
    ).searchParams.get("interest")!.length,
    200,
  );
});
