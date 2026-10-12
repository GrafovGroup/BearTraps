import BusinessPhone from "@/components/business-phone";
import Image from "next/image";
import Link from "@/components/site-link";
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="BearTraps home">
      <Image
        className="brand-logo"
        src="/brand/beartraps-shield.png"
        alt="BEARTRAPS"
        width={2172}
        height={724}
        priority
      />
    </Link>
  );
}
export function Header() {
  return (
    <>
      <div className="utility">
        <span>EQUIPMENT FOR CANADA’S WILD PLACES</span>
        <div className="utility-contact">
          <BusinessPhone />
          <a href="mailto:info@beartraps.ca">EMAIL OUR TEAM ↗</a>
        </div>
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
        <BusinessPhone />
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
