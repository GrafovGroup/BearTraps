import { validateCatalog } from "./product-schema.ts";
export { categories } from "./categories.ts";
export type { Product } from "./product-schema.ts";
// Add only evidence-backed supplier records. Test fixtures are never imported here.
export const products = validateCatalog([]);
export const publishedProducts = products.filter(
  (p) => p.published && p.verification === "verified",
);
export const locales = ["en", "fr"] as const;
export const publishedLocales = ["en"] as const;
export const siteUrl = "https://beartraps.ca";
