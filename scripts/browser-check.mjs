import { chromium, firefox, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const server = spawn(
  "python3",
  ["-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", "out"],
  { stdio: "ignore" },
);
const base = "http://127.0.0.1:4173",
  reports = [];
await mkdir("screenshots", { recursive: true });
try {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch(base);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
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
        );
        assert.equal(
          await page.locator('a[href^="tel:"]').count(),
          0,
          "Unconfirmed phone must not be dialable",
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
        .getByRole("complementary", { name: "Contact shortcut" })
        .getByRole("link", { name: "CONTACT US" })
        .click();
      await page.waitForURL("**/contact/");
      assert.equal(await page.locator(".mobile-quote").count(), 0);
      await page.getByRole("button", { name: "PREPARE EMAIL" }).click();
      await page.getByRole("alert").waitFor();
      await page.waitForFunction(
        () => document.activeElement?.className === "error-summary",
      );
      await page.getByLabel("NAME", { exact: true }).fill("QA Buyer");
      await page
        .getByLabel("EMAIL", { exact: true })
        .fill("buyer@example.invalid");
      await page
        .getByLabel("SUBJECT / PRODUCT OF INTEREST")
        .fill("Signage & transport");
      await page
        .getByLabel("MESSAGE", { exact: true })
        .fill("Please discuss specifications for our park.");
      await page.getByRole("checkbox").check();
      const sent = [];
      page.on("request", (r) => {
        if (r.method() === "POST") sent.push(r.url());
      });
      await page.getByRole("button", { name: "PREPARE EMAIL" }).click();
      const email = page.getByRole("link", { name: "OPEN EMAIL APP" });
      await email.waitFor();
      const href = new URL(await email.getAttribute("href"));
      assert.equal(href.protocol, "mailto:");
      assert.equal(href.pathname, "info@beartraps.ca");
      assert.equal(href.searchParams.get("subject"), "Signage & transport");
      assert.match(href.searchParams.get("body"), /QA Buyer/);
      assert.match(
        await page.getByRole("status").innerText(),
        /Nothing has been submitted/,
      );
      assert.deepEqual(sent, []);
      await page
        .getByLabel("MESSAGE", { exact: true })
        .fill("Changed details for our park.");
      assert.equal(
        await email.count(),
        0,
        "Stale prepared email must disappear after edits",
      );
      await page.goto(
        base +
          "/contact/?interest=Model%20A%20%2F%20SKU-1&product=https%3A%2F%2Fbeartraps.ca%2Fproducts%2Fmodel-a%2F",
        { waitUntil: "networkidle" },
      );
      assert.equal(
        await page.getByLabel("SUBJECT / PRODUCT OF INTEREST").inputValue(),
        "Model A / SKU-1",
      );
      assert.match(
        await page.getByLabel("MESSAGE", { exact: true }).inputValue(),
        /products\/model-a/,
      );
      for (const route of ["request-quote", "equipment-package"]) {
        await page.goto(base + `/${route}/`);
        await page.waitForURL("**/contact/");
        assert.equal(await page.getByRole("spinbutton").count(), 0);
      }
      for (const path of [
        "/products/",
        "/contact/",
        "/government-procurement/",
        "/bear-traps/",
      ]) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "Overflow " + engine + path,
        );
        assert.equal(
          await page
            .locator('a[href*="request-quote"],a[href*="equipment-package"]')
            .count(),
          0,
        );
        assert.equal(
          await page
            .getByRole("button", { name: /ADD.*RFQ|DOWNLOAD.*RFQ/ })
            .count(),
          0,
        );
        if (path !== "/contact/") {
          assert.equal(await page.locator(".mobile-quote").isVisible(), true);
          await page
            .getByRole("link", { name: "TERMS", exact: true })
            .scrollIntoViewIfNeeded();
          assert.ok(
            await page
              .getByRole("link", { name: "TERMS", exact: true })
              .evaluate(
                (el) =>
                  el.getBoundingClientRect().bottom <=
                  document
                    .querySelector(".mobile-quote")
                    .getBoundingClientRect().top,
              ),
            "Footer hidden by mobile CTA",
          );
          await page.evaluate(() => scrollTo(0, 0));
        }
        if (path === "/bear-traps/") {
          await page
            .getByText("DOES A REQUEST CONFIRM AVAILABILITY OR ELIGIBILITY?", {
              exact: true,
            })
            .click();
          assert.equal(
            await page
              .getByText("No. Supply, lead time", { exact: false })
              .isVisible(),
            true,
          );
        }
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
      await page.emulateMedia({ reducedMotion: "reduce" });
      assert.ok(
        await page.evaluate(
          () => matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      );
      assert.equal(
        (
          await page.request.get(base + "/products/not-a-published-product/")
        ).status(),
        404,
      );
      assert.deepEqual(failures, []);
      console.log(
        `${engine}: browsing, mobile contact, optional fields, accessible validation, truthful mailto, product prefill, legacy redirects and no public RFQ passed.`,
      );
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
