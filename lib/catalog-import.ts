import { createHash } from "node:crypto";
import { z } from "zod";
import { validateCatalog, type Product } from "./product-schema.ts";
function canonical(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value !== null && typeof value === "object")
    return (
      "{" +
      Object.entries(value)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => JSON.stringify(k) + ":" + canonical(v))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}
export function productDigest(value: unknown): string {
  return createHash("sha256").update(canonical(value)).digest("hex");
}
const review = z
  .object({
    reviewer: z.string().trim().min(2).max(200),
    reviewedAt: z.string().datetime(),
    productSha256: z.string().regex(/^[a-f0-9]{64}$/),
    supplier: z.literal(true),
    modelSpecifications: z.literal(true),
    imageRightsAndUniqueness: z.literal(true),
    regulatoryReview: z.literal(true),
    documentsAndClaims: z.literal(true),
  })
  .strict();
export const intakeSchema = z
  .array(
    z
      .object({
        status: z.enum(["draft", "pending-review", "publishable", "archived"]),
        internalId: z.string().trim().min(1).max(100),
        notes: z.string().max(5000).optional(),
        review: review.optional(),
        product: z.record(z.unknown()),
      })
      .strict(),
  )
  .max(5000);
export function importCatalogue(input: unknown): Product[] {
  const entries = intakeSchema.parse(input);
  const ids = new Set<string>(),
    published: unknown[] = [];
  for (const record of entries) {
    if (ids.has(record.internalId))
      throw Error(`Duplicate internal ID: ${record.internalId}`);
    ids.add(record.internalId);
    if (record.status !== "publishable") continue;
    if (!record.review)
      throw Error(`Missing evidence review: ${record.internalId}`);
    if (Date.parse(record.review.reviewedAt) > Date.now())
      throw Error("Review date cannot be in the future");
    if (record.review.productSha256 !== productDigest(record.product))
      throw Error(`Product changed after review: ${record.internalId}`);
    if (
      record.product.verification !== "verified" ||
      record.product.published !== true
    )
      throw Error(`Publication flags must be verified: ${record.internalId}`);
    published.push(record.product);
  }
  return validateCatalog(published);
}
export function catalogueChanges(previous: Product[], next: Product[]) {
  const before = new Map(previous.map((p) => [p.slug, productDigest(p)]));
  const after = new Map(next.map((p) => [p.slug, productDigest(p)]));
  return {
    added: next.filter((p) => !before.has(p.slug)).map((p) => p.slug),
    changed: next
      .filter(
        (p) => before.has(p.slug) && before.get(p.slug) !== after.get(p.slug),
      )
      .map((p) => p.slug),
    removed: previous.filter((p) => !after.has(p.slug)).map((p) => p.slug),
  };
}
