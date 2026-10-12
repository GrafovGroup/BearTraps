import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
const hash = (b) => createHash("sha256").update(b).digest("hex");
function inventory(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? inventory(join(dir, e.name)) : [join(dir, e.name)],
    )
    .sort();
}
const files = inventory("out");
if (
  files.some((p) =>
    /(?:\.php$|\.env|node_modules|review-manifest|supplier-intake)/i.test(p),
  )
)
  throw Error("Private/backend file in static release");
const products = JSON.parse(readFileSync("content/products.json", "utf8"));
const config = JSON.parse(readFileSync("content/business.json", "utf8"));
const report = {
  version: 1,
  commit:
    process.env.RELEASE_COMMIT || process.env.GITHUB_SHA || "local-unreleased",
  generatedAt: new Date().toISOString(),
  hosting: "WHC static export",
  deployed: false,
  publishedProductCount: products.filter(
    (p) => p.published && p.verification === "verified",
  ).length,
  contactMode: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
    ? "service-configured-requires-external-acceptance"
    : "formspree",
  confirmedPhone: config.phone?.e164 || null,
  package: {
    file: "beartraps-whc.zip",
    sha256: hash(readFileSync("beartraps-whc.zip")),
  },
  files: files.map((p) => ({
    path: p.slice(4),
    sha256: hash(readFileSync(p)),
  })),
};
writeFileSync("release-manifest.json", JSON.stringify(report, null, 2) + "\n");
console.log(
  `Release manifest: ${report.files.length} files, ${report.publishedProductCount} published products; not deployed.`,
);
