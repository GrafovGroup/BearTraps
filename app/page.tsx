import PagePhoto from "@/components/page-photo";
import Link from "@/components/site-link";
import { categories } from "@/lib/catalog";
import { CTA } from "@/components/site";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> PROFESSIONAL WILDLIFE EQUIPMENT
          </p>
          <h1>
            Built for
            <br />
            the <em>field.</em>
            <br />
            Trusted for
            <br />
            the job.
          </h1>
          <p className="hero-description">
            Bear capture equipment. Field-ready transport.
            <br />
            Safer infrastructure for the places we share.
          </p>
          <div className="actions">
            <Link className="button amber" href="#equipment">
              VIEW EQUIPMENT <span>↘</span>
            </Link>
            <Link className="text-link" href="/contact/">
              CONTACT US ↗
            </Link>
          </div>
          <p className="hero-footnote">
            FOR PARKS, MUNICIPALITIES & PROFESSIONAL FIELD TEAMS
          </p>
        </div>
        <div className="hero-art hero-photography">
          <PagePhoto id="hero" priority />
          <Link className="hero-photo-link" href="/bear-traps/">
            EXPLORE CAPTURE EQUIPMENT ↗
          </Link>
        </div>
      </section>
      <div className="capability-strip">
        <span>PROFESSIONAL CAPTURE</span>
        <span>TRANSPORT & LOGISTICS</span>
        <span>SITE INFRASTRUCTURE</span>
        <span>INSTITUTIONAL PROCUREMENT</span>
      </div>
      <section id="equipment" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE EQUIPMENT DIRECTORY</p>
            <h2>
              Ready for the requirements.
              <br />
              Built around the job.
            </h2>
          </div>
          <p>
            From a single warning sign to a coordinated equipment request. Start
            with your category.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link className="category-card" key={c.slug} href={"/" + c.slug}>
              <span className="category-number">
                {c.number}
                <span>↗</span>
              </span>
              <h3>{c.title}</h3>
              <p>{c.summary}</p>
              <span className="card-action">EXPLORE CATEGORY</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="feature-section">
        <div>
          <p className="eyebrow">01 / CAPTURE & TRANSPORT</p>
          <h2>
            A field system.
            <br />
            Not just a trap.
          </h2>
          <p>
            Plan capture equipment together with its transport, monitoring and
            site safety requirements. A well-defined request starts long before
            equipment reaches the field.
          </p>
          <Link className="button amber" href="/bear-traps">
            EXPLORE BEAR TRAPS ↗
          </Link>
        </div>
        <div className="feature-list">
          {[
            [
              "01",
              "Professional live capture",
              "Species, authorized use, dimensions and inspection requirements.",
              "bear-traps",
            ],
            [
              "02",
              "Transport & handling",
              "Trailers, cradles, loading access and vehicle compatibility.",
              "transport-trailers",
            ],
            [
              "03",
              "Site safety & visibility",
              "Warning signage, site communication and remote monitoring.",
              "warning-signage",
            ],
          ].map(([n, t, d, s]) => (
            <Link href={"/" + s} key={n}>
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>
      <section className="section habitat-section">
        <PagePhoto id="black-bear" />
        <div className="habitat-copy">
          <p className="eyebrow">INFRASTRUCTURE FOR BEAR COUNTRY</p>
          <h2>
            Keep attractants
            <br />
            out of reach.
          </h2>
          <p className="large-copy">
            Waste containers, food lockers and storage enclosures specified for
            the site, the collection routine and the evidence your project
            requires.
          </p>
          <Link className="text-link" href="/bear-resistant-furniture/">
            EXPLORE SITE INFRASTRUCTURE ↗
          </Link>
        </div>
      </section>
      <section className="procurement section">
        <p className="eyebrow">FOR THE PEOPLE RESPONSIBLE FOR THE PLACE</p>
        <div className="split">
          <h2>
            Field practical.
            <br />
            Procurement minded.
          </h2>
          <div>
            <p className="large-copy">
              Build a clear specification, document your requirements and bring
              equipment, freight and tender details into one request.
            </p>
            <Link className="button outline" href="/government-procurement">
              GOVERNMENT & INSTITUTIONAL PROCUREMENT ↗
            </Link>
          </div>
        </div>
        <div className="industry-row">
          {[
            "PARKS & CAMPGROUNDS",
            "MUNICIPALITIES",
            "CONSERVATION",
            "COMMERCIAL SITES",
          ].map((i) => (
            <Link key={i} href="/industries">
              {i} ↗
            </Link>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
