import Image from "next/image";
import { notFound } from "next/navigation";
import { publishedProducts, siteUrl } from "@/lib/catalog";
import { productStructuredData } from "@/lib/product-schema";
import { Breadcrumb } from "@/components/site";
import CatalogueBrowser from "@/components/catalogue/catalogue-browser";
import {
  SpecificationTable,
  TechnicalDocuments,
  ComplianceNotice,
  RelatedAccessories,
} from "@/components/catalogue/product-components";
import Link from "@/components/site-link";
import { productContactHref } from "@/lib/contact";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: [] }, ...publishedProducts.map((p) => ({ slug: [p.slug] }))];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const p = publishedProducts.find((p) => p.slug === slug?.[0]);
  return {
    title: slug?.length
      ? p?.title || "Product not found"
      : "Equipment catalogue",
    description:
      p?.summary ||
      "Find professional wildlife equipment and build a sourcing request.",
    alternates: { canonical: "/products/" + (p ? p.slug + "/" : "") },
    openGraph: {
      title: p?.title || "Equipment catalogue",
      description: p?.summary || "Professional wildlife equipment requirements",
    },
  };
}
export default async function ProductRoute({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  if (!slug?.length)
    return (
      <>
        <div className="page-intro">
          <Breadcrumb title="Equipment catalogue" />
          <p className="eyebrow">PROFESSIONAL WILDLIFE EQUIPMENT</p>
          <h1>
            Find the equipment.
            <br />
            Define the requirement.
          </h1>
          <p className="large-copy">
            Capture, transport, signage and infrastructure. Bring your
            specifications together in one request.
          </p>
        </div>
        <div className="section">
          <CatalogueBrowser />
        </div>
      </>
    );
  if (slug.length !== 1) notFound();
  const p = publishedProducts.find((p) => p.slug === slug[0]);
  if (!p) notFound();
  const schema = productStructuredData(p, siteUrl);
  return (
    <section className="section product-detail">
      <Breadcrumb title={p.title} />
      <p className="eyebrow">
        {p.manufacturer} / {p.model} / {p.sku}
      </p>
      <h1>{p.title}</h1>
      <p className="large-copy">{p.summary}</p>
      <div className="product-images">
        {p.images.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={1200}
            height={900}
          />
        ))}
      </div>
      <div className="split">
        <SpecificationTable product={p} />
        <Link className="button amber" href={productContactHref(p)}>
          ASK ABOUT THIS PRODUCT ↗
        </Link>
      </div>
      <TechnicalDocuments product={p} />
      <ComplianceNotice product={p} />
      <RelatedAccessories
        records={publishedProducts.filter((a) =>
          [...p.relatedProducts, ...p.relatedAccessories].includes(a.slug),
        )}
      />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </section>
  );
}
