import { chromium, firefox, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const server = spawn(
  "python3",
  ["-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", "out"],
  { stdio: "ignore" },
);
const base = "http://127.0.0.1:4173";
const reports = [];
try {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch(base);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  await mkdir("screenshots", { recursive: true });
  for (const [engine, type] of [
    ["chromium", chromium],
    ["firefox", firefox],
    ["webkit", webkit],
  ]) {
    const browser = await type.launch();
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      const failures = [];
      page.on("pageerror", (e) => failures.push(e.message));
      for (const [name, width] of [
        ["desktop", 1440],
        ["tablet", 768],
        ["mobile", 390],
      ]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(base + "/", { waitUntil: "networkidle" });
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "Homepage overflow " + engine + " " + name,
        );
        if (engine === "chromium")
          await page.screenshot({
            path: `screenshots/${name}.png`,
            fullPage: true,
          });
      }
      await page.keyboard.press("Tab");
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent),
        "SKIP TO CONTENT",
      );
      await page.keyboard.press("Enter");
      assert.match(page.url(), /#main$/);
      await page.getByText("MENU", { exact: true }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "EQUIPMENT", exact: true })
        .click();
      await page.getByLabel("SEARCH EQUIPMENT").fill("signage");
      await page
        .getByRole("status")
        .filter({ hasText: "1 sourcing categories found" })
        .waitFor();
      await page.getByRole("link", { name: "SPECIFY REQUIREMENTS" }).click();
      await page
        .getByRole("button", { name: "ADD REQUIREMENT TO RFQ" })
        .click();
      await page.getByRole("link", { name: "VIEW YOUR RFQ" }).click();
      await page
        .getByLabel("ADD EQUIPMENT", { exact: true })
        .selectOption("bear-traps");
      await page.getByRole("spinbutton").first().fill("250");
      await page.getByText("ADD CUSTOM SOURCING LINE", { exact: true }).click();
      await page
        .getByLabel("CUSTOM REQUIREMENT", { exact: true })
        .fill("Custom reflective sign size");
      await page
        .getByLabel("SOURCING CATEGORY", { exact: true })
        .selectOption("warning-signage");
      await page
        .getByRole("button", { name: "ADD SOURCING LINE", exact: false })
        .click();
      await page
        .getByLabel("Specifications for Custom reflective sign size", {
          exact: true,
        })
        .fill("Requested size: 600 x 900 mm");
      await page.reload();
      assert.equal(await page.getByRole("spinbutton").count(), 3);
      await page.getByRole("button", { name: "DOWNLOAD YOUR RFQ" }).click();
      await page
        .getByRole("alert")
        .filter({ hasText: "Review your request" })
        .waitFor();
      await page.waitForFunction(
        () => document.activeElement?.className === "error-summary",
      );
      assert.equal(
        await page.evaluate(() => document.activeElement?.className),
        "error-summary",
      );
      await page.getByLabel("CONTACT NAME").fill("QA Buyer");
      await page
        .getByLabel("ORGANIZATION", { exact: false })
        .fill("Test Organization");
      await page.getByLabel("BUYER TYPE").selectOption("Municipality");
      await page
        .getByLabel("EMAIL", { exact: false })
        .fill("buyer@example.invalid");
      await page.getByLabel("PHONE", { exact: false }).fill("+1 416 555 0123");
      await page.getByLabel("PROVINCE / TERRITORY").selectOption("Ontario");
      await page
        .getByLabel("DELIVERY DESTINATION")
        .fill("Test destination, Ontario");
      await page
        .getByLabel("TENDER REFERENCE", { exact: true })
        .fill("TEST-2099");
      await page.getByLabel("TENDER CLOSING DATE").fill("2099-06-01");
      await page
        .getByLabel("TENDER CLOSING TIME", { exact: true })
        .fill("14:30");
      await page
        .getByLabel("CLOSING TIME ZONE")
        .selectOption("America/Toronto");
      await page
        .getByLabel("PROCUREMENT DOCUMENT REFERENCE")
        .fill("Specification section 12");
      await page
        .getByLabel("FREIGHT / UNLOADING NEEDS")
        .fill("Liftgate required");
      for (const checkbox of await page.getByRole("checkbox").all())
        await checkbox.check();
      const downloading = page.waitForEvent("download");
      await page.getByRole("button", { name: "DOWNLOAD YOUR RFQ" }).click();
      const download = await downloading;
      const content = await readFile(await download.path(), "utf8");
      for (const text of [
        "Quantity: 250",
        "Custom reflective sign size",
        "600 x 900 mm",
        "America/Toronto",
        "Specification section 12",
        "Liftgate required",
        "Not submitted",
        "info@beartraps.ca",
      ])
        assert.ok(content.includes(text), text);
      assert.equal(
        await page
          .getByRole("button", { name: "ONLINE SUBMISSION UNAVAILABLE" })
          .isDisabled(),
        true,
      );
      await page.evaluate(() => {
        window.print = () => {
          document.documentElement.dataset.printRequested = "true";
        };
      });
      await page.getByRole("button", { name: "PRINT RFQ / SAVE PDF" }).click();
      await page.waitForFunction(
        () => document.documentElement.dataset.printRequested === "true",
      );
      await page.emulateMedia({ media: "print" });
      assert.equal(await page.locator(".print-rfq").isVisible(), true);
      assert.equal(await page.locator("header").isVisible(), false);
      if (engine === "chromium")
        await page.screenshot({
          path: "screenshots/rfq-print.png",
          fullPage: true,
        });
      await page.emulateMedia({ media: "screen" });
      await page
        .getByRole("button", {
          name: "Remove Custom reflective sign size",
          exact: true,
        })
        .click();
      assert.equal(await page.getByRole("spinbutton").count(), 2);
      await page.goto(base + "/equipment-package/", {
        waitUntil: "networkidle",
      });
      await page.getByRole("button", { name: "ADD PACKAGE TO RFQ" }).click();
      await page.getByRole("link", { name: "REVIEW YOUR RFQ" }).click();
      await page.waitForURL("**/request-quote/");
      await page.getByRole("button", { name: "DOWNLOAD YOUR RFQ" }).waitFor();
      assert.equal(await page.getByRole("spinbutton").count(), 4);
      for (const path of [
        "/products/",
        "/request-quote/",
        "/government-procurement/",
        "/equipment-package/",
        "/bear-traps/",
      ]) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "Overflow " + engine + " " + path,
        );
        if (engine === "chromium") {
          const result = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          reports.push({ path, violations: result.violations });
          assert.deepEqual(
            result.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
            [],
            "Accessibility " + path,
          );
          await page.screenshot({
            path: "screenshots/" + path.replaceAll("/", "") + "-mobile.png",
            fullPage: true,
          });
        }
      }
      await page.goto(base + "/products/not-a-published-product/");
      assert.equal(
        (
          await page.request.get(base + "/products/not-a-published-product/")
        ).status(),
        404,
      );
      assert.deepEqual(failures, []);
      console.log(
        `${engine}: responsive views, keyboard skip link, catalogue search, custom RFQ, deadline fields, persistence, print/download, package merging and no false submission passed.`,
      );
    } catch (error) {
      const failedPage = browser.contexts()[0]?.pages()[0];
      if (failedPage) {
        console.error("Browser failure at", failedPage.url());
        await failedPage.screenshot({
          path: `screenshots/${engine}-failure.png`,
          fullPage: true,
        });
      }
      throw error;
    } finally {
      await browser.close();
    }
  }
} finally {
  await writeFile(
    "screenshots/accessibility-results.json",
    JSON.stringify(reports, null, 2),
  );
  server.kill();
}
