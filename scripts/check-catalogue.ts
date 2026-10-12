import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { products } from "../lib/catalog.ts";
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
