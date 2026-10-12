// This command is only for the isolated CI test job. Never run against production content.
import { writeFileSync } from "node:fs";
import { fixtureProduct } from "../tests/fixtures/products.ts";
import { validateCatalog } from "../lib/product-schema.ts";
if (process.env.CI !== "true" || process.env.CATALOGUE_FIXTURE_BUILD !== "true")
  throw Error("Requires isolated CI fixture build");
const accessory = fixtureProduct("fixture-accessory"),
  product = fixtureProduct("fixture-model");
product.title = "Internal fixture capture system";
product.category = "bear-traps";
product.regulatoryClassification = "regulated";
product.leadTime = "TEST ONLY lead time";
product.shippingFreightClass = "TEST ONLY freight";
product.documents = [
  {
    title: "TEST ONLY manual",
    model: product.model,
    kind: "manual",
    url: product.source.url,
    evidence: product.source,
  },
];
product.variants = [
  {
    id: "variant",
    label: "TEST ONLY variant",
    sku: "TEST-VARIANT",
    specifications: { Width: "1200 mm" },
    evidence: product.source,
  },
];
product.relatedAccessories = [accessory.slug];
product.compatibilityEvidence = [
  {
    accessorySlug: accessory.slug,
    accessoryModel: accessory.model,
    evidence: product.source,
  },
];
writeFileSync(
  "content/products.json",
  JSON.stringify(validateCatalog([product, accessory]), null, 2) + "\n",
);
