import { notFound } from "next/navigation";
import { products } from "@/lib/catalog";
import { Breadcrumb } from "@/components/site";
import AddToQuote from "@/components/add-to-quote";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug && p.published);
  return {
    title: p?.title || "Product not found",
    description: p?.summary,
    alternates: { canonical: "/products/" + slug },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug && p.published);
  if (!p) notFound();
  return (
    <section className="section">
      <Breadcrumb title={p.title} />
      <p className="eyebrow">PRODUCT SPECIFICATIONS</p>
      <h1>{p.title}</h1>
      <p className="large-copy">{p.summary}</p>
      <dl className="specs">
        {Object.entries(p.specifications).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p>
        Availability, buyer eligibility and destination requirements are
        reviewed before supply.
      </p>
      <AddToQuote slug={p.category} />
    </section>
  );
}
