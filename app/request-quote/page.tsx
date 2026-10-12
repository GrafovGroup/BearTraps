import QuoteForm from "@/components/quote-form";
import { Breadcrumb } from "@/components/site";
export const metadata = {
  title: "Build your equipment RFQ",
  description:
    "Prepare a multi-category equipment request with quantities, delivery details and tender requirements.",
  alternates: { canonical: "/request-quote" },
};
export default function QuotePage() {
  return (
    <>
      <div className="page-intro">
        <Breadcrumb title="Request a quote" />
        <p className="eyebrow">YOUR EQUIPMENT / YOUR REQUIREMENTS</p>
        <h1>
          Build a better
          <br />
          equipment request.
        </h1>
        <p className="large-copy">
          Select equipment categories, add your specifications and download your
          RFQ. The download stays on your device; it does not submit an enquiry.
        </p>
      </div>
      <QuoteForm />
    </>
  );
}
