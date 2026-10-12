import type { Product } from "./product-schema.ts";
export type CatalogFilters = {
  query: string;
  category: string;
  application: string;
  supplier: string;
  feature: string;
  maxWidthMm: string;
  sort: "relevance" | "title-asc" | "title-desc";
};
export const defaultFilters: CatalogFilters = {
  query: "",
  category: "",
  application: "",
  supplier: "",
  feature: "",
  maxWidthMm: "",
  sort: "relevance",
};
export function filterProducts(records: Product[], f: CatalogFilters) {
  const terms = f.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return records
    .filter(
      (p) =>
        p.published && p.verification === "verified" && p.supplier.verified,
    )
    .filter((p) => {
      const haystack = [
        p.title,
        p.summary,
        p.sku,
        p.model,
        p.manufacturer,
        ...p.features,
        ...p.applications,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return (
        terms.every((t) => haystack.includes(t)) &&
        (!f.category || p.category === f.category) &&
        (!f.application || p.applications.includes(f.application)) &&
        (!f.supplier || p.supplier.id === f.supplier) &&
        (!f.feature || p.features.includes(f.feature)) &&
        (!f.maxWidthMm ||
          (p.dimensions !== null &&
            p.dimensions.widthMm <= Number(f.maxWidthMm)))
      );
    })
    .sort((a, b) =>
      f.sort === "title-asc"
        ? a.title.localeCompare(b.title)
        : f.sort === "title-desc"
          ? b.title.localeCompare(a.title)
          : 0,
    );
}
