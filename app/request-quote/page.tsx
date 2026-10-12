import Link from "@/components/site-link";
import LegacyContactRedirect from "@/components/legacy-contact-redirect";
export const metadata = {
  title: "Contact our team",
  robots: { index: false, follow: true },
  alternates: { canonical: "/contact/" },
};
export default function LegacyPage() {
  return (
    <section className="section">
      <h1>Contact our team</h1>
      <p>
        Discuss equipment, quotations and procurement directly with our team.
      </p>
      <Link className="button amber" href="/contact/">
        CONTACT US ↗
      </Link>
      <LegacyContactRedirect />
    </section>
  );
}
