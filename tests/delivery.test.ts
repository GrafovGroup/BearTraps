import test from "node:test";
import assert from "node:assert/strict";
import { httpDelivery } from "../lib/rfq-delivery.ts";
import {
  handleRfq,
  type BackendDependencies,
} from "../integrations/rfq-handler.ts";
import { validQuote } from "./fixtures/quote.ts";
const key = "00000000-0000-4000-8000-000000000001";
const receipt = {
  status: "accepted" as const,
  reference: "TEST-RECEIPT",
  acceptedAt: "2026-10-12T00:00:00Z",
};
const request = (
  body = JSON.stringify(validQuote()),
  origin = "https://beartraps.ca",
) =>
  new Request("https://forms.example.invalid/rfq", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: origin,
      "idempotency-key": key,
    },
    body,
  });
const dependencies = (): BackendDependencies => ({
  allowedOrigins: ["https://beartraps.ca"],
  allowRequest: async () => true,
  verifySpam: async () => true,
  acceptDurably: async () => receipt,
});
test("adapter requires HTTPS and positive acceptance receipt", async () => {
  assert.throws(() => httpDelivery("http://example.invalid"));
  const adapter = httpDelivery("https://forms.example.invalid", async () =>
    Response.json(receipt, { status: 202 }),
  );
  assert.deepEqual(await adapter.submit(validQuote(), key), receipt);
  for (const response of [
    Response.json({ status: "ok" }),
    Response.json({ error: "failed" }, { status: 503 }),
    Response.json({}, { status: 429 }),
  ])
    await assert.rejects(
      httpDelivery(
        "https://forms.example.invalid",
        async () => response,
      ).submit(validQuote(), key),
    );
});
test("server validates origin, body, rate limit, spam and durable acceptance", async () => {
  assert.equal((await handleRfq(request(), dependencies())).status, 202);
  assert.equal(
    (
      await handleRfq(
        request(undefined, "https://evil.invalid"),
        dependencies(),
      )
    ).status,
    403,
  );
  assert.equal(
    (await handleRfq(request("not-json"), dependencies())).status,
    400,
  );
  assert.equal(
    (
      await handleRfq(
        request(JSON.stringify({ ...validQuote(), consent: false })),
        dependencies(),
      )
    ).status,
    400,
  );
  assert.equal(
    (await handleRfq(request("x".repeat(128001)), dependencies())).status,
    413,
  );
  assert.equal(
    (
      await handleRfq(request(), {
        ...dependencies(),
        allowRequest: async () => false,
      })
    ).status,
    429,
  );
  assert.equal(
    (
      await handleRfq(request(), {
        ...dependencies(),
        verifySpam: async () => false,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await handleRfq(request(), {
        ...dependencies(),
        acceptDurably: async () => {
          throw Error("secret provider failure");
        },
      })
    ).status,
    503,
  );
});
test("no delivery call on invalid requests and failures do not reveal private details", async () => {
  let calls = 0;
  const deps = {
    ...dependencies(),
    acceptDurably: async () => {
      calls++;
      throw Error("private@example.invalid");
    },
  };
  await handleRfq(request("{}"), deps);
  assert.equal(calls, 0);
  const response = await handleRfq(request(), deps);
  assert.equal(response.status, 503);
  assert.equal(
    (await response.text()).includes("private@example.invalid"),
    false,
  );
});
