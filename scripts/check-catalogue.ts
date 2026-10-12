import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { products } from "../lib/catalog.ts";
function rejectPlaceholderUrls(value: unknown): void {
  if (typeof value === "string" && value.startsWith("https://")) {
    const host = new URL(value).hostname;
    if (
      host.endsWith(".invalid") ||
      /(^|\.)(example\.(com|org|net)|localhost)$/.test(host)
    )
      throw Error("Placeholder evidence URL in production catalogue");
  } else if (Array.isArray(value)) value.forEach(rejectPlaceholderUrls);
  else if (value && typeof value === "object")
    Object.values(value).forEach(rejectPlaceholderUrls);
}
products.forEach(rejectPlaceholderUrls);
for (const p of products)
  for (const image of p.images) {
    const file = "public" + image.src;
    if (!existsSync(file))
      throw new Error("Missing licensed product image: " + file);
    if (
      createHash("sha256").update(readFileSync(file)).digest("hex") !==
      image.sha256
    )
      throw new Error("Image hash does not match rights register: " + file);
  }
console.log(
  `Catalogue validation passed: ${products.length} records; ${products.filter((p) => p.published).length} published. No fixture inventory imported.`,
);
