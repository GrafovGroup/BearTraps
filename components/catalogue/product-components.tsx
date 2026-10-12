import Link from "next/link";
import type { Product } from "@/lib/catalog";
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="product-card">
      <p className="eyebrow">
        {p.manufacturer} / {p.model}
      </p>
      <h3>
        <Link href={"/products/" + p.slug + "/"}>{p.title}</Link>
      </h3>
      <p>{p.summary}</p>
      <p className="product-code">SKU {p.sku}</p>
      <Link className="text-link" href={"/products/" + p.slug + "/"}>
        VIEW SPECIFICATIONS ↗
      </Link>
    </article>
  );
}
export function SpecificationTable({ product: p }: { product: Product }) {
  const specs = {
    ...p.specifications,
    ...(p.dimensions
      ? {
          "Dimensions (L × W × H)": `${p.dimensions.lengthMm} × ${p.dimensions.widthMm} × ${p.dimensions.heightMm} mm`,
        }
      : {}),
    ...(p.weightKg ? { Weight: `${p.weightKg} kg` } : {}),
  };
  return (
    <table className="spec-table">
      <caption>Verified technical specifications</caption>
      <tbody>
        {Object.entries(specs).map(([key, value]) => (
          <tr key={key}>
            <th scope="row">{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function TechnicalDocuments({ product: p }: { product: Product }) {
  return (
    <section>
      <h2>Technical documents</h2>
      {p.documents.length ? (
        <ul className="document-list">
          {p.documents.map((d) => (
            <li key={d.url}>
              <a href={d.url} target="_blank" rel="noreferrer">
                {d.title} ↗<span> {d.kind} · opens supplier document</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Include the documentation you require with our team.</p>
      )}
    </section>
  );
}
export function ComplianceNotice({ product: p }: { product: Product }) {
  return (
    <aside className="compliance-notice">
      <h2>Supply requires human review.</h2>
      <p>
        {p.regulatoryClassification === "regulated"
          ? "This is regulated equipment. "
          : "Equipment suitability, compatibility and buyer eligibility must be confirmed. "}
        There is no online checkout. An enquiry does not establish authorization
        to acquire or use the equipment.
      </p>
      <p>Eligible buyer types for review: {p.buyerEligibility.join(", ")}.</p>
      <p>
        Jurisdiction records are reviewed individually; missing or unknown
        status blocks sale.
      </p>
      <Link className="text-link" href="/product-compliance/">
        READ PRODUCT COMPLIANCE ↗
      </Link>
    </aside>
  );
}
export function RelatedAccessories({ records }: { records: Product[] }) {
  if (!records.length) return null;
  return (
    <section>
      <h2>Related equipment & accessories</h2>
      <p>
        Confirm exact-model compatibility and any buyer or jurisdiction
        requirements with our team.
      </p>
      <div className="product-grid">
        {records.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
