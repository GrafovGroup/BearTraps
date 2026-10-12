import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const server = spawn(
  "python3",
  ["-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", "out"],
  { stdio: "ignore" },
);
let browser;
try {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch("http://127.0.0.1:4173");
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  browser = await chromium.launch();
  const page = await browser.newPage();
  const failures = [];
  page.on("pageerror", (e) => failures.push(e.message));
  await mkdir("screenshots", { recursive: true });
  for (const [name, width] of [
    ["desktop", 1440],
    ["tablet", 768],
    ["mobile", 390],
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      "Horizontal overflow: " + name,
    );
    await page.screenshot({
      path: "screenshots/" + name + ".png",
      fullPage: true,
    });
  }
  await page.getByText("MENU", { exact: true }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "EQUIPMENT", exact: true })
    .click();
  await page.getByRole("button", { name: "ADD REQUIREMENT TO RFQ" }).click();
  await page.getByRole("link", { name: "VIEW YOUR RFQ" }).click();
  await page.getByLabel("ADD EQUIPMENT").selectOption("warning-signage");
  const quantities = page.getByRole("spinbutton");
  await quantities.first().fill("3");
  await page.reload();
  await page.getByRole("button", { name: "DOWNLOAD YOUR RFQ" }).click();
  await page.getByRole("alert").waitFor();
  await page.getByLabel("CONTACT NAME").fill("QA Buyer");
  await page
    .getByLabel("ORGANIZATION", { exact: false })
    .fill("Test Organization");
  await page.getByLabel("EMAIL", { exact: false }).fill("buyer@example.com");
  await page.getByLabel("PHONE", { exact: false }).fill("+1 416 555 0123");
  await page.getByLabel("PROVINCE / TERRITORY").selectOption("Ontario");
  await page
    .getByLabel("DELIVERY DESTINATION")
    .fill("Test destination, Ontario");
  await page.getByRole("checkbox").check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "DOWNLOAD YOUR RFQ" }).click();
  const download = await downloadPromise;
  const text = await readFile(await download.path(), "utf8");
  assert.match(text, /Quantity: 3/);
  assert.match(text, /Bear warning signage/);
  assert.match(text, /Not submitted/);
  assert.equal(await page.getByRole("spinbutton").count(), 2);
  await page
    .getByRole("button", { name: "Remove Warning signage", exact: true })
    .click();
  assert.equal(await page.getByRole("spinbutton").count(), 1);
  assert.deepEqual(failures, []);
  await page.screenshot({ path: "screenshots/rfq-mobile.png", fullPage: true });
  console.log(
    "Passed desktop/tablet/mobile layout, mobile navigation, basket persistence, quantities, form validation, RFQ download and removal.",
  );
} finally {
  await browser?.close();
  server.kill();
}
