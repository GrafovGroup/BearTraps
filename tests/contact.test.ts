import test from "node:test";
import assert from "node:assert/strict";
import {
  contactSchema,
  contactMailto,
  productContactHref,
} from "../lib/contact.ts";
import { contactDelivery } from "../lib/contact-delivery.ts";
import {
  handleContact,
  handleAuthenticatedContact,
  type BackendDependencies,
} from "../integrations/contact-handler.ts";
const contact = {
  name: "Test Buyer",
  organization: "",
  email: "buyer@example.invalid",
  phone: "",
  subject: "Signage inquiry",
  message: "Please discuss signage specifications.",
  consent: true as const,
  website: "",
};
const key = "00000000-0000-4000-8000-000000000001";
const receipt = {
  status: "accepted" as const,
  reference: "TEST-123",
  acceptedAt: "2026-10-12T00:00:00Z",
};
const deps = (): BackendDependencies => ({
  allowedOrigins: ["https://beartraps.ca"],
  allowRequest: async () => true,
  verifySpam: async () => true,
  acceptDurably: async () => receipt,
});
const request = (
  body = JSON.stringify(contact),
  origin = "https://beartraps.ca",
) =>
  new Request("https://forms.example.invalid/contact", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "idempotency-key": key,
    },
    body,
  });
test("simple contact validates required fields, consent, optional phone and spam", () => {
  assert.equal(contactSchema.safeParse(contact).success, true);
  for (const change of [
    { name: "" },
    { email: "invalid" },
    { consent: false },
    { website: "bot" },
    { phone: "letters" },
    { message: "short" },
    { message: "x".repeat(3001) },
    { items: [] },
  ])
    assert.equal(
      contactSchema.safeParse({ ...contact, ...change }).success,
      false,
    );
  const link = new URL(
    contactMailto({
      ...contact,
      subject: "A & B?",
      message: "Line one\nLine two & three",
    }),
  );
  assert.equal(link.protocol, "mailto:");
  assert.equal(link.pathname, "info@beartraps.ca");
  assert.equal(link.searchParams.get("subject"), "A & B?");
  assert.match(link.searchParams.get("body")!, /Line two & three/);
  const productLink = new URL(
    productContactHref({ title: "A & B", sku: "SKU-1", slug: "model" }),
    "https://beartraps.ca",
  );
  assert.equal(productLink.searchParams.get("interest"), "A & B / SKU-1");
  assert.equal(
    productLink.searchParams.get("product"),
    "https://beartraps.ca/products/model/",
  );
});
test("contact service fails closed for invalid input, abuse, upstream failure and receipts", async () => {
  assert.equal((await handleContact(request(), deps())).status, 202);
  assert.equal((await handleContact(request("{}"), deps())).status, 400);
  assert.equal(
    (await handleContact(request("x".repeat(128001)), deps())).status,
    413,
  );
  assert.equal(
    (await handleContact(request(undefined, "https://evil.invalid"), deps()))
      .status,
    403,
  );
  assert.equal(
    (
      await handleContact(request(), {
        ...deps(),
        allowRequest: async () => false,
      })
    ).status,
    429,
  );
  assert.equal(
    (
      await handleContact(request(), {
        ...deps(),
        verifySpam: async () => false,
      })
    ).status,
    403,
  );
  const failure = await handleContact(request(), {
    ...deps(),
    acceptDurably: async () => {
      throw Error("private-secret");
    },
  });
  assert.equal(failure.status, 503);
  assert.equal((await failure.text()).includes("private-secret"), false);
  assert.equal(
    (
      await handleContact(request(), {
        ...deps(),
        acceptDurably: async () => ({ ...receipt, reference: "<private>" }),
      })
    ).status,
    502,
  );
});
test("contact adapter requires confirmed receipt and authenticated bridge upstream", async () => {
  assert.throws(() => contactDelivery("http://example.invalid"));
  assert.deepEqual(
    await contactDelivery("https://example.invalid", async () =>
      Response.json(receipt, { status: 202 }),
    ).submit(contact, key),
    receipt,
  );
  for (const response of [
    Response.json({ status: "ok" }),
    Response.json({}, { status: 503 }),
    Response.json({}, { status: 429 }),
  ])
    await assert.rejects(
      contactDelivery("https://example.invalid", async () => response).submit(
        contact,
        key,
      ),
    );
  const secret = "test-secret-".repeat(4);
  assert.equal(
    (await handleAuthenticatedContact(request(), deps(), secret)).status,
    401,
  );
  const authorized = request();
  authorized.headers.set("authorization", `Bearer ${secret}`);
  assert.equal(
    (await handleAuthenticatedContact(authorized, deps(), secret)).status,
    202,
  );
  const cors = await handleContact(
    new Request("https://example.invalid", {
      method: "OPTIONS",
      headers: {
        origin: "https://beartraps.ca",
        "access-control-request-method": "POST",
      },
    }),
    deps(),
  );
  assert.equal(cors.status, 204);
  assert.equal(
    cors.headers.get("access-control-allow-origin"),
    "https://beartraps.ca",
  );
});
