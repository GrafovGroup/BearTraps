import { z } from "zod";
import { validateCatalog, type Product } from "./product-schema.ts";
const review = z
  .object({
    reviewer: z.string().trim().min(2),
    reviewedAt: z.string().datetime(),
    supplier: z.literal(true),
    modelSpecifications: z.literal(true),
    imageRightsAndUniqueness: z.literal(true),
    regulatoryReview: z.literal(true),
    documentsAndClaims: z.literal(true),
  })
  .strict();
const entry = z
  .object({
    status: z.enum(["draft", "pending-review", "publishable", "archived"]),
    internalId: z.string().trim().min(1).max(100),
    notes: z.string().max(5000).optional(),
    review: review.optional(),
    product: z.record(z.unknown()),
  })
  .strict();
export function importCatalogue(input: unknown): Product[] {
  const entries = z.array(entry).max(5000).parse(input);
  const ids = new Set<string>();
  const published: unknown[] = [];
  for (const record of entries) {
    if (ids.has(record.internalId))
      throw new Error(`Duplicate internal ID: ${record.internalId}`);
    ids.add(record.internalId);
    if (record.status !== "publishable") continue;
    if (!record.review)
      throw new Error(`Missing evidence review: ${record.internalId}`);
    if (Date.parse(record.review.reviewedAt) > Date.now())
      throw new Error("Review date cannot be in the future");
    if (
      record.product.verification !== "verified" ||
      record.product.published !== true
    )
      throw new Error(
        `Publication flags must be verified: ${record.internalId}`,
      );
    published.push(record.product);
  }
  return validateCatalog(published);
}
