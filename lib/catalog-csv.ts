// RFC 4180-style input only. Nested evidence cells are JSON, never executable formulas.
export const intakeColumns = [
  "internalId",
  "status",
  "notes",
  "review_json",
  "id",
  "sku",
  "slug",
  "title",
  "category",
  "subcategory",
  "manufacturer",
  "model",
  "summary",
  "published",
  "verification",
  "source_json",
  "supplier_json",
  "specifications_json",
  "dimensions_json",
  "weightKg",
  "variants_json",
  "applications_json",
  "features_json",
  "transportRequirements",
  "shippingFreightClass",
  "leadTime",
  "images_json",
  "documents_json",
  "availability",
  "priceVisibility",
  "rfq",
  "regulatoryClassification",
  "buyerEligibility_json",
  "provincesServed_json",
  "jurisdictions_json",
  "certificationsEvidence_json",
  "relatedProducts_json",
  "relatedAccessories_json",
  "compatibilityEvidence_json",
] as const;
export function parseCsv(source: string): string[][] {
  if (source.length > 10_000_000) throw Error("CSV exceeds 10 MB");
  const input = source.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false,
    closed = false;
  const field = () => {
    row.push(cell);
    cell = "";
    closed = false;
  };
  const line = () => {
    field();
    if (row.some((v) => v !== "")) rows.push(row);
    row = [];
  };
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else cell += c;
    } else if (c === ",") field();
    else if (c === "\n" || c === "\r") {
      line();
      if (c === "\r" && input[i + 1] === "\n") i++;
    } else if (c === '"' && !cell && !closed) quoted = true;
    else {
      if (closed || c === '"') throw Error("Malformed CSV quoting");
      cell += c;
    }
  }
  if (quoted) throw Error("Unclosed CSV quote");
  if (cell || row.length || closed) line();
  if (rows.length > 5001) throw Error("CSV exceeds 5000 records");
  return rows;
}
export function csvIntake(source: string): unknown[] {
  const [headers, ...rows] = parseCsv(source);
  if (
    !headers ||
    !headers.includes("internalId") ||
    !headers.includes("status")
  )
    throw Error("Missing intake headers");
  if (
    new Set(headers).size !== headers.length ||
    headers.some(
      (h) => !intakeColumns.includes(h as (typeof intakeColumns)[number]),
    )
  )
    throw Error("Duplicate or unknown CSV header");
  return rows.map((cells, index) => {
    if (cells.length !== headers.length)
      throw Error(`CSV row ${index + 2}: wrong column count`);
    const record: Record<string, unknown> = {},
      product: Record<string, unknown> = {};
    headers.forEach((header, i) => {
      const value = cells[i].trim();
      if (!value) return;
      if (["internalId", "status", "notes"].includes(header))
        record[header] = value;
      else if (header.endsWith("_json")) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(value);
        } catch {
          throw Error(`CSV row ${index + 2}: invalid JSON in ${header}`);
        }
        if (header === "review_json") record.review = parsed;
        else product[header.slice(0, -5)] = parsed;
      } else if (["published", "rfq"].includes(header)) {
        if (!["true", "false"].includes(value))
          throw Error(`CSV row ${index + 2}: ${header} must be true or false`);
        product[header] = value === "true";
      } else if (header === "weightKg") {
        if (
          value !== "null" &&
          (!/^\d+(\.\d+)?$/.test(value) || !Number.isFinite(Number(value)))
        )
          throw Error(`CSV row ${index + 2}: invalid weightKg`);
        product[header] = value === "null" ? null : Number(value);
      } else
        product[header] =
          ["shippingFreightClass", "leadTime"].includes(header) &&
          value === "null"
            ? null
            : value;
    });
    return { ...record, product };
  });
}
