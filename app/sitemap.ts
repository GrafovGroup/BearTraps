export const dynamic = "force-static";
import { categories, products, siteUrl } from "@/lib/catalog";
import { pages } from "@/lib/pages";
export default function sitemap() {
  return [
    "",
    ...categories.map((c) => c.slug),
    ...Object.keys(pages),
    "request-quote",
    "products",
    "equipment-package",
    ...products.filter((p) => p.published).map((p) => "products/" + p.slug),
  ].map((slug) => ({
    url: siteUrl + (slug ? "/" + slug + "/" : "/"),
    changeFrequency: "monthly" as const,
    priority: slug ? 0.7 : 1,
  }));
}
