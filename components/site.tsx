import Link from "next/link";
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="BearTraps.ca home">
      <svg viewBox="0 0 44 46" width="38" height="40" aria-hidden="true">
        <path
          fill="currentColor"
          d="M22 1 41 8v16c0 10-12 18-19 21C15 42 3 34 3 24V8Z"
        />
        <path
          fill="#192A24"
          d="m10 22 3-9 6 2 6-1 7 6 3 2-2 5-9 1-3 7-5-2 1-6-7-1Z"
        />
        <circle cx="28" cy="20" r="1.4" fill="#F5F5F0" />
      </svg>
      <span>
        BEARTRAPS<span className="brand-ca">.CA</span>
        <small>PROFESSIONAL WILDLIFE EQUIPMENT</small>
      </span>
    </Link>
  );
}
export function Header() {
  return (
    <>
      <div className="utility">
        <span>EQUIPMENT FOR CANADA’S WILD PLACES</span>
        <a href="mailto:info@beartraps.ca">EMAIL OUR TEAM ↗</a>
      </div>
      <header>
        <Brand />
        <nav aria-label="Main navigation">
          <Link href="/products/">EQUIPMENT</Link>
          <Link href="/government-procurement">PROCUREMENT</Link>
          <Link href="/industries">INDUSTRIES</Link>
          <Link href="/about">ABOUT</Link>
        </nav>
        <Link className="button amber header-quote" href="/contact/">
          CONTACT US <span>↗</span>
        </Link>
        <details className="mobile-nav">
          <summary>MENU</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/products/">EQUIPMENT</Link>
            <Link href="/government-procurement">PROCUREMENT</Link>
            <Link href="/industries">INDUSTRIES</Link>
            <Link href="/about">ABOUT</Link>
            <Link href="/contact/">CONTACT US</Link>
          </nav>
        </details>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <Brand />
        <p>
          Built for the field.
          <br />
          Trusted for the job.
        </p>
        <a href="mailto:info@beartraps.ca">EMAIL OUR TEAM ↗</a>
      </div>
      <div className="footer-links">
        <span>© {new Date().getFullYear()} BEARTRAPS.CA</span>
        <Link href="/contact">CONTACT</Link>
        <a href="mailto:info@beartraps.ca">EMAIL US</a>
        <Link href="/product-compliance">PRODUCT COMPLIANCE</Link>
        <Link href="/privacy">PRIVACY</Link>
        <Link href="/terms">TERMS</Link>
      </div>
    </footer>
  );
}
export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">HOME</Link>
      <span>/</span>
      <span aria-current="page">{title.toUpperCase()}</span>
    </nav>
  );
}
export function CTA() {
  return (
    <section className="quote-banner">
      <div>
        <p className="eyebrow">LET’S SPECIFY THE RIGHT EQUIPMENT</p>
        <h2>
          Your field requirements.
          <br />
          Our starting point.
        </h2>
      </div>
      <Link className="button dark" href="/contact/">
        CONTACT US <span>↗</span>
      </Link>
    </section>
  );
}
