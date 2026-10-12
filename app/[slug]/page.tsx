import PagePhoto from "@/components/page-photo";
import pageImages from "@/content/page-images.json";
import BusinessPhone from "@/components/business-phone";
export const dynamicParams = false;
import { notFound } from "next/navigation";
import Link from "@/components/site-link";
import { categories, siteUrl } from "@/lib/catalog";
import { pages } from "@/lib/pages";
import { Breadcrumb, CTA } from "@/components/site";
import CatalogueBrowser from "@/components/catalogue/catalogue-browser";
import { Suspense } from "react";
import ContactForm from "@/components/contact-form";
export function generateStaticParams() {
  return [
    ...categories.map((c) => ({ slug: c.slug })),
    ...Object.keys(pages).map((slug) => ({ slug })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  const p = pages[slug];
  return {
    title: c?.title || p?.title || "Page not found",
    description: c?.summary || p?.intro,
    alternates: { canonical: "/" + slug + "/" },
    openGraph: {
      title: c?.title || p?.title,
      description: c?.summary || p?.intro,
      url: "/" + slug + "/",
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  const p = pages[slug];
  if (!c && !p) notFound();
  const title = c?.title || p.title;
  const photo = pageImages.find((image) => image.page === `/${slug}/`);
  return (
    <>
      <div className={`page-intro ${photo ? "page-intro-with-photo" : ""}`}>
        <div className="page-intro-copy">
          <Breadcrumb title={c?.short || slug.replaceAll("-", " ")} />
          <p className="eyebrow">
            {c
              ? "EQUIPMENT DIRECTORY / " + c.number
              : "BEARTRAPS.CA / FIELD & PROCUREMENT"}
          </p>
          <h1>{title}</h1>
          <p className="large-copy">{c?.summary || p.intro}</p>
        </div>
        {photo && <PagePhoto id={photo.id} priority />}
      </div>
      {c ? (
        <>
          <section className="section split">
            <div>
              <h2>
                Specify the job.
                <br />
                Define the equipment.
              </h2>
              <p className="body-copy">{c.detail}</p>
              <Link
                className="button amber"
                href={`/contact/?interest=${encodeURIComponent(c.title)}`}
              >
                CONTACT US ↗
              </Link>
            </div>
            <div className="requirements">
              <p className="eyebrow">REQUIREMENTS TO INCLUDE</p>
              {c.items.map((i, n) => (
                <div key={i}>
                  <span>0{n + 1}</span>
                  <h3>{i}</h3>
                </div>
              ))}
              <p>
                Include quantity, delivery province, required date and any
                mandatory specifications. Product models and availability are
                confirmed in a written quote.
              </p>
            </div>
          </section>
          <section className="section">
            <CatalogueBrowser initialCategory={c.slug} />
          </section>
          <section className="section pale">
            <div className="split">
              <div>
                <p className="eyebrow">DOCUMENTATION & SUITABILITY</p>
                <h2>Make the requirements clear.</h2>
              </div>
              <div>
                <p className="body-copy">
                  Request dimensions, weight, materials, compatibility, handling
                  requirements and evidence for any performance claim.{" "}
                  {c.regulated
                    ? "Buyer authorization and jurisdiction review are required before any supply decision."
                    : "Confirm site access and installation requirements before selecting a model."}
                </p>
                <Link className="text-link" href="/product-compliance">
                  PRODUCT COMPLIANCE ↗
                </Link>
              </div>
            </div>
          </section>
          <section className="section category-faq">
            <h2>Before you request a quote</h2>
            <details>
              <summary>
                WHAT INFORMATION HELPS SPECIFY {c.short.toUpperCase()}?
              </summary>
              <p>
                Include {c.items.join(", ").toLowerCase()}, quantities, delivery
                destination and required date. Attach model-specific evidence to
                your email if your procurement requires an exact specification.
              </p>
            </details>
            <details>
              <summary>
                DOES A REQUEST CONFIRM AVAILABILITY OR ELIGIBILITY?
              </summary>
              <p>
                No. Supply, lead time, freight and suitability are confirmed in
                a written quote. Buyer authorization and applicable product
                restrictions require individual review.
              </p>
            </details>
          </section>
          <section className="section">
            <p className="eyebrow">COMPLETE YOUR REQUEST</p>
            <h2>Related equipment</h2>
            <div className="related-links">
              {categories
                .filter((x) => x.slug !== c.slug)
                .slice(0, 3)
                .map((x) => (
                  <Link key={x.slug} href={"/" + x.slug}>
                    {x.title} ↗
                  </Link>
                ))}
            </div>
          </section>
        </>
      ) : (
        <section className="section prose-grid">
          {p.sections.map((s) => (
            <article key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </article>
          ))}
        </section>
      )}
      {slug === "government-procurement" && (
        <section className="section pale">
          <h2>Discuss your procurement requirements.</h2>
          <p className="large-copy">
            Contact our team directly for bulk quantities, technical
            specifications, custom sourcing and delivery coordination. We handle
            quotations, tender documents and orders offline.
          </p>
          <Link
            className="button amber"
            href="/contact/?interest=Government%20procurement"
          >
            CONTACT US ↗
          </Link>
          <p>
            <a href="mailto:info@beartraps.ca">info@beartraps.ca</a>
          </p>
        </section>
      )}
      {slug === "contact" && (
        <>
          <section className="section pale">
            <h2>Equipment enquiries</h2>
            <BusinessPhone className="contact-link" />
            <a className="contact-link" href="mailto:info@beartraps.ca">
              info@beartraps.ca
            </a>
            <p>
              Contact our team about products, specifications, quotations and
              procurement.
            </p>
          </section>
          <Suspense fallback={<p>Loading contact form…</p>}>
            <ContactForm />
          </Suspense>
        </>
      )}
      {!["privacy", "terms"].includes(slug) && <CTA />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              {
                "@type": "ListItem",
                position: 2,
                name: title,
                item: siteUrl + "/" + slug + "/",
              },
            ],
          }),
        }}
      />
    </>
  );
}
