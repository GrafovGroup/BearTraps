import { z } from "zod";
import { categories, categoryIds } from "./categories.ts";
import { provinces } from "./geography.ts";
const text = z.string().trim().min(1).max(2000);
const url = z
  .string()
  .url()
  .refine((v) => v.startsWith("https://"), "Use an HTTPS evidence URL");
const proof = z.object({
  url,
  reviewedBy: text,
  reviewedAt: z
    .string()
    .datetime()
    .refine(
      (v) => Date.parse(v) <= Date.now(),
      "Evidence review cannot be in the future",
    ),
});
export const productSchema = z.object({
  id: text,
  sku: text,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  category: z.enum(categoryIds),
  subcategory: text,
  manufacturer: text,
  model: text,
  summary: text,
  published: z.boolean(),
  verification: z.enum(["draft", "verified"]),
  source: proof,
  supplier: z.object({
    id: text,
    name: text,
    verified: z.boolean(),
    record: proof,
  }),
  specifications: z.record(text, text),
  dimensions: z
    .object({
      lengthMm: z.number().positive(),
      widthMm: z.number().positive(),
      heightMm: z.number().positive(),
    })
    .nullable(),
  weightKg: z.number().positive().nullable(),
  variants: z.array(
    z.object({
      id: text,
      label: text,
      sku: text,
      specifications: z.record(text, text),
      evidence: proof,
    }),
  ),
  applications: z.array(text),
  features: z.array(text),
  transportRequirements: text,
  shippingFreightClass: text.nullable(),
  leadTime: text.nullable(),
  images: z.array(
    z.object({
      src: z
        .string()
        .regex(/^\/images\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|svg)$/),
      alt: text,
      source: url,
      rights: text,
      rightsEvidence: url,
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
    }),
  ),
  documents: z.array(
    z.object({
      title: text,
      url,
      kind: z.enum(["manual", "specification", "evidence"]),
      model: text,
      evidence: proof,
    }),
  ),
  availability: z.literal("quote-only"),
  priceVisibility: z.literal("hidden"),
  rfq: z.literal(true),
  regulatoryClassification: z.enum(["general", "regulated"]),
  buyerEligibility: z.array(text).min(1),
  provincesServed: z.array(z.enum(provinces)),
  jurisdictions: z.array(
    z.object({
      province: z.enum(provinces),
      status: z.enum(["unknown", "restricted", "permitted", "prohibited"]),
      buyerTypes: z.array(text),
      requirements: z.array(text),
      evidence: proof.nullable(),
      humanReviewRequired: z.literal(true),
    }),
  ),
  certificationsEvidence: z.array(
    z.object({ claim: text, scope: text, evidence: proof }),
  ),
  compatibilityEvidence: z
    .array(
      z.object({ accessorySlug: text, accessoryModel: text, evidence: proof }),
    )
    .default([]),
  relatedProducts: z.array(text),
  relatedAccessories: z.array(text),
});
export type Product = z.infer<typeof productSchema>;
export function validateCatalog(input: unknown): Product[] {
  const records = z.array(productSchema).parse(input);
  const ids = new Set<string>(),
    skus = new Set<string>(),
    slugs = new Set<string>(),
    images = new Set<string>();
  for (const p of records) {
    for (const [label, value, set] of [
      ["ID", p.id, ids],
      ["SKU", p.sku.toUpperCase(), skus],
      ["slug", p.slug, slugs],
    ] as const) {
      if (set.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
      set.add(value);
    }
    const variants = new Set<string>();
    for (const v of p.variants) {
      if (variants.has(v.id) || skus.has(v.sku.toUpperCase()))
        throw new Error(`Duplicate variant: ${v.id}`);
      variants.add(v.id);
      skus.add(v.sku.toUpperCase());
    }
    if (
      p.published &&
      (p.verification !== "verified" ||
        !p.supplier.verified ||
        Object.keys(p.specifications).length === 0)
    )
      throw new Error(`Unverified publication: ${p.slug}`);
    if (
      /certified|bear-resistant|humane/i.test(
        [
          p.title,
          p.summary,
          ...p.features,
          ...Object.values(p.specifications),
          ...p.variants.flatMap((v) => [
            v.label,
            ...Object.values(v.specifications),
          ]),
        ].join(" "),
      ) &&
      p.certificationsEvidence.length === 0
    )
      throw new Error(`Unsupported performance claim: ${p.slug}`);
    for (const claim of p.certificationsEvidence)
      if (claim.scope !== p.model)
        throw new Error(`Evidence scope must match the exact model: ${p.slug}`);
    if (
      categories.find((c) => c.slug === p.category)?.regulated &&
      p.regulatoryClassification !== "regulated"
    )
      throw Error(
        `Regulated category cannot be classified as general: ${p.slug}`,
      );
    for (const document of p.documents)
      if (document.model !== p.model)
        throw Error(`Document scope must match the exact model: ${p.slug}`);
    const provincesSeen = new Set<string>();
    for (const j of p.jurisdictions) {
      if (provincesSeen.has(j.province))
        throw new Error(`Duplicate province: ${p.slug}`);
      provincesSeen.add(j.province);
      if (j.status !== "unknown" && !j.evidence)
        throw new Error(`Missing jurisdiction evidence: ${p.slug}`);
    }
    for (const image of p.images) {
      for (const key of [image.src, image.sha256, image.source]) {
        if (images.has(key)) throw new Error(`Reused product image: ${p.slug}`);
        images.add(key);
      }
    }
  }
  for (const p of records)
    for (const ref of [...p.relatedProducts, ...p.relatedAccessories])
      if (ref === p.slug || !slugs.has(ref))
        throw new Error(`Broken relationship: ${p.slug} -> ${ref}`);
  for (const p of records) {
    const seen = new Set<string>();
    for (const proof of p.compatibilityEvidence) {
      const accessory = records.find((a) => a.slug === proof.accessorySlug);
      if (
        seen.has(proof.accessorySlug) ||
        !p.relatedAccessories.includes(proof.accessorySlug) ||
        !accessory ||
        proof.accessoryModel !== accessory.model
      )
        throw Error(`Invalid compatibility evidence: ${p.slug}`);
      seen.add(proof.accessorySlug);
    }
    for (const slug of p.relatedAccessories)
      if (!seen.has(slug))
        throw Error(
          `Missing exact-model compatibility evidence: ${p.slug} -> ${slug}`,
        );
  }
  return records;
}
export function productStructuredData(p: Product, siteUrl: string) {
  if (!p.published || p.verification !== "verified" || !p.supplier.verified)
    return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.summary,
    sku: p.sku,
    model: p.model,
    manufacturer: { "@type": "Organization", name: p.manufacturer },
    url: `${siteUrl}/products/${p.slug}/`,
    category: categories.find((c) => c.slug === p.category)?.title,
    additionalProperty: Object.entries(p.specifications).map(
      ([name, value]) => ({ "@type": "PropertyValue", name, value }),
    ),
    ...(p.weightKg !== null
      ? {
          weight: {
            "@type": "QuantitativeValue",
            value: p.weightKg,
            unitCode: "KGM",
          },
        }
      : {}),
  };
}
