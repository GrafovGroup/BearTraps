import test from "node:test";
import assert from "node:assert/strict";
import { submitFormspree, formspreeEndpoint } from "../lib/formspree.ts";
const contact = {
  name: "QA Buyer",
  organization: "",
  email: "qa@example.com",
  phone: "",
  subject: "Equipment",
  message: "Please discuss equipment.",
  consent: true as const,
  website: "",
};
test("Formspree sends all validated fields without custom service receipt headers", async () => {
  await submitFormspree(contact, async (url, init) => {
    assert.equal(url, formspreeEndpoint);
    const headers = new Headers(init?.headers);
    assert.equal(headers.get("Accept"), "application/json");
    assert.equal(headers.has("Idempotency-Key"), false);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.email, contact.email);
    assert.equal(body.subject, contact.subject);
    assert.equal(body.consent, true);
    assert.equal(body._gotcha, "");
    return Response.json({ ok: true });
  });
});
test("Formspree rejects failures, unexpected receipts and invalid input", async () => {
  for (const response of [
    Response.json({ ok: false }),
    Response.json({}),
    Response.json({ ok: true }, { status: 429 }),
    new Response("not json", { status: 500 }),
  ])
    await assert.rejects(submitFormspree(contact, async () => response));
  await assert.rejects(
    submitFormspree(contact, async () => {
      throw new TypeError("network");
    }),
  );
  await assert.rejects(
    submitFormspree({ ...contact, website: "spam" }, async () => {
      throw Error("must not send");
    }),
  );
});
