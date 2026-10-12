import Image from "next/image";
import { notFound } from "next/navigation";
import { categories, publishedProducts, siteUrl } from "@/lib/catalog";
import { productStructuredData } from "@/lib/product-schema";
import { Breadcrumb } from "@/components/site";
import CatalogueBrowser from "@/components/catalogue/catalogue-browser";
import {
  ProductLogistics,
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
  const category = categories.find((c) => c.slug === p.category)!;
  return (
    <section className="section product-detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">HOME</Link>
        <span>/</span>
        <Link href="/products/">EQUIPMENT</Link>
        <span>/</span>
        <Link href={`/${p.category}/`}>{category.short.toUpperCase()}</Link>
        <span>/</span>
        <span aria-current="page">{p.title}</span>
      </nav>
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
      <ProductLogistics product={p} />
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
            __html: JSON.stringify([
              schema,
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { name: "Home", item: siteUrl + "/" },
                  { name: "Equipment", item: siteUrl + "/products/" },
                  { name: category.title, item: `${siteUrl}/${p.category}/` },
                  { name: p.title, item: `${siteUrl}/products/${p.slug}/` },
                ].map((item, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  ...item,
                })),
              },
            ]).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </section>
  );
}
