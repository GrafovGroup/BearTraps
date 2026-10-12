import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
if (process.env.CATALOGUE_FIXTURE_BUILD !== "true")
  throw Error("Only for isolated fixture build");
const server = spawn(
  "python3",
  ["-m", "http.server", "4174", "--bind", "127.0.0.1", "--directory", "out"],
  { stdio: "ignore" },
);
const base = "http://127.0.0.1:4174";
let browser;
try {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch(base);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/products/fixture-model/", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Planning & delivery" }).waitFor();
  assert.ok(
    await page.getByText("TEST ONLY freight", { exact: true }).isVisible(),
  );
  assert.ok(
    await page.getByText("TEST ONLY variant", { exact: true }).isVisible(),
  );
  assert.equal(
    await page
      .getByRole("link", { name: /TEST ONLY manual/ })
      .getAttribute("href"),
    "https://example.invalid/internal-fixture",
  );
  assert.ok(
    await page
      .getByRole("link", {
        name: "Internal fixture fixture-accessory",
        exact: true,
      })
      .isVisible(),
  );
  const data = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const product = data
    .map(JSON.parse)
    .flat()
    .find((d) => d["@type"] === "Product");
  assert.equal(product.model, "TEST MODEL");
  assert.equal("offers" in product, false);
  assert.ok(product.additionalProperty.length > 0);
  assert.equal(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations.length,
    0,
  );
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  const requests = [];
  let responseMode = "invalid";
  await page.route("https://contact.example.invalid/receive", async (route) => {
    const request = route.request();
    if (request.method() === "OPTIONS")
      return route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "content-type,idempotency-key",
          "access-control-allow-methods": "POST",
        },
      });
    requests.push({
      key: request.headers()["idempotency-key"],
      body: request.postDataJSON(),
    });
    await route.fulfill({
      status: 202,
      headers: { "access-control-allow-origin": "*" },
      contentType: "application/json",
      body: JSON.stringify(
        responseMode === "invalid"
          ? { status: "ok" }
          : {
              status: "accepted",
              reference: "CI-RECEIPT",
              acceptedAt: "2026-10-12T00:00:00Z",
            },
      ),
    });
  });
  await page.getByRole("link", { name: "ASK ABOUT THIS PRODUCT" }).click();
  await page
    .getByLabel("SUBJECT / PRODUCT OF INTEREST", { exact: true })
    .waitFor();
  assert.match(
    await page
      .getByLabel("SUBJECT / PRODUCT OF INTEREST", { exact: true })
      .inputValue(),
    /TEST MODEL/,
  );
  assert.match(
    await page.getByLabel("MESSAGE", { exact: true }).inputValue(),
    /products\/fixture-model\//,
  );
  await page.getByLabel("NAME", { exact: true }).fill("CI TEST BUYER");
  await page.getByLabel("EMAIL", { exact: true }).fill("test@example.invalid");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "SEND MESSAGE", exact: true }).click();
  await page
    .getByText("Receipt was not confirmed.", { exact: false })
    .waitFor();
  assert.equal(
    await page.getByText("Accepted for processing.", { exact: false }).count(),
    0,
  );
  responseMode = "accepted";
  await page.getByRole("button", { name: "SEND MESSAGE", exact: true }).click();
  await page
    .getByText("Accepted for processing. Reference: CI-RECEIPT.", {
      exact: false,
    })
    .waitFor();
  assert.equal(requests.length, 2);
  assert.equal(requests[0].key, requests[1].key);
  assert.equal(requests[1].body.organization, "");
  assert.equal(requests[1].body.phone, "");
  await page
    .getByLabel("MESSAGE", { exact: true })
    .fill("A different synthetic enquiry for CI.");
  await page.getByRole("button", { name: "SEND MESSAGE", exact: true }).click();
  await page
    .getByText("Accepted for processing. Reference: CI-RECEIPT.", {
      exact: false,
    })
    .waitFor();
  assert.notEqual(requests[2].key, requests[1].key);
  await page.goto(base + "/products/", { waitUntil: "networkidle" });
  await page
    .getByLabel("MANUFACTURER", { exact: true })
    .selectOption("INTERNAL TEST MANUFACTURER");
  await page
    .getByLabel("SEARCH EQUIPMENT", { exact: true })
    .fill("fixture-accessory");
  assert.equal(await page.locator(".product-card").count(), 1);
  await page
    .getByLabel("SEARCH EQUIPMENT", { exact: true })
    .fill("no-matching-model");
  await page.getByRole("link", { name: "DISCUSS SOURCING" }).click();
  assert.equal(
    await page
      .getByLabel("SUBJECT / PRODUCT OF INTEREST", { exact: true })
      .inputValue(),
    "no-matching-model",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Isolated product, filtering, axe and mocked accepted/rejected/retry contact workflows passed. No live mail sent.",
  );
} finally {
  await browser?.close();
  server.kill();
}
