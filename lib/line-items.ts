import { z } from "zod";
import { categoryIds, categories } from "./categories.ts";
import { publishedProducts } from "./catalog.ts";
export const lineSchema = z
  .object({
    id: z.string().min(1).max(180),
    kind: z.enum(["category", "product", "custom"]),
    category: z.enum(categoryIds),
    productSlug: z.string().max(120).optional(),
    variantId: z.string().max(120).optional(),
    title: z.string().trim().max(160).default(""),
    quantity: z.number().int().min(1).max(99999),
    specifications: z.string().trim().max(1000).default(""),
  })
  .superRefine((line, ctx) => {
    if (line.kind === "product") {
      const p = publishedProducts.find(
        (p) => p.slug === line.productSlug && p.category === line.category,
      );
      if (
        !p ||
        (line.variantId && !p.variants.some((v) => v.id === line.variantId))
      )
        ctx.addIssue({
          code: "custom",
          message: "Choose a published product and valid variant",
        });
    }
    if (line.kind === "custom" && line.title.length < 3)
      ctx.addIssue({
        code: "custom",
        path: ["title"],
        message: "Describe the custom sourcing request",
      });
    if (line.kind !== "product" && (line.productSlug || line.variantId))
      ctx.addIssue({
        code: "custom",
        message: "Product references require a product line",
      });
  });
export type BasketItem = z.infer<typeof lineSchema>;
export function categoryLine(category: BasketItem["category"]): BasketItem {
  return {
    id: "category:" + category,
    kind: "category",
    category,
    title: "",
    quantity: 1,
    specifications: "",
  };
}
export function lineTitle(line: BasketItem) {
  if (line.kind === "custom") return line.title;
  if (line.kind === "product") {
    const p = publishedProducts.find((p) => p.slug === line.productSlug);
    const v = p?.variants.find((v) => v.id === line.variantId);
    return p
      ? p.title + (v ? " — " + v.label : "")
      : "Product requiring sourcing review";
  }
  return (
    categories.find((c) => c.slug === line.category)?.title ||
    "Equipment requirement"
  );
}
export function mergeLines(existing: BasketItem[], incoming: BasketItem[]) {
  const lines = existing.map((x) => ({ ...x }));
  for (const next of incoming) {
    const i = lines.findIndex((x) => x.id === next.id);
    if (i >= 0)
      lines[i].quantity = Math.min(99999, lines[i].quantity + next.quantity);
    else if (lines.length < 50) lines.push(next);
    else throw new Error("Your request can contain up to 50 lines.");
  }
  return lines;
}
